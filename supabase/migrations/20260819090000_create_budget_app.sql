create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.trip_settings (
  trip_id text primary key,
  total_budget_krw numeric(14, 2) not null check (total_budget_krw >= 0),
  twd_krw_rate numeric(10, 4) not null check (twd_krw_rate > 0),
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  travelers integer not null check (travelers > 0),
  scope_note text not null default '',
  updated_at timestamptz not null default now()
);

create table public.budget_items (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null references public.trip_settings(trip_id) on delete cascade,
  trip_day text not null,
  category text not null,
  item_name text not null,
  currency text not null check (currency in ('KRW', 'TWD')),
  planned_amount numeric(14, 2) not null check (planned_amount >= 0),
  status text not null default 'planned',
  priority integer not null default 1 check (priority between 0 and 3),
  vendor text,
  memo text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, trip_day, item_name)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null references public.trip_settings(trip_id) on delete cascade,
  spent_at date not null,
  trip_day text not null,
  category text not null,
  item_name text not null,
  currency text not null check (currency in ('KRW', 'TWD')),
  amount numeric(14, 2) not null check (amount >= 0),
  payment_method text,
  payment_status text not null default 'paid',
  vendor text,
  memo text,
  budget_item_id uuid references public.budget_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null references public.trip_settings(trip_id) on delete cascade,
  vendor text not null,
  service_name text not null,
  service_dates date[] not null default '{}',
  currency text not null check (currency in ('KRW', 'TWD')),
  total_amount numeric(14, 2) not null check (total_amount >= 0),
  status text not null,
  conditions jsonb not null default '{}'::jsonb,
  cancellation_note text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (trip_id, vendor, service_name)
);

create table public.reservation_payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  label text not null,
  amount numeric(14, 2) not null check (amount >= 0),
  currency text not null check (currency in ('KRW', 'TWD')),
  due_date date,
  paid_at date,
  status text not null default 'scheduled',
  payment_method text,
  memo text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index budget_items_trip_sort_idx on public.budget_items (trip_id, sort_order, trip_day);
create index expenses_trip_date_idx on public.expenses (trip_id, spent_at desc);
create index reservations_trip_idx on public.reservations (trip_id);
create index reservation_payments_reservation_sort_idx on public.reservation_payments (reservation_id, sort_order);

create table private.budget_pin_config (
  trip_id text primary key references public.trip_settings(trip_id) on delete cascade,
  pin_hash text not null,
  updated_at timestamptz not null default now()
);

create table private.budget_rate_limits (
  client_hash text primary key,
  attempt_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create table private.budget_sessions (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null references public.trip_settings(trip_id) on delete cascade,
  token_hash text not null unique,
  client_hash text not null,
  expires_at timestamptz not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index budget_sessions_expiry_idx on private.budget_sessions (expires_at);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trip_settings_touch_updated_at before update on public.trip_settings
for each row execute function private.touch_updated_at();
create trigger budget_items_touch_updated_at before update on public.budget_items
for each row execute function private.touch_updated_at();
create trigger expenses_touch_updated_at before update on public.expenses
for each row execute function private.touch_updated_at();
create trigger reservations_touch_updated_at before update on public.reservations
for each row execute function private.touch_updated_at();
create trigger reservation_payments_touch_updated_at before update on public.reservation_payments
for each row execute function private.touch_updated_at();

alter table public.trip_settings enable row level security;
alter table public.budget_items enable row level security;
alter table public.expenses enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_payments enable row level security;

revoke all on table public.trip_settings from public, anon, authenticated;
revoke all on table public.budget_items from public, anon, authenticated;
revoke all on table public.expenses from public, anon, authenticated;
revoke all on table public.reservations from public, anon, authenticated;
revoke all on table public.reservation_payments from public, anon, authenticated;
grant all on table public.trip_settings to service_role;
grant all on table public.budget_items to service_role;
grant all on table public.expenses to service_role;
grant all on table public.reservations to service_role;
grant all on table public.reservation_payments to service_role;

revoke all on table private.budget_pin_config from public, anon, authenticated;
revoke all on table private.budget_rate_limits from public, anon, authenticated;
revoke all on table private.budget_sessions from public, anon, authenticated;

create or replace function public.budget_unlock(p_pin text, p_client_hash text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_attempt_count integer := 0;
  v_window_started timestamptz := v_now;
  v_locked_until timestamptz;
  v_pin_hash text;
  v_token text;
begin
  if length(coalesce(p_client_hash, '')) < 16 then
    return jsonb_build_object('ok', false, 'code', 'invalid_client');
  end if;

  insert into private.budget_rate_limits (client_hash)
  values (p_client_hash)
  on conflict (client_hash) do nothing;

  select attempt_count, window_started_at, locked_until
    into v_attempt_count, v_window_started, v_locked_until
  from private.budget_rate_limits
  where client_hash = p_client_hash
  for update;

  if v_locked_until is not null and v_locked_until > v_now then
    return jsonb_build_object(
      'ok', false,
      'code', 'rate_limited',
      'retry_after', greatest(1, ceil(extract(epoch from (v_locked_until - v_now))))::integer
    );
  end if;

  if v_window_started < v_now - interval '10 minutes' then
    v_attempt_count := 0;
    v_window_started := v_now;
    update private.budget_rate_limits
      set attempt_count = 0, window_started_at = v_now, locked_until = null, updated_at = v_now
      where client_hash = p_client_hash;
  end if;

  select pin_hash into v_pin_hash
  from private.budget_pin_config
  where trip_id = 'taiwan-2027';

  if v_pin_hash is null then
    return jsonb_build_object('ok', false, 'code', 'not_configured');
  end if;

  if extensions.crypt(coalesce(p_pin, ''), v_pin_hash) <> v_pin_hash then
    v_attempt_count := v_attempt_count + 1;
    update private.budget_rate_limits
      set attempt_count = v_attempt_count,
          window_started_at = v_window_started,
          locked_until = case when v_attempt_count >= 5 then v_now + interval '10 minutes' else null end,
          updated_at = v_now
      where client_hash = p_client_hash;

    if v_attempt_count >= 5 then
      return jsonb_build_object('ok', false, 'code', 'rate_limited', 'retry_after', 600);
    end if;
    return jsonb_build_object('ok', false, 'code', 'invalid_pin', 'remaining_attempts', 5 - v_attempt_count);
  end if;

  update private.budget_rate_limits
    set attempt_count = 0, window_started_at = v_now, locked_until = null, updated_at = v_now
    where client_hash = p_client_hash;

  delete from private.budget_sessions where expires_at <= v_now;
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into private.budget_sessions (trip_id, token_hash, client_hash, expires_at)
  values (
    'taiwan-2027',
    encode(extensions.digest(v_token, 'sha256'), 'hex'),
    p_client_hash,
    v_now + interval '8 hours'
  );

  return jsonb_build_object('ok', true, 'token', v_token, 'expires_at', v_now + interval '8 hours');
end;
$$;

create or replace function public.budget_validate_session(p_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rows integer;
begin
  if length(coalesce(p_token, '')) < 32 then
    return false;
  end if;

  update private.budget_sessions
    set last_seen_at = now()
    where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
      and expires_at > now();
  get diagnostics v_rows = row_count;
  return v_rows = 1;
end;
$$;

create or replace function public.budget_revoke_session(p_token text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from private.budget_sessions
  where token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex');
$$;

revoke all on function public.budget_unlock(text, text) from public, anon, authenticated;
revoke all on function public.budget_validate_session(text) from public, anon, authenticated;
revoke all on function public.budget_revoke_session(text) from public, anon, authenticated;
grant execute on function public.budget_unlock(text, text) to service_role;
grant execute on function public.budget_validate_session(text) to service_role;
grant execute on function public.budget_revoke_session(text) to service_role;

insert into public.trip_settings (
  trip_id, total_budget_krw, twd_krw_rate, start_date, end_date, travelers, scope_note
) values (
  'taiwan-2027', 4000000, 44.26, '2027-02-20', '2027-02-23', 3,
  '항공권·숙박비 제외 · Excel은 백업/참고용 · Supabase가 운영 원본'
)
on conflict (trip_id) do update set
  total_budget_krw = excluded.total_budget_krw,
  twd_krw_rate = excluded.twd_krw_rate,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  travelers = excluded.travelers,
  scope_note = excluded.scope_note;

insert into public.budget_items (
  trip_id, trip_day, category, item_name, currency, planned_amount, status, priority, vendor, memo, sort_order
) values
  ('taiwan-2027', '한국 출국', '교통', '목동 → 인천공항 T2 이동', 'KRW', 0, '검토 중', 2, null, 'Stretch Limousine 조건 재확인. 조건이 맞지 않으면 프리미엄 택시 또는 일반 택시.', 10),
  ('taiwan-2027', 'Day 1', '교통', 'Taipei Garden Hotel Mercedes-Benz 공항픽업', 'TWD', 1800, '예약 절차 진행 중', 3, 'Taipei Garden Hotel', 'Mercedes-Benz sedan, 통상 S350. 2013–2019년식 범위, 특정 연식/차량 지정 불가. T2→호텔, 3인+대형 캐리어 2개.', 110),
  ('taiwan-2027', 'Day 1', '교통', '타이베이·단수이 시내 택시', 'TWD', 2200, '예정', 2, null, '부모님 컨디션에 맞춰 그때그때 호출.', 120),
  ('taiwan-2027', 'Day 1', '식비/주류', '춘수당 점심 + 버블티', 'TWD', 1400, '예정', 2, '춘水堂', null, 130),
  ('taiwan-2027', 'Day 1', '식비/주류', '단수이 해산물 + 주류', 'TWD', 4500, '예정', 2, null, null, 140),
  ('taiwan-2027', 'Day 1', '카페/간식', '삼미식당·야시장·시먼딩 간식', 'TWD', 800, '선택', 1, null, '삼미식당 연어초밥은 대기가 길면 미련 없이 패스.', 150),
  ('taiwan-2027', 'Day 2', '교통', 'LUMI DRIVE New Alphard 40系 · Day 2 + Day 4', 'TWD', 15000, '예약금 송금 승인 대기', 3, 'LUMI DRIVE 璐米租車', 'Day 2 8시간 + Day 4 약 4시간. 2024–2026 차량 풀에서 신형 우선, 2026년식 지정 보장 아님. 합법 R 번호판, 승객보험 1인당 NT$5,000,000.', 210),
  ('taiwan-2027', 'Day 2', '식비/주류', 'Qiao Yan 점심', 'TWD', 3200, '예정', 2, 'Qiao Yan', null, 220),
  ('taiwan-2027', 'Day 2', '관광/체험', '스펀 풍등', 'TWD', 300, '예정', 2, null, '풍등 1개 기준.', 230),
  ('taiwan-2027', 'Day 2', '카페/간식', '스펀 간식·음료', 'TWD', 500, '예정', 1, null, null, 240),
  ('taiwan-2027', 'Day 2', '식비/주류', '지우펀 저녁 + 고량주', 'TWD', 3500, '예정', 2, null, null, 250),
  ('taiwan-2027', 'Day 3', '교통', 'Day 3 택시', 'TWD', 1800, '예정', 2, null, '전용차 없이 필요한 순간마다 호출.', 310),
  ('taiwan-2027', 'Day 3', '식비/주류', '딘타이펑 신생점', 'TWD', 2800, '예정', 3, '鼎泰豐 新生店', null, 320),
  ('taiwan-2027', 'Day 3', '카페/간식', '용캉제·칭톈제 카페·디저트', 'TWD', 900, '예정', 1, null, null, 330),
  ('taiwan-2027', 'Day 3', '식비/주류', '2차 이자카야', 'TWD', 2200, '예정', 1, '85TD', '메인 디너 뒤 가볍게.', 340),
  ('taiwan-2027', 'Day 4', '식비/주류', '현지식 아침', 'TWD', 500, '예정', 1, null, null, 410),
  ('taiwan-2027', 'Day 4', '식비/주류', '肥前屋 장어덮밥', 'TWD', 1800, '예정', 3, '肥前屋', null, 420),
  ('taiwan-2027', 'Day 4', '카페/간식', '공항 라운지·간식', 'TWD', 300, '예정', 1, null, '비즈니스 라운지 외 추가 간식만.', 430),
  ('taiwan-2027', '공통', '쇼핑/기타', '편의점·기념품·기타', 'TWD', 3000, '예정', 1, null, null, 510),
  ('taiwan-2027', '한국 귀국', '교통', '인천공항 → 목동 택시', 'KRW', 0, '현장 호출', 1, null, '도착 후 편하게 택시 호출.', 610)
on conflict (trip_id, trip_day, item_name) do update set
  category = excluded.category,
  currency = excluded.currency,
  planned_amount = excluded.planned_amount,
  status = excluded.status,
  priority = excluded.priority,
  vendor = excluded.vendor,
  memo = excluded.memo,
  sort_order = excluded.sort_order;

insert into public.reservations (
  id, trip_id, vendor, service_name, service_dates, currency, total_amount, status, conditions, cancellation_note, memo
) values
  (
    '11111111-1111-4111-8111-111111111111', 'taiwan-2027', 'Taipei Garden Hotel',
    'Mercedes-Benz Airport Transfer', array['2027-02-20'::date], 'TWD', 1800,
    'reservation_in_progress',
    jsonb_build_object(
      'route', '桃園國際機場 T2 → 台北花園大酒店',
      'vehicle', 'Mercedes-Benz sedan · 통상 S350',
      'vehicle_years', '약 2013–2019',
      'capacity', '성인 3명 · 대형 수하물 2개',
      'availability', '24시간 · 최소 24시간 전 예약',
      'free_wait', '예정 도착시간 기준 90분',
      'night_surcharge', '23:00–06:00 NT$200'
    ),
    '예약번호·항공편·도착시간 제출 후 Google Form 카드 사전승인과 호텔 회신 필요.',
    '사전승인은 예약 보증용 hold이며 약 14영업일 내 해제. 실제 비용은 호텔에서 해당 카드·다른 카드·현금으로 결제 가능.'
  ),
  (
    '22222222-2222-4222-8222-222222222222', 'taiwan-2027', 'LUMI DRIVE 璐米租車',
    'Toyota New Alphard 40系 · Day 2 + Day 4', array['2027-02-21'::date, '2027-02-23'::date], 'TWD', 15000,
    'deposit_bank_approval_pending',
    jsonb_build_object(
      'schedule', 'Day 2 8시간 · Day 4 약 4시간',
      'vehicle_years', '2024–2026 차량 풀 · 신형 연식 우선',
      'license', '합법 R 번호판 렌터카',
      'insurance', '승객보험 1인당 NT$5,000,000',
      'cabin', '무연 · 출차 전 내외부 정리',
      'second_row', '독립 캡틴시트 · 전동 리클라이닝 · 레그레스트 · 통풍 · 열선 · 마사지',
      'dispatch_notice', '운행 24시간 전까지 기사·차량 정보 제공'
    ),
    '초과시간 발생 시 추가요금 별도.',
    '첫 계약금 수령 후 업체가 정식 주문 생성. 일반 기사 간단한 영어 가능, 복잡한 소통은 번역 앱 사용.'
  )
on conflict (trip_id, vendor, service_name) do update set
  service_dates = excluded.service_dates,
  currency = excluded.currency,
  total_amount = excluded.total_amount,
  status = excluded.status,
  conditions = excluded.conditions,
  cancellation_note = excluded.cancellation_note,
  memo = excluded.memo;

insert into public.reservation_payments (
  id, reservation_id, label, amount, currency, due_date, paid_at, status, payment_method, memo, sort_order
) values
  ('11111111-1111-4111-8111-111111111101', '11111111-1111-4111-8111-111111111111', '호텔 도착 후 결제', 1800, 'TWD', '2027-02-20', null, 'scheduled', '현금 또는 카드', 'Google Form 카드 사전승인은 결제가 아닌 보증용 hold.', 1),
  ('22222222-2222-4222-8222-222222222201', '22222222-2222-4222-8222-222222222222', '8월 계약금', 2000, 'TWD', '2026-08-31', null, 'bank_approval_pending', '해외송금', '한국 은행 승인 대기. 수령 후 정식 주문 생성.', 1),
  ('22222222-2222-4222-8222-222222222202', '22222222-2222-4222-8222-222222222222', '1월 추가 계약금', 2000, 'TWD', '2027-01-31', null, 'scheduled', '해외송금', '2027년 1월 예정.', 2),
  ('22222222-2222-4222-8222-222222222203', '22222222-2222-4222-8222-222222222222', '잔금', 11000, 'TWD', '2027-02-23', null, 'scheduled', null, 'Day 4 마지막 차량 일정 종료 후.', 3)
on conflict (id) do update set
  label = excluded.label,
  amount = excluded.amount,
  currency = excluded.currency,
  due_date = excluded.due_date,
  paid_at = excluded.paid_at,
  status = excluded.status,
  payment_method = excluded.payment_method,
  memo = excluded.memo,
  sort_order = excluded.sort_order;

-- The family PIN is provisioned after migration as a bcrypt hash only.
-- Never commit the raw PIN or a service/secret key to this repository.
