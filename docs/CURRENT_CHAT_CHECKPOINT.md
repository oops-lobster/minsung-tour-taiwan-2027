# CURRENT CHAT CHECKPOINT

Last updated: 2026-08-24 16:48 KST

> Canonical handoff for continuing this Taiwan family-trip planning chat.
>
> **Freshness rule:** if this checkpoint and the repository disagree, inspect latest `main` first and treat `main` as product source of truth. Protected Supabase remains the operational budget source of truth.

---

# Conversation mode
- User: 민성.
- Tone: persona 4 / 새라 모드 — 친근한 반말, 장난스럽게 가능. 정확한 정보는 엄밀하게.
- Food priority: **taste > price > transport convenience**.
- Parents’ comfort matters strongly, especially rear-seat comfort and minimizing luggage burden.
- Rain alternatives should be **equally good alternate days**, not degraded backups.
- **Do not expose protected budget figures in public docs/UI.** Read Supabase when budget detail is needed.
- Vendor LINE/chat logs: translate → interpret → classify `keep / one reminder / close & leave` → draft reply if needed.
- Do **not** send Gmail/email/Calendar/external writes unless explicitly requested in the current message. Default to copy/paste drafts.
- English reservation/contact name is always **RAY** (`R-A-Y`).
- Chinese call scripts should, when useful, be shown as:
  1. Traditional Chinese
  2. Pinyin
  3. Korean phonetic reading

---

# CURRENT CONVERSATION POSITION

## Day 2 Plan A
- **Sunny/fair Plan A is CLOSED / FINALIZED. Do not redesign it unless the user explicitly reopens it.**
- Final daytime flow:
  - Taipei Garden Hotel breakfast
  - 08:30 LUMI Alphard departure
  - Yehliu
  - Guihou Fishermen’s Market lunch
  - Shifen Waterfall
  - Shifen Old Street
  - Jiufen arrival around 16:15, LUMI 8h service ends
- Jiufen evening for Plan A:
  - 16:15–17:20 lantern/photo walk
  - 17:30 阿理廚坊 / A Li Kitchen — Taiwanese dinner + kaoliang
  - short night alley walk
  - ~19:00 逸茶酒室 Golden Bar — Taiwanese craft beer, **Golden Bar remains A-plan first choice**
  - ~20:15 55688 taxi first choice back to Taipei Garden Hotel; Uber/local taxi backup
  - optional hidden-stage Korean pocha near hotel only if energy remains

## Day 2 rainy-day reset — IMPORTANT NEW DIRECTION
Earlier B/C logic tried to preserve parts of Yehliu/Shifen/Jiufen. **That is now obsolete.**

User explicitly decided:
- **B and C should abandon the entire “예스지” frame.**
- B/C do **not** have to go to Yehliu, Shifen, Jiufen, north coast, or northeast Taiwan.
- Treat the LUMI booking as what it really is: **a private chauffeur-driven Alphard for 8 hours**, not a fixed package tour.
- B/C may go anywhere reasonably reachable within the charter: Taipei, Beitou, Wulai, Taoyuan, Yilan/Jiaoxi, etc.
- The design criterion is not “save A despite rain.” It is:
  > **Would the family feel ‘it was actually better because it rained’?**
- Therefore B/C must be built from a blank page around rain-positive experiences: hot springs, excellent indoor museums, scenic rainy drives, good meals, door-to-door comfort.
- User is open to Taoyuan or Yilan; no north/northeast constraint.
- Kaohsiung was discussed jokingly and rejected as impractical for an 8h Taipei-based charter because return travel would dominate the day.

## Current A/B/C/D interpretation
- **A:** fair / only weak shower → execute finalized Plan A.
- **B:** ordinary/manageable rain → completely separate “rain is a feature” itinerary, not a damaged A.
- **C:** persistent/heavier but still safe rain → even more indoor / weather-positive alternative, still fully independent from A.
- **D:** typhoon / extreme downpour / dangerous wind / road closure / government emergency → stop normal itinerary logic and prioritize safety + LUMI operating decision.

The next major planning task is **design B and C from scratch across the broader Taipei/Taoyuan/Yilan/Beitou/Wulai region**.

---

# Day 2 weather-decision web app
User wants the web app to classify the Day 2 weather situation automatically when the app is opened.

Desired concept:
- no background server job required
- app open → fetch latest available forecast/live data → classify/update UI
- weather inputs should be multi-location, not Taipei-only
- Yehliu-specific wind/gust/wave data matter for A decision
- do not show today’s weather as if it were the 2027-02-21 forecast when trip date is outside forecast range
- show `아직 여행일 예보 제공 전` until real forecast exists
- D should be a safety override, not “C but worse”

A detailed Codex prompt was prepared for:
- Open-Meteo weather + marine
- A/B/C classifier + safety hold
- per-location status
- reasons/confidence
- forecast-range awareness
- manual override
- deterministic test modes
- unit tests/build checks

**Implementation completion has not yet been verified. Inspect latest `main` before claiming it is live.**

---

# Trip core
- Taiwan family trip, 3 adults.
- Dates: **2027-02-20 to 2027-02-23**.
- Hotel: **Taipei Garden Hotel**.
- Day 1 flight source of truth: **Asiana OZ711, ICN 08:00 → TPE T2 09:50 local**.
- Recheck actual 2027 airline itinerary before travel.
- Day 2 & Day 4 vehicle: **LUMI DRIVE New Toyota Alphard 40系**.

---

# KOREA DEPARTURE CAR — FINALIZED / CONFIRMED

## Global25 chauffeur reservation
- Vendor: **글로벌25시콜리무진**.
- Date: **2027-02-20**.
- Pickup window: **04:10–04:20**.
- Route: Mokdong → **ICN Terminal 2**.
- Travelers: 3 adults, 2 suitcases.
- Vehicle: **Genesis G90 Long Wheel Base 4-seat**.
- Vendor sent rear-seat photos; they show the desired true 4-seat VIP layout with two independent rear seats, fixed center console, large rear cabin, and visible legrest configuration.
- User decided this level of evidence is sufficient and proceeded.
- **Reservation confirmation message has now been received. Reservation is CONFIRMED.**
- No reservation deposit.
- User selected bank transfer as payment method in the reservation request.
- Exact private amount is stored in protected Supabase; do not mirror it in public docs.

## Website / budget state
- Public website has been updated from the old stretch-limo concept to the Global25 G90 LWB 4-seat reservation.
- G90 rear-seat image has been added to GitHub Pages and linked to the Day 1 departure timeline item.
- Protected Supabase budget item has been updated to **예약 확정**.
- Latest relevant website confirmation commit at this checkpoint: `6d889479a643178668366cf88a40e8ab0c266403`.
- Rear-seat image file on main: `public/images/g90-lwb-4seat-rear.webp`.

**Korea departure vehicle search is closed. Do not reopen unless Global25 changes/cancels the confirmed reservation.**

---

# TAIWAN DAY 1 AIRPORT PICKUP — LIVE BOARD

The user now likes the idea of a different vehicle experience in Taiwan because Korea departure is already a flagship luxury sedan.

## 1) 宇航富豪 — strongest value/comfort candidate at the moment
- ES300h pickup baseline was quoted.
- Vendor offered Mercedes aviation-seat van/MPV upgrade for a very small promo increment.
- User explicitly asked whether the photographed Mercedes aviation-seat vehicle and promo total were really guaranteed; vendor replied **`是的，沒錯`**.
- Seat equipment question covered:
  - electric recline
  - legrest
  - ventilation
  - heating
  - massage
- Vendor replied **`都有，是正航空椅`** → interpret as all listed features present; vendor calls them true aviation seats.
- Photos show very large independent captain/aviation seats and spacious rear cabin.
- User currently sees this as highly attractive because Korea already provides the luxury-sedan experience.

Pending:
- signboard/meet-and-greet fee (question was read but unanswered)
- explicit luggage-help confirmation
- exact waiting-time confirmation for this promo
- day-of payment/no-deposit confirmation if needed
- final reservation confirmation

## 2) Heycar
- W223 S-Class priority, not 100% guaranteed.
- Backup remains S-Class family, not a lower class.
- 90 min free wait after landing confirmed.
- Strong luxury-sedan option, but less differentiated now that Korea departure is G90 LWB.

## 3) 奇立租賃
- Lexus ES300h designated, within 5 years.
- Explicit model guarantee.
- Signboard offered.
- Strong low-risk baseline.
- Conditions were largely agreed, but explicit final reservation confirmation was previously unclear.

## 4) CBI / 錢比國際租賃
- Closed politely.
- Vendor also sent a final courtesy close message.
- **close & leave.**

---

# Day 1 — structurally finalized

## Sunny Plan A
- airport pickup → Taipei Garden Hotel → My灶
- 12:10–13:15 My灶
- 13:30 弄宅咖啡, 3 adults, reservation confirmed
- 14:25–15:20 林安泰古厝民俗文物館
- Baishihu → Bishanyan sunset
- 19:00 小統一牛排館, 3 adults, reservation confirmed/fixed
- Longshan Temple → Huaxi/Guangzhou night market → Carrefour Guilin → hotel

## Rain Day 1
- B1: My灶 + 弄宅 fixed → TFAM if Feb 2027 exhibition fits family → 小隱茶庵 → 19:00 小統一
- B2: if TFAM unsuitable → Miniatures Museum → 小隱茶庵 → 19:00 小統一
- Do not change 小統一 19:00 without approval.

---

# LUMI DRIVE — Day 2 / Day 4 contract
- Driver-included charter, not self-drive.
- Day 2 2027-02-21: New Alphard 40系, **8h, 08:30–16:30 max**.
- Day 4 2027-02-23: ~4h, hotel → 肥前屋 → TPE T2.
- Contract total and payment schedule remain in protected operational records.
- First deposit transfer from Korea was previously sent; never resend unless formally failed/returned.
- Vehicle pool 2024–2026, mostly 2025/2026; 2026 not guaranteed.
- Second-row features confirmed: captain seats, recline, legrest, ventilation, heating, massage.

## LUMI extreme-weather policy — NEW CONFIRMED ANSWER
LUMI replied on 2026-08-24:
- `天災影響訂金會協助退還到您的指定帳戶（或者保留下次使用）`
  - if affected by natural disaster, they will help **refund the deposit to a designated account OR keep it for future use**.
- `您預訂的日期，已經過了颱風季節了（不會有颱風）`
  - vendor notes the booked date is outside normal typhoon season; do not interpret this as literal zero meteorological risk.
- `部份景點關閉會選擇其他景點進行行程！`
  - if only some attractions close, they will **choose other attractions and continue the itinerary**.

User already thanked them; conversation closed with a sticker. No further reply needed.

Operational D rule:
- if safe to drive but some attractions close → reroute to alternatives
- if natural-disaster conditions prevent normal operation → refund/credit option exists
- D remains a safety-first branch, not a sightseeing optimization branch

---

# Jiufen / restaurant status

## 阿理廚坊 / A Li Kitchen
- Plan A target: **2027-02-21 17:30, 3 adults**.
- Goal: Taiwanese dinner + kaoliang, preferably window/night-view seating.
- English phone communication was difficult.
- First call produced `聽不懂` (“I don’t understand”).
- User retried using Google Translate TTS.
- Best interpretation of the staff response: **call again about one week before the date**.
- TODO exists in protected trip tasks:
  - around **2027-02-14**, call again
  - reservation name **RAY**
  - ask for 17:30 / 3 adults / window-night-view seat
  - Google Translate TTS recommended
- Do not claim the restaurant is already reserved.

## 逸茶酒室 Golden Bar
- **Plan A first-choice second round remains Golden Bar.**
- Desired seat: **2F rooftop/open-air scenic seat**.
- General reservation policy is unclear/inconsistent across sources; phone contact is preferred over email by user.
- Facebook Messenger did not work for the user.
- User tried calling; **no answer yet**.
- Retry later; target question only:
  - 2027-02-21 ~19:00
  - 3 guests
  - can 2F rooftop scenic seats be reserved?
- If reservation requires deposit/minimum spend, user is open to it.
- If A weather is good, Golden Bar remains preferred over Ximending alternatives because the Jiufen rooftop-night-view experience is the point.

## Ximending craft-beer idea
- Taihu Driftwood / other Ximending craft-beer bars were explored as alternatives.
- **Do not replace Golden Bar in Plan A.**
- They are only relevant if later B/C design returns to Taipei or if Golden Bar becomes impractical.

---

# Taxi return from Jiufen — Plan A
- Primary: **Taiwan Taxi 55688 app**.
- Secondary: Uber.
- Fallback: local taxi / accessible vehicle pickup point.
- Golden Bar’s alley may not be directly vehicle-accessible; walk to a reachable pickup point before meeting the taxi.

---

# Website / mapping notes
- User wants actual geographic pins/route maps, not vague area names.
- Previous map output once geocoded a place incorrectly far south; avoid name-only ambiguous geocoding.
- When mapping trip points, use verified business refs, exact addresses, or coordinates.
- Day 1 is entirely Taipei-area after arrival from Taoyuan; it does **not** go anywhere near Kaohsiung.
- Day 2 Plan A route: Taipei → Yehliu/Guihou → Shifen → Jiufen → Taipei.

---

# Protected TODO notes
- `阿理廚坊 2/21 저녁 예약` task exists for Feb 2027, with one-week-before phone reminder and RAY details.
- There are older stale TODOs from earlier transport ideas (e.g. stretch-limo follow-up). Since Korea departure is now Global25 G90 confirmed, those obsolete tasks can be cleaned up later if desired.

---

# GitHub / website
Repo: `oops-lobster/minsung-tour-taiwan-2027`
Public site: `https://oops-lobster.github.io/minsung-tour-taiwan-2027/`
Checkpoint: `docs/CURRENT_CHAT_CHECKPOINT.md`

Recent relevant main work:
- Day 2 sunny final schedule / Guihou / Jiufen evening
- protected Day 2 budget migration
- Korea departure update to Global25 G90 LWB 4-seat
- G90 rear-seat image added to public site
- reservation status changed to confirmed

---

# Continuity rules
- Always inspect latest `main` before claiming website state.
- Do not resurrect old Day 1 Tamsui/CKS/Chun Shui Tang plan.
- Do not change 小統一 19:00 reservation.
- Do not remove 弄宅咖啡 from rainy Day 1.
- Do not expose protected budget data publicly.
- OZ711 source of truth remains **09:50 TPE T2** unless airline schedule changes.
- Guihou lunch is fixed in Day 2 Plan A.
- **Day 2 Plan A is closed.**
- **B/C must now be designed from scratch and are not constrained to 예스지, Jiufen, north coast, or northeast Taiwan.**
- B/C success criterion: **“비 와서 더 좋았다.”**
- D = safety-first + LUMI operation/refund/credit logic.
- Korea departure vehicle is **Global25 G90 LWB 4-seat — reservation confirmed — search closed.**
- Golden Bar remains Plan A’s preferred Jiufen craft-beer second round; phone retry pending.
