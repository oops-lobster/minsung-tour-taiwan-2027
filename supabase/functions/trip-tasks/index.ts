import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.112.3"

const TRIP_ID = "taiwan-2027"
const productionOrigin = "https://oops-lobster.github.io"

function isAllowedOrigin(origin: string) {
  return origin === productionOrigin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? ""
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? origin : productionOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-budget-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  }
}

function json(request: Request, body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders(request) })
}

function readSecretKey() {
  const modern = Deno.env.get("SUPABASE_SECRET_KEYS")
  if (modern) {
    try {
      const parsed = JSON.parse(modern) as Record<string, string | { key?: string; value?: string }>
      const candidate = parsed.default ?? Object.values(parsed)[0]
      if (typeof candidate === "string") return candidate
      if (candidate?.key) return candidate.key
      if (candidate?.value) return candidate.value
    } catch {
      if (modern.startsWith("sb_secret_")) return modern
    }
  }
  return Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
}

function normalizeDueMonth(value: unknown) {
  if (value === null || value === "") return null
  if (typeof value !== "string") return undefined
  if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`
  if (/^\d{4}-\d{2}-01$/.test(value)) return value
  return undefined
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) })
  if (request.method !== "POST") return json(request, { ok: false, error: "method_not_allowed" }, 405)

  const origin = request.headers.get("origin")
  if (origin && !isAllowedOrigin(origin)) return json(request, { ok: false, error: "origin_not_allowed" }, 403)

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
  const secretKey = readSecretKey()
  if (!supabaseUrl || !secretKey) return json(request, { ok: false, error: "server_not_configured" }, 500)
  const admin = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false } })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return json(request, { ok: false, error: "invalid_json" }, 400)
  }

  const sessionToken = request.headers.get("x-budget-session")
    ?? (typeof body.sessionToken === "string" ? body.sessionToken : "")
  const { data: sessionValid, error: sessionError } = await admin.rpc("budget_validate_session", { p_token: sessionToken })
  if (sessionError) return json(request, { ok: false, error: "session_check_failed" }, 500)
  if (!sessionValid) return json(request, { ok: false, error: "session_expired" }, 401)

  const action = typeof body.action === "string" ? body.action : ""

  if (action === "list") {
    const { data, error } = await admin.from("trip_tasks")
      .select("id,trip_id,title,due_month,note,completed,sort_order,created_at,updated_at")
      .eq("trip_id", TRIP_ID)
      .order("completed", { ascending: true })
      .order("due_month", { ascending: true, nullsFirst: false })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
    if (error) return json(request, { ok: false, error: "db_error" }, 500)
    return json(request, { ok: true, tasks: data ?? [] })
  }

  if (action === "create") {
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 160) : ""
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 2000) : ""
    const dueMonthValue = Object.prototype.hasOwnProperty.call(body, "due_month") ? body.due_month : body.dueMonth
    const dueMonth = normalizeDueMonth(dueMonthValue)
    if (!title) return json(request, { ok: false, error: "title_required" }, 400)
    if (dueMonth === undefined) return json(request, { ok: false, error: "invalid_due_month" }, 400)

    const { data: latest } = await admin.from("trip_tasks").select("sort_order")
      .eq("trip_id", TRIP_ID).order("sort_order", { ascending: false }).limit(1).maybeSingle()
    const { data, error } = await admin.from("trip_tasks").insert({
      trip_id: TRIP_ID,
      title,
      due_month: dueMonth,
      note: note || null,
      sort_order: Number(latest?.sort_order ?? 0) + 10,
    }).select("id,trip_id,title,due_month,note,completed,sort_order,created_at,updated_at").single()
    if (error) return json(request, { ok: false, error: error.code === "23505" ? "duplicate_title" : "db_error" }, error.code === "23505" ? 409 : 500)
    return json(request, { ok: true, task: data }, 201)
  }

  if (action === "toggle") {
    const id = typeof body.id === "string" ? body.id : ""
    if (!id || typeof body.completed !== "boolean") return json(request, { ok: false, error: "invalid_task" }, 400)
    const { data, error } = await admin.from("trip_tasks").update({ completed: body.completed })
      .eq("trip_id", TRIP_ID).eq("id", id)
      .select("id,trip_id,title,due_month,note,completed,sort_order,created_at,updated_at").single()
    if (error) return json(request, { ok: false, error: "db_error" }, 500)
    return json(request, { ok: true, task: data })
  }

  if (action === "delete") {
    const id = typeof body.id === "string" ? body.id : ""
    if (!id) return json(request, { ok: false, error: "id_required" }, 400)
    const { error } = await admin.from("trip_tasks").delete().eq("trip_id", TRIP_ID).eq("id", id)
    if (error) return json(request, { ok: false, error: "db_error" }, 500)
    return json(request, { ok: true })
  }

  return json(request, { ok: false, error: "unknown_action" }, 400)
})
