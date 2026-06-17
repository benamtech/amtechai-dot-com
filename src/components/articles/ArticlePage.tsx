import { Link } from 'react-router-dom';
import { ArticleContentBlock, ArticleDefinition, buildArticleSchema } from '../../lib/articles';

type ArticlePageProps = {
  article: ArticleDefinition;
};

const toneClasses = {
  default: 'border-black/10 bg-white text-black',
  warning: 'border-amber-300/60 bg-amber-50 text-amber-950',
  success: 'border-emerald-300/60 bg-emerald-50 text-emerald-950',
};

function ArticleJsonLd({ article }: ArticlePageProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleSchema(article)) }}
    />
  );
}

function BlockRenderer({ block }: { block: ArticleContentBlock }) {
  if (block.type === 'answer') {
    return (
      <section className="rounded-[2rem] border border-black/10 bg-black p-7 text-white shadow-2xl shadow-black/10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/50">Direct answer</p>
        <p className="mt-4 text-xl leading-relaxed md:text-2xl">{block.body}</p>
      </section>
    );
  }

  if (block.type === 'section') {
    return (
      <section id={block.id} className="scroll-mt-28">
        {block.eyebrow && <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/35">{block.eyebrow}</p>}
        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-black md:text-5xl">{block.title}</h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-black/70">
          {block.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    );
  }

  if (block.type === 'table') {
    return (
      <section id={block.id} className="scroll-mt-28 overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-xl shadow-black/[0.04]">
        <div className="border-b border-black/10 p-6">
          <h2 className="font-display text-2xl font-black tracking-tight text-black">{block.title}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="bg-black/[0.03] text-xs uppercase tracking-[0.2em] text-black/45">
              <tr>{block.columns.map((column) => <th key={column} className="px-6 py-4 font-bold">{column}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-black/10 text-sm leading-relaxed text-black/70">
              {block.rows.map((row) => (
                <tr key={row.join('-')}>{row.map((cell) => <td key={cell} className="px-6 py-5 align-top">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (block.type === 'callout') {
    return (
      <aside className={`rounded-[1.5rem] border p-6 ${toneClasses[block.tone ?? 'default']}`}>
        <h3 className="font-display text-xl font-black tracking-tight">{block.title}</h3>
        <p className="mt-3 leading-relaxed opacity-75">{block.body}</p>
      </aside>
    );
  }

  return (
    <section id={block.id} className="rounded-[2rem] border border-black/10 bg-black/[0.03] p-7">
      <h2 className="font-display text-2xl font-black tracking-tight text-black">{block.title}</h2>
      <ul className="mt-5 space-y-3 text-black/70">
        {block.items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-black" />{item}</li>)}
      </ul>
    </section>
  );
}

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <article className="bg-[#f6f3ee] text-black">
      <ArticleJsonLd article={article} />
      <header className="border-b border-black/10 px-5 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.2em] text-black/45">
            <span>{article.category.replace('-', ' ')}</span>
            <span>•</span>
            <span>{article.readingTime}</span>
            <span>•</span>
            <time dateTime={article.dateModified}>Updated {article.dateModified}</time>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-black/65 md:text-2xl">{article.dek}</p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-black/35">For {article.audience}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_280px] md:px-10">
        <div className="space-y-12">
          {article.blocks.map((block, index) => <BlockRenderer key={`${block.type}-${index}`} block={block} />)}

          {article.faqs.length > 0 && (
            <section className="rounded-[2rem] border border-black/10 bg-white p-7">
              <h2 className="font-display text-3xl font-black tracking-tight">FAQ</h2>
              <div className="mt-6 divide-y divide-black/10">
                {article.faqs.map((faq) => (
                  <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                    <h3 className="font-bold text-black">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-black/65">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {article.citations.length > 0 && (
            <section className="border-t border-black/10 pt-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-black/35">External research cited</h2>
              <ol className="mt-5 space-y-3 text-sm text-black/65">
                {article.citations.map((citation) => (
                  <li key={citation.url}>
                    <a className="font-bold text-black underline decoration-black/20 underline-offset-4 hover:decoration-black" href={citation.url} target="_blank" rel="noreferrer">
                      {citation.label}
                    </a>
                    {citation.publisher ? <span> — {citation.publisher}</span> : null}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="space-y-6 md:sticky md:top-24 md:self-start">
          <div className="rounded-[1.5rem] border border-black/10 bg-white p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-black/35">Entity focus</h2>
            <p className="mt-3 font-display text-2xl font-black">{article.primaryEntity.name}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.entities.map((entity) => <span key={`${entity.type}-${entity.name}`} className="rounded-full bg-black/[0.06] px-3 py-1 text-xs font-bold text-black/55">{entity.name}</span>)}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-black p-5 text-white">
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">Related next steps</h2>
            <div className="mt-4 space-y-4">
              {article.internalLinks.map((link) => (
                <Link key={link.href} to={link.href} className="block rounded-2xl border border-white/10 p-4 transition hover:bg-white/10">
                  <span className="font-bold">{link.label}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-white/55">{link.reason}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
