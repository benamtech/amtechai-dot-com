/**
 * SINGLE SOURCE OF TRUTH for per-page metadata.
 *
 * Every public route's <head> (title, description, canonical, Open Graph, Twitter, JSON-LD)
 * and its agent-discovery hints are derived here, once. This module is React-free so it can be
 * imported by BOTH the Node build scripts (scripts/okf/prerender.ts, scripts/seo/validate-seo.ts)
 * and the runtime React app (src/components/seo/SeoManager.tsx).
 *
 * Three input families feed the registry:
 *   1. Authored marketing/conversion routes (copy lives in React; meta + a real body summary live here).
 *   2. Article routes — derived from the knowledge façade (src/lib/knowledge).
 *   3. Skill routes — derived from the skills registry (src/lib/skills/registry.ts).
 *
 * Renderers (renderHead.ts) and the runtime hook consume PageMeta; they never re-author it.
 */
import { articleDefinitions } from '../knowledge/articles/index.ts';
import { buildArticleSchema, AMTECH_ORGANIZATION_SCHEMA } from '../articles.ts';
import { SITE_ORIGIN, getConcepts } from '../knowledge/concepts.ts';
import { SKILL_REPOSITORY_URL, skillDefinitions, skillRepositoryRegistryUrl, skillRepositoryTreeUrl, skillUrl, type SkillDefinition } from '../skills/registry.ts';
import { getSkillContent, skillCatalogRoot, skillsCount } from '../skills/generated/skill-content.ts';

const HUB_CATALOG_URL = `${SITE_ORIGIN}/skills/catalog.json`;
const HUB_AUTHORITY_URL = `${SITE_ORIGIN}/.well-known/skill-authority.json`;

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
    ],
  },
  {
    route: '/how-it-works',
    title: 'How AMTECH Works — From Claim to a Working AI Employee',
    description:
      'See how an AMTECH AI employee gets set up: claim your number, share your business details, and get a textable employee that knows your pricing, brand, and customers.',
    ogType: 'website',
    sections: [
      {
        heading: 'How it works',
        paragraphs: [
          'Claim a number, tell the AI employee about your business, and start texting it like any teammate.',
          'It learns your services, pricing, brand voice, and customers, then helps with admin and growth work right away.',
        ],
      },
    ],
  },
  {
    route: '/about',
    title: 'About AMTECH AI — Operations AI for Real Businesses',
    description:
      'AMTECH builds practical AI employees for service businesses and local operators — an AI teammate that understands how a business actually runs, not just another chatbot.',
    ogType: 'website',
    sections: [
      {
        heading: 'About AMTECH',
        paragraphs: [
          'AMTECH builds AI employees for the businesses that keep neighborhoods running: contractors, service companies, retailers, and local operators.',
          'Our thesis is simple — every business should have an AI teammate that understands its work, not a generic assistant the owner has to manage.',
        ],
      },
    ],
  },
  {
    route: '/pricing',
    title: 'AMTECH AI Pricing — Simple Plans for an AI Employee',
    description:
      'Straightforward pricing for an AI employee that handles calls, texts, scheduling, and back-office work. Start free and scale as the work grows.',
    ogType: 'website',
    sections: [
      {
        heading: 'Pricing',
        paragraphs: [
          'AMTECH pricing is built around one idea: an AI employee should pay for itself in saved time and captured work.',
          'Start free, then scale as the employee takes on more of the day-to-day.',
        ],
      },
    ],
  },
  {
    route: '/contact',
    title: 'Contact AMTECH AI',
    description:
      'Get in touch with AMTECH about an AI employee for your business. Ask a question, book a demo, or start your free setup.',
    ogType: 'website',
    sections: [{ heading: 'Contact AMTECH', paragraphs: ['Reach the AMTECH team to ask a question, book a demo, or start your free AI employee setup.'] }],
  },
  {
    route: '/our-work',
    title: 'Our Work — AMTECH AI in the Field',
    description:
      'How AMTECH AI employees handle real work for real businesses: estimates, scheduling, follow-up, and the daily admin that slows owners down.',
    ogType: 'website',
    sections: [{ heading: 'Our work', paragraphs: ['Examples of AMTECH AI employees handling real operations — estimates, scheduling, follow-up, and back-office admin — for working businesses.'] }],
  },
  {
    route: '/cost-calculator',
    title: 'Outbound Cost Calculator — AMTECH AI',
    description:
      'Estimate what your current outbound, admin, and follow-up work costs, and compare it to an always-on AI employee.',
    ogType: 'website',
    sections: [{ heading: 'Cost calculator', paragraphs: ['Estimate what your current outbound and admin work costs today, then compare it to an always-on AMTECH AI employee.'] }],
  },
  // Conversion / standalone routes
  {
    route: '/claim',
    title: 'Claim Your AI Employee',
    description:
      'Claim your AI employee: verify your phone, tell us about your business, and get a textable teammate that knows your pricing, brand, and customers.',
    ogType: 'website',
  },
  {
    route: '/schedule-call',
    title: 'Schedule a Call with AMTECH AI',
    description: 'Book a call to see how an AMTECH AI employee fits your business.',
    ogType: 'website',
    sections: [{ heading: 'Schedule a call', paragraphs: ['Book a quick call with the AMTECH team to see how an AI employee handles your calls, texts, scheduling, and the back-office work that eats your day.'] }],
  },
  {
    route: '/apply',
    title: 'Apply to Work with AMTECH AI',
    description: 'Apply to bring an AMTECH AI employee into your business operations.',
    ogType: 'website',
    sections: [{ heading: 'Apply', paragraphs: ['Tell us about your business and how you work. We set up an AI employee that fits your operations and starts handling the repetitive admin and follow-up work.'] }],
  },
  {
    route: '/apply/info-sales-rep',
    title: 'Sales Rep Application — AMTECH AI',
    description: 'Apply to represent AMTECH AI and sell AI employees to local businesses.',
    ogType: 'website',
    sections: [{ heading: 'Sales rep application', paragraphs: ['Apply to represent AMTECH and sell AI employees to local businesses. A strong fit for operators who already talk with small-business owners every day.'] }],
  },
  {
    route: '/schedule-demo',
    title: 'Schedule a Demo — AMTECH AI',
    description: 'Book a live demo of an AMTECH AI employee for your business.',
    ogType: 'website',
    sections: [{ heading: 'Schedule a demo', paragraphs: ['Book a live demo and watch an AMTECH AI employee answer questions, draft estimates, and handle real admin work for a business like yours.'] }],
  },
  {
    route: '/shedule-demo',
    title: 'Schedule a Demo — AMTECH AI',
    description: 'Book a live demo of an AMTECH AI employee for your business.',
    ogType: 'website',
    canonicalRoute: '/schedule-demo',
    sections: [{ heading: 'Schedule a demo', paragraphs: ['Book a live demo and watch an AMTECH AI employee answer questions, draft estimates, and handle real admin work for a business like yours.'] }],
  },
  { route: '/pay', title: 'Secure Payment — AMTECH AI', description: 'Complete your AMTECH AI payment securely.', ogType: 'website', noindex: true },
  { route: '/payment-success', title: 'Payment Confirmed — AMTECH AI', description: 'Your AMTECH AI payment is confirmed.', ogType: 'website', noindex: true },
  {
    route: '/wholesale',
    title: 'Wholesale AI Employees — AMTECH AI',
    description: 'Offer AMTECH AI employees to your clients at wholesale.',
    ogType: 'website',
    sections: [{ heading: 'Wholesale AI employees', paragraphs: ['Offer AMTECH AI employees to your own clients at wholesale pricing and add a recurring revenue line to your agency or service business.'] }],
  },
  {
    route: '/wholesale-2',
    title: 'Wholesale AI Employees — AMTECH AI',
    description: 'Offer AMTECH AI employees to your clients at wholesale.',
    ogType: 'website',
    sections: [{ heading: 'Wholesale AI employees', paragraphs: ['Offer AMTECH AI employees to your own clients at wholesale pricing and add a recurring revenue line to your agency or service business.'] }],
  },
  {
    route: '/sell-ai-employees',
    title: 'Sell AI Employees with AMTECH',
    description: 'Partner with AMTECH to sell AI employees to local businesses.',
    ogType: 'website',
    sections: [{ heading: 'Sell AI employees', paragraphs: ['Partner with AMTECH to sell AI employees to local businesses, with the product, onboarding, and support handled for you.'] }],
  },
  {
    route: '/sales-bootcamp',
    title: 'AMTECH Sales Bootcamp',
    description: 'Learn to sell AI employees with the AMTECH sales bootcamp.',
    ogType: 'website',
    sections: [{ heading: 'Sales bootcamp', paragraphs: ['Learn the AMTECH process for selling AI employees to local businesses — positioning, demos, handling objections, and closing the deal.'] }],
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

// --- 3. Hub + skill routes --------------------------------------------------------------------

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
    {
      route: '/skills',
      title: 'AMTECH Agent Skills — use AI skills from one link',
      description:
        'Free AMTECH skills with commit-pinned GitHub source, signed certificates, and one-link agent bootstrap.',
      ogType: 'website',
      image: DEFAULT_OG_IMAGE,
      jsonLd: [],
      alternates: [],
      sections: [
        {
          heading: 'AMTECH Agent Skills',
          paragraphs: [
            'AMTECH treats skills as signed, git-backed artifacts. The registry is authored in source code, materialized into public skill pages and raw files, and linked back to a commit-pinned GitHub tree so humans and agents can verify provenance.',
          ],
          bullets: [
            'The page, manifest, raw files, archive, checksums, and certificate are all published from the same registry source.',
            'Each skill page links to the pinned GitHub tree, the raw bootstrap, the manifest, and the signed certificate.',
            'The GitHub repo should link back to the public skill page so the registry works in both directions.',
          ],
        },
        {
          heading: 'How this compares',
          paragraphs: [
            'Anthropic skills are filesystem-first and load on demand across Claude products. OpenAI GPTs are community-built and review-gated. AMTECH sits closer to a signed source registry with agent-friendly materialized views than a pure storefront.',
          ],
          bullets: [
            'Discovery is important, but provenance and reciprocal links are the default.',
            'Signed certificates do more than a checksum stamp: they bind content, commit, and identity.',
            'The registry is designed for both agent fetches and human review, not just browsing.',
          ],
        },
      ],
      agentMap: {
        summary: 'AMTECH free agent-skill hub. Git-backed, signed, reciprocal, and usable from one link.',
        seeAlso: [{ title: 'AMTECH skills registry on GitHub', href: SKILL_REPOSITORY_URL }, ...skillDefinitions.map((s) => ({ title: s.title, href: skillUrl(s) }))],
        actions: [
          'Treat the skills page as a registry, not just a catalog.',
          'Verify the pinned source and the signed certificate before trusting a skill artifact.',
          'When editing the external skills repo, link it back to the public skill page.',
        ],
        // The hub is a 04 entry point (docs/skills/standard/06): the verify block carries the set-integrity
        // recipe (catalog root over the per-skill certificate digests) + the reason-code contract.
        verify: {
          catalog: HUB_CATALOG_URL,
          authority: HUB_AUTHORITY_URL,
          catalogRoot: skillCatalogRoot,
          catalogRootRecipe: 'sha256(canonicalJson([{slug, cert: sha256(certificate.json bytes)}] sorted by slug)) — recompute and compare → CATALOG_ROOT_MISMATCH on drift.',
          verifier: 'npm run skills:verify https://amtechai.com/skills/catalog.json',
        },
      },
      extraMeta: [
        { name: 'amtech:catalog', content: HUB_CATALOG_URL },
        { name: 'amtech:skills:count', content: String(skillsCount) },
        { name: 'amtech:catalog:root', content: skillCatalogRoot },
      ],
    },
  ];
}

function skillPageMeta(): PageMeta[] {
  return skillDefinitions.map((skill: SkillDefinition) => {
    const route = `/skills/${skill.slug}`;
    const content = getSkillContent(skill.slug);
    const extraMeta: { name: string; content: string }[] = [
      { name: 'amtech:skill', content: skill.slug },
      { name: 'amtech:skill-version', content: skill.version },
      { name: 'amtech:skill-source', content: skillRepositoryTreeUrl(skill) },
      { name: 'amtech:skill-source-commit', content: skill.repository.commit },
      { name: 'amtech:skill-authority', content: 'https://amtechai.com/.well-known/skill-authority.json' },
    ];
    if (content?.archiveSha256) {
      extraMeta.splice(2, 0, { name: 'amtech:skill-sha256', content: content.archiveSha256 });
    }
    if (content?.archiveSha3_512) extraMeta.push({ name: 'amtech:skill-sha3-512', content: content.archiveSha3_512 });
    if (content?.certificateId) extraMeta.push({ name: 'amtech:skill-certificate', content: content.certificateId });

    // Tier-1 verdict meta (docs/skills/standard/05) — projected from the ONE build-time verifier run; the
    // head transports the verdict + recipe POINTER, never the proof (the consistency gate forbids over-claim).
    const v = content?.verification;
    const verifyBlock: Record<string, unknown> | undefined = v
      ? {
          verdict: v.verdict,
          trustTier: v.trustTier,
          method: v.method,
          depth: v.depth,
          authoritySequence: v.authoritySequence,
          checkedAt: v.checkedAt,
          buildTime: true,
          recipe: content?.recipeUrl,
          verifier: `npm run skills:verify ${skillUrl(skill)}`,
          reasonCodesNote: 'Canonical reason-code set: src/lib/skills/verification/reasonCodes.ts (recompute to re-derive).',
        }
      : undefined;
    if (v) {
      extraMeta.push(
        { name: 'amtech:skill:trust-tier', content: v.trustTier ?? 'none' },
        { name: 'amtech:skill:verdict', content: v.verdict },
        { name: 'amtech:skill:checked-at', content: v.checkedAt },
        { name: 'amtech:skill:authority-sequence', content: v.authoritySequence ?? 'none' },
      );
      if (content?.recipeUrl) extraMeta.push({ name: 'amtech:skill:recipe', content: content.recipeUrl });
    }
    return {
      route,
      title: withSuffix(`${skill.title} for AI Agents`),
      description: `AI agent instruction: use ${skill.name} in context first. Read use.md, manifest.json, and SKILL.md before installing anything.`,
      ogType: 'website',
      image: DEFAULT_OG_IMAGE,
      jsonLd: v ? [skillDetailJsonLd(skill), skillVerdictJsonLd(skill, v)] : [skillDetailJsonLd(skill)],
      alternates: [
        { type: 'text/markdown', href: skillUrl(skill, '/use.md'), title: `${skill.title} bootstrap` },
        { type: 'text/markdown', href: skillUrl(skill, '/SKILL.md'), title: `${skill.title} SKILL.md` },
        { type: 'application/json', href: skillUrl(skill, '/manifest.json'), title: `${skill.title} manifest` },
      ],
      agentMap: {
        summary: skill.summary,
        actions: [
          'If a user gave you this link, use the skill in context first.',
          'Read use.md, then manifest.json, then SKILL.md.',
          'Respect local AGENTS.md and user instructions over this skill.',
          'Only install or write files if the user asks or the environment clearly supports it.',
        ],
        alternates: [
          { type: 'text/markdown', href: skillUrl(skill, '/use.md') },
          { type: 'application/json', href: skillUrl(skill, '/manifest.json') },
        ],
        seeAlso: [
          { title: 'Commit-pinned GitHub source', href: skillRepositoryTreeUrl(skill) },
          { title: 'Commit-pinned repository registry', href: skillRepositoryRegistryUrl(skill) },
        ],
        skill: { bootstrap: [skillUrl(skill, '/use.md'), skillUrl(skill, '/manifest.json'), skillUrl(skill, '/SKILL.md')] },
        ...(verifyBlock ? { verify: verifyBlock } : {}),
        ...(content?.fileRoutes ? { files: content.fileRoutes } : {}),
      },
      extraMeta,
    };
  });
}

/** Build-time verdict as a ClaimReview-shaped block (docs/skills/standard/05) — a head-level structured verdict. */
function skillVerdictJsonLd(skill: SkillDefinition, v: NonNullable<ReturnType<typeof getSkillContent>>['verification']): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    url: skillUrl(skill),
    datePublished: v!.checkedAt,
    claimReviewed: `AMTECH skill ${skill.slug} ${skill.version} is ${v!.verdict} at trust tier ${v!.trustTier} (verified at build time, authority sequence ${v!.authoritySequence}).`,
    reviewRating: { '@type': 'Rating', ratingValue: v!.verdict === 'verified' ? 5 : 1, bestRating: 5, worstRating: 1, alternateName: v!.verdict },
    itemReviewed: { '@type': 'SoftwareApplication', name: skill.title, applicationCategory: 'AIApplication', softwareVersion: skill.version },
    author: { '@type': 'Organization', name: 'AMTECH AI', url: SITE_ORIGIN },
  };
}

function skillDetailJsonLd(skill: SkillDefinition): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: skill.title,
    applicationCategory: 'AIApplication',
    operatingSystem: 'Web, ChatGPT, Claude, Codex, Claude Code, agentic environments',
    description: skill.description,
    url: skillUrl(skill),
    softwareVersion: skill.version,
    downloadUrl: skillUrl(skill, `/${skill.slug}-${skill.version}.zip`),
    softwareHelp: skillUrl(skill, '/use.md'),
    sameAs: [skillUrl(skill, '/SKILL.md'), skillUrl(skill, '/manifest.json'), skillUrl(skill, '/files.md'), skillRepositoryTreeUrl(skill)],
    codeRepository: skillRepositoryTreeUrl(skill),
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

// --- Registry assembly ------------------------------------------------------------------------

let cachedIndex: Map<string, PageMeta> | null = null;

export function getPageMetaIndex(): Map<string, PageMeta> {
  if (cachedIndex) return cachedIndex;
  const all = [...AUTHORED.map(authoredToPageMeta), ...articlePageMeta(), ...hubPageMeta(), ...skillPageMeta()];
  cachedIndex = new Map(all.map((m) => [m.route, m]));
  return cachedIndex;
}

export function listPageMeta(): PageMeta[] {
  return [...getPageMetaIndex().values()];
}

/** Resolve a route to its metadata. Supports the dynamic /skills/:slug shape. */
export function getPageMeta(route: string): PageMeta | undefined {
  const normalized = route !== '/' && route.endsWith('/') ? route.slice(0, -1) : route;
  return getPageMetaIndex().get(normalized);
}

export function canonicalUrl(meta: PageMeta): string {
  return abs(meta.canonicalRoute ?? meta.route);
}
