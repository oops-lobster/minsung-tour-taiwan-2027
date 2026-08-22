begin;

update public.budget_items
set
  category = '교통 / 공항 픽업',
  item_name = '奇立租賃 Lexus ES300h + 피켓 서비스',
  currency = 'TWD',
  planned_amount = 1500,
  status = '예약 요청 · 확인 대기',
  priority = 3,
  vendor = '奇立租賃',
  memo = 'ES300h 픽업 NT$1,300 + 피켓 서비스 NT$200. 5년 이내 ES300h 지정, 차종 변경 없음. 주차·통행료 포함, 실제 착륙 후 90분 대기 포함. 현금 결제 예정. 실제 차량·기사 정보는 이용 2–3일 전 확정.',
  updated_at = now()
where trip_id = 'taiwan-2027'
  and (
    id = '3c436cbc-2085-4500-b7d7-499197ab2608'
    or item_name in (
      'Taipei Garden Hotel Mercedes-Benz 공항픽업',
      '奇立租賃 Lexus ES300h + 피켓 서비스'
    )
  );

update public.budget_items
set
  memo = regexp_replace(coalesce(memo, ''), '공항 픽업 NT\$1,800은 별도 항목\.', '공항 픽업은 별도 항목.'),
  updated_at = now()
where trip_id = 'taiwan-2027'
  and (
    id = 'cac5c45a-7df0-41f2-a847-ab732e75ab4f'
    or item_name = 'Day 1 MRT·택시 이동'
  );

update public.reservations
set
  vendor = '奇立租賃',
  service_name = 'Lexus ES300h Airport Pickup + Signboard',
  service_dates = array['2027-02-20'::date],
  currency = 'TWD',
  total_amount = 1500,
  status = 'confirmation_pending',
  conditions = jsonb_build_object(
    'route', '桃園國際機場 T2 → 台北花園大酒店',
    'flight', '아시아나항공 OZ711 · TPE T2 09:50 도착',
    'vehicle', 'Lexus ES300h 지정',
    'vehicle_years', '5년 이내',
    'model_guarantee', '다른 차종으로 변경 없음',
    'capacity', '성인 3명 · 중형 캐리어 1개 · 기내용 캐리어 1개',
    'signboard', '피켓 미팅 포함',
    'free_wait', '실제 착륙 후 90분',
    'included_fees', '주차비 · 통행료 · 일반 픽업 비용 포함',
    'holiday_surcharge', '춘절·원소절 추가요금 없음',
    'dispatch_notice', '실제 차량·기사 정보는 이용 2–3일 전 제공'
  ),
  cancellation_note = '업체 최종 예약 확인 대기. 확정 전에는 예약 완료로 처리하지 않음.',
  memo = '현금 결제 예정. 현재 별도 계약금 없음. 업체가 추후 계약금을 요청하면 결제 상태 갱신.',
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111111'
  and trip_id = 'taiwan-2027';

update public.reservation_payments
set
  label = '이용 당일 현금 결제 예정',
  amount = 1500,
  currency = 'TWD',
  due_date = '2027-02-20',
  paid_at = null,
  status = 'scheduled',
  payment_method = '현금',
  memo = 'ES300h NT$1,300 + 피켓 NT$200. 업체가 추후 계약금을 요청하면 결제 상태 갱신.',
  updated_at = now()
where id = '11111111-1111-4111-8111-111111111101'
  and reservation_id = '11111111-1111-4111-8111-111111111111';

update public.trip_tasks
set
  title = '奇立 ES300h 픽업 최종 확인',
  note = '奇立租賃 ES300h 지정 픽업 + 피켓 서비스 최종 확답 확인. OZ711 09:50/T2, 현금 결제, 실제 차량·기사 정보는 이용 2–3일 전 확인.',
  updated_at = now()
where trip_id = 'taiwan-2027'
  and title = '호텔 리무진 예약';

update public.trip_tasks
set
  note = '奇立租賃 ES300h 지정 픽업 + 피켓 서비스 최종 확답 확인. OZ711 09:50/T2, 현금 결제, 실제 차량·기사 정보는 이용 2–3일 전 확인.',
  updated_at = now()
where trip_id = 'taiwan-2027'
  and title = '奇立 ES300h 픽업 최종 확인';

commit;
