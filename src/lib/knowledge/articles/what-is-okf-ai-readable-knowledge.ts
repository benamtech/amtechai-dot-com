import type { ArticleDefinition } from '../../articles';

const firstConceptExample = `---
type: Service
title: AI Employee
description: A managed AI system that handles operational work for a business.
tags: [ai, operations, automation]
---

# AI Employee

An AI Employee is not just a chatbot. It is a connected operating assistant that can read business context, follow workflows, and report back to a human supervisor.

## Related concepts

- Business Brain because every AI Employee needs durable company context.
- Owner Briefing because the agent should turn work into decisions.`;

const okfBundlePrompt = `Act as an entity SEO strategist and OKF bundle architect.

Business or site:
[describe the company, product, or website]

Audience:
[describe who needs to understand this knowledge]

Goal:
Create the first 10 OKF-style concept files we should publish.

Return:
1. The 10 concepts, each with a type, title, description, and tags
2. The reason each concept deserves its own file
3. The 20 most important links between those concepts, with relationship reasons
4. The 5 concepts that need citations before publication
5. The first 3 article or page ideas that should be generated from this graph
6. A warning list of weak, duplicate, or vague concepts to avoid`;

export const article: ArticleDefinition = {
  slug: 'what-is-okf-ai-readable-knowledge',
  title: "What Is OKF? Google's New Format For AI-Readable Knowledge",
  description:
    'OKF is a simple way to package knowledge so AI agents can read it. Here is how markdown concept files become a graph, and why AMTECH treats OKF as one output of a larger publishing system.',
  dek: 'OKF is not just a better wiki format. It is a portable surface for agent-readable concepts, and the first step toward a richer knowledge publishing system.',
  datePublished: '2026-06-19',
  dateModified: '2026-06-19',
  authorName: 'AMTECH AI',
  readingTime: '9 min read',
  category: 'strategy',
  audience: 'founders, technical marketers, SEO strategists, content operators, and AI builders',
  primaryEntity: {
    name: 'Open Knowledge Format',
    type: 'method',
    sameAs: ['https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing'],
  },
  entities: [
    { name: 'knowledge graph', type: 'method', sameAs: ['https://arxiv.org/abs/2003.02320'] },
    { name: 'agent-readable knowledge', type: 'outcome' },
    { name: 'AI search', type: 'tool' },
    { name: 'AI Overviews', type: 'tool', sameAs: ['https://developers.google.com/search/docs/appearance/ai-features'] },
    { name: 'structured data', type: 'method', sameAs: ['https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data'] },
    { name: 'JSON-LD', type: 'tool' },
    { name: 'llms.txt', type: 'tool' },
    { name: 'Business Brain', type: 'service' },
    { name: 'AMTECH Knowledge Publishing Standard', type: 'method' },
  ],
  internalLinks: [
    {
      label: 'Build a local SEO knowledge graph',
      href: '/articles/build-local-seo-plan-with-chatgpt',
      reason: 'Shows the entity and knowledge-graph SEO workflow that OKF can turn into a portable agent-readable surface.',
    },
    {
      label: 'Build a Business Brain first',
      href: '/articles/business-brain-free',
      reason: 'Shows the durable context layer a company needs before agents or AI Employees can use its knowledge reliably.',
    },
    {
      label: 'AMTECH vs. ChatGPT or Claude',
      href: '/articles/amtech-vs-chatgpt-claude',
      reason: "Connects agent-readable knowledge to AMTECH's distinction between one-off chat tools and managed AI Employees.",
    },
    {
      label: 'Browse the AMTECH article graph',
      href: '/articles',
      reason: 'Moves from the OKF explainer into the broader AMTECH graph of articles, playbooks, entities, and operating use cases.',
    },
  ],
  citations: [
    {
      label: 'Introducing the Open Knowledge Format',
      url: 'https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing',
      publisher: 'Google Cloud',
    },
    {
      label: 'AI features and your website',
      url: 'https://developers.google.com/search/docs/appearance/ai-features',
      publisher: 'Google Search Central',
    },
    {
      label: 'Introduction to structured data markup in Google Search',
      url: 'https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data',
      publisher: 'Google Search Central',
    },
    {
      label: 'Knowledge Graphs',
      url: 'https://arxiv.org/abs/2003.02320',
      publisher: 'arXiv',
    },
    {
      label: 'A Survey on Knowledge Graphs: Representation, Acquisition, and Applications',
      url: 'https://arxiv.org/abs/2002.00388',
      publisher: 'arXiv',
    },
    {
      label: 'Contextual estimation of link information gain',
      url: 'https://patents.google.com/patent/US20200349181A1/en',
      publisher: 'Google Patents',
    },
  ],
  faqs: [
    {
      question: 'Is OKF the same as a knowledge graph?',
      answer:
        'No. OKF is a lightweight file format that can express a simple knowledge graph through concept files and markdown links. A full knowledge graph may have richer typed entities, stricter edge rules, database storage, validation, and multiple generated surfaces.',
    },
    {
      question: 'Does OKF replace SEO?',
      answer:
        'No. OKF does not replace crawlable pages, helpful content, internal links, structured data, or technical SEO. It gives agents another clean way to read your knowledge.',
    },
    {
      question: 'Do I need a database to use OKF?',
      answer:
        'No. You can hand-author OKF files in a folder. A database becomes useful when you need one source of truth to generate many surfaces, such as OKF, HTML pages, JSON-LD, sitemaps, and internal tools.',
    },
    {
      question: 'What is the first OKF concept I should write?',
      answer:
        'Write the concept your customers, team, or agents need to understand before anything else makes sense. Usually that is your core service, main framework, or the problem your product is built to solve.',
    },
  ],
  blocks: [
    {
      type: 'answer',
      body:
        'OKF, short for Open Knowledge Format, is a way to package knowledge so AI agents can read it directly. In plain English, OKF is a folder of markdown files where each file describes one concept, and the links between files form a simple knowledge graph.',
    },
    {
      type: 'section',
      id: 'why-okf-exists',
      eyebrow: 'Context',
      title: 'Agents need context, but websites are messy',
      body: [
        'The new bottleneck in AI is not always the model. Often, it is the context. Google Cloud introduced OKF on June 12, 2026, with the same practical premise: foundation models keep improving, but they still need the right information to produce accurate and useful results.',
        "In most companies, that information is scattered across wikis, docs, drives, code comments, spreadsheets, databases, old proposals, chat threads, and a few experienced people's heads. Before an agent can help, it has to figure out what the important things are, which definitions are current, which sources are trusted, and how one concept relates to another.",
        'Traditional retrieval can pull chunks of text at query time. That is useful, but it is not the same as giving an agent a clean map. A chunk is a piece of text. A concept is a named thing with context, links, citations, and purpose.',
      ],
    },
    {
      type: 'prompt',
      id: 'first-concept-example',
      title: 'Example: a small OKF-style concept file',
      helper: 'A person can read this file, an agent can parse it, and the links show how the idea connects to other ideas.',
      body: firstConceptExample,
    },
    {
      type: 'table',
      id: 'okf-mental-model',
      title: 'The simplest useful OKF mental model',
      columns: ['Website habit', 'OKF habit', 'Why it matters'],
      rows: [
        ['Page', 'Concept', 'Agents need to know the thing being explained, not only the page layout.'],
        ['Navigation menu', 'index.md', 'Agents need a cheap map before loading a whole bundle.'],
        ['Internal link', 'Graph edge', 'A link tells the agent that two concepts are related.'],
        ['Blog category', 'Concept type or tag', 'Grouping becomes machine-readable.'],
        ['Citation link', 'Trust edge', 'Claims become easier to inspect and verify.'],
        ['Sitemap', 'Discovery surface', 'Crawlers and agents need stable entry points.'],
      ],
    },
    {
      type: 'section',
      id: 'links-become-edges',
      eyebrow: 'Graph layer',
      title: 'Why links matter more than they look',
      body: [
        'A normal internal link says, "Here is another page." An OKF link can say, "This concept depends on, explains, references, joins with, contrasts against, or extends that concept." The markdown link is simple. The surrounding sentence gives the relationship meaning.',
        'That is close to how good editorial links should work anyway. A useful internal link should never be just "read more." It should tell the reader why the next page matters. Better link text also helps agents and search systems understand the relationship instead of guessing from two URLs.',
        "This is where knowledge graph SEO and OKF overlap. Google's Search documentation says AI Overviews and AI Mode may use query fan-out across related subtopics and data sources. That makes clear entity relationships more valuable, not less.",
      ],
    },
    {
      type: 'table',
      id: 'okf-strengths-and-limits',
      title: 'What OKF does well, and what it does not solve',
      columns: ['Layer', 'What OKF gives you', 'What you still need to decide'],
      rows: [
        ['Format', 'Plain markdown files with YAML frontmatter.', 'Which concepts deserve their own files.'],
        ['Portability', 'A bundle that is not tied to one model, cloud, database, CMS, or agent platform.', 'Where the canonical source of truth lives.'],
        ['Graph shape', 'Markdown links between concepts.', 'Whether those links encode meaningful relationship reasons.'],
        ['Conformance', 'A small interoperability surface with `type` as the required field.', 'Stricter quality, freshness, and no-orphan validation.'],
        ['Agent access', 'A clean bundle agents can navigate.', 'How public, private, and permissioned knowledge should be served.'],
        ['Search support', 'A machine-readable knowledge surface.', 'Crawlable HTML, structured data, sitemap, robots.txt, and human UX.'],
      ],
    },
    {
      type: 'callout',
      title: 'Do not treat OKF as a dumping ground for markdown',
      body:
        'If you export a messy wiki into OKF, you have a portable messy wiki. That is better than a trapped messy wiki, but it is not a knowledge advantage. The advantage comes from deciding what deserves to be a concept, how concepts relate, which claims need evidence, and which surfaces need to stay in sync.',
      tone: 'warning',
    },
    {
      type: 'section',
      id: 'amtech-standard',
      eyebrow: 'AMTECH standard',
      title: 'OKF should be one output, not the whole system',
      body: [
        'At AMTECH, we do not treat OKF as the source of truth. We treat it as one projection. The source is a richer knowledge model: concepts, entities, article bodies, citations, and edges. From that model, we generate multiple surfaces for different consumers.',
        'That distinction matters. OKF answers, "Can an agent read this bundle?" A complete knowledge publishing system asks a harder question: "Can the same source of truth produce every surface humans, crawlers, agents, databases, and AI search systems need?"',
        'One source and many surfaces prevents the usual failure mode where the blog says one thing, the structured data says another, the internal wiki is stale, and the AI assistant has to guess which version is real.',
      ],
    },
    {
      type: 'table',
      id: 'amtech-surfaces',
      title: 'The surfaces one source model can generate',
      columns: ['Surface', 'Who it serves'],
      rows: [
        ['React article pages', 'Human readers.'],
        ['Prerendered HTML', 'Crawlers, link previews, non-JS readers, and agents.'],
        ['JSON-LD', 'Search systems that understand structured page data.'],
        ['OKF markdown bundle', 'Agents and tools that want portable concept files.'],
        ['Supabase concept tables', 'Queryable graph access and future product/API use.'],
        ['sitemap.xml', 'Search discovery.'],
        ['robots.txt', 'Crawl guidance.'],
        ['llms.txt', 'Agent orientation.'],
      ],
    },
    {
      type: 'section',
      id: 'concept-example',
      eyebrow: 'Example',
      title: 'AI Employee is stronger as a concept graph than as one landing page',
      body: [
        'Suppose you want AI systems to understand what AMTECH means by "AI Employee." A weak version is one landing page that says an AI Employee saves time. A stronger version is a concept graph: AI Employee, Business Brain, Owner Briefing, Supervisor, and agent-readable knowledge all defined and linked.',
        'Now the idea is not floating alone. It has neighbors. It has definitions. It has a role. That is what a graph gives you: not just more pages, but more meaning between pages.',
      ],
    },
    {
      type: 'checklist',
      id: 'first-okf-file-checklist',
      title: 'The first OKF file you should create',
      items: [
        'Pick one concept your company explains over and over: your core service, main framework, a customer problem, or a term you define differently than the market.',
        'Give it a clear `type`, title, one-sentence description, and useful tags.',
        'Explain why the concept matters and when to use it.',
        'Link it to related concepts with relationship reasons, not generic "read more" language.',
        'Add citations where the concept relies on external claims, platform behavior, or research.',
        'Add it to an index so an agent can navigate the bundle without loading everything first.',
      ],
    },
    {
      type: 'prompt',
      id: 'okf-bundle-prompt',
      title: 'Prompt: plan your first OKF bundle',
      helper: 'Use this with ChatGPT, Claude, Gemini, or your preferred writing agent to turn a site or business into an initial concept map.',
      body: okfBundlePrompt,
    },
    {
      type: 'section',
      id: 'when-to-keep-it-simple',
      eyebrow: 'Decision point',
      title: 'When to keep OKF simple and when to build a pipeline',
      body: [
        'You do not need a full graph pipeline on day one. Keep it simple if you have fewer than 20 important concepts, your content does not change often, and your immediate goal is to make your knowledge clearer for agents and collaborators. A hand-authored folder can be enough.',
        'Build a larger system when you publish many articles, care about AI search visibility, need structured data and human pages to stay in sync, or want the same knowledge to power articles, internal tools, search, and automation. That is when OKF should stop being the whole thing and become one generated surface from a stronger source model.',
      ],
    },
    {
      type: 'section',
      id: 'short-version',
      eyebrow: 'Bottom line',
      title: 'The future of content is useful knowledge projected into many surfaces',
      body: [
        "OKF is Google's lightweight format for AI-readable knowledge. It represents knowledge as markdown concept files with YAML frontmatter. The only required field is `type`. Links between files turn the bundle into a simple graph.",
        'That makes OKF a powerful first step for teams that want agents to read curated knowledge without scraping a whole website or depending on a proprietary platform. But OKF is not the full strategy.',
        'For serious publishing, OKF should be one output from a richer system: one source of truth, first-class entities, explicit relationships, citations, generated human pages, generated structured data, queryable graph tables, and validation before publish.',
      ],
    },
  ],
};
