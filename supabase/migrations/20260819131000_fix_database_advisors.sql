-- Keep a legacy trigger helper deterministic when this migration is applied to
-- an existing project. Fresh installations do not have this legacy function.
do $$
begin
  if to_regprocedure('public.set_updated_at()') is not null then
    alter function public.set_updated_at() set search_path = '';
  end if;
end $$;

create index if not exists budget_sessions_trip_id_idx
  on private.budget_sessions (trip_id);

create index if not exists expenses_budget_item_id_idx
  on public.expenses (budget_item_id);
