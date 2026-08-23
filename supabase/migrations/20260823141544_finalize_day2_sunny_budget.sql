begin;

-- Matches production migration history version 20260823141544.

-- Preserve the original row IDs when upgrading older seed data, while avoiding
-- unique-key collisions in databases where the final rows already exist.
delete from public.budget_items as legacy
where legacy.trip_id = 'taiwan-2027'
  and (
    (legacy.trip_day = 'Day 2' and legacy.item_name = 'LUMI DRIVE New Alphard 40系 · Day 2 + Day 4'
      and exists (select 1 from public.budget_items where trip_id = legacy.trip_id and trip_day = 'Day 2' and item_name = 'LUMI DRIVE New Alphard 40系 · Day 2 배분'))
    or (legacy.trip_day = 'Day 2' and legacy.item_name = 'Qiao Yan 점심'
      and exists (select 1 from public.budget_items where trip_id = legacy.trip_id and trip_day = 'Day 2' and item_name = '龜吼漁夫市集 점심 3인'))
    or (legacy.trip_day = 'Day 2' and legacy.item_name = '스펀 간식·음료'
      and exists (select 1 from public.budget_items where trip_id = legacy.trip_id and trip_day = 'Day 2' and item_name = '스펀 간식·커피'))
    or (legacy.trip_day = 'Day 2' and legacy.item_name = '지우펀 저녁 + 고량주'
      and exists (select 1 from public.budget_items where trip_id = legacy.trip_id and trip_day = 'Day 2' and item_name = '阿理廚坊 1차 + 고량주'))
  );

update public.budget_items
set item_name = 'LUMI DRIVE New Alphard 40系 · Day 2 배분'
where trip_id = 'taiwan-2027' and trip_day = 'Day 2'
  and item_name = 'LUMI DRIVE New Alphard 40系 · Day 2 + Day 4';

update public.budget_items
set item_name = '龜吼漁夫市集 점심 3인'
where trip_id = 'taiwan-2027' and trip_day = 'Day 2' and item_name = 'Qiao Yan 점심';

update public.budget_items
set item_name = '스펀 간식·커피'
where trip_id = 'taiwan-2027' and trip_day = 'Day 2' and item_name = '스펀 간식·음료';

update public.budget_items
set item_name = '阿理廚坊 1차 + 고량주'
where trip_id = 'taiwan-2027' and trip_day = 'Day 2' and item_name = '지우펀 저녁 + 고량주';

insert into public.budget_items (
  trip_id, trip_day, category, item_name, currency, planned_amount,
  status, priority, vendor, memo, sort_order
) values
  ('taiwan-2027', 'Day 2', '식비/주류', 'Taipei Garden Hotel 조식 3인', 'TWD', 2000, '예정', 2, 'Taipei Garden Hotel', '숙박 예약은 조식 미포함. 2027/2/21 아침 1일만 현장 추가 결제 예정. 현재 기준 1인 NT$600 + 10% 서비스료 ≈ NT$660, 3인 약 NT$1,980이라 예산은 NT$2,000으로 잡음. 2/20 체크인 시 다음 날 조식만 추가 요청하고 2027 실제 요금 재확인.', 205),
  ('taiwan-2027', 'Day 2', '교통', 'LUMI DRIVE New Alphard 40系 · Day 2 배분', 'TWD', 10000, '예약금 송금 승인 대기', 3, 'LUMI DRIVE 璐米租車', 'LUMI Day 2 + Day 4 패키지 총액 NT$15,000 중 Day 2 8시간 몫을 NT$10,000으로 배분. 예약/결제 원본은 reservations의 총액 NT$15,000을 유지.', 210),
  ('taiwan-2027', 'Day 2', '관광/체험', '예류지질공원 입장 3인', 'TWD', 360, '예정', 2, '野柳地質公園', '성인 3명 기준 현재 참고 예산. 2027-02-21 실제 입장료는 여행 직전 재확인.', 215),
  ('taiwan-2027', 'Day 2', '식비/주류', '龜吼漁夫市集 점심 3인', 'TWD', 3000, '예정', 2, '龜吼漁夫市集', 'Day 2 예류 뒤 귀후어항 현장 선택형 점심. 목표 지출 NT$2,500 전후, 편하게 허용 NT$3,000, NT$3,200을 넘으면 주문량/시가 품목을 다시 확인. 추천 구성: 연어 제외 제철 모둠 사시미, 니기리 6–10피스(가능하면), 상태와 가격이 좋을 때 花蟹 1마리 清蒸, 당일 좋은 흰살생선 1마리 찜 또는 소금구이, 小卷/透抽 또는 야생새우, 채소·국. 랍스터·고가 갑각류는 Day 3 고급 디너로 남김. 1층에서 단가→무게→재료값 확인 후 2층 조리비·총액까지 확인하고 조리.', 220),
  ('taiwan-2027', 'Day 2', '관광/체험', '스펀 풍등', 'TWD', 300, '예정', 2, null, '풍등 1개 기준. 2026 현장 참고가: 단색 약 NT$200, 인기 4색 약 NT$250–300. 세 사람이 4색 풍등 1개를 함께 쓰는 것을 기본으로 하고, 2027/2/21 실제 가격은 현장 재확인.', 230),
  ('taiwan-2027', 'Day 2', '카페/간식', '스펀 간식·커피', 'TWD', 800, '예정', 1, null, '귀후어항 점심 뒤라 간식은 맛보기 위주. 2026 참고가: 땅콩 아이스크림롤 약 NT$50, 닭날개 볶음밥 약 NT$75. 커피는 Tag Cafe 또는 十分柑ma店에서 3인 15–20분 휴식/테이크아웃을 고려해 총 NT$800 예산. 점포·가격은 2027 방문 전 재확인.', 240),
  ('taiwan-2027', 'Day 2', '식비/주류', '阿理廚坊 1차 + 고량주', 'TWD', 2800, '예약 문의 예정', 3, '阿理廚坊', '17:30 전후 3인. 대만식 요리 여러 접시 + 고량주 1차. 창가/야경 자리, 金門高粱 판매 여부, 외부 고량주 반입 및 코키지 여부를 예약 전에 확인.', 250),
  ('taiwan-2027', 'Day 2', '식비/주류', 'Golden Bar 2차 · 크래프트 맥주', 'TWD', 2200, '예약 문의 예정', 2, '逸茶酒室 Golden Bar', '19:05 전후 입장, 3인. 대만 크래프트 맥주를 넉넉히 마시는 기준. 1층 창가 또는 2층 전망석 예약 가능 여부를 문의.', 260),
  ('taiwan-2027', 'Day 2', '교통', '지우펀 → Taipei Garden Hotel 택시', 'TWD', 1000, '예정', 2, null, 'Golden Bar 종료 후 20:15 전후 호출, 호텔 21:00 전후 도착 목표. 2027 춘절 특별운임 여부는 직전 재확인.', 270),
  ('taiwan-2027', 'Day 2', '식비/주류', '은하동 한식포차 3차', 'TWD', 1200, '선택', 1, '銀河洞 韓式pocha', '호텔 21:00 복귀 후 컨디션이 좋을 때만 발동하는 히든 스테이지. 호텔에서 도보 약 8–12분. 어묵탕/전류 + 소주 중심.', 280),
  ('taiwan-2027', 'Day 2', '예비비', 'Day 2 맑음 플랜 예비비 · 상한 26,000', 'TWD', 2340, '상한 버퍼', 0, null, '세부 계획 합계 약 NT$23,660(3차 포함). 실제 지출 목표는 약 NT$23,500, Day 2 맑음 플랜 상한은 NT$26,000으로 관리.', 290),
  ('taiwan-2027', 'Day 4', '교통', 'LUMI DRIVE New Alphard 40系 · Day 4 배분', 'TWD', 5000, '예약금 송금 승인 대기', 3, 'LUMI DRIVE 璐米租車', 'LUMI Day 2 + Day 4 패키지 총액 NT$15,000 중 Day 4 약 4시간 몫을 NT$5,000으로 배분. 예약/결제 원본 총액은 변경하지 않음.', 405)
on conflict (trip_id, trip_day, item_name) do update set
  category = excluded.category,
  currency = excluded.currency,
  planned_amount = excluded.planned_amount,
  status = excluded.status,
  priority = excluded.priority,
  vendor = excluded.vendor,
  memo = excluded.memo,
  sort_order = excluded.sort_order;

do $$
declare
  day2_total numeric;
  lumi_total numeric;
  lumi_payment_total numeric;
  lumi_payment_count integer;
begin
  select sum(planned_amount) into day2_total
  from public.budget_items
  where trip_id = 'taiwan-2027' and trip_day = 'Day 2' and currency = 'TWD';

  if day2_total is distinct from 26000 then
    raise exception 'Day 2 TWD planned total must be 26000, got %', day2_total;
  end if;

  select total_amount into lumi_total
  from public.reservations
  where id = '22222222-2222-4222-8222-222222222222'
    and trip_id = 'taiwan-2027'
    and vendor = 'LUMI DRIVE 璐米租車'
    and service_dates = array['2027-02-21'::date, '2027-02-23'::date];

  if lumi_total is distinct from 15000 then
    raise exception 'LUMI reservation total must remain 15000, got %', lumi_total;
  end if;

  select coalesce(sum(amount), 0), count(*) into lumi_payment_total, lumi_payment_count
  from public.reservation_payments
  where reservation_id = '22222222-2222-4222-8222-222222222222';

  if lumi_payment_total is distinct from 15000 or lumi_payment_count is distinct from 3 then
    raise exception 'LUMI payment schedule must remain 3 rows totaling 15000';
  end if;
end;
$$;

commit;
