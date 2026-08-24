# CURRENT CHAT CHECKPOINT

Last updated: 2026-08-24 13:01 KST

> Canonical handoff for continuing this Taiwan family-trip planning chat.
>
> **Freshness rule:** if this checkpoint and the repository disagree, inspect the latest `main` commits/files first and treat `main` as product source of truth. Protected Supabase remains the operational budget source of truth.

---

# Conversation mode
- User: 민성.
- Tone: persona 4 / 새라 모드 — 친근한 반말, 장난스럽게 가능. 정확한 정보는 엄밀하게.
- Food priority: **taste > price > transport convenience**.
- Parents’ comfort matters strongly, especially rear-seat comfort and minimizing luggage burden.
- Rain alternatives should be genuinely good alternate days, not degraded backups.
- Public budget exposure is forbidden. **Do not copy protected budget figures into public UI/docs; read the protected Supabase source when needed.**
- Vendor LINE logs are commonly pasted into chat. Expected workflow: translate → evaluate → classify **keep / one reminder / close & leave** → draft reply if needed.
- For outreach, **do not send Gmail/email or other external messages unless the user explicitly asks to send in that turn.** Default to search + contact info + copy/paste message only.

---

# CURRENT CONVERSATION POSITION

## What is already closed
- **Day 2 sunny / no-rain Plan A is finalized.**
- Day 2 Jiufen evening is finalized through hotel return, with an optional third round.

## Deferred planning task
- Day 2 rainy alternatives are still pending:
  - **Plan B = normal / manageable rain**
  - **Plan C = more persistent or heavier rain, but still safe/manageable**
- Jiufen remains the **fixed ending** for both B and C.
- Torrential rain / typhoon / dangerous wind / landslide-risk conditions are explicitly **out of scope** for the current B/C design.
- Existing Day 2 rain logic in `src/data/weatherPlans.ts` is still placeholder/draft and should not be treated as the newly agreed B/C.

## Current active topic
The conversation temporarily shifted from rainy-Day-2 design to **premium airport-transfer decisions**:
1. Korea home → ICN T2 departure car.
2. TPE T2 → Taipei Garden Hotel arrival car.

---

# Trip core
- Taiwan family trip, 3 adults.
- Dates: **2027-02-20 to 2027-02-23**.
- Hotel: **Taipei Garden Hotel**.
- Day 1 flight source of truth: **Asiana OZ711, ICN 08:00 → TPE T2 09:50 local**.
- Recheck actual 2027 airline itinerary before travel.
- Day 2 & Day 4 vehicle: **LUMI DRIVE New Toyota Alphard 40系**.

---

# KOREA DEPARTURE CAR — NEW LIVE BOARD

## Strategy change
- Original idea: expensive Chrysler 300C Stretch Limousine for the Korea departure.
- Current direction: **drop the stretch-limo idea and use a proper chauffeur-driven flagship sedan instead**, because the 04:20 departure is mostly about sleeping comfortably, luggage help, and a smooth door-to-airport experience.
- Desired experience:
  - chauffeur arrives and waits in front of home before departure
  - helps load luggage
  - parents use the best rear seats
  - direct drop at ICN T2 departure level
  - user can rest/sleep during the ride

## Preferred vehicle
**1st choice: Genesis G90 LWB 4-seat chauffeur car**
- 4-seat layout is preferred over 5-seat bench because total occupants are driver + 3 travelers.
- Ideal seating: driver + user in front, parents in the two independent VIP rear seats.
- Rear-seat experience is the point: independent rear seats / center console / recline / legrest-class chauffeur configuration if available.

## Korea departure timing / load
- Date: 2027-02-20.
- Chauffeur arrival target: about **04:10**.
- Departure: about **04:20**.
- Destination: **ICN Terminal 2**.
- Travelers: 3 adults.
- Luggage: 1 medium suitcase + 1 cabin/20-inch suitcase.

## Price psychology
- Ordinary taxi is much cheaper and remains the practical fallback; departure after 04:00 avoids Seoul taxi late-night surcharge.
- For a **true G90 LWB 4-seat designated chauffeur**:
  - roughly 12–15만원 = very good
  - 15–17만원 = acceptable if vehicle and service are confirmed
  - ~17만원 = psychological ceiling
  - 18만원+ = starts to feel unnecessary
  - 20만원+ = generally reject unless there is an exceptional reason

## Korea candidates
### A. 개인/숨고 G90 LWB 4-seat chauffeur
- A specific individual chauffeur listing for **G90 LWB 4-seat / airport VIP transfer** was found and contacted.
- Exterior and rear-seat photos were checked.
- Treat as one of the two finalists together with Global25.
- Exact current quote/booking outcome should be re-read from the latest chat if needed.

### B. 글로벌25시 콜리무진
- Public benchmark previously found: Yangcheon → ICN G90 around **KRW 140,000 + VAT**, before any special early-morning adjustments.
- User has already **called Global25**.
- They said they would summarize/confirm the details by **text message**.
- Wait for the text and verify:
  - G90 **LWB 4-seat** specifically, not generic G90
  - designated/guaranteed actual dispatch
  - 04:10 home-front waiting / 04:20 departure
  - luggage loading help
  - toll + VAT + early-morning surcharge included final total
  - reservation/deposit/cancellation terms

### C. LANE4
- User called directly.
- Quote: **KRW 220,000**.
- Too expensive for this use case; effectively rejected / backup only.

### D. Other Korea candidates
- OK Korea / AirDrive / other corporate chauffeur services were researched, but currently not worth expanding the search unless the two finalists fail.
- Current user view: **Global25 vs the G90 LWB 4-seat private/숨고 option is enough.**

## K9 note
- Do not chase a “K9 4-seat” as the main solution.
- Current factory K9 is basically a 5-seat bench configuration even with VIP rear-seat options; G90 LWB 4-seat is the cleaner match.

---

# TAIWAN DAY 1 AIRPORT PICKUP — NEW LIVE BOARD

## Main decision frame
The pickup search is no longer simply “ES300h vs S-Class.” Three distinct experiences are now alive:
1. **Heycar S-Class** — car itself is the luxury experience.
2. **宇航富豪 Mercedes aviation-seat van** — rear-seat comfort/value is the experience.
3. **奇立 ES300h** — clean, low-risk, excellent-value sedan baseline.

Do not reopen dead vendors unless new information materially changes the ranking.

---

## 1) Heycar — S-Class candidate
### Current quote
- TPE T2 → Taipei Garden Hotel.
- **Mercedes-Benz S-Class W223 priority arrangement**.
- Base: **NT$2,500**.
- Signboard/meet-and-greet: **+NT$200**.
- Practical total: **NT$2,700**.
- Includes driver, airport parking, highway tolls, normal airport pickup fees.
- Flight time corrected to **OZ711 09:50 TPE T2**.

### Vehicle condition / guarantee
- W223 vehicle age: **within 6 years**.
- **W223 is NOT 100% guaranteed.**
- If unexpected dispatch/maintenance issues occur, Heycar says it will still send an **S-Class family vehicle**, not downgrade to another vehicle class.
- Previously established chat context: fallback S-Class was considered to be within roughly **8 years**; re-confirm if this becomes decision-critical.
- Heycar supplied exterior/interior/rear-seat photos; vehicle shown looked clean and clearly W223-generation.
- The shown car is a normal rear bench S-Class, not a 4-seat limousine layout.

### Waiting / surcharge
- **90 minutes free waiting after actual landing** confirmed.
- Vendor says Lunar-New-Year-period rides have surcharge.
- Current trip date 2027-02-20 is outside the official Lunar New Year holiday window, so surcharge is not expected on that basis, but re-confirm the final total before booking.

### Decision position
- Compared with Taipei Garden Hotel random S-Class pickup (~NT$1,800, older/random generation), the difference to Heycar with signboard is only **NT$900**.
- Current preference in that comparison: **Heycar is worth the premium** because it sharply reduces old/random S-Class risk.
- W222 fallback is not automatically “bad”; a clean later W222 remains a genuinely good chauffeur sedan.

---

## 2) 奇立租賃 — ES300h low-risk baseline
### Confirmed conditions
- **Lexus ES300h designated**.
- Vehicle age: **within 5 years**.
- Model guarantee explicitly confirmed: **will not be changed to another model**.
- Base pickup: **NT$1,300**.
- Signboard: **+NT$200**.
- Total understood as **NT$1,500**.
- 90-min wait after actual landing included.
- Parking/tolls/normal pickup fees included.
- Vendor said exact physical car is assigned only 2–3 days before service.
- Do not push the price again; vendor already explained holiday-period pricing was being treated favorably.

### Booking-status issue
- User sent a formal reservation request and asked for booking/payment confirmation.
- Vendor replied to some details (including signboard) but did **not clearly say** `預約成立 / 已幫您保留 / 訂單成立`.
- Therefore treat as **conditions agreed, reservation status not clearly closed** until explicit confirmation arrives.

### Role now
- Still an excellent, low-risk **ES300h fallback**.
- If Heycar or 宇航富豪 fails on certainty/booking, 奇立 remains very strong.

---

## 3) 宇航富豪 — SURPRISINGLY STRONG NEW CANDIDATE
### ES300h offer
- Lexus ES300h can be designated.
- Imported-car airport pickup quoted **NT$1,400 all-in**.
- Company advertises/said vehicles are generally within 3 years.
- The specific ES300h was said to have been **purchased last April**, so it is very new.
- Exterior, rear-seat/interior photos and video were eventually provided.

### +NT$100 aviation-seat upgrade
This changed the ranking materially.

- Vendor offered an **“航空椅” Mercedes van/MPV upgrade for only +NT$100** from the ES300h package.
- Therefore practical promo total discussed: **NT$1,500**.
- Vendor explained the normal aviation-seat transfer price is around **NT$1,800/1,900**, and the +100 offer is a customer-experience promotion.
- User explicitly asked whether +100 means the **same photographed Mercedes aviation-seat vehicle can be designated/guaranteed** and whether total is NT$1,500.
- Vendor answered: **`是的，沒錯`**.

### Rear-seat equipment
The supplied photos show very large independent captain/aviation seats and spacious rear cabin.
User asked whether the seats have:
- electric recline
- legrest
- ventilation
- heating
- massage

Vendor replied: **`都有，是正航空椅`** — all are present; vendor describes them as true aviation seats.

### Why it is attractive
- For only ~NT$100 more than ES300h, parents get independent high-comfort rear seats.
- Pure rear-seat comfort/value may beat the ES300h and can rival or exceed the S-Class for this short airport ride, even if the van itself is less refined than an S-Class chassis.
- Tradeoff: it overlaps somewhat with Day 2/4 Alphard captain-seat experience; S-Class gives a more distinct luxury-sedan experience.

### Still pending / confirm before booking
- **Signboard/meet-and-greet availability and fee** — user has asked; await/confirm reply.
- 90-min free wait after landing — confirm if not already explicit for this exact promo.
- Payment/booking terms.
- Preferred risk-control: ask whether **full cash payment on service day with no deposit** is acceptable. If yes, this significantly reduces concern about using a smaller operator.
- Before any advance payment, get written confirmation of:
  - exact pictured aviation-seat Mercedes vehicle / equivalent exact agreed vehicle
  - final all-in total including signboard
  - waiting time
  - reservation confirmation

### Trust assessment
- Not currently treated as an obvious scam/fake operator.
- Has its own website and service information broadly matching LINE responses.
- Appears more like a smaller transfer/dispatch operation than a heavily reviewed large company.
- Because independent review depth is limited, prefer **day-of cash payment** and written booking terms over large advance transfer.

---

## 4) CBI / 錢比國際租賃 — CLOSED
- ES300h quote was NT$1,800; general 3-year-new-car claim.
- S-Class inventory/price could not be confirmed now because they have few units and would need to see future dispatch availability.
- Discount signal weak.
- User already sent a polite “we will compare with family and contact you if selected” close-out message.
- **Classification: close & leave.** No more reminders needed.

---

## Taiwan airport-pickup ranking logic right now
Do not force a final winner until the remaining signboard/payment answers arrive.

### If prioritizing “luxury sedan / first-arrival event”
**Heycar S-Class** is strongest.

### If prioritizing “parents’ rear-seat comfort + absurd value”
**宇航富豪 aviation-seat Mercedes at NT$1,500 promo** is extremely strong if exact-vehicle guarantee + day-of cash + signboard/waiting terms all check out.

### If prioritizing “certainty / simple low-risk value”
**奇立 ES300h NT$1,500 incl. signboard** remains the cleanest baseline.

Hotel random S-Class at ~NT$1,800 is now less compelling than Heycar because the Heycar premium is only NT$900 while generation/condition certainty is much better.

---

# Day 1 — structurally finalized

## Sunny Plan A
- Airport pickup → Taipei Garden Hotel → My灶.
- 12:10–13:15 My灶.
- 13:30 弄宅咖啡, 3 adults, reservation confirmed.
- 14:25–15:20 林安泰古厝民俗文物館.
- Baishihu → Bishanyan sunset.
- 19:00 小統一牛排館, 3 adults, fixed reservation.
- Longshan Temple → Huaxi/Guangzhou night market → Carrefour Guilin → hotel.

## Rain Day 1
- B1: My灶 + 弄宅 fixed → TFAM if February 2027 exhibition fits family → 小隱茶庵 → 19:00 小統一.
- B2: if TFAM unsuitable, Miniatures Museum only as stable indoor fallback → 小隱茶庵 → 19:00 小統一.
- Do not change 小統一 19:00 without approval.

---

# LUMI DRIVE — Day 2 / Day 4 contract
- Driver-included charter service, not self-drive.
- 2027-02-21: 8-hour New Alphard 40系, **08:30–16:30 max**.
- 2027-02-23: approx. 4-hour New Alphard 40系, hotel → 肥前屋 → TPE T2.
- Package total: **NT$15,000**.
- Includes driver, fuel, tolls, parking, passenger insurance; overtime extra.
- Total deposit: NT$4,000 split into Aug 2026 NT$2,000 + Jan 2027 NT$2,000.
- First NT$2,000 has been sent from Korea but vendor receipt confirmation is still pending.
- **Do not resend unless the first transfer is formally returned/failed.**
- Balance: NT$11,000; later get one final written confirmation of timing/method.
- Vehicle pool: 2024–2026, mostly 2025/2026; 2026 not guaranteed.
- Second-row features confirmed: captain seats, recline, legrest, ventilation, heating, massage.

---

# DAY 2 SUNNY PLAN A — FINALIZED

## Morning / charter
- 06:30–07:30 Taipei Garden Hotel breakfast.
- 08:15 lobby.
- 08:30 LUMI Alphard departure.
- 09:20–10:45 Yehliu Geopark.
  - self-guided Zones 1 + 2 only.
  - 10:45 vehicle return target; 10:50 absolute departure ceiling.
- 10:55–12:10 **Guihou Fishermen’s Market / 龜吼漁夫市集** lunch.
- 12:10–13:00 drive/rest to Shifen.
- 13:00–14:00 Shifen Waterfall schedule block.
  - actual core viewing 40–50 min.
  - remaining time = exit + Visitor Center restroom.
- 14:10–15:20 Shifen Old Street.
  - one 4-color lantern shared by all 3.
  - snacks only as tasting.
  - coffee max ~15–20 min if desired.
  - leave ~15:20 to protect Jiufen arrival.
- 15:20 onward drive to Jiufen.
- ~16:15 Jiufen arrival / LUMI 8-hour service ends.

## Jiufen late afternoon / night — finalized
### 16:15–17:20 Jiufen lantern-photo walk
- 基山街 → 昇平戲院 → 豎崎路 → A-Mei Teahouse exterior / views.
- Light rain/mist is acceptable and can improve the wet-stone/red-lantern mood.

### 17:30–18:45 1st round — 阿理廚坊 / A Li Kitchen
- Proper Taiwanese dinner.
- Food quality prioritized.
- Alcohol role: **kaoliang**.
- Before booking: window/night-view seat + kaoliang sale / outside bottle / corkage.

### 18:45–19:05 short night lantern walk

### 19:05–20:15 2nd round — 逸茶酒室 Golden Bar
- Taiwanese craft beer bar.
- User expects to drink generously, not just one token drink.
- Prefer scenic seating.

### 20:15–21:00 taxi to Taipei Garden Hotel
- Official Day 2 main itinerary ends around 21:00 hotel arrival.

### 21:30–23:00 optional hidden stage — 銀河洞 韓式pocha
- Korean pocha near hotel/Ximending.
- Light Korean food + soju.
- Delete without regret if tired.

---

# DAY 2 BUDGET
- Operational budget is already updated in **protected Supabase**.
- Do not mirror private line-item numbers into this public checkpoint or public UI.
- LUMI reservation contract remains NT$15,000 total for Day 2 + Day 4; planning attribution must not alter the reservation contract total.

---

# Built Day 2 field tools on website
- Yehliu: self-guided science-rich geology guide, offline-first PWA, local-only GPS concept.
- Guihou: fixed lunch + dedicated field guide, price calculator, seafood coach, field Chinese/TTS.
- Shifen Waterfall: dedicated explainer.
- Shifen Old Street: dedicated mini guide.
- Taiwan language AI: outbound speaking / incoming listening / field cheat sheet.

---

# WEATHER PLAN STATUS
- Plan A = sunny/fair — finalized.
- Plan B = normal/manageable rain — design pending.
- Plan C = more persistent/heavier but still safe/manageable rain — design pending.
- Torrential/typhoon/dangerous conditions excluded from current B/C design.
- Jiufen remains the fixed ending for B and C unless travel itself becomes unsafe.

---

# GitHub / website
Repo: `oops-lobster/minsung-tour-taiwan-2027`
Public site: `https://oops-lobster.github.io/minsung-tour-taiwan-2027/`
Checkpoint: `docs/CURRENT_CHAT_CHECKPOINT.md`

Recent relevant product state already on main:
- Taiwan language AI tools.
- Guihou lunch + field guide.
- PWA immediate update fix.
- Shifen Waterfall explainer.
- Shifen Old Street mini guide.
- Day 2 Jiufen evening finalized in `src/data/day2GuihouUpdate.ts`.
- Codex prompt: `docs/codex_day2_sunny_final_schedule_budget.md`.

---

# Continuity rules
- Always inspect recent `main` commits before claiming what is currently on the website.
- Do not resurrect old Day 1 Tamsui/CKS/Chun Shui Tang plan.
- CKS Memorial Hall is currently unassigned, not on Day 3.
- Do not change 小統一 19:00 reservation.
- Do not remove 弄宅咖啡 from rainy Day 1.
- Do not expose private budget data publicly.
- OZ711 source of truth remains **09:50 TPE T2** unless airline schedule changes.
- LUMI first NT$2,000 deposit receipt remains pending; do not resend unless failed/returned.
- Guihou lunch is fixed.
- Day 2 sunny Plan A is closed.
- Day 2 rainy Plan B/C is still pending, with Jiufen ending fixed.
- Current vehicle decisions to resolve next:
  1. Korea departure: **Global25 vs G90 LWB 4-seat individual/숨고 chauffeur**.
  2. Taiwan arrival: **Heycar S-Class vs 宇航富豪 aviation-seat Mercedes vs 奇立 ES300h**.
- For 宇航富豪, wait for/confirm signboard fee and day-of cash/no-deposit possibility before committing.
- For Global25, wait for the promised text summary and verify exact G90 LWB 4-seat guarantee and final all-in price.
