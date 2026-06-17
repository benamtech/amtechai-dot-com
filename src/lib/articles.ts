export type ArticleContentBlock =
  | { type: 'prompt'; id: string; title: string; body: string; helper?: string }
  | { type: 'answer'; body: string }
  | { type: 'section'; id: string; eyebrow?: string; title: string; body: string[] }
  | { type: 'table'; id: string; title: string; columns: string[]; rows: string[][] }
  | { type: 'callout'; title: string; body: string; tone?: 'default' | 'warning' | 'success' }
  | { type: 'checklist'; id: string; title: string; items: string[] };

export type ArticleLink = {
  label: string;
  href: string;
  reason: string;
};

export type ArticleCitation = {
  label: string;
  url: string;
  publisher?: string;
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleEntity = {
  name: string;
  type: 'business' | 'service' | 'problem' | 'industry' | 'place' | 'method' | 'customer' | 'tool' | 'outcome';
  sameAs?: string[];
};

export type ArticleDefinition = {
  slug: string;
  title: string;
  description: string;
  dek: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  readingTime: string;
  category: 'first-action' | 'local-condition' | 'material-surface' | 'compliance' | 'comparison' | 'field-note' | 'strategy';
  audience: string;
  primaryEntity: ArticleEntity;
  entities: ArticleEntity[];
  internalLinks: ArticleLink[];
  citations: ArticleCitation[];
  faqs: ArticleFaq[];
  blocks: ArticleContentBlock[];
};

export const AMTECH_ORGANIZATION_SCHEMA = {
  '@type': 'Organization',
  '@id': 'https://amtechai.com/#organization',
  name: 'AMTECH AI',
  url: 'https://amtechai.com',
};

export function buildArticleSchema(article: ArticleDefinition) {
  const url = `https://amtechai.com/articles/${article.slug}`;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${url}#article`,
      headline: article.title,
      description: article.description,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: {
        '@type': 'Person',
        name: article.authorName,
      },
      publisher: AMTECH_ORGANIZATION_SCHEMA,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      about: [article.primaryEntity, ...article.entities].map((entity) => ({
        '@type': 'Thing',
        name: entity.name,
        additionalType: entity.type,
        ...(entity.sameAs ? { sameAs: entity.sameAs } : {}),
      })),
      citation: article.citations.map((citation) => citation.url),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://amtechai.com/' },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://amtechai.com/articles' },
        { '@type': 'ListItem', position: 3, name: article.title, item: url },
      ],
    },
    ...(article.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: article.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];
}
