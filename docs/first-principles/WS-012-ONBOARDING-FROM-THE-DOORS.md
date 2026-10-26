# WS-012. Onboarding: how the doors that exist compose into one conversation (2026-10-26)

Read from our own code and decisions: `standard/platform/front_door.py`, `interviewer.py`, `talker.py`,
`door/signup/start.html`, `funnel/funnel.py`, specs S02 and S04, `standard/DECISIONS.md` D44, D54, D70, and
`amtech-ai-platform-mvp/plans/2026-10-18-ONE-ONBOARDING/README.md`. Facts of our own code; no lane can overturn them.

## 1. Ben's instruction, and the decision it reverses

Ben, 2026-10-26: *"we need to have the llm based onboarding with integrated signup and verification, which would then
go to a new ai employee / org setup (instead of loading ai employee on page by default)"*.

D70 (2026-10-18, also Ben's) said the opposite for every door: *"hand the person a pool employee at the first word"*,
and retired the interviewer (*"nothing is asked as a gate"*). So the new site's onboarding **supersedes D70 for the
website's main door**. Whether the funnel pages (`/contractors`, `/create`) keep the employee-at-the-first-word model
is a separate question; Ben's sentence is about loading an employee on the page by default, which is what they do.
This goes to `standard/DECISIONS.md` as a new decision when the plan is written, with D70's falsifier answered.

## 2. The parts that exist and work

| Part | Code | What it does | Measured |
|---|---|---|---|
| **The interviewer** | `interviewer.py`, route `POST /api/onboarding/message/stream` (still wired) | A chat that learns three required topics (the business and the employee's name; the work that costs the most time; where and when, with working hours). Two model calls a turn: the reply streams, the extractor writes the draft in the background. Coverage decided in code (`ask_state`), never by the model. Six optional topics become the employee's first-session agenda | X06b, ten simulated owners: median 4.5 turns, 10/10 complete, 89/89 facts quote the owner, 0 secrets asked, 32 s of model wait per interview |
| **Sign up and verify** | `POST /signup/start`, `/signup/verify` | One card: email or mobile, a one-time code (Resend or Twilio Verify), no password. Sets the `__Host-` session cookie | Walked green 2026-10-26 (every door) |
| **The organisation** | `org_create` RPC; `open_gateway_org()` | The one writer of a customer's organisation on the gateway, on the door's price book (`door_books`); idempotent | E-ONE-ACCOUNT-ONE-ORG |
| **The pool** | `funnel/funnel.py` | Ready-built employees waiting (three ready on 2026-10-26, refilled one build at a time, 178-263 s a build) | A visit is handed an employee in 0.9-1.5 s (2026-10-18) |
| **The claim (attach)** | X10, `E-CLAIM-IS-ATTACH` | A pool employee joins an organisation: the address derived from what the employee learned (`address_candidates` reads its `brain/business.md`), its SOUL swapped, its bounds lifted, no restart | Walked green 2026-10-26 |
| **The look on joining** | `looks.py` | A character (shape and hue) is given once when the employee joins an organisation, kept in its home, keyed on ids | test_looks: 24 |
| **The keep offer** | `talker.py` `offer_keep` | A claim card in the conversation at the moment of need | Live on /contractors and /create |
| **Launch (the old path)** | `POST /api/onboarding/launch` | Compiles a manifest from the draft and builds a new employee | `employee.py add` 26.5-35.6 s cold; superseded by the pool |

## 3. The composition (hypothesis H-ONB-1, to be prototyped in round 2)

One conversation on amtechai.com, in this order, every step an existing part:

1. **The conversation opens on the page** (no employee yet): AMTECH's onboarding voice asks what the business is and
   what work costs the owner the most time; the visitor can paste their website. The interviewer's three topics and its
   `sourced_facts` rule; nothing asked that is not needed to start.
2. **Signup and verification inside the conversation**: the code card appears as a turn ("Where should I send the
   code?"), not as a separate page. The same `/signup/start` and `/signup/verify`.
3. **The organisation and its first business are made** from the draft (`org_create`, `open_gateway_org` on the
   website door's book).
4. **The first employee is claimed from the pool** and attached to the new organisation, its brain seeded with the
   draft (the S02 §5 path: "nobody is sent through the interview twice"), its character given (`looks.py`), its
   address derived from the business.
5. **The person lands in the employee's own client** at `<name>.amtechai.com`, already working on the job they named,
   with the six open topics as its first-session agenda.

Where the agentic feeling can come from without faking anything: steps 3 and 4 are real events with real timings;
the page can show them as they happen (the organisation drawn, the employee's character given, its team taking shape
for the jobs named), because each is a row the platform writes.

**What would prove H-ONB-1 wrong:** a visitor who will not give an email before seeing an employee work (measure:
drop-off at step 2 in the prototype's walk and in the rivals' onboarding read by RIVALS Part C); or a claim that
takes long enough that the wait needs hiding (measure the attach on the box before designing the reveal).

## 4. Open, to measure before the prototype

- The attach's wall time from claim to the employee serving at its address (E-CLAIM-IS-ATTACH has the receipt).
- Whether the interviewer's prompts still match the shipped talker's voice, and its cost per interview today.
- What the site needs from the front door to host the conversation on `amtechai.com` (CORS for `/api/onboarding/*`
  is gated by `_origin_is(app_url)` or `_cors`).
