create table if not exists public.trip_tasks (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null default 'taiwan-2027',
  title text not null,
  due_month date,
  note text,
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'trip_tasks_trip_id_fkey') then
    alter table public.trip_tasks add constraint trip_tasks_trip_id_fkey
    foreign key (trip_id) references public.trip_settings(trip_id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'trip_tasks_title_length_check') then
    alter table public.trip_tasks add constraint trip_tasks_title_length_check
    check (char_length(title) between 1 and 160);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'trip_tasks_due_month_check') then
    alter table public.trip_tasks add constraint trip_tasks_due_month_check
    check (due_month is null or due_month = date_trunc('month', due_month)::date);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'trip_tasks_note_length_check') then
    alter table public.trip_tasks add constraint trip_tasks_note_length_check
    check (note is null or char_length(note) <= 2000);
  end if;
end $$;

create unique index if not exists trip_tasks_trip_title_uidx on public.trip_tasks (trip_id, title);
create index if not exists trip_tasks_sort_idx on public.trip_tasks (trip_id, completed, due_month, sort_order, created_at);

drop trigger if exists trip_tasks_touch_updated_at on public.trip_tasks;
create trigger trip_tasks_touch_updated_at before update on public.trip_tasks
for each row execute function private.touch_updated_at();

alter table public.trip_tasks enable row level security;
revoke all on table public.trip_tasks from public, anon, authenticated;
grant all on table public.trip_tasks to service_role;

insert into public.trip_tasks (trip_id, title, due_month, note, completed, sort_order)
values
  ('taiwan-2027', '호텔 리무진 예약', '2027-01-01', 'Taipei Garden Hotel 공항 픽업. 항공편 번호와 도착시간 최종 확인 후 예약.', false, 10),
  ('taiwan-2027', '스트레치 리무진 재문의', '2027-01-01', '2027년 1월쯤 실제 차량과 배차 가능 여부 재확인. 조건이 맞지 않으면 다른 차량으로 변경.', false, 20)
on conflict (trip_id, title) do nothing;
