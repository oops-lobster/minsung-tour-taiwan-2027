# CURRENT CHAT CHECKPOINT

Last updated: 2026-08-24 13:35 KST

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
- **All English reservation/contact names should use `RAY`.** If spelling is needed: `R-A-Y`.
- When giving Chinese/Taiwanese vendor call scripts, format in this order whenever useful:
  1. Traditional Chinese
  2. Pinyin
  3. Korean phonetic reading

---

# CURRENT CONVERSATION POSITION

## Already closed/finalized
- **Day 2 sunny / no-rain Plan A is finalized.**
- Day 2 Jiufen evening structure is finalized through hotel return, with optional third round.

## Current Day 2 planning direction
The rainy-day logic has now been clarified into **A / B / C / D**:

### A — normal/fair / only weak shower
- Original finalized outdoor plan can be used basically as-is.
- Rough initial operational markers:
  - max hourly precipitation under ~2 mm/h
  - gust under ~40 km/h
  - Yehliu wave under ~2.0 m
- A short light shower alone should not force a rain-plan switch.

### B — normal/manageable rain
- Umbrella/raincoat weather, but still walkable and tourable.
- Rough initial markers:
  - rain probability around >=50%
  - hourly precipitation roughly 2–5 mm/h
  - gust roughly 40–50 km/h
  - Yehliu wave roughly 2.0–2.5 m
- Outdoor segments may be compressed, but **Jiufen remains fixed**.

### C — persistent/heavier rain but still safe/manageable
- Outdoor daytime itinerary should be actively modified rather than stubbornly preserved.
- Rough initial markers:
  - hourly precipitation >=5 mm/h, or several hours of persistent meaningful rain
  - high rain probability plus actual expected precipitation
  - gust >=~50 km/h
  - Yehliu wave >=~2.5 m
- Yehliu and/or Shifen may be heavily reduced/replaced depending on local conditions.
- **Jiufen is still retained if access/roads are safe.**
- In C, Jiufen photo walk can be shortened substantially; dinner/bar can remain the anchor.

### D — safety override, NOT just “Plan C++”
- Typhoon / extreme downpour / dangerous wind / road closure / official attraction closure / government emergency signals.
- D means **release every fixed sightseeing assumption, including Jiufen**.
- App should show a safety hold such as `안전 확인 필요 · 일반 일정 판정 중지` rather than recommend a normal itinerary.
- LUMI operation/change/refund terms matter here.

## Important conceptual rule
- **A = 그냥 간다**
- **B = 비 맞으면서도 간다 / 조금 압축한다**
- **C = 낮 일정은 크게 조정하되 안전하면 지우펀 저녁까지 살린다**
- **D = 지우펀 포함 고정 해제, 안전/운행 여부부터 판단한다**

---

# Day 2 web-app weather decision system — newly requested

User wants the website/app to automatically determine whether Day 2 is currently **A / B / C / D** when the app is opened.

## Desired behavior
- No background server job is required.
- **Opening the app is enough:** fetch latest available forecast/live data → classify → update UI.
- Cache around ~30 minutes on travel day is acceptable.
- Before forecast range reaches 2027-02-21, do **NOT** misuse today’s Taipei weather as if it were the trip-day decision.
- Show an explicit out-of-range state such as `아직 여행일 예보 제공 전`.
- As trip date enters forecast horizon, progress through preview / near-term / live style states.

## Day 2 multi-location inputs
Do not use Taipei-only weather for Day 2.
- Yehliu / north coast: rain + wind + gust + **wave height**
- Shifen: rain + wind + gust
- Jiufen: rain + wind + gust

Use existing repo coordinates where available; avoid duplicate hardcoding.

## Yehliu-specific rule
- Rain alone does not automatically mean closure.
- February north coast can be affected by northeast monsoon; **wind / gust / wave** are critical.
- A dry but windy/high-wave day can be worse for Yehliu than a rainy calm day.
- Marine data is only a risk indicator; app must not claim `open/closed` without a real official source.

## Codex prompt status
- A detailed Codex prompt was prepared in chat to implement:
  - multi-location weather fetch
  - Open-Meteo weather + marine data
  - A/B/C classifier
  - D safety override
  - per-location GOOD / CAUTION / POOR
  - reason strings
  - forecast-range awareness
  - manual override while showing auto recommendation
  - deterministic `weatherTest=day2-a/day2-b/day2-c/day2-safety/...` modes
  - unit tests + build checks
- **Implementation is not yet confirmed as completed.** Inspect latest `main` before claiming this feature exists.

---

# Trip core
- Taiwan family trip, 3 adults.
- Dates: **2027-02-20 to 2027-02-23**.
- Hotel: **Taipei Garden Hotel**.
- Day 1 flight source of truth: **Asiana OZ711, ICN 08:00 → TPE T2 09:50 local**.
- Recheck actual 2027 airline itinerary before travel.
- Day 2 & Day 4 vehicle: **LUMI DRIVE New Toyota Alphard 40系**.

---

# KOREA DEPARTURE CAR — LIVE BOARD

## Strategy
- Stretch-limo idea has been dropped.
- Desired experience: premium chauffeur sedan, home-front wait, luggage loading, parents in best rear seats, direct ICN T2.

## Preferred vehicle
**Genesis G90 LWB 4-seat**
- Ideal seating: driver + user front, parents in two independent rear VIP seats.
- True 4-seat LWB is preferred over generic 5-seat G90.

## Timing/load
- 2027-02-20.
- Driver arrival target ~04:10.
- Depart ~04:20.
- Mokdong → ICN T2.
- 3 adults.
- 1 medium + 1 cabin/20-inch suitcase.

## Price psychology
- ~12–15만원 = excellent.
- ~15–17만원 = acceptable if true designated G90 LWB 4-seat + full service.
- ~17만원 = psychological ceiling.
- ~18만원+ = starts to feel unnecessary.
- 20만원+ = generally reject.

## Current candidates / outcomes
### Global25
- User already called.
- They said they would send conditions by text.
- Verify exact G90 LWB 4-seat guarantee, all-in price, early-morning fee, toll/VAT, luggage help, wait/departure timing.

### Individual/Soomgo G90 LWB 4-seat chauffeur
- Exterior/rear-seat photos were checked previously.
- Contact phase mostly done; do not expand unless needed.

### LANE4
- Quote **KRW 220,000** → reject.

### New G90 quote
- A later **KRW 250,000** G90 proposal arrived.
- This is far beyond target; user should politely decline rather than negotiate aggressively.
- Classification: **close & leave** unless the quote changes dramatically on its own.

---

# TAIWAN DAY 1 AIRPORT PICKUP — LIVE BOARD

## Main frame
Three differentiated experiences remain:
1. **Heycar S-Class** — flagship luxury-sedan experience.
2. **宇航富豪 Mercedes aviation-seat van** — parent rear-seat comfort/value.
3. **奇立 ES300h** — simple, clean, low-risk sedan baseline.

Because Korea departure is likely a flagship sedan, the user now sees more appeal in choosing a different vehicle experience on Taiwan arrival rather than another luxury sedan.

---

## 1) Heycar — S-Class
- W223 priority.
- Base NT$2,500; signboard +NT$200; practical total NT$2,700.
- Includes driver, parking, highway, normal airport pickup fees.
- OZ711 09:50 T2 corrected.
- W223 within 6 years.
- **W223 not 100% guaranteed**; if dispatch/maintenance issue, vendor says still S-Class family, no class downgrade.
- 90 min free waiting after landing confirmed.
- Strong if user wants the luxury-sedan experience itself.

---

## 2) 奇立租賃 — ES300h baseline
- Lexus ES300h designated.
- Vehicle within 5 years.
- Explicit model guarantee: will not change to another model.
- Base NT$1,300.
- Signboard +NT$200.
- Total understood NT$1,500.
- 90-min wait + parking/tolls/normal pickup fees included.
- Exact physical unit assigned 2–3 days before.
- Do not push cash-discount negotiation again.
- Reservation conditions were agreed, but explicit final `預約成立 / 訂單成立` confirmation remained unclear.

---

## 3) 宇航富豪 — aviation-seat Mercedes, currently very attractive
### ES300h baseline
- ES300h airport pickup NT$1,400 all-in was quoted.
- Specific ES300h said to be very new; photos/video supplied.

### Aviation-seat upgrade
- Vendor offered Mercedes aviation-seat vehicle for **+NT$100**.
- Understood promotional total = **NT$1,500**.
- Vendor said normal aviation-seat pickup price is around NT$1,800/1,900 and this is an experience/promo upgrade.
- User explicitly asked whether the photographed Mercedes aviation-seat vehicle can actually be the dispatched vehicle and whether final total is NT$1,500.
- Vendor replied **`是的，沒錯`**.

### Seat equipment
User asked whether it has:
- electric recline
- legrest
- ventilation
- heating
- massage

Vendor replied:
- **`都有，是正航空椅`**
- Interpret as all listed functions present; vendor calls them true aviation seats.

### Current pending questions
- User sent:
  - whether signboard/meet-and-greet is available with this aviation-seat pickup
  - if so, extra fee
- Message was read but **no reply yet** as of this checkpoint.
- Do not spam follow-up immediately.
- Luggage assistance has **not yet been explicitly confirmed**.
- Cash/day-of payment has **not yet been explicitly agreed**.
- Preferred next confirmations:
  1. signboard fee
  2. whether driver waits in arrival hall and helps push/load luggage
  3. 90 min free wait for this promo
  4. day-of full cash payment/no deposit if possible
  5. final written booking confirmation and exact vehicle guarantee

### Trust position
- Not treated as obvious scam/fake.
- Has its own website; public service info broadly matches LINE chat.
- Independent review depth appears limited compared with a major operator.
- Therefore favor written terms + day-of payment if available.

---

## 4) CBI / 錢比國際租賃 — CLOSED
- ES300h NT$1,800; weak price advantage.
- S-Class availability uncertain.
- User already closed politely.
- Vendor’s final reply on 2026-08-24:
  - `沒問題，非常感謝您的耐心等候，也希望有機會能夠為您服務！謝謝`
  - pure closing courtesy.
- **Classification: close & leave. No reply needed.**

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
- B1: My灶 + 弄宅 fixed → TFAM if Feb 2027 exhibition fits family → 小隱茶庵 → 19:00 小統一.
- B2: if TFAM unsuitable, Miniatures Museum as stable indoor fallback → 小隱茶庵 → 19:00 小統一.
- Do not change 小統一 19:00 without approval.

---

# LUMI DRIVE — Day 2 / Day 4 contract
- Driver-included charter, not self-drive.
- Day 2 2027-02-21: New Alphard 40系, 8h, **08:30–16:30 max**.
- Day 4 2027-02-23: ~4h, hotel → 肥前屋 → TPE T2.
- Contract total NT$15,000.
- Includes driver, fuel, tolls, parking, passenger insurance; overtime extra.
- Deposit total NT$4,000 split Aug 2026 NT$2,000 + Jan 2027 NT$2,000.
- First NT$2,000 has been sent from Korea; vendor receipt confirmation remained pending.
- **Do not resend unless formally failed/returned.**
- Balance NT$11,000; later confirm timing/method.
- Vehicle pool 2024–2026, mostly 2025/2026; 2026 not guaranteed.
- Second-row features confirmed: captain seats, recline, legrest, ventilation, heating, massage.

## Extreme-weather policy question
- User wants to ask LUMI specifically about **D-scenario** treatment:
  - typhoon / heavy rain / government closure / road closure
  - free cancellation or rescheduling?
  - refund/credit treatment of Day 2 deposit portion?
  - if only some attractions close but car can safely run, does itinerary simply change while charge stays the same?
  - if Day 2 is affected, does Day 4 airport transfer stay intact?
- A Traditional-Chinese inquiry draft was prepared in chat.
- **Do not assume it has been sent unless the user confirms.**

---

# DAY 2 SUNNY PLAN A — FINALIZED

## Morning / charter
- 06:30–07:30 Taipei Garden Hotel breakfast.
- 08:15 lobby.
- 08:30 LUMI Alphard departure.
- 09:20–10:45 Yehliu Geopark.
  - self-guided Zones 1 + 2.
  - 10:45 vehicle return target; 10:50 absolute departure ceiling.
- 10:55–12:10 Guihou Fishermen’s Market / 龜吼漁夫市集 lunch.
- 12:10–13:00 drive/rest to Shifen.
- 13:00–14:00 Shifen Waterfall block.
- 14:10–15:20 Shifen Old Street.
- ~15:20 depart toward Jiufen.
- ~16:15 Jiufen arrival / LUMI service ends.

---

# DAY 2 JIUFEN EVENING — A/B/C COMMON ANCHOR

Critical new decision:
- **A/B/C all use the same Jiufen dinner/bar anchor whenever Jiufen access remains safe.**
- Only **D** releases this fixed ending.

## 16:15–17:20 Jiufen lantern-photo walk
- In A: full version.
- In B: rain-compatible version, still attractive.
- In C: compress heavily if needed; it is acceptable to wait indoors/under cover and protect dinner time.

## 17:30–18:45 1st round — 阿理廚坊 / A Li Kitchen
- Proper Taiwanese dinner.
- Food quality prioritized.
- Alcohol role: kaoliang.
- Target reservation: **2027-02-21 (Sun) 17:30, 3 adults, name RAY.**
- Desired if possible: window/night-view seat.
- After reservation feasibility is known, ask about:
  - English communication
  - kaoliang availability
  - BYOB if they do not sell it
  - corkage

## 18:45–19:05 short night lantern walk
- Optional/compressible in rain.

## ~19:00–20:15 2nd round — 逸茶酒室 Golden Bar
- Taiwanese craft beer bar.
- Scenic seating preferred.
- User expects real drinking, not one symbolic beer.
- Current public understanding: likely walk-in/no standard reservation, but user wants to ask directly whether reservation is possible.
- If standard booking is not accepted, later consider politely asking whether a deposit / minimum spend / seat-retention fee could secure a good indoor/window scenic seat.
- For B/C, indoor/window seat is more valuable than an exposed outdoor view seat.

## ~20:15–21:00 taxi → Taipei Garden Hotel
- Official Day 2 main itinerary ends around hotel arrival.

## Optional ~21:30–23:00 — 銀河洞 韓式pocha
- Korean food + soju.
- Delete without regret if tired.

---

# A LI KITCHEN / 阿理廚坊 — LIVE RESERVATION CALL STATE

## Phone
- Taiwan domestic: **02-2496-7727**
- From Korea: **+886 2 2496 7727**

## Current timing
- First call attempt around early afternoon KST on 2026-08-24: **no answer**.
- At 13:35 KST, Taiwan is 12:35, still lunch-service time; not answering is not suspicious.
- User is retrying by phone now / shortly.
- If repeated no answer, a better retry window is Taiwan ~14:00–16:30 (KST ~15:00–17:30).

## First-line phone script
Traditional Chinese:
`您好，請問可以說英文嗎？`

Pinyin:
`Nín hǎo, qǐngwèn kěyǐ shuō Yīngwén ma?`

Korean phonetic:
`닌 하오, 칭원 커이 슈오 잉원 마?`

## If English is possible
Say:
`Hi, I’m calling from Korea. I’d like to make a dinner reservation for three people.`

Then:
`February 21st, 2027, Sunday, at 5:30 p.m.`

Reservation name:
`The reservation name is Ray. R-A-Y.`

If reservation is too early:
`No problem. When is the earliest time I can make the reservation?`

If 17:30 is unavailable:
`What is the closest available time to 5:30 p.m.?`
- Do not automatically accept a major shift; bring options back into chat because Day 2 timing is structured.

If seat choice is possible:
`If possible, could we reserve a window table with a nice night view? We are three adults and I’m traveling with my parents.`

## Chinese fallback for booking
Traditional Chinese:
`我想訂位。2027年2月21日，星期日，下午5點半，3位。`

Pinyin:
`Wǒ xiǎng dìngwèi. Èr líng èr qī nián, èr yuè èrshíyī rì, xīngqírì, xiàwǔ wǔ diǎn bàn, sān wèi.`

Korean phonetic:
`워 샹 띵웨이. 얼 링 얼 치 니엔, 얼 위에 얼스이 르, 싱치르, 샤우 우 디엔 반, 산 웨이.`

If too early:
Traditional Chinese:
`現在訂位太早嗎？`

Pinyin:
`Xiànzài dìngwèi tài zǎo ma?`

Korean phonetic:
`시엔짜이 띵웨이 타이 짜오 마?`

Ask when to call again:
Traditional Chinese:
`請問什麼時候可以再打電話訂位？`

Pinyin:
`Qǐngwèn shénme shíhou kěyǐ zài dǎ diànhuà dìngwèi?`

Korean phonetic:
`칭원 션머 스허우 커이 짜이 다 띠엔화 띵웨이?`

Window/night-view seat:
Traditional Chinese:
`可以訂靠窗、可以看夜景的位子嗎？`

Pinyin:
`Kěyǐ dìng kàochuāng, kěyǐ kàn yèjǐng de wèizi ma?`

Korean phonetic:
`커이 띵 카오촹, 커이 칸 예징 더 웨이쯔 마?`

## Call priority
1. English possible?
2. Can 2027-02-21 17:30 / 3 people be booked now?
3. If too early, when does booking open?
4. If booking succeeds, request window/night-view seat.
5. Ask kaoliang/BYOB/corkage only if the staff sounds unhurried; not necessary during a busy lunch call.

---

# GOLDEN BAR / 逸茶酒室 — NEXT CONTACT
- User wants to ask two things first:
  1. English communication possible?
  2. Can 2027-02-21 around 19:00 for 3 people be reserved?
- If they say standard reservations are not accepted, later ask politely whether advance deposit / minimum spend / seat-retention fee could secure a good scenic seat.
- No need to over-negotiate before confirming their normal policy.

---

# DAY 2 BUDGET
- Operational budget is already updated in **protected Supabase**.
- Do not mirror private line-item numbers into this public checkpoint or public UI.
- LUMI reservation contract remains NT$15,000 total for Day 2 + Day 4; planning attribution must not alter the reservation contract total.

---

# Built Day 2 field tools already known on website
- Yehliu science-rich offline guide + local GPS concept.
- Guihou dedicated field guide + price calculator + seafood quality coach + field Chinese/TTS.
- Shifen Waterfall explainer.
- Shifen Old Street mini guide.
- Taiwan language AI tools.
- **Do not claim the new Day 2 A/B/C/D auto-classifier exists until latest main is inspected and confirms implementation.**

---

# GitHub / website
Repo: `oops-lobster/minsung-tour-taiwan-2027`
Public site: `https://oops-lobster.github.io/minsung-tour-taiwan-2027/`
Checkpoint: `docs/CURRENT_CHAT_CHECKPOINT.md`

Known product state before any new weather-classifier implementation:
- Taiwan language AI tools.
- Guihou lunch + field guide.
- PWA immediate update fix.
- Shifen Waterfall explainer.
- Shifen Old Street mini guide.
- Day 2 Jiufen evening data added previously.
- Day 2 sunny schedule/budget Codex prompt stored previously.

---

# Continuity rules
- Always inspect recent `main` commits before claiming what is currently deployed.
- Do not resurrect old Day 1 Tamsui/CKS/Chun Shui Tang plan.
- CKS Memorial Hall is currently unassigned, not on Day 3.
- Do not change 小統一 19:00 reservation.
- Do not remove 弄宅咖啡 from rainy Day 1.
- Do not expose private budget data publicly.
- OZ711 source of truth remains **09:50 TPE T2** unless airline schedule changes.
- LUMI first NT$2,000 deposit receipt remains pending; do not resend unless failed/returned.
- Guihou lunch is fixed.
- Day 2 sunny Plan A is closed.
- **A/B/C/D weather semantics above are the current source of truth for rain planning.**
- **A/B/C share the Jiufen dinner/bar anchor; only D releases Jiufen.**
- Current concrete next tasks:
  1. Retry **A Li Kitchen** call; reservation target 2027-02-21 17:30, 3p, name **RAY**.
  2. Then contact **Golden Bar** about English + reservation policy.
  3. Design actual Day 2 **Plan B and Plan C daytime itineraries**.
  4. Ask LUMI D-scenario cancellation/change/refund rules if not already sent.
  5. Resolve Taiwan airport pickup after 宇航 signboard/payment answers.
  6. Resolve Korea departure G90 after Global25 text / final acceptable quote.
- For Chinese call scripts, always include **Traditional Chinese + Pinyin + Korean phonetic** when useful.
- Never send an external vendor message/email from connected accounts without explicit current-turn instruction.
