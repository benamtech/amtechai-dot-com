/**
 * SINGLE SOURCE OF TRUTH for per-page metadata.
 *
 * Every public route's <head> (title, description, canonical, Open Graph, Twitter, JSON-LD)
 * and its agent-discovery hints are derived here, once. This module is React-free so it can be
 * imported by BOTH the Node build scripts (scripts/okf/prerender.ts, scripts/seo/validate-seo.ts)
 * and the runtime React app (src/components/seo/SeoManager.tsx).
 *
 * Two input families feed the registry:
 *   1. Authored marketing/conversion routes (copy lives in React; meta + a real body summary live here).
 *   2. Article routes — derived from the knowledge façade (src/lib/knowledge).
 *
 * Renderers (renderHead.ts) and the runtime hook consume PageMeta; they never re-author it.
 */
import { articleDefinitions } from '../knowledge/articles/index.ts';
import { buildArticleSchema, AMTECH_ORGANIZATION_SCHEMA } from '../articles.ts';
import { SITE_ORIGIN, getConcepts } from '../knowledge/concepts.ts';


export const SITE_NAME = 'AMTECH AI';
export const DEFAULT_TITLE = 'AMTECH. — Your Next Employee Is a Computer';
/** Optional branded share image. Set to a real 1200x630 raster once public/og-default.png exists. */
export const DEFAULT_OG_IMAGE: string | undefined = undefined;

export type JsonLdObject = Record<string, unknown>;

/** A readable content section, rendered into the prerendered static body so view-source has real text. */
export type BodySection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

/** A compact instruction payload embedded for agents that cannot or will not parse the full page. */
export type AgentMap = {
  summary: string;
  /** What an agent should do with this page, in order. */
  actions?: string[];
  /** Alternate machine-readable representations of THIS resource. */
  alternates?: { type: string; href: string }[];
  /** Related routes worth traversing (knowledge-graph neighbors). */
  seeAlso?: { title: string; href: string }[];
  /** Skill bootstrap order (docs/skills/standard/05) — the head transports the pointer, not the proof. */
  skill?: { bootstrap: string[] };
  /** The self-describing verification contract: the recipe + verdict + reason-code surface to recompute. */
  verify?: Record<string, unknown>;
  /** Quick file-route map: where each archive file is published, with its SRI digest. */
  files?: { path: string; url: string; role: string; integrity: string }[];
};

export type PageMeta = {
  /** Canonical path, e.g. '/about'. Registry key. */
  route: string;
  title: string;
  description: string;
  ogType: 'website' | 'article';
  /** Absolute or site-relative OG image; omitted from output when undefined. */
  image?: string;
  /** Canonical URL override (for alias routes that should point elsewhere). */
  canonicalRoute?: string;
  noindex?: boolean;
  jsonLd: JsonLdObject[];
  /** rel="alternate" links (markdown twins, manifests, etc.). */
  alternates: { type: string; href: string; title?: string }[];
  agentMap?: AgentMap;
  /** Real readable body for the prerendered static HTML (marketing/hub routes). */
  sections?: BodySection[];
  /** Extra <meta name="..." content="..."> tags injected after JSON-LD (skill stamps, demonstrates). */
  extraMeta?: { name: string; content: string }[];
};

const abs = (route: string) => `${SITE_ORIGIN}${route}`;
const withSuffix = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);

/** Organization + WebSite schema attached to the homepage. */
function siteJsonLd(): JsonLdObject[] {
  return [
    {
      '@context': 'https://schema.org',
      ...AMTECH_ORGANIZATION_SCHEMA,
      description:
        'AMTECH builds AI employees that work inside a business — answering, selling, scheduling, and handling admin work.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE_ORIGIN}/#website`,
      name: SITE_NAME,
      url: `${SITE_ORIGIN}/`,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    },
  ];
}

// --- 1. Authored marketing + conversion routes -------------------------------------------------

type AuthoredEntry = Omit<PageMeta, 'route' | 'jsonLd' | 'alternates'> & {
  route: string;
  jsonLd?: JsonLdObject[];
};

const AUTHORED: AuthoredEntry[] = [
  {
    route: '/',
    title: DEFAULT_TITLE,
    description:
      'AMTECH builds AI employees that work inside your business — answering, selling, scheduling, and handling admin — so owners and small teams get more done without learning AI tools.',
    ogType: 'website',
    jsonLd: siteJsonLd(),
    sections: [
      {
        heading: 'Your next employee is a computer',
        paragraphs: [
          'AMTECH gives a business a textable AI employee that understands how it actually runs — its pricing, brand, documents, customers, and the way the owner likes work done.',
          'Instead of learning AI tools, owners and office staff just text the employee and get admin and growth work handled.',
        ],
      },
      {
        heading: 'What it does',
        bullets: [
          'Answers questions about the business using its real information.',
          'Drafts estimates, follow-ups, and customer messages in the business voice.',
          'Handles scheduling, intake, and the repetitive back-office work that slows owners down.',
        ],
      },
      {
        heading: 'This site is agent-readable.',
        paragraphs: ['Structured content is available at these surfaces:'],
        bullets: [
          'The working agent for contractors — https://amtechai.com/contractors',
          'Knowledge graph (OKF bundle) — https://amtechai.com/okf/index.md',
          'Agent orientation — https://amtechai.com/llms.txt',
          'Published articles — https://amtechai.com/articles',
        ],
      },
    ],
    agentMap: {
      summary: 'AMTECH AI sets up AI employees for local service businesses — purchasing, quoting, scheduling, and admin.',
      actions: [
        'Start at /contractors to give the working agent a real job.',
        'Read /llms.txt for a structured orientation to this site.',
        'Browse /okf/index.md for the full knowledge graph.',
      ],
      seeAlso: [
        { title: 'The working agent for contractors', href: '/contractors' },
        { title: 'Knowledge graph (OKF bundle)', href: '/okf/index.md' },
        { title: 'Agent orientation (llms.txt)', href: '/llms.txt' },
        { title: 'Articles hub', href: '/articles' },
      ],
    },
  },
  {
    route: '/how-it-works',
    title: 'How AMTECH Works — an AI employee set up in a conversation',
    description:
      'Give the working agent a real job on amtechai.com/contractors, or start a short chat at app.amtechai.com. Keep it with your email, and your employee lives at your own address. It drafts; you send.',
    ogType: 'website',
    sections: [
      {
        heading: 'An AI employee that knows your business, set up in a conversation',
        bullets: [
          'Start one of two ways: give the working agent a real job on amtechai.com/contractors, or start a short chat at app.amtechai.com.',
          'Keep it with a code sent to your email. The work, the files and what it learned about your business come with you.',
          'Your employee lives at your-business.amtechai.com. Talk to it like a person; it shows you what it is doing and what needs you.',
          'It drafts and you send. It never asks for a password or a card number in the chat.',
        ],
      },
    ],
  },
  {
    route: '/about',
    title: 'About AMTECH AI — we run our own business on it',
    description:
      'AMTECH is Ben Palaskas. It builds AI employees for contractors, service companies and local operators, and has run its own business on one since August 2026.',
    ogType: 'website',
    sections: [
      {
        heading: 'We run our own business on it',
        paragraphs: [
          'AMTECH is Ben Palaskas. It builds AI employees for the businesses that keep neighbourhoods running: contractors, service companies and local operators.',
          'AMTECH runs its own company on an AI employee, and has since August 2026. It writes our estimates, answers our email and keeps our records.',
          '78% of small-business owners do not fully trust AI to work without oversight (Business.com, 2026). The employee drafts, and you approve what goes out.',
        ],
      },
    ],
  },
  {
    route: '/privacy',
    title: 'Privacy Policy — AMTECH AI',
    description: 'What AMTECH collects, why, and what it will never do with it, including text messages from your AI employee.',
    ogType: 'website',
    sections: [
      {
        heading: 'Privacy Policy',
        paragraphs: [
          'AMTECH collects only what the Service needs to do the work you hired it to do, and does not sell personal information.',
          'Text messages: when you give your mobile number and tick the text-message box, your AI employee texts you about your own business. Message frequency varies. Message and data rates may apply. Reply HELP for help and STOP to stop.',
          'No mobile information will be shared with third parties or affiliates for marketing or promotional purposes. Text-messaging originator opt-in data and consent will not be shared with any third parties.',
        ],
      },
    ],
  },
  {
    route: '/terms',
    title: 'Terms of Service — AMTECH AI',
    description: 'The terms for using AMTECH AI employees, including the text-message program.',
    ogType: 'website',
    sections: [
      {
        heading: 'Terms of Service',
        paragraphs: [
          'These terms govern your use of AMTECH AI employees and amtechai.com.',
          'Text messages from your AI employee: you opt in by entering your mobile number and ticking the text-message box. Message frequency varies. Message and data rates may apply. Reply HELP for help, STOP to stop, START to begin again. Carriers are not liable for delayed or undelivered messages.',
        ],
      },
    ],
  },
  {
    route: '/sms',
    title: 'Text messages from your AI employee — AMTECH AI',
    description: 'Who receives texts from an AMTECH AI employee, how you opt in, what you will receive, and how to stop.',
    ogType: 'website',
    sections: [
      {
        heading: 'Text messages from your AI employee',
        paragraphs: [
          'Only the owner of an AMTECH AI employee receives texts, at the mobile number they gave when they set the employee up or claimed it.',
          'Opt-in: beneath the number is a box the owner ticks. It reads: "Text me from my AI employee about my business. Message frequency varies. Message and data rates may apply. Reply HELP for help, STOP to stop. See amtechai.com/sms."',
          'Example: "Rita (Ridgeline Roofing): The Henderson estimate is done, $14,820. Want me to send it? Reply STOP to stop texts."',
          'Reply HELP for help or email ben@amtechai.com. Reply STOP to stop; START to begin again. No mobile information is shared with third parties or affiliates for marketing or promotional purposes.',
        ],
      },
    ],
  },
  {
    route: '/pricing',
    title: 'AMTECH AI Pricing — an AI employee from no monthly fee to $1,500 a month managed',
    description:
      'Self-serve: no monthly fee, pay for the work as it is done, and 8% of payments made through it. Managed AI employee from $1,500 a month. Websites $1,000 or more. Hourly work $75 an hour.',
    ogType: 'website',
    sections: [
      {
        heading: 'What it costs',
        bullets: [
          'Your own AI employee, self-serve: no monthly fee. Start free on a real job; if you keep it, you pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it.',
          'A managed AI employee: from $1,500 a month. Most businesses land above $2,000 a month.',
          'A website: $1,000 or more.',
          'Hourly work, built or advised: $75 an hour.',
          'Payments through a site AMTECH runs: 8% of each payment, taken by Stripe; you are the merchant and Stripe’s card fee comes on top.',
        ],
      },
    ],
  },
  {
    route: '/painters',
    title: 'For Painting Contractors — AMTECH AI',
    description:
      'One AMTECH employee for your painting business: it writes the estimate, sends the invoice, keeps and follows up your clients, and makes you readable to AI search. From $1,500 a month.',
    ogType: 'website',
    sections: [
      {
        heading: 'You run the crew. AMTECH runs the office.',
        paragraphs: [
          'AMTECH is an AI employee for your painting company. It writes your estimates, sends your invoices, and follows up with your clients — while you are on the ladder. You approve everything before it goes out.',
        ],
        bullets: [
          'Estimates in your rates and your format, drafted while you watch.',
          'Invoices and reminders that go out on time, without you remembering.',
          'Follow-up on every lead, in your voice, so no job slips.',
        ],
      },
      {
        heading: 'Half your market is already asking AI for a painter.',
        paragraphs: [
          '45% of consumers now use AI tools to find local businesses, up from 6% a year earlier (BrightLocal, 2026). When someone asks an AI assistant to find them a painter, the businesses that come back are the ones the AI can read. Paid leads do not close the gap: contractors pay about $54 per lead for Google Local Services Ads (SearchLight Digital, 2026). AMTECH makes your business readable where the new customers are looking.',
        ],
      },
      {
        heading: 'Four jobs. One hire.',
        bullets: [
          'Estimates and proposals — you describe the job, it drafts the estimate in your rates and format, in about two minutes while you watch.',
          'Invoicing and getting paid — it sends the invoice and follows up when a customer has not paid.',
          'Clients and follow-up — every lead and client in one place, connected to the software you use or kept for you, followed up in your voice.',
          'Local SEO and marketing — real pages for the work you actually do, so you are found on Google and in the AI assistants people ask.',
        ],
      },
      {
        heading: 'You stay in charge. That is the point.',
        paragraphs: [
          'The employee drafts. You approve. Every estimate, every invoice, every message waits for your yes before it goes out. 78% of small-business owners do not fully trust AI to work without oversight (Business.com, 2026) — so AMTECH is built around your approval, not around replacing you. It drafts the estimate; you check the numbers. That is ten minutes, not an evening.',
        ],
      },
      {
        heading: 'If you use ChatGPT, you already know the feeling.',
        paragraphs: [
          'You already have a computer write a caption or tidy up your notes. That is what it feels like to hand it a piece of writing and get a finished result back. AMTECH does that for your whole office, because the employee already knows your rates, your customers, and the way you write.',
          'Never used any of it? Simpler still: it is an extra pair of hands for everything that happens on a computer. You talk to it, approve what matters, and it types.',
        ],
      },
      {
        heading: 'Other tools make you type more. This does the work.',
        paragraphs: [
          'Estimating apps and customer lists are screens you fill in yourself, so the work is still yours. AMTECH works the other way round: you say what you want, and it does the steps. You approve the money and what goes out to a customer. It shows you what it did.',
        ],
      },
      {
        heading: 'You already pay for this. Just in four places.',
        paragraphs: [
          'An SEO company. A customer list. An estimating app. Add them up and you are already past $1,500 a month — before any of it actually gets done. AMTECH is one employee and one bill, from $1,500 a month.',
        ],
      },
      {
        heading: 'Fair questions, straight answers.',
        bullets: [
          'Will my clients know it is AI? Only if you want them to — you approve every message before it goes out, so it reads like you.',
          'What if it gets a number wrong? You check every estimate before it is sent. It drafts; you approve.',
          'How long does setup take? A couple of hours of calls, then it works in your phone and email.',
          'Do I need to know AI? No. If you can text, you can run it.',
        ],
      },
      {
        heading: 'We run our own business on it.',
        paragraphs: [
          'AMTECH runs its own company on an AI employee, and has since August 2026. We write our own estimates, answer our own email, and keep our own records with the same setup we would build for you. Book a call, bring a painting job you need priced, and watch it become a full estimate in about two minutes. AI employees are early access for a small number of businesses.',
        ],
      },
    ],
  },
  {
    route: '/contractors',
    title: 'AI Estimates for Contractors, Live — AMTECH AI',
    description:
      'Give the AMTECH employee a real job and watch it draft the estimate and make a page your customer can open. Free to try, no sign-up to start.',
    ogType: 'website',
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is it free to try?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. There is no card and no sign-up to start. You only sign in if you want to keep what it made."
            }
          },
          {
            "@type": "Question",
            "name": "What does it cost if I keep it?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "There is no monthly fee. You pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it. Stripe's card fee comes out of your side, as it does on any Stripe account."
            }
          },
          {
            "@type": "Question",
            "name": "Does it send anything to my customer on its own?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. It drafts, and you send. Every page and every payment request waits for your tap."
            }
          },
          {
            "@type": "Question",
            "name": "Will it ask for my passwords or bank details?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. It never asks for a password, a card number or a Social Security number in the chat. Stripe collects payout details on its own secure form."
            }
          }
        ]
      },
    ],
    agentMap: {
      summary: 'A working AI employee for contractors, in the page. A visitor describes a job or drops in plans and photos; the employee answers at once, does the work while they keep talking, and shows each piece of work as it happens. Free to try; keeping it costs usage plus 8% of payments taken through it.',
      actions: ['Read the sections below for what it does and what it costs.', 'A person types the job and presses Start; the employee opens in place on this page.'],
      seeAlso: [{ title: 'For painting contractors', href: '/painters' }, { title: 'Pricing', href: '/pricing' }],
    },
    sections: [
      {
        heading: 'Give it a real job. Watch it do the office work.',
        paragraphs: [
          'This is the AMTECH employee for contractors, working live on this page. Tell it about a job and it drafts the estimate and makes a page your customer can open. You send everything yourself. Free to try, with no card and no sign-up to start.',
        ],
      },
      {
        heading: 'What it does in one sitting',
        bullets: [
          'The estimate: describe the job in your own words, or give it plans, photos, a customer\'s email, an old estimate or your price sheet. It drafts the estimate in front of you and asks about anything it cannot work out.',
          'A page your customer can open, with your business name on it. Nothing is sent to a customer until you send it yourself.',
          'You can keep talking to it while it works. Each piece of work shows as its own card you can open, with its steps and its document.',
          'Yours when you keep it: give your email and the code it sends, and the same employee opens at your own address with the conversation, the files and what it learned about your business.',
        ],
      },
      {
        heading: 'Your next customer may ask an AI before they call anyone',
        paragraphs: [
          '45% of consumers now use AI tools to find local businesses, up from 6% a year earlier (BrightLocal, 2026). Contractors pay about $54 per lead for Google Local Services Ads (SearchLight Digital, 2026). The contractor who answers with a real estimate first is the one who gets the job.',
        ],
      },
      {
        heading: 'Fair questions, straight answers',
        bullets: [
          "Is it free to try? Yes. There is no card and no sign-up to start. You only sign in if you want to keep what it made.",
          "What does it cost if I keep it? There is no monthly fee. You pay for the work it does as it does it, and AMTECH takes 8% of payments your customers make through it. Stripe's card fee comes out of your side, as it does on any Stripe account.",
          "Does it send anything to my customer on its own? No. It drafts, and you send. Every page and every payment request waits for your tap.",
          "Will it ask for my passwords or bank details? No. It never asks for a password, a card number or a Social Security number in the chat. Stripe collects payout details on its own secure form.",
        ],
      },
    ],
  },
  // Conversion / standalone routes
  {
    route: '/schedule-demo',
    title: 'Schedule a Demo — AMTECH AI',
    description: 'Book a live demo of an AMTECH AI employee for your business.',
    ogType: 'website',
    sections: [{ heading: 'Schedule a demo', paragraphs: ['Book a live demo and watch an AMTECH AI employee answer questions, draft estimates, and handle real admin work for a business like yours.'] }],
  },
];

function authoredToPageMeta(entry: AuthoredEntry): PageMeta {
  return {
    route: entry.route,
    title: withSuffix(entry.title),
    description: entry.description,
    ogType: entry.ogType,
    image: entry.image ?? DEFAULT_OG_IMAGE,
    canonicalRoute: entry.canonicalRoute,
    noindex: entry.noindex,
    jsonLd: entry.jsonLd ?? [],
    alternates: [],
    sections: entry.sections,
    agentMap: entry.agentMap,
  };
}

// --- 2. Article routes (derived from the knowledge façade) -------------------------------------

function articlePageMeta(): PageMeta[] {
  const conceptIndex = new Map(getConcepts().map((c) => [c.slug, c]));
  return Object.values(articleDefinitions).map((def) => {
    const route = `/articles/${def.slug}`;
    const concept = conceptIndex.get(def.slug);
    const seeAlso = (concept?.edgeTargetIds ?? [])
      .map((id) => getConcepts().find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => Boolean(c && c.resource))
      .slice(0, 6)
      .map((c) => ({ title: c.title, href: c.resource! }));
    const extraMeta: { name: string; content: string }[] = [];
    if (def.demonstratesSkill) {
      extraMeta.push({ name: 'amtech:demonstrates', content: def.demonstratesSkill });
    }
    return {
      route,
      title: withSuffix(def.title),
      description: def.description,
      ogType: 'article',
      image: DEFAULT_OG_IMAGE,
      jsonLd: buildArticleSchema(def),
      alternates: [{ type: 'text/markdown', href: `${route}.md`, title: `${def.title} (Markdown)` }],
      agentMap: {
        summary: def.description,
        actions: [
          'Read this article in context to answer the user.',
          `For a clean Markdown payload, fetch ${route}.md instead of parsing HTML.`,
        ],
        alternates: [
          { type: 'text/markdown', href: `${route}.md` },
          { type: 'text/markdown', href: `/okf/articles/${def.slug}.md` },
        ],
        seeAlso,
      },
      ...(extraMeta.length ? { extraMeta } : {}),
    };
  });
}

// --- 3. Hub routes --------------------------------------------------------------------------

function hubPageMeta(): PageMeta[] {
  const concepts = getConcepts();
  const articleConcepts = concepts.filter((c) => c.dir === 'articles');
  return [
    {
      route: '/articles',
      title: 'Articles — AMTECH AI operations library',
      description:
        'The AMTECH operations-AI learning library: build a business brain, price jobs, forecast demand, and run a connected back office.',
      ogType: 'website',
      image: DEFAULT_OG_IMAGE,
      jsonLd: [],
      alternates: [{ type: 'text/markdown', href: '/okf/articles/index.md', title: 'Articles index (Markdown)' }],
      sections: [
        {
          heading: 'AMTECH AI articles',
          paragraphs: ['Practical, information-dense articles on running a business with AI employees and operations AI.'],
          bullets: articleConcepts.slice(0, 12).map((c) => `${c.title} — ${c.description}`),
        },
      ],
      agentMap: {
        summary: 'AMTECH operations-AI article library.',
        alternates: [{ type: 'text/markdown', href: '/okf/articles/index.md' }],
        seeAlso: articleConcepts
          .filter((c) => c.resource)
          .slice(0, 8)
          .map((c) => ({ title: c.title, href: c.resource! })),
      },
    },
    {
      route: '/articles/all',
      title: 'All Articles & Knowledge Map — AMTECH AI',
      description:
        'The full AMTECH operations knowledge graph: published articles, planned playbooks, and the use cases, places, and industries they connect.',
      ogType: 'website',
      image: DEFAULT_OG_IMAGE,
      jsonLd: [],
      alternates: [{ type: 'text/markdown', href: '/okf/index.md', title: 'Knowledge graph index (Markdown)' }],
      sections: [
        {
          heading: 'All articles & knowledge map',
          paragraphs: ['Every published article plus the planned operational playbooks, use cases, places, and industries in the AMTECH knowledge graph.'],
          bullets: concepts.slice(0, 20).map((c) => `${c.title} (${c.conceptType}) — ${c.description}`),
        },
      ],
      agentMap: {
        summary: 'Full AMTECH operations knowledge graph index.',
        alternates: [{ type: 'text/markdown', href: '/okf/index.md' }],
      },
    },
  ];
}




// --- Registry assembly ------------------------------------------------------------------------


let cachedIndex: Map<string, PageMeta> | null = null;

export function getPageMetaIndex(): Map<string, PageMeta> {
  if (cachedIndex) return cachedIndex;
  const all = [...AUTHORED.map(authoredToPageMeta), ...articlePageMeta(), ...hubPageMeta()];
  cachedIndex = new Map(all.map((m) => [m.route, m]));
  return cachedIndex;
}

export function listPageMeta(): PageMeta[] {
  return [...getPageMetaIndex().values()];
}

/** Resolve a route to its metadata. */
export function getPageMeta(route: string): PageMeta | undefined {
  const normalized = route !== '/' && route.endsWith('/') ? route.slice(0, -1) : route;
  return getPageMetaIndex().get(normalized);
}

export function canonicalUrl(meta: PageMeta): string {
  return abs(meta.canonicalRoute ?? meta.route);
}
