import ArticlePage from '../components/articles/ArticlePage';
import { ArticleDefinition } from '../lib/articles';

const baseLinks = [
  { label: 'Talk through an estimating workflow', href: '/schedule-call', reason: 'Map the exact estimate, follow-up, and admin steps AMTECH can automate for your business.' },
  { label: 'See how AMTECH works', href: '/how-it-works', reason: 'Understand how AI employees turn one-off prompts into repeatable operating systems.' },
  { label: 'Compare investment levels', href: '/pricing', reason: 'Use this after you know whether you need a prompt, a workflow, or a complete AI employee.' },
];

const estimatePrompt = `[YOUR COMPANY NAME] is a [painting, pressure washing, roofing, landscaping, HVAC, etc.] contractor in [city, state, neighborhood, or service area].

Here is the description of this job a client wants me to do: [Use talk-to-text here. Explain the job, surfaces, square footage, access, prep work, materials, risks, timeline, and anything you would tell your estimator or office manager.]

Client name: [TYPE CLIENT NAME HERE]
Client/jobsite address: [TYPE JOBSITE ADDRESS HERE]
Client email: [TYPE CLIENT EMAIL HERE]

Create an official quote or estimate for the client from my company. Make it professional, branded, clear, and ready to convert into a PDF.

My brand colors and font are: [SHORT BRAND DESCRIPTION]
Attached is my logo: [ATTACH LOGO IF THE TOOL SUPPORTS FILES]

Include: scope of work, assumptions, exclusions, line items, total price, optional upgrades, payment terms, expected timeline, acceptance language, and a short professional note from the owner.`;

function promptSection(industry: string, pricingNote: string): ArticleDefinition['blocks'] {
  return [
    {
      type: 'answer',
      body: `You can draft a professional, branded ${industry} estimate in minutes with ChatGPT, AMTECH, Claude, or another modern AI tool. The key is not magic wording. The key is giving the model your business identity, the client details, the job description, the pricing logic, and the exact document you want returned.`,
    },
    {
      type: 'section',
      id: 'copy-paste-prompt',
      eyebrow: 'Copy this first',
      title: 'The two-minute prompt',
      body: [
        estimatePrompt,
        'Use voice dictation for the job description if you are in the truck or walking the property. Talk the same way you would talk to your estimator, office manager, or best employee: what you saw, what could go wrong, what materials matter, what the customer cares about, and where you want the price to land.',
      ],
    },
    {
      type: 'table',
      id: 'prompt-breakdown',
      title: 'Why this prompt works',
      columns: ['Prompt ingredient', 'Why it matters', 'What to add when the job is complex'],
      rows: [
        ['Company and trade', 'The AI needs to know whether it is writing like a contractor, not a generic assistant.', 'Crew size, normal minimum charge, warranty language, license or insurance notes.'],
        ['Location', 'Pricing, seasonality, access, labor expectations, and customer language vary by market.', 'Neighborhood, property type, parking constraints, local material availability.'],
        ['Spoken job description', 'The messy field context is usually where the real estimate lives.', 'Measurements, substrate condition, prep requirements, photos, known customer objections.'],
        ['Client details', 'A real estimate needs to feel official and ready to send.', 'Decision-maker name, billing contact, jobsite notes, requested start date.'],
        ['Brand direction', 'The same numbers convert better when the document looks intentional.', 'Logo, colors, tone, tagline, financing or deposit terms.'],
      ],
    },
    {
      type: 'section',
      id: 'pricing',
      eyebrow: 'Pricing logic',
      title: 'If you are not sure what to charge, ask for the math separately',
      body: [
        pricingNote,
        'A strong pricing prompt asks the AI to show assumptions, not just a final number. Tell it to estimate labor hours, material quantities, equipment, travel, overhead, margin, risk buffer, and optional upgrades. Then compare the output against your actual experience before you send anything.',
        'In practice, AI pricing can land close enough to be useful as a first pass, but it can be optimistic if you do not force it to account for current local costs, prep time, callbacks, waste, travel, weather, and your required profit. Treat the first number like a smart draft, not like accounting truth.',
      ],
    },
    {
      type: 'checklist',
      id: 'send-checklist',
      title: 'Before you send the estimate',
      items: [
        'Check that every promise in the scope is something your crew can actually deliver.',
        'Confirm measurements, quantities, material assumptions, and access constraints.',
        'Add exclusions for anything that could become a dispute later.',
        'Make the payment terms, expiration date, and acceptance instructions obvious.',
        'Add one or two optional upgrades so the client can choose a better outcome without renegotiating.',
      ],
    },
    {
      type: 'callout',
      title: 'Do not let AI invent your liabilities',
      body: 'Never send an AI-generated estimate without reviewing scope, price, terms, warranty language, and exclusions. The tool can write faster than your office, but you are still responsible for what the client signs.',
      tone: 'warning',
    },
    {
      type: 'section',
      id: 'beyond-document',
      eyebrow: 'Next level',
      title: 'The bigger win is turning the prompt into a repeatable system',
      body: [
        'One good prompt can save 30 minutes today. A real operating system can intake the lead, ask the right questions, organize photos, draft the estimate, create follow-up messages, update the CRM, and remind the owner only when judgment is needed.',
        'Some platforms can read blueprints, photos, aerial imagery, or measurement files. For many contractors, the more economical move is still to use your own field understanding and let AI handle the heavy lifting: calculations, material research, pricing structure, wording, upsells, customer education, and follow-up.',
        'If estimating is becoming a bottleneck, AMTECH can help you decide whether you need a better prompt library, a branded estimate workflow, or a full AI employee that turns new opportunities into polished sales assets automatically.',
      ],
    },
  ];
}

const articles: Record<string, ArticleDefinition> = {
  'write-pressure-washing-estimate-with-ai': {
    slug: 'write-pressure-washing-estimate-with-ai',
    title: 'Write a Pressure Washing Estimate With AI',
    description: 'A copy-paste prompt and practical workflow for creating pressure washing estimates with AI tools.',
    dek: 'Use this anti-clickbait guide to get a usable pressure washing estimate draft in two minutes, then tighten the price before you send it.',
    datePublished: '2026-06-17',
    dateModified: '2026-06-17',
    authorName: 'AMTECH AI',
    readingTime: '7 min read',
    category: 'first-action',
    audience: 'pressure washing owners, exterior cleaners, and local service contractors',
    primaryEntity: { name: 'AI pressure washing estimates', type: 'method' },
    entities: [
      { name: 'pressure washing contractors', type: 'industry' },
      { name: 'ChatGPT', type: 'tool' },
      { name: 'branded estimates', type: 'outcome' },
      { name: 'local pricing', type: 'problem' },
    ],
    internalLinks: baseLinks,
    citations: [],
    faqs: [
      { question: 'Can ChatGPT write a pressure washing estimate?', answer: 'Yes. Give it your company details, client information, job description, surface conditions, pricing assumptions, and desired format. Review the scope and price before sending.' },
      { question: 'Should AI set my pressure washing price?', answer: 'Use AI to draft the math and expose assumptions, but validate the final price against your market, minimum charge, equipment cost, chemicals, risk, and profit target.' },
    ],
    blocks: promptSection('pressure washing', 'For pressure washing, ask for separate pricing assumptions for square footage, surface type, chemical use, water access, height, stains, delicate materials, travel, and minimum service charge.'),
  },
  'estimate-painting-cost-ai': {
    slug: 'estimate-painting-cost-ai',
    title: 'Estimate Painting Cost With AI',
    description: 'How painting contractors can use AI to calculate, structure, and write a professional painting estimate.',
    dek: 'AI can help turn measurements, prep notes, colors, coatings, and labor assumptions into a polished painting estimate your client can understand.',
    datePublished: '2026-06-17',
    dateModified: '2026-06-17',
    authorName: 'AMTECH AI',
    readingTime: '8 min read',
    category: 'first-action',
    audience: 'residential and commercial painting contractors',
    primaryEntity: { name: 'AI painting cost estimates', type: 'method' },
    entities: [
      { name: 'painting contractors', type: 'industry' },
      { name: 'material quantities', type: 'problem' },
      { name: 'labor hours', type: 'method' },
      { name: 'optional upgrades', type: 'outcome' },
    ],
    internalLinks: baseLinks,
    citations: [],
    faqs: [
      { question: 'Can AI estimate painting cost?', answer: 'AI can draft a useful estimate if you provide room counts, wall height, surface condition, prep work, coating type, number of coats, trim details, labor assumptions, and local pricing context.' },
      { question: 'What should painters double-check?', answer: 'Double-check prep time, repairs, primer, number of coats, product choice, ceiling or trim exclusions, furniture moving, access, and your required margin.' },
    ],
    blocks: promptSection('painting', 'For painting, ask the AI to separate prep, masking, repairs, primer, paint quantity, coats, walls, ceilings, trim, doors, access, cleanup, and warranty assumptions.'),
  },
  'create-estimate-with-chatgpt': {
    slug: 'create-estimate-with-chatgpt',
    title: 'Create an Estimate With ChatGPT',
    description: 'A contractor-focused guide to creating professional estimates with ChatGPT and similar AI tools.',
    dek: 'ChatGPT can create the document, organize the scope, explain the assumptions, and even help with first-pass pricing when you provide the right field context.',
    datePublished: '2026-06-17',
    dateModified: '2026-06-17',
    authorName: 'AMTECH AI',
    readingTime: '7 min read',
    category: 'first-action',
    audience: 'owners and office managers at local service businesses',
    primaryEntity: { name: 'ChatGPT estimates', type: 'tool' },
    entities: [
      { name: 'contractor estimates', type: 'outcome' },
      { name: 'AI tools', type: 'tool' },
      { name: 'office admin bottleneck', type: 'problem' },
      { name: 'sales documents', type: 'outcome' },
    ],
    internalLinks: baseLinks,
    citations: [],
    faqs: [
      { question: 'Can ChatGPT make a PDF estimate?', answer: 'It can draft the estimate content and structure. Depending on the tool you use, you may export, print to PDF, or paste the result into your estimate template.' },
      { question: 'Is it safe to include client details?', answer: 'Use judgment with private data. Only enter information you are comfortable putting into that platform, and avoid sensitive payment, identity, or confidential information unless your tools and policies support it.' },
    ],
    blocks: promptSection('contractor', 'If you are unsure about price, ask ChatGPT to build three versions: lean, standard, and premium. Require it to show labor, materials, overhead, margin, and risk assumptions so you can correct the model quickly.'),
  },
};

export function PressureWashingEstimateArticle() {
  return <ArticlePage article={articles['write-pressure-washing-estimate-with-ai']} />;
}

export function PaintingCostAIArticle() {
  return <ArticlePage article={articles['estimate-painting-cost-ai']} />;
}

export function ChatGPTEstimateArticle() {
  return <ArticlePage article={articles['create-estimate-with-chatgpt']} />;
}
