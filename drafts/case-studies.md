# Case study drafts — for review

Long versions of the four featured case studies. One Search and Research synthesis stay as short cards.

**How to review**
- Anything in `[brackets]` is a placeholder: a number, name or fact only you know. Fill it in or tell me to cut the line.
- Everything else is built from what's already on the site and in `archive/old-cases`. I didn't invent outcomes.
- Comment on any line in the pull request ("Files changed" tab, tap a line). I'll apply the changes here and in `index.html`.

Each case follows the same shape: a summary line, the problem, 3–4 key decisions with the tradeoff, impact, and a closing note.

---

## 1. Component rules that people and AI follow, in 50+ shipped features

**HoneyBook · 2026 · Senior Product Designer, Design Systems**
**Team:** [me + N engineers, N designers] · **Timeline:** [months] · **Outcome:** 50+ features shipped on the right components, and generated code builds on HBUI instead of public libraries.

### The problem
Vibe coding changed who builds at HoneyBook. PMs prototype, designers open PRs, and LLMs generate UI. That changes what a design system is for: HBUI now serves people and AI alike, and both need it to be unambiguous.

It wasn't. Across the library, components overlapped in look and purpose, with no written meaning behind them. Tags, chips, badges and statuses were the clearest example. People used them interchangeably, and an LLM had no way to tell them apart, so it guessed, or reached for a public library instead. [Optional: one concrete example of misuse you saw, e.g. a status rendered as a tag on an invoice.]

### Key decisions

**1. Define components by meaning, not by look.**
I mapped every overlapping component by purpose, usage and level of interaction, then gave each a distinct role and contract:
- A **Badge** is a system-assigned descriptor.
- A **Status** is a step in a lifecycle.
- A **Tag** is a user-defined category.
- A **Chip** is [role — e.g. an interactive filter or selection].

Then we aligned the visuals to match, so each one still feels related but now signals its purpose.
*Tradeoff:* [check] existing screens had to change to follow the new contracts. [How many / how you handled migration.]

**2. One source of truth, not two.**
People rely on visuals and AI needs structured text. Writing every guideline twice would double the upkeep and let the two versions drift apart. Instead we restructured the guidelines as data, with one shared format that produces a Storybook page for people and a rules file for agents.
*Tradeoff:* writing guidelines as structured data is slower than free-form docs. It pays off on every update after.

**3. A shared, plain-language vocabulary.**
Rule writing is a human, messy process, even when the output has to be structured. We set ground rules for the writing itself: one vocabulary across components, patterns and guidelines, and images that point at the exact rule they illustrate. That keeps the system readable for anyone, however close they work to it.

**4. Accept that patterns don't all fit one shape.**
Components have properties, and patterns have scenarios. They overlap enough to share a common format, but patterns differ heavily from each other. Forcing them into one template would have made the system brittle, so the format flexes where it has to.

### Impact
- **50+ features** have shipped on the right components.
- Misuse now gets caught in review. [Number, e.g. review comments about component misuse dropped from X to Y per month.]
- Generated code builds on HBUI instead of public libraries. [Number, e.g. share of AI-generated PRs that pass system review on the first try.]
- [Optional: adoption by PMs and designers who open PRs, or a quote from an engineer.]

### What I learned
AI is here to stay, and so are systems. The work that made HBUI legible to agents (clear roles, plain language, one source of truth) is the same work that made it clearer for people. Systems are built around people, and human language outlasts any tool.

---

## 2. Three token layers that made dark mode a token swap

**HoneyBook · 2026 · Senior Product Designer, Design Systems**
**Team:** [me + N engineers] · **Timeline:** [months] · **Outcome:** light and dark mode run on the same components, with accessibility built into the foundation.

### The problem
The foundations under a design system decide how far it can scale. At HoneyBook, visual decisions lived in too many places: [hardcoded values / one-off colors / per-component overrides — pick what's true]. Every theme change or contrast fix meant hunting through components, and dark mode would have meant designing much of the product twice.

The question was how to set up tokens that improve scale without making the system harder to understand or adopt.

### Key decisions

**1. Three layers, with strict rules about who uses what.**
- **Primitives** hold raw values, such as [e.g. blue-600].
- **Semantic tokens** name those values by purpose, such as secondary text or an accent surface.
- **Components** only ever use semantic tokens. Never primitives, never raw values.

*Tradeoff:* the strict rule adds a step when someone needs a new color. That step is the point: it forces a conversation about purpose before a new value enters the system.

**2. Name tokens by purpose, not appearance.**
`text-primary`, `surface-accent`, `stroke-focus` say what a color is for, not what it looks like. That's what makes theming possible: the purpose stays the same in dark mode, and only the value changes. [Optional: your naming pattern, e.g. category-role-state.]

**3. Put accessibility in the foundation.**
Contrast is checked at the token level, not patched per component. If every text and surface pairing passes [WCAG AA], every component built on them inherits it. [How you checked: tooling, manual audit, contrast matrix.]

**4. Map before migrating.**
I started by mapping the layers beneath the UI: where consistency matters most, where change is most likely, and where values were already drifting. [What the audit found, e.g. X unique colors reduced to Y primitives and Z semantic tokens.]

### Impact
- Light and dark mode are a token swap: same components, different values.
- [Number, e.g. X hardcoded values replaced, or Y unique colors consolidated into Z tokens.]
- [Time or effort saved, e.g. a theme change that used to take days now takes one file change.]
- The same structure is what lets the system scale to [new surfaces / brands / AI-generated code], because there's one place to change a decision.

### What I learned
Foundations work is invisible, but it shapes everything that comes after. A strong token structure makes design decisions easier to change, scale and keep aligned across teams.

*Live demo idea:* this site's own theme toggle could run on the same three-layer structure, and the case study could link to it.

---

## 3. Three boards, one kanban system

**HoneyBook · 2025 · Senior Product Designer**
**Team:** [me + N engineers across N domain teams] · **Timeline:** [months] · **Outcome:** the Pipeline was rebuilt with no custom one-offs, and the same component now serves other domains.

### The problem
The Pipeline is home base for HoneyBook members, but it was an outdated table posing as a pipeline. Projects, contacts and tasks all needed a board, and each was owned by a different team with its own timeline and opinions on how a kanban should work.

Without a shared model, every board would be built from scratch, and inconsistently. The challenge was finding enough common ground to build once, without flattening real differences between domains.

### Key decisions

**1. Columns are just a property.**
Every domain was really visualizing a property value: a project's stage, a task's status, a lead's source. So I designed one system instead of three boards. Nearly any property can define the columns, and moving a card changes that value. Visual continuity keeps that clear while things move.
*Tradeoff:* a generic model needs more upfront design than one bespoke board. It's what let the other boards reuse the same component.

**2. Map card properties by behavior.**
Cards hold both content and interactive parts. I mapped every card property by how it behaves, so interactive elements never clash with content, whichever domain fills the card.

**3. Design every interaction state up front.**
Drag, bulk select, sort constraints and columns that can't accept an item were all designed before build, not discovered during QA. [Optional: one state that was especially tricky and how you solved it.]

**4. Defaults first, customization second.**
Flexibility meant three things: sensible defaults for fast shipping, defined pillars for cross-domain coherence, and room for domain-specific content without breaking the system. Any card can be customized, but the design works best with system presets.
*Tradeoff:* [Did a team push for more freedom than the presets allow? If so, how you handled it. Otherwise cut this line.]

### Impact
- The Pipeline was rebuilt on the system and shipped with **no custom one-offs** in the code.
- Members responded warmly. [Number or quote, e.g. a satisfaction score, usage, or a member quote.]
- The same component now serves other domains: [which ones].
- [Optional: build time for the next board vs the first.]

### What I learned
The best systems work often starts as product work. Finding the one idea that the domains shared (columns as a property) did more than any amount of visual alignment could have.

---

## 4. Onboarding that gets users to value sooner, part of 50%+ ARR growth

**NEXT · 2023 · [your title at NEXT]**
**Team:** [me + PM + N engineers] · **Timeline:** [weeks/months] · **Outcome:** more new users uploaded their own data early, and the upgrade prompt became a steady source of sales conversations.

### The problem
NEXT helps product teams turn customer research into what to build next. New users signed up, but many never reached the moment where the product proved its value: seeing insights from their own research. Without that moment, upgrading rarely made sense to them.

At the same time, NEXT shipped features every week, so the structure kept growing and the product got harder to navigate for someone new.

### Key decisions

I tested three ideas in fast iterations:

**1. Show the process the way teams work.**
A vertical view of the research process ([check steps: collect, highlight, cluster…]) mirrors how teams actually work. It became the side navigation, with results brought forward for impact-driven PMs. The vertical menu also made room for tailored data views, which turned out to be invaluable for customers.
*Tradeoff:* moving the navigation touched every part of the product, at a company releasing weekly. [How you staged the rollout.]

**2. Always invite users to add their own data.**
Seeing the product is one thing. Seeing your own research in it is what proves the value. Every new user now sees a clear starting point that invites them to upload their own research.

**3. Put the upgrade where the value is.**
A visible usage meter (for example, 127 of 180 minutes used) sits next to an Upgrade button, right where users see the value. The incentive shows up at the moment it makes sense.

### Impact
- More new users uploaded their own data early on. [Number, e.g. activation rose from X% to Y%.]
- The upgrade prompt became a steady source of sales conversations. [Number, e.g. X sales conversations per month.]
- This work was part of NEXT's **50%+ ARR growth** over [period]. [One honest line on how much of it, e.g. "alongside pricing and sales changes."]
- The new structure simplified the platform's mental model and led to less confusion. [Optional: support tickets or user feedback.]

### What I learned
This design grew out of small concepts made over a long time. When a vision is clear, ideas can come from anywhere, and the work is capturing them and bringing them together at the right moment.

---

## Short cards (unchanged)
- **Research synthesis in minutes instead of hours** — NEXT, 2024
- **One search for quick lookups and complex queries** — NEXT, 2023

## Other small fixes worth doing (not in this branch)
- Nav says "New York". Change to "Miami" or "US remote, ET" if you want.
- Add a resume link next to Email.
