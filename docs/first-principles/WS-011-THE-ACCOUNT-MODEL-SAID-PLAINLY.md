# WS-011. The account model, said plainly (2026-10-26)

From our own store (`standard/platform/migrations`, `account_home.py`; surveyed in DP-011), the field's practice
(DP-033) and Ben's goal sentence (2026-10-25, `plans/2026-10-22-REORIENT/PROMPT-NEXT-16-AND-17.md`): *"managed ai
agent swarm infrastructure for running one or multiple businesses within an org. users and orgs can have multiple
employees, (which all have their own team), users can be only in an org of their own or also be in an org like as a
user seat"*. Ben asked (2026-10-26) that the site, the onboarding and the pricing all say it the same way. The diagram
is `WS-011-account-model.svg` beside this file.

## Six nouns, and nothing else

| Word on the site | What it is | In the store |
|---|---|---|
| **You** (a person) | Someone who signs in with a code by email or text. No password | `users` |
| **Organisation** | What pays and what holds people, permissions and money. A person may own one and hold seats in others | `accounts`, relations on `org:<id>` |
| **Business** | A company the organisation runs: its name, website, time zone, its records. Every organisation has at least one | `businesses` |
| **AI employee** | An agent on a computer of its own, with its own address, mailbox and records, working for one business | `employees` |
| **Team** | The employee's own teammates: the employee focused on one job each, peers, made and named by the employee or the owner | Hermes profiles of the employee |
| **Seat** | A person's place in an organisation, with what they may do there, in words | relation tuples (`owner`, `member`, `manager`, `biller`, `approver`, `spender`, `inviter`), and `grantee` on one employee |

**Never introduce a seventh word** for any of these on the site (no "workspace", "account", "agent", "bot",
"tenant", "instance"). "Account" stays for signing in only.

## The four cases the site must show, each a real state of the store

1. **An owner with one business.** One person, their organisation, one business, one employee with its team. The
   default; the onboarding ends here.
2. **An owner with several businesses** (Ben's operator: a person running one or several service businesses). One
   organisation, several businesses, each with its own employees; the floor lists them side by side. Built (0040).
3. **People sharing an employee.** A bookkeeper, a spouse, a foreman given a seat: `member` and granted one employee
   (`grantee`, they *use* it), or given one power only, such as `approver` (says yes to what employees send) or
   `spender` (confirms what employees pay). No other product read has an approver-only seat (DP-033 §2).
4. **An agency running its clients** (Ben, 2026-10-26: SEO agency owners and SMB marketing agencies). The agency is an
   organisation with the `reseller` relation over each client's organisation; its managers *operate* them. Built
   (DP-011 A3), drawn nowhere yet. Each client keeps its own organisation, its own money and its own records, and can
   end the agency's access.

Plus the one AMTECH itself holds: **AMTECH's staff inside a customer** only by `operator` access that the customer
can see and that ends (0033), the shape of Google's Access Approval.

## Who may do what, in words (for the people page and the pricing page)

| Seat | May |
|---|---|
| Owner | Everything in the organisation: people, money, businesses, employees, closing it |
| Manager | Start, connect and retire employees |
| Member | See the organisation; use the employees granted to them |
| Approver | Say yes or no to what employees send outward, on every employee |
| Spender | Confirm a payment an employee makes |
| Biller | See the plan, pay, change the card |
| Inviter | Invite people |

## Gaps the store has (from DP-011 and DP-033; none blocks the site)

- **A seat scoped to one business** (a bookkeeper for one of two businesses): not built; Ben's decision O1 (DP-900).
- **Teammates sit outside the permission model**: a person granted an employee reaches its team through it.
- **A person with no organisation** (an invitation not yet accepted) has no designed first screen (DP-011 A4).
- **The reseller's own floor** (its clients as rows with money and waiting work, HighLevel's table) is not drawn.

## What it changes on the site

- The pricing page prices the **organisation** (what pays), with each **business** and **employee** inside it; the
  agency case prices per client organisation.
- The onboarding ends in case 1, and says in one line that cases 2 to 4 are a click away later (another business,
  invite someone, run clients).
- The diagram is drawn once, as a figure, and reused on the home page's "how it is organised" section, the pricing page
  and the agencies page. The words in the first table are the only words used.
