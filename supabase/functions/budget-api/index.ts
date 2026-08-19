import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.112.3"

const TRIP_ID = "taiwan-2027"
const productionOrigin = "https://oops-lobster.github.io"

function isAllowedOrigin(origin: string) {
  return origin === productionOrigin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)
}

type JsonRecord = Record<string, unknown>

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin") ?? ""
  const allowedOrigin = isAllowedOrigin(origin) ? origin : productionOrigin

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-budget-session",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  }
}

function json(request: Request, body: JsonRecord, status = 200) {
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

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

function asObject(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {}
}

function pick(source: JsonRecord, keys: string[]) {
  return Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]))
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(request) })
  if (request.method !== "POST") return json(request, { ok: false, error: "method_not_allowed" }, 405)

  const origin = request.headers.get("origin")
  if (origin && !isAllowedOrigin(origin)) return json(request, { ok: false, error: "origin_not_allowed" }, 403)

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? ""
  const secretKey = readSecretKey()
  if (!supabaseUrl || !secretKey) return json(request, { ok: false, error: "server_not_configured" }, 500)

  const admin = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let body: JsonRecord
  try {
    body = asObject(await request.json())
  } catch {
    return json(request, { ok: false, error: "invalid_json" }, 400)
  }

  const action = typeof body.action === "string" ? body.action : ""

  if (action === "unlock") {
    const pin = typeof body.pin === "string" ? body.pin : ""
    if (!/^\d{6}$/.test(pin)) return json(request, { ok: false, error: "invalid_pin_format" }, 400)

    const fingerprint = [
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
      request.headers.get("user-agent") ?? "unknown",
      origin ?? "direct",
    ].join("|")
    const clientHash = await sha256(fingerprint)
    const { data, error } = await admin.rpc("budget_unlock", { p_pin: pin, p_client_hash: clientHash })

    if (error) {
      console.error("budget_unlock", error.message)
      return json(request, { ok: false, error: "unlock_failed" }, 500)
    }

    const result = asObject(data)
    if (result.ok === true) return json(request, result)
    if (result.code === "rate_limited") return json(request, result, 429)
    return json(request, result, 401)
  }

  const sessionToken = request.headers.get("x-budget-session")
    ?? (typeof body.sessionToken === "string" ? body.sessionToken : "")
  const { data: sessionValid, error: sessionError } = await admin.rpc("budget_validate_session", {
    p_token: sessionToken,
  })

  if (sessionError) {
    console.error("budget_validate_session", sessionError.message)
    return json(request, { ok: false, error: "session_check_failed" }, 500)
  }
  if (!sessionValid) return json(request, { ok: false, error: "session_expired" }, 401)

  try {
    if (action === "snapshot") {
      const [settingsResult, itemsResult, expensesResult, reservationsResult, paymentsResult] = await Promise.all([
        admin.from("trip_settings").select("*").eq("trip_id", TRIP_ID).single(),
        admin.from("budget_items").select("*").eq("trip_id", TRIP_ID).order("sort_order").order("created_at"),
        admin.from("expenses").select("*").eq("trip_id", TRIP_ID).order("spent_at", { ascending: false }).order("created_at", { ascending: false }),
        admin.from("reservations").select("*").eq("trip_id", TRIP_ID).order("created_at"),
        admin.from("reservation_payments").select("*").order("sort_order").order("created_at"),
      ])
      const failure = [settingsResult, itemsResult, expensesResult, reservationsResult, paymentsResult].find((result) => result.error)
      if (failure?.error) throw failure.error

      return json(request, {
        ok: true,
        data: {
          settings: settingsResult.data,
          budgetItems: itemsResult.data ?? [],
          expenses: expensesResult.data ?? [],
          reservations: reservationsResult.data ?? [],
          reservationPayments: paymentsResult.data ?? [],
        },
      })
    }

    if (action === "budget_item_upsert") {
      const item = asObject(body.item)
      const payload = {
        ...pick(item, ["trip_day", "category", "item_name", "currency", "planned_amount", "status", "priority", "vendor", "memo", "sort_order"]),
        trip_id: TRIP_ID,
      }
      const id = typeof item.id === "string" ? item.id : null
      const query = id
        ? admin.from("budget_items").update(payload).eq("id", id).eq("trip_id", TRIP_ID)
        : admin.from("budget_items").insert(payload)
      const { data, error } = await query.select("*").single()
      if (error) throw error
      return json(request, { ok: true, item: data })
    }

    if (action === "budget_item_delete") {
      const id = typeof body.id === "string" ? body.id : ""
      const { error } = await admin.from("budget_items").delete().eq("id", id).eq("trip_id", TRIP_ID)
      if (error) throw error
      return json(request, { ok: true })
    }

    if (action === "expense_upsert") {
      const expense = asObject(body.expense)
      const payload = {
        ...pick(expense, ["spent_at", "trip_day", "category", "item_name", "currency", "amount", "payment_method", "payment_status", "vendor", "memo", "budget_item_id"]),
        trip_id: TRIP_ID,
      }
      const id = typeof expense.id === "string" ? expense.id : null
      const query = id
        ? admin.from("expenses").update(payload).eq("id", id).eq("trip_id", TRIP_ID)
        : admin.from("expenses").insert(payload)
      const { data, error } = await query.select("*").single()
      if (error) throw error
      return json(request, { ok: true, expense: data })
    }

    if (action === "expense_delete") {
      const id = typeof body.id === "string" ? body.id : ""
      const { error } = await admin.from("expenses").delete().eq("id", id).eq("trip_id", TRIP_ID)
      if (error) throw error
      return json(request, { ok: true })
    }

    if (action === "reservation_payment_update") {
      const payment = asObject(body.payment)
      const id = typeof payment.id === "string" ? payment.id : ""
      const payload = pick(payment, ["status", "paid_at", "payment_method", "memo"])
      const { data, error } = await admin.from("reservation_payments").update(payload).eq("id", id).select("*").single()
      if (error) throw error
      return json(request, { ok: true, payment: data })
    }

    if (action === "settings_update") {
      const settings = asObject(body.settings)
      const payload = pick(settings, ["total_budget_krw", "twd_krw_rate"])
      const { data, error } = await admin.from("trip_settings").update(payload).eq("trip_id", TRIP_ID).select("*").single()
      if (error) throw error
      return json(request, { ok: true, settings: data })
    }

    if (action === "lock") {
      await admin.rpc("budget_revoke_session", { p_token: sessionToken })
      return json(request, { ok: true })
    }

    return json(request, { ok: false, error: "unknown_action" }, 400)
  } catch (error) {
    console.error("budget-api", error instanceof Error ? error.message : String(error))
    return json(request, { ok: false, error: "operation_failed" }, 500)
  }
})
