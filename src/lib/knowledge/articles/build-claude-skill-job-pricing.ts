import type { ArticleDefinition } from '../../articles';

const quickStartPrompt = `I want to run a Job Profitability Check for my local service business.

Do not give me a final price immediately.

First, review the job information I provide. Then ask me for any missing details you need before calculating.

After that, help me estimate:

1. Direct labor cost
2. Materials and supplies
3. Equipment or rental cost
4. Travel and setup time
5. Overhead allocation
6. Risk buffer
7. Desired profit

Then calculate:

1. Walk-away price
2. Standard target price
3. Premium or risk-adjusted price

Finally, give me a short owner decision memo that says whether I should quote the job, revise the scope, ask more questions, or pass.

Here is the job information:

Business type:
Service requested:
Customer type:
Job location:
Expected crew size:
Estimated labor hours:
Materials or supplies needed:
Equipment needed:
Travel time:
Deadline or urgency:
Known risks:
Customer expectations:
Price I was thinking of charging:
Target profit margin:`;

const skillBuilderPrompt = `I want to create a reusable Claude Skill for my local service business.

The skill should be called: Job Profitability Check.

Purpose:
Help me decide whether a service job is priced profitably before I send a quote.

Audience:
Owner of a local service business who understands the trade but does not want to manually calculate labor, materials, overhead, risk, and margin every time.

The skill should help Claude:

1. Ask for missing job details before calculating.
2. Separate direct labor, materials, equipment, travel/setup, overhead, risk buffer, and profit.
3. Calculate walk-away price, standard target price, and premium/risk-adjusted price.
4. Produce a short owner decision memo with risks, missing information, customer-facing explanation, and human verification checklist.

Important rules:

- Never pretend the price is final.
- Always show assumptions.
- Always ask for missing information if the inputs are weak.
- Use low, expected, and high estimates when uncertain.
- Use this formula when calculating margin:
  target price = total estimated cost / (1 - target margin)
- Warn me if the job looks underpriced, risky, or out of scope.
- Keep the tone practical, direct, and owner-friendly.

Please draft a complete SKILL.md file for this workflow.`;

const skillMdExample = `---
name: job-profitability-check
description: Use this skill when the user wants to price, quote, evaluate, or decide whether to take a local service job. Helps calculate labor, materials, overhead, risk, margin, and owner decision guidance.
---

# Job Profitability Check

You help a local service business owner decide whether a job is priced profitably before they send a quote.

## Primary outcome

Produce a practical owner decision memo that includes:

- Recommended price range
- Walk-away price
- Standard target price
- Premium or risk-adjusted price
- Missing information
- Main profit risks
- Customer-facing explanation
- Human verification checklist

## Step 1: Check for required job facts

Before calculating, review whether the user provided enough information.

Ask for missing details if needed:

- Business type
- Service requested
- Customer type
- Job location
- Scope of work
- Measurements or quantities
- Expected crew size
- Estimated labor hours
- Labor cost or hourly burden rate
- Materials and supplies
- Equipment or rentals
- Travel and setup time
- Timeline or urgency
- Access constraints
- Known risks
- Warranty or callback exposure
- Desired profit margin
- Price the owner was considering

If the user gives incomplete information, proceed only with clearly labeled assumptions.

## Step 2: Break down cost categories

Separate the job into:

1. Direct labor
2. Materials and supplies
3. Equipment, rentals, or subcontractors
4. Travel, setup, and non-billable time
5. Overhead allocation
6. Risk buffer
7. Desired profit

Use low, expected, and high estimates when uncertain.

## Step 3: Calculate pricing options

Calculate:

- Walk-away price: minimum price where the job is barely worth taking
- Standard target price: price that protects cost, overhead, and expected profit
- Premium/risk-adjusted price: price for urgency, difficult access, complexity, customer risk, warranty exposure, or schedule disruption

Use this formula when margin is requested:

Target price = total estimated cost / (1 - target margin)

Explain the math in plain English.

## Step 4: Produce owner decision memo

Format the final answer as:

### Recommendation
Quote / revise scope / ask more questions / pass.

### Price range
- Walk-away:
- Standard target:
- Premium/risk-adjusted:

### Assumptions
List the assumptions used.

### Profit risks
List the biggest risks.

### Missing information
List anything the owner should confirm.

### Customer-facing explanation
Give a short explanation the owner can use in the estimate.

### Human verification checklist
List what the owner must verify before sending.

## Safety and quality rules

- Do not claim the price is final.
- Do not invent exact local costs when the user has not provided them.
- Do not ignore missing information.
- Do not recommend unsafe, illegal, or unlicensed work.
- Do not provide tax, legal, accounting, or insurance advice as final professional advice.
- Always remind the owner to verify scope, costs, terms, and margin before sending.`;

export const article: ArticleDefinition = {
  slug: 'build-claude-skill-job-pricing',
  title: 'Build a Claude Skill That Helps You Price Jobs Like a Pro',
  description: 'A plain-English guide for Claude users who want to create a reusable job profitability skill for pricing local service work.',
  dek: 'Use Claude to turn messy job details into a repeatable pricing review: missing facts, cost buckets, margin math, risk flags, and an owner decision memo.',
  datePublished: '2026-06-18',
  dateModified: '2026-06-18',
  authorName: 'AMTECH AI',
  readingTime: '12 min read',
  category: 'strategy',
  audience: 'Claude users, local service business owners and contractors learning how to turn AI prompts into repeatable workflows',
  primaryEntity: { name: 'Claude Skills', type: 'tool', sameAs: ['https://claude.ai'] },
  entities: [
    { name: 'job profitability check', type: 'method' },
    { name: 'local service businesses', type: 'industry' },
    { name: 'AI employees', type: 'service' },
    { name: 'AI agents', type: 'service' },
    { name: 'job pricing', type: 'problem' },
    { name: 'gross margin', type: 'method' },
    { name: 'owner bottleneck', type: 'problem' },
  ],
  internalLinks: [
    {
      label: 'AMTECH vs. ChatGPT or Claude',
      href: '/articles/amtech-vs-chatgpt-claude',
      reason: 'Use this next if you want to understand the difference between a general AI tool and a custom AI employee.',
    },
    {
      label: 'Create an estimate with ChatGPT',
      href: '/articles/create-estimate-with-chatgpt',
      reason: 'Use this when you want a practical estimating prompt before turning the workflow into a reusable skill.',
    },
    {
      label: 'Schedule a call',
      href: '/schedule-call',
      reason: 'Talk through which pricing, estimating, follow-up, or office workflows should become an AI employee in your business.',
    },
  ],
  citations: [
    {
      label: 'Agent Skills overview',
      url: 'https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview',
      publisher: 'Claude API Docs',
    },
    {
      label: 'Anthropic skills repository',
      url: 'https://github.com/anthropics/skills',
      publisher: 'Anthropic GitHub',
    },
    {
      label: 'Equipping agents for the real world with Agent Skills',
      url: 'https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills',
      publisher: 'Anthropic Engineering',
    },
    {
      label: 'Extend Claude with skills',
      url: 'https://code.claude.com/docs/en/skills',
      publisher: 'Claude Code Docs',
    },
    {
      label: 'How to price your product',
      url: 'https://www.uschamber.com/co/start/strategy/how-to-price-your-product',
      publisher: 'U.S. Chamber of Commerce',
    },
    {
      label: 'Run the Job Costing tool',
      url: 'https://help.servicetitan.com/docs/run-the-job-costing-tool',
      publisher: 'ServiceTitan Help',
    },
  ],
  faqs: [
    {
      question: 'Can Claude Skills replace estimating software?',
      answer: 'Usually no. A skill can help you reason through pricing and prepare better estimate logic, but it does not automatically replace your CRM, estimating software, accounting system, or field-service platform.',
    },
    {
      question: 'Do I need to know how to code to build a Claude Skill?',
      answer: 'Not for the basic idea. A useful first skill can be written as instructions: what the skill does, when Claude should use it, what steps Claude should follow, and what output Claude should produce.',
    },
    {
      question: 'Is it safe to use Claude with customer data?',
      answer: 'Use judgment. Do not paste sensitive customer, payment, health, identity, or confidential business information into any AI tool unless your policies, plan, and data controls support it.',
    },
    {
      question: 'What is the best first skill for a local service business?',
      answer: 'A job profitability or estimate review skill is a strong first choice because it is practical, repeated often, tied to profit, and easy for the owner to review.',
    },
    {
      question: 'How is a skill different from asking Claude a question?',
      answer: 'A question helps once. A skill helps repeatedly by giving Claude the same checklist, math rules, warnings, and output format every time the workflow appears.',
    },
  ],
  blocks: [
    {
      type: 'prompt',
      id: 'quick-start-prompt',
      title: 'Try the Job Profitability Check first',
      body: quickStartPrompt,
      helper: 'Paste this into Claude before you build the full skill. A useful skill starts as a useful repeatable prompt.',
    },
    {
      type: 'answer',
      body: 'A Claude Skill is a saved set of instructions Claude can reuse for a specific task. For a local service business, a strong first skill is a Job Profitability Check: Claude reviews job details, asks for missing information, estimates costs, calculates price ranges, flags risk, and gives the owner a decision memo before a quote goes out.',
    },
    {
      type: 'section',
      id: 'start-with-workflow',
      eyebrow: 'Action first',
      title: 'Start with one pricing decision your business repeats every week.',
      body: [
        'Most local service owners do not need another AI trick. They need help making better decisions faster. Pricing is a strong place to start because every quote forces the owner to balance labor, materials, travel, risk, overhead, margin, and customer expectations.',
        'The workflow in this guide is called a Job Profitability Check. It helps answer a direct business question: based on this job information, what price range protects labor, materials, overhead, risk, and profit?',
        'This works for painters, pressure washers, HVAC companies, cleaners, landscapers, roofers, remodelers, plumbers, electricians, restoration companies, and other local service businesses. The point is not to let AI guess. The point is to make Claude walk through the decision with discipline.',
      ],
    },
    {
      type: 'section',
      id: 'what-is-skill',
      eyebrow: 'Plain English',
      title: 'What is a Claude Skill?',
      body: [
        'A Claude Skill is a saved instruction set for Claude. Instead of typing the same long prompt every time, you give Claude reusable directions for one kind of work.',
        'For example: “When I ask about pricing a job, use my Job Profitability Check. Ask for missing details. Break the job into labor, materials, travel, overhead, risk, and profit. Show the math. Give me a decision memo.” That is a skill.',
        'Anthropic describes skills as reusable, filesystem-based resources that give Claude domain-specific workflows, context, and best practices. The public Anthropic skills repository describes them as folders of instructions, scripts, and resources that Claude can load dynamically for specialized tasks. In business-owner language: a skill is how you save a repeatable way of working so Claude does not need to be re-taught from scratch.',
      ],
    },
    {
      type: 'table',
      id: 'skill-comparison',
      title: 'Prompt vs skill vs AI employee',
      columns: ['Term', 'Plain meaning', 'Pricing example'],
      rows: [
        ['Prompt', 'Something you type once.', '“Help me price this job.”'],
        ['Skill', 'A saved process Claude can reuse.', '“Use my Job Profitability Check every time I evaluate a job.”'],
        ['AI agent', 'AI that can take multiple steps with tools, files, or systems.', '“Review the job notes, check the price table, draft the estimate, and prepare follow-up.”'],
        ['AI employee', 'A business role built around AI, rules, tools, memory, handoffs, and approvals.', '“An AI office employee helps with intake, estimating, follow-up, records, reports, and owner approvals.”'],
      ],
    },
    {
      type: 'section',
      id: 'get-started',
      eyebrow: 'Claude setup',
      title: 'How to get started with Claude if you are new.',
      body: [
        'Go to claude.ai and create an account. If you have used ChatGPT, the basic experience will feel familiar: you type a message, Claude responds. Start with normal chat before building a skill.',
        'Paste the quick-start prompt from the top of this article and use one real job example. Do not start with your most complicated job. Start with a normal pressure washing job, room painting job, weekly cleaning quote, landscape cleanup, HVAC maintenance visit, or small plumbing repair.',
        'Once the prompt helps, look for the Skills option in your Claude setup or use Claude Code if your workflow is technical. Claude Code documentation explains that skills can be invoked directly by name or used when Claude decides they are relevant. For this article, you only need the simple idea: save the instructions so Claude can repeat the workflow later.',
      ],
    },
    {
      type: 'section',
      id: 'why-pricing',
      eyebrow: 'Why this workflow',
      title: 'Pricing is a useful first skill because it is repeated, valuable, and easy to rush.',
      body: [
        'Many owners price from memory: that feels like a $1,200 job, we charged $900 last time, add a little extra because it looks annoying, or match what the customer probably expects. That instinct can be useful, but it can also hide real costs.',
        'Travel time, setup, prep, material waste, equipment wear, callback risk, warranty exposure, schedule disruption, owner time, office follow-up, and overhead can all turn a busy job into a low-profit job.',
        'The U.S. Chamber of Commerce explains pricing as a process that should account for costs, profit margin, customer value, and competitive position. ServiceTitan describes job costing as breaking down costs like payroll, equipment, and materials by job. Claude can help make those assumptions visible before the owner commits to a price.',
      ],
    },
    {
      type: 'table',
      id: 'four-step-process',
      title: 'The 4-step Job Profitability Check',
      columns: ['Step', 'What Claude should do', 'Owner value'],
      rows: [
        ['1. Capture facts', 'Ask what is missing before calculating.', 'Prevents rushed quotes from weak job information.'],
        ['2. Break into cost buckets', 'Separate labor, materials, equipment, travel, overhead, risk, and profit.', 'Shows where the money actually goes.'],
        ['3. Calculate three prices', 'Produce walk-away, standard target, and premium/risk-adjusted prices.', 'Gives the owner a decision range instead of one fragile guess.'],
        ['4. Make the decision', 'Recommend quote, revise scope, ask more questions, or pass.', 'Turns math into a pro-level business decision.'],
      ],
    },
    {
      type: 'section',
      id: 'step-one',
      title: 'Step 1: Capture the job facts.',
      body: [
        'Claude cannot help with pricing if the job details are weak. The first job of the skill is not calculation. The first job is asking whether you know enough to price the work.',
        'A painting quote without prep details is not ready. A pressure washing quote without surface condition and water access is not ready. A cleaning quote without square footage, frequency, pets, and access instructions is not ready. An HVAC job without urgency, system type, and diagnostic context is not ready.',
        'The first value of the skill is preventing rushed quotes. Claude should ask for the missing facts before it touches the math.',
      ],
    },
    {
      type: 'section',
      id: 'step-two',
      title: 'Step 2: Break the job into cost buckets.',
      body: [
        'Once the job facts are clear, Claude should separate the job into direct labor, materials and supplies, equipment or rentals, travel and setup, overhead allocation, risk buffer, and desired profit.',
        'This matters because owners often think in revenue, but profit is not revenue. A $2,000 job is not a $2,000 win if the job carries $700 of labor, $350 of materials, $150 of travel and setup, $250 of overhead, $150 of callback exposure, and two unpaid owner hours after the job.',
        'Claude can make those assumptions visible. That visibility is often more valuable than the first number it gives you.',
      ],
    },
    {
      type: 'section',
      id: 'step-three',
      title: 'Step 3: Calculate three prices, not one.',
      body: [
        'The skill should produce a walk-away price, a standard target price, and a premium or risk-adjusted price. The walk-away price is the minimum where the job is barely worth doing. The standard target is the price you would usually quote if the job is normal. The premium price applies when there is urgency, difficult access, complexity, customer risk, warranty exposure, or schedule disruption.',
        'When calculating margin, use this logic: target price equals total estimated cost divided by one minus target margin. If your total estimated cost is $1,000 and you want a 30% margin, adding 30% gives you $1,300, but $300 profit on a $1,300 sale is about 23% margin. To target a true 30% margin, use 1000 divided by 0.70, which is about $1,428.57.',
        'Claude can do the math quickly, but the owner still has to verify the assumptions.',
      ],
    },
    {
      type: 'section',
      id: 'step-four',
      title: 'Step 4: Make the owner decision.',
      body: [
        'The final output should not just be a price. It should help you decide whether to quote, revise the scope, ask more questions, or pass.',
        'A useful owner decision memo includes a recommended price range, the main profit risks, missing information, a customer-facing explanation, optional upgrades, and what a human must verify before sending.',
        'This is the difference between using AI as a chatbot and using AI as a business tool. Claude is not just calculating. It is helping you think through whether the job is worth taking, whether the scope is too vague, whether the customer expectation is risky, and whether the price protects profit.',
      ],
    },
    {
      type: 'prompt',
      id: 'skill-builder-prompt',
      title: 'Ask Claude to draft the skill',
      body: skillBuilderPrompt,
      helper: 'Use this after the quick-start prompt works. It asks Claude to turn the workflow into a reusable skill file.',
    },
    {
      type: 'prompt',
      id: 'skill-md-example',
      title: 'Example SKILL.md for the workflow',
      body: skillMdExample,
      helper: 'If your Claude setup supports file-based skills, this is a practical starting point. Customize it with your real labor rates, service types, minimum charges, and approval rules.',
    },
    {
      type: 'section',
      id: 'real-example',
      eyebrow: 'In the field',
      title: 'Example: a pressure washing owner checks a $650 quote.',
      body: [
        'Imagine a pressure washing owner gives Claude this job: clean a 3,000 square foot driveway and 600 square foot patio, 35 minutes away, with two people, four hours on site, degreaser and surface cleaner use, a customer deadline this week, oil stains, older concrete, limited water access, a possible price of $650, and a 35% target margin.',
        'Claude should not just say “charge $800.” A useful answer would break down total labor hours, labor cost, travel and setup, chemical cost, equipment wear, overhead, risk buffer, target margin, missing information, and recommended price range.',
        'Then Claude might say that $650 only works if labor burden, chemical cost, travel overhead, and staining risk are low. If oil stains or water access add time, the job may be underpriced. That is the point: Claude is helping the owner see the business decision more clearly.',
      ],
    },
    {
      type: 'callout',
      title: 'Do not build a skill that only says “tell me what to charge.”',
      body: 'Claude does not automatically know your crew speed, labor burden, material costs, equipment cost, callback rate, market position, minimum job size, warranty policy, schedule pressure, or risk tolerance. The skill should make guessing harder by forcing Claude to ask better questions and show assumptions.',
      tone: 'warning',
    },
    {
      type: 'callout',
      title: 'Do not let AI invent your liabilities.',
      body: 'Never send an AI-generated quote without reviewing scope, exclusions, assumptions, taxes, payment terms, warranty language, customer promises, safety constraints, licensing, and compliance requirements. A skill can help you think. It should not become an unchecked authority.',
      tone: 'warning',
    },
    {
      type: 'section',
      id: 'ai-employees',
      eyebrow: 'The bigger system',
      title: 'How this connects to AI employees.',
      body: [
        'A Claude Skill is a good first step because it captures one repeatable decision. But a skill is not the same thing as a full AI employee. A prompt helps once. A skill repeats one workflow. An agent uses tools, files, and steps to complete a larger task. An AI employee owns a business function with rules, tools, memory, handoffs, and approvals.',
        'A Job Profitability Check skill could eventually become part of a larger AI office employee. That employee could collect job details from a form, ask the customer missing questions, organize photos, check service area rules, prepare a pricing review, draft the estimate, suggest follow-up messages, update the CRM, and escalate uncertain decisions to the owner.',
        'That is the bigger opportunity. Start with one useful skill. Then connect it to the business.',
      ],
    },
    {
      type: 'checklist',
      id: 'diy-or-help',
      title: 'DIY is enough when:',
      items: [
        'You know your labor rates and minimum charges.',
        'Your jobs are fairly simple.',
        'You personally review every quote.',
        'You only need help thinking through price.',
        'You are not connecting Claude to forms, CRM, email, calendar, or estimating software yet.',
      ],
    },
    {
      type: 'checklist',
      id: 'expert-help',
      title: 'You probably need expert help when:',
      items: [
        'You have multiple crews or many service types.',
        'Your pricing depends on routes, seasons, materials, or crew capacity.',
        'You want the workflow connected to forms, CRM, email, calendar, or estimating software.',
        'You need approval rules, reporting dashboards, or durable business memory.',
        'You want an AI employee, not just a better prompt.',
      ],
    },
    {
      type: 'section',
      id: 'bottom-line',
      eyebrow: 'Bottom line',
      title: 'Start with one decision your business repeats every week.',
      body: [
        'Make it clear. Make it repeatable. Then make it work for you.',
        'A Claude Skill is a strong first step because it saves one useful way of working. An AI employee is what happens when that skill connects to your real business: intake, estimates, records, follow-up, dashboards, and owner approvals.',
        'If you can describe the workflow once, AMTECH can help turn it into a system.',
      ],
    },
  ],
};
