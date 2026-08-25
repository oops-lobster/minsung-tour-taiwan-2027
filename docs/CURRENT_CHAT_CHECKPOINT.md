# CURRENT CHAT CHECKPOINT

Last updated: 2026-08-25 KST

> Canonical handoff for continuing this Taiwan family-trip planning chat.
>
> **Freshness rule:** if this checkpoint and the repository disagree, inspect latest `main` first and treat `main` as product source of truth. Protected Supabase remains the operational budget source of truth.
>
> Detailed snapshot of tonight's Day 2 B discussion: `docs/chat-checkpoints/2026-08-24_day2-rain-B.md`.

---

# Conversation mode
- User: 민성.
- Tone: persona 4 / 새라 모드 — 친근한 반말, 장난스럽게 가능. 정확한 정보는 엄밀하게.
- Food priority: **taste > price > transport convenience**.
- Parents’ comfort matters strongly.
- Rain alternatives should be **equally good alternate days**, not degraded backups.
- Do **not** expose protected budget figures in public docs/UI.
- Vendor LINE/chat logs: translate → interpret → classify `keep / one reminder / close & leave` → draft reply if needed.
- Do **not** send Gmail/email/Calendar/external writes unless explicitly requested in the current message. Default to copy/paste drafts.
- English reservation/contact name: **RAY** (`R-A-Y`).
- Chinese call scripts, when useful: Traditional Chinese → Pinyin → Korean phonetic reading.

---

# Trip core
- Taiwan family trip, 3 adults.
- Dates: **2027-02-20 to 2027-02-23**.
- Hotel: **Taipei Garden Hotel**.
- Day 1 flight source of truth: **Asiana OZ711, ICN 08:00 → TPE T2 09:50 local**.
- Return currently shown on site: **2027-02-23 TPE→ICN 17:10–20:35**; recheck actual airline schedule before travel.
- Day 2 & Day 4 vehicle: **LUMI DRIVE New Toyota Alphard 40系**, driver-included charter.

---

# Day 2 weather / branch logic — LATEST

## A
- **Plan A is CLOSED / FINALIZED. Do not redesign unless user explicitly reopens it.**
- A means **outdoor itinerary is viable**, not literally zero rain.
- Light drizzle / weak short shower / umbrella-level rain → keep A.
- If an unexpected strong shower arrives mid-day, shelter in Alphard or nearby indoor spot and reassess. A short burst does not justify rebuilding the whole day.
- Only persistent/heavy weather or safety issues should materially change the remainder.
- Weather classifier should avoid A↔B flapping from brief weak showers.

Final A daytime:
- hotel breakfast
- 08:30 LUMI departure
- Yehliu
- Guihou Fishermen’s Market lunch
- Shifen Waterfall
- Shifen Old Street
- ~16:15 Jiufen / LUMI ends

Final A evening:
- 16:15–17:20 Jiufen lantern/photo walk
- 17:30 **阿理廚坊 / A Li Kitchen** — Taiwanese dinner + kaoliang
- ~19:00 **逸茶酒室 Golden Bar** — first-choice Taiwanese craft beer
- **Golden Bar is walk-in only; user confirmed it does not accept reservations.**
- Desired seat: 2F rooftop/open-air scenic seat.
- If crowded / bad seats, do not force it: leave Jiufen → 55688/Uber → Ximending → **Taihu Driftwood** or another good craft-beer bar.
- ~20:15-ish return timing if Golden Bar works; 55688 primary, Uber/local taxi backups.
- **銀河洞 Korean pocha** is an optional Day 2 A late hidden stage only if energy remains; it was **not Day 1**.

## B
- **Gentle/light-to-moderate steady rain.** Rain should become part of the mood.
- **READY / IMPLEMENTED.** This is now a complete independent rainy-day route.
- B no longer preserves Yehliu/Shifen/Jiufen. It is an independent rainy-day route.
- Final theme:
  > **Yilan traditional culture → Yilan local banquet-style lunch → Jiaoxi tea → Huashan 1914 → Penghu seafood → hotel-area drink or immediate return**

## C
- **Heavy/persistent but still safe rain.**
- Current concept: **Taoyuan / Xpark indoor-focused day**.
- Xpark alone is not enough; pair with another worthwhile Taoyuan-area indoor/cultural/food stop so the 8h Alphard remains valuable.

## D
- dangerous/extreme weather, road closures, official warnings, unsafe conditions
- safety-first + LUMI operating decision
- if only some attractions close but driving is safe → reroute
- if natural-disaster conditions prevent normal operation → LUMI confirmed deposit refund to designated account OR future credit option

---

# Day 2 Plan B — FINAL / READY

Final route:

> Taipei Garden Hotel → 宜蘭傳藝園區 → 拾松 宜蘭總店 → 日光山茶屋 → 華山1914 → 北海漁村海鮮餐廳 台北杭州店 → 臺虎西門 optional → Taipei Garden Hotel

- LUMI New Alphard 40系 is used only from **08:30 to 16:30**.
- Target arrival at 宜蘭傳藝園區: **09:40–09:50**; culture/performance/crafts until 11:50.
- 拾松 宜蘭總店: **12:10–13:20**, current first choice, reservation not done.
- 日光山茶屋: **13:40–14:25/14:40**, current first choice, reservation not done.
- Driver checks Freeway 5 northbound ETA from 14:20 and protects the 16:30 vehicle hard stop.
- 華山1914: **16:30–18:15**, with Vinyl Decision as the top priority and a compact in-app field guide for design/craft/backup stops.
- 北海漁村海鮮餐廳 台北杭州店: **18:30–20:00/20:20**, Plan B dinner first choice, reservation not done.
- 北海漁村 mobile order guide: `public/beihai-order-guide.html` / deployed at `/minsung-tour-taiwan-2027/beihai-order-guide.html`.
- After 20:20, 臺虎西門 is optional. Going directly to the hotel is an equally valid normal finish.
- Hotel return target: **21:30–22:00**, earlier is welcome.
- All venue hours, Sunday policies, performances, popups, current tenants, menu, market price and 18天生啤酒 availability require a **2027-02 pre-trip recheck**.
- Schedule information architecture was simplified: compact page intro, one Plan selector, a route-at-a-glance ribbon, collapsed weather evidence, and a collapsed full map/place drawer before the scan-friendly timeline.

A/B/C/D behavior:
- A remains CLOSED / FINAL and unchanged.
- B shows the full Yilan–Huashan–Beihai route above.
- C shows only a separate heavy-rain indoor-plan placeholder; it never reuses B's route.
- D suppresses normal tourism route/schedule and shows safety-first instructions only.

---

# Day 2 Plan B — ARCHIVED DESIGN NOTES (SUPERSEDED BY FINAL SECTION ABOVE)

## B principles / rejected ideas
- **Pinglin morning tea stop is dropped** from current B. User preferred not to drink tea first thing in the morning.
- **Lanyang Museum rejected.** User strongly dislikes museum-style sightseeing.
- Yilan National Center for Traditional Arts is preferred because it is more like **민속촌/한옥마을 + traditional performances + crafts + shops** than a museum.
- Good for drizzle/light rain; not for C-level heavy persistent rain because outdoor movement remains.
- Kavalan whisky distillery was considered but parents likely prefer performance/crafts, so cultural village wins.
- Hot springs are not core B/C right now. If ever used, user prefers them only as last activity before hotel because of makeup/comfort issues.

## Current daytime timing

### 08:30 — Taipei Garden Hotel depart
- breakfast already eaten
- LUMI Alphard, hard service window **08:30–16:30 max**

### ~09:40–09:50 — 宜蘭傳藝園區 / National Center for Traditional Arts arrive
- realistic planning target, not optimistic ideal drive time
- visit about **2 hours**
- prioritize:
  - one good traditional performance
  - craft demonstrations / craft shops
  - old Taiwanese streets / architecture
  - relaxed browsing
- do NOT turn it into an exhibition-reading day
- exact Sunday 2027-02-21 program must be rechecked closer to travel

### ~11:50 — leave cultural village

### ~12:10–13:20 — Yilan local lunch
Current first hold: **拾松 宜蘭總店**.

Concept: **“대만식 향토 한정식 / 지방 잔칫상 / 백반 여러 접시 공유”**.

Current dishes of interest:
- **西魯肉** — warm thick cabbage/pork/mushroom banquet soup/stew; Korean-palate friendly direction
- **糕渣** — stock-based custardy fritter; unusual Yilan specialty
- **卜肉** — crispy fried pork, comparable to sauce-free tangsuyuk-style pork
- **鴨賞** — savory smoked/cured duck
- taro/seafood item
- vegetable
- optional taro dessert

User liked this direction.

Need later:
- latest menu/reviews
- Sunday/reservation policy
- exact 3-person order without over-ordering

Other explored lunch options:
- 宜蘭渡小月 — more formal classic Yilan banquet/family dining
- Red Lantern cherry duck — stronger signature but longer/heavier/more formal; not current first pick

### ~13:20 depart lunch

### ~13:40–14:25/14:40 — Jiaoxi tea stop
Current candidate: **日光山茶屋 Nikko Hill Tea House**.

Role:
- post-lunch rainy-afternoon rest
- warm tea / eaves / mountain-rain atmosphere
- parents rest before return drive
- still a candidate, not final locked choice

### ~14:20 onward — live traffic decision
- Sunday afternoon National Freeway 5 northbound congestion is the timing risk.
- Driver checks live ETA during tea.
- leave earlier if needed to protect **16:30 LUMI hard stop**.

### ~16:00–16:30 — Taipei drop-off
Current preferred zone: **忠孝復興 / 東區 (Taipei East District)**.

Why:
- excellent rainy-day buffer
- SOGO Fuxing / SOGO Zhongxiao
- Dongqu underground passage/shopping
- East District streets, cafés, shops
- user is happy to browse department stores and grab a boba/dessert if something looks good, e.g. “幸福堂 같은 거”; do not force a specific branch if it is not nearby/current in 2027
- dinner will be later, so drop-off does **not** need to be next to dinner

Expected flow:
- ~16:20/16:30 East District drop-off
- browse/shop/café/dessert until ~18:30+
- taxi to dinner
- dinner around **19:00-ish**, exact time to finalize after restaurant

---

# Day 2 B dinner — ARCHIVED COMPARISON NOTES

## Critical next-day constraint
- **Day 3 dinner is 85TD.**
- Therefore Day 2 should NOT be another polished high-end Cantonese/Chinese seafood course.
- Desired contrast:
  - **Day 2:** lively Taiwanese fresh/live seafood, shared dishes, draft beer
  - **Day 3:** 85TD modern high-end Cantonese / skyline dinner

## Search categories user wants
1. **Taiwanese fresh/live seafood restaurant** — clear first choice
2. excellent sashimi/Japanese seafood restaurant — backup category

## Current #1 — 北海漁村海鮮餐廳 / Northsea Fishing Village
Why leading:
- long-running Taiwanese seafood restaurant
- Penghu sourcing identity
- public descriptions emphasize selecting good catches from Penghu and bringing them to Taipei
- shared-table style works for 3 family members
- strongest answer to user's goal: **“대만이 섬이니까 싱싱한 해산물 제대로 먹고 싶다.”**
- current menu data suggests **18 Days draft beer / 18天生啤酒** can fit the meal

Desired ordering philosophy later:
- ask what is best from Penghu / what came in well that day
- one excellent whole/seasonal fish simply cooked
- sashimi/raw only if genuinely good that day
- one crustacean/squid/shellfish dish
- vegetable
- rice/noodle/fried rice as needed
- draft beer
- don't order prestige seafood only because it is expensive

## Current #2 — 海九澎湖海鮮餐廳
Why serious challenger:
- stronger live-tank / “choose what looks best today” character
- Penghu wild/live seafood angle
- may be better for the visceral **“오늘 좋은 놈 골라 먹기”** experience

### Tomorrow's first task
Compare **北海漁村 vs 海九** on:
- recent consistency/reviews
- actual freshness/sourcing strength
- February seasonal seafood
- exact 3-person order
- price range
- comfort/noise/parents suitability
- Sunday dinner / reservation details

## Down-ranked for this B dinner
- 真的好海鮮 — good/polished but may overlap too much in tone with next day 85TD
- Mitsui-style high-end Japanese — good seafood, less specifically Taiwan-local and more formal
- 小六食堂 — interesting Japanese seafood backup, but not current family-dinner leader

---

# B evening drinks — ARCHIVED EXPLORATION

Current rough rhythm:
> **fresh seafood + 18-day draft beer → second-round drink → optional third round**

- User described it roughly as **“생맥 → ??? → 이자카야”**.
- If 北海漁村 wins, a Huashan-area cocktail stop such as **防空洞 bomb shelter 華山店** was discussed as one possible second round.
- Not final; compare nearby bars only after dinner is locked.
- **銀河洞 Korean pocha** may theoretically be reused but is not a fixed B step; originally it was optional Day 2 A late third round.
- Do not overpack the night; parents’ energy and Day 3 matter.

---

# Day 2 weather-decision web app
User wants app-open automatic classification.

Desired:
- no background server required
- fetch latest forecast/live data on app open
- multi-location weather for A, with Yehliu wind/gust/wave especially important
- do not show today's weather as if it were the 2027-02-21 forecast before forecast range opens
- show `아직 여행일 예보 제공 전`
- D safety override
- manual override
- deterministic test modes
- avoid short-shower A/B flapping

A detailed Codex prompt was prepared earlier.
**Implementation completion must be verified against latest `main` before claiming live.**

---

# LUMI DRIVE — Day 2 / Day 4
- driver-included charter, not self-drive
- Day 2 2027-02-21: New Alphard 40系, **08:30–16:30 max**
- Day 4 2027-02-23: ~4h, hotel → 肥前屋 → TPE T2, luggage held in vehicle
- vehicle pool 2024–2026, mostly 2025/2026; exact 2026 not guaranteed
- second-row captain seats/recline/legrest/ventilation/heating/massage confirmed
- user states **NT$4,000 LUMI deposits are already paid**; user's mental **future 4M KRW budget excludes those already-paid deposits**
- protected budget record historically showed a discrepancy with this statement; reconcile only if budget is being updated

Extreme-weather confirmation:
- natural-disaster impact → deposit refund to designated account OR retain for future use
- partial attraction closure → reroute to other attractions and continue if safe

---

# KOREA DEPARTURE — FINAL / CLOSED
- Vendor: 글로벌25시콜리무진
- 2027-02-20, pickup 04:10–04:20
- Mokdong → ICN T2
- 3 adults + 2 suitcases
- **Genesis G90 Long Wheel Base 4-seat** designated
- actual rear-seat photos confirmed proper VIP 4-seat layout
- reservation confirmation received
- no deposit
- search closed unless vendor changes/cancels
- public site already updated previously with G90 details and image `public/images/g90-lwb-4seat-rear.webp`

---

# TAIWAN DAY 1 AIRPORT PICKUP — FINAL / CLOSED

## 宇航富豪 — confirmed
- 2027-02-20 · Taoyuan Airport T2 → Taipei Garden Hotel
- exact photographed Mercedes-Benz aviation-seat vehicle designated
- adult 3 + medium suitcase 1 + cabin suitcase 1
- signboard meeting, luggage help, and 85-minute airport wait confirmed
- electric recline, legrest, ventilation, heating, massage confirmed
- public site uses the two clearest cabin photos; price/payment details remain out of public UI
- search closed unless vendor changes/cancels

## Retired backups — no longer active on the public site

### Heycar
- W223 S-Class priority, not 100% guaranteed
- fallback remains S-Class family
- 90m free wait

### 奇立租賃
- Lexus ES300h designated, <=5y
- explicit model guarantee
- signboard offered
- strong safe fallback

### CBI / 錢比
- politely closed
- **close & leave**

---

# Day 1 — structurally finalized

Sunny:
- airport pickup → Taipei Garden Hotel → My灶
- 12:10–13:15 My灶
- 13:30 弄宅咖啡, 3 adults, reserved
- 14:25–15:20 林安泰古厝
- Baishihu → Bishanyan sunset
- 19:00 小統一牛排館, 3 adults, reserved/fixed
- Longshan → Huaxi/Guangzhou night market → Carrefour Guilin → hotel

Rain Day 1:
- B1: My灶 + 弄宅 fixed → TFAM if Feb 2027 exhibit fits → 小隱茶庵 → 19:00 小統一
- B2: if TFAM unsuitable → Miniatures Museum → 小隱茶庵 → 19:00 小統一
- do not change 小統一 19:00 without approval

---

# A Li Kitchen / Jiufen notes
- Plan A target: **2027-02-21 17:30, 3 adults**
- goal: Taiwanese dinner + kaoliang, preferably window/night-view seating
- phone English difficult; user retried using Google Translate TTS
- best interpretation: call again about one week before
- TODO around 2027-02-14, reservation name **RAY**
- do not claim already reserved

---

# Mapping preference
- use actual verified business refs / exact addresses / coordinates
- do not use vague region names as pins
- previous ambiguous geocoding error annoyed user
- Day 2 Plan A route: Taipei → Yehliu/Guihou → Shifen → Jiufen → Taipei

---

# GitHub / website
Repo: `oops-lobster/minsung-tour-taiwan-2027`
Public site: `https://oops-lobster.github.io/minsung-tour-taiwan-2027/`
Canonical checkpoint: `docs/CURRENT_CHAT_CHECKPOINT.md`
Tonight's detailed B snapshot: `docs/chat-checkpoints/2026-08-24_day2-rain-B.md`

Latest `main` at the start of the 2026-08-25 implementation:
- `339bd909f4874498cd239ca943a884d90887ae5b`

The Day 2 Plan B UI, Huashan mini guide, Beihai static field guide, honest C/D branching, confirmed G90 departure, and confirmed Day 1 airport pickup are included in the next implementation commit after this checkpoint entry.

---

# NEXT TODO

1. Confirm 拾松's latest menu, Sunday reservation policy, and a 3-person order.
2. Finalize 日光山茶屋 and verify its reservation policy.
3. Reserve 北海漁村 台北杭州店 for 18:30.
4. In 2027-02, recheck 北海漁村's menu, market prices, seasonal catch and 18天生啤酒, then refresh the field guide.
5. In 2027-02, recheck Huashan popups, performances and tenant continuity.
6. Design Plan C in detail as a separate heavy-rain indoor day.

Continuity anchors:
- Day 2 A closed/final.
- B = gentle-to-moderate steady rain Yilan culture/food/tea + Huashan LP/design + Beihai seafood.
- C = heavy safe rain Taoyuan/Xpark direction.
- D = safety-first.
- Day 3 dinner = **85TD**, so do not make Day 2 dinner another similar high-end Chinese course.
