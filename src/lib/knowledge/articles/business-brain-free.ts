import type { ArticleDefinition } from '../../articles';

const businessBrainPrompt = `I want to build a simple business brain for my company before I automate anything.

Act like an operations consultant for an owner-led business.

First, ask me for the missing context you need. Then help me organize what I already know into these sections:

1. Services we sell
2. Customers we serve
3. Jobs we do often
4. Pricing rules and approval rules
5. Common customer questions
6. Estimate, invoice, and follow-up templates
7. Mistakes we never want repeated
8. Tools, files, inboxes, calendars, and records the business uses
9. Decisions that must stay with a human
10. Tasks AI could safely draft, summarize, research, or prepare

For each section, give me:
- What to collect
- Where to find it
- A simple free place to store it
- How an AI assistant could use it later
- What a human must still verify

Do not recommend buying software yet. Keep the first version free, simple, and owner-friendly.`;

export const article: ArticleDefinition = {
  slug: 'business-brain-free',
  title: 'How to Build a Business Brain for Free Before You Hire an AI Consultant',
  description: 'A practical owner guide for organizing business knowledge, records, examples, rules, and approvals before building an AI employee or custom automation system.',
  dek: 'A useful AI system does not start with a clever prompt. It starts with the facts, examples, rules, files, and judgment your business already uses every day.',
  datePublished: '2026-06-18',
  dateModified: '2026-06-18',
  authorName: 'AMTECH AI',
  readingTime: '10 min read',
  category: 'strategy',
  audience: 'small-business owners, operators, and office managers who want to prepare for AI without wasting money on tools too early',
  primaryEntity: { name: 'business brain', type: 'method' },
  entities: [
    { name: 'AI employees', type: 'service' },
    { name: 'owner bottleneck', type: 'problem' },
    { name: 'approval boundaries', type: 'method' },
    { name: 'business records', type: 'method' },
    { name: 'SOPs', type: 'method' },
    { name: 'local service businesses', type: 'industry' },
    { name: 'custom AI agents', type: 'service' },
  ],
  internalLinks: [
    {
      label: 'AMTECH vs. ChatGPT or Claude',
      href: '/articles/amtech-vs-chatgpt-claude',
      reason: 'Read this next if you want to understand why a business brain is different from a general chat window.',
    },
    {
      label: 'Build a Claude pricing skill',
      href: '/articles/build-claude-skill-job-pricing',
      reason: 'Use this when you are ready to turn one part of the business brain into a reusable pricing workflow.',
    },
    {
      label: 'Build a local SEO knowledge graph',
      href: '/articles/build-local-seo-plan-with-chatgpt',
      reason: 'Use this when your business brain needs to become public authority content for services, places, problems, and proof.',
    },
    {
      label: 'Schedule a call',
      href: '/schedule-call',
      reason: 'Talk through what parts of your business knowledge are ready to become an AI employee.',
    },
  ],
  citations: [
    {
      label: 'Creating helpful, reliable, people-first content',
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      publisher: 'Google Search Central',
    },
    {
      label: 'Structured data introduction',
      url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      publisher: 'Google Search Central',
    },
  ],
  faqs: [
    {
      question: 'What is a business brain?',
      answer: 'A business brain is the organized set of services, rules, examples, templates, records, decisions, and approvals that an AI system needs before it can help with real work consistently.',
    },
    {
      question: 'Can I build a business brain without paying for software?',
      answer: 'Yes. The first version can live in simple folders, docs, spreadsheets, and exported examples. The value comes from clarity, not from buying another platform too early.',
    },
    {
      question: 'Is this the same as training a custom model?',
      answer: 'No. For most small businesses, the first useful step is organizing context and operating rules so AI can reference them, not training a new foundation model.',
    },
  ],
  blocks: [
    {
      type: 'answer',
      body: 'To build a business brain for free, collect the business knowledge that already exists in your estimates, invoices, emails, job notes, customer questions, SOPs, pricing rules, and approval habits. Put it into a simple folder and spreadsheet system first. Then use AI to draft, summarize, compare, and prepare work against those examples while a human still approves important decisions.',
    },
    {
      type: 'section',
      id: 'why-it-matters',
      eyebrow: 'Foundation',
      title: 'Why the business brain comes before automation',
      body: [
        'Most owners want the exciting version of AI first: an agent that answers customers, writes estimates, updates records, follows up, researches vendors, and reports what happened. That can be useful, but only after the system understands how the business actually works.',
        'The business brain is the operating context behind the agent. It is the difference between a generic answer and a draft that reflects your services, your customer types, your margin rules, your risk tolerance, your tone, your proof, and your approval boundaries.',
        'You do not need a large software project to start. You need one clean place where your best examples, recurring decisions, rules, and exceptions stop living only in your head.',
      ],
    },
    {
      type: 'table',
      id: 'free-business-brain-map',
      title: 'Free business brain map',
      columns: ['Brain layer', 'What to collect', 'Free starting place', 'How AI can use it'],
      rows: [
        ['Services and offers', 'Service list, packages, add-ons, exclusions, service areas, ideal jobs, bad-fit jobs.', 'Google Doc, Notion page, or simple markdown file.', 'Draft service pages, qualify requests, explain scope, and avoid selling work you do not want.'],
        ['Customer and job examples', 'Past estimates, invoices, before/after notes, photos, objections, customer questions, change orders.', 'Folder organized by service type and job type.', 'Recognize patterns, draft similar documents, summarize job context, and spot missing information.'],
        ['Rules and approvals', 'Pricing formulas, discount rules, warranty boundaries, escalation triggers, safety red lines, who signs off.', 'Spreadsheet with rule, owner, examples, and approval status.', 'Know when to draft, when to ask, when to warn, and when to stop for human review.'],
        ['Templates and tone', 'Estimate language, emails, texts, invoice notes, review requests, customer explanations.', 'Shared document with approved examples.', 'Write faster first drafts that sound like the business instead of generic AI copy.'],
        ['Records and tools', 'CRM fields, calendar rules, inbox labels, file naming, job statuses, vendor lists, reporting cadence.', 'Spreadsheet inventory of systems and fields.', 'Prepare cleaner handoffs for future integrations, dashboards, and AI employees.'],
      ],
    },
    {
      type: 'prompt',
      id: 'business-brain-prompt',
      title: 'Copy-ready business brain starter prompt',
      helper: 'Paste this into ChatGPT or Claude, then answer the questions with your real examples. Keep the output in your business brain folder.',
      body: businessBrainPrompt,
    },
    {
      type: 'section',
      id: 'what-to-collect-first',
      eyebrow: 'First pass',
      title: 'What to collect in the first two hours',
      body: [
        'Start with the work that repeats and costs the owner time. Pull three to five good estimates, three invoices, three customer emails or text threads, your service list, your common objections, and a list of decisions nobody else on the team feels comfortable making.',
        'Do not over-organize the first pass. Make folders named services, examples, templates, rules, records, and decisions. Put imperfect material in the right place. The goal is to make the invisible operating system visible enough for a human or AI assistant to inspect.',
        'Then add short notes explaining why each example is good or bad. AI learns more from contrast than from a pile of unlabeled documents. A rejected estimate, a painful customer issue, or an underpriced job can be as useful as your cleanest template.',
      ],
    },
    {
      type: 'checklist',
      id: 'business-brain-checklist',
      title: 'Minimum viable business brain checklist',
      items: [
        'A one-page description of what the business sells, who it serves, and which jobs are poor fits.',
        'A list of recurring office tasks that drain owner time: estimates, invoices, follow-up, research, purchasing, reports, records, or SOP updates.',
        'Approved examples of customer-facing writing, including estimate language, invoice notes, and follow-up messages.',
        'A rules sheet for pricing, discounts, refunds, warranties, safety, escalation, and human approval.',
        'A systems map showing where customer, job, calendar, vendor, invoice, and file records currently live.',
        'A red-line list of actions AI should never take without a human.',
      ],
    },
    {
      type: 'callout',
      title: 'Do not dump everything into AI and call it a system',
      body: 'Uploading a messy folder into a chat tool is not the same as building a business brain. Sensitive data, stale examples, contradictory rules, and unlabeled documents can create confident but wrong outputs. Clean the first layer, label examples, and keep approval boundaries visible.',
      tone: 'warning',
    },
    {
      type: 'section',
      id: 'diy-vs-expert',
      eyebrow: 'Decision point',
      title: 'When the free version is enough and when to bring in help',
      body: [
        'The free version is enough when you are trying to learn, organize examples, improve prompts, draft first-pass documents, or identify which workflow deserves automation first. You should be able to do that with documents, folders, spreadsheets, and a general AI assistant.',
        'Bring in expert help when the workflow needs system access, customer communication, CRM updates, payment or booking logic, dashboards, role-based permissions, reliable logs, or multi-step handoffs across tools. At that point, the business brain becomes implementation material for an AI employee instead of just a better prompt library.',
        'A good consultant should not skip this step. They should help you clarify the rules, records, examples, and outcomes before building anything expensive.',
      ],
    },
  ],
};
