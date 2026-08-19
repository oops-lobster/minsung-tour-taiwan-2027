-- The pre-existing trip_tasks table used this public trigger. The private
-- trigger installed by our security migration supersedes it.
drop trigger if exists set_trip_tasks_updated_at on public.trip_tasks;
drop function if exists public.set_updated_at();
