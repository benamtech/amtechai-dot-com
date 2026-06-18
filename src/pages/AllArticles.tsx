import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, MapPin, RadioTower, Sparkles } from 'lucide-react';
import { articleKnowledgeGraphNodes, articleTopicGroups, getNodesByIds } from '../lib/articleKnowledgeGraph';

const nodeTypeOrder = ['EXISTING', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];
const nodesByType = nodeTypeOrder.map((type) => ({
  type,
  label: articleKnowledgeGraphNodes.find((node) => node.type === type)?.typeLabel ?? type,
  nodes: articleKnowledgeGraphNodes.filter((node) => node.type === type),
}));

function ArticleCard({ node, compact = false }: { node: (typeof articleKnowledgeGraphNodes)[number]; compact?: boolean }) {
  const isPublished = node.status === 'published';
  const className = `group block border-2 border-black bg-white p-5 shadow-[6px_6px_0_#000] transition ${isPublished ? 'hover:-translate-y-1 hover:shadow-[9px_9px_0_#e11d2a]' : 'opacity-95'}`;
  const content = (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        <span className={`${isPublished ? 'bg-red text-white' : 'bg-black text-white'} px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em]`}>{isPublished ? 'Published' : 'Planned'}</span>
        <span className="border border-black/20 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-black/54">{node.uc}</span>
        {node.city && <span className="border border-black/20 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-black/54">{node.city}</span>}
      </div>
      <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-black leading-[0.98] tracking-[-0.045em]`}>{node.title}</h3>
      <p className="mt-4 text-sm leading-6 text-black/62">{node.mechanism}</p>
      <div className="mt-6 flex items-center justify-between gap-4 text-xs font-black uppercase tracking-[0.15em] text-black/45">
        <span>{node.subtype || node.topic}</span>
        {isPublished ? <ArrowRight className="text-red transition group-hover:translate-x-1" size={16} /> : <span>Graph node</span>}
      </div>
    </>
  );

  return isPublished ? <Link to={node.href} className={className}>{content}</Link> : <article className={className}>{content}</article>;
}

export default function AllArticles() {
  return (
    <main className="bg-[#f4f4f4] text-black">
      <section className="relative overflow-hidden border-b-4 border-black bg-white pt-32 pb-14 md:pt-44 md:pb-20">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_78%_18%,rgba(225,29,42,0.18),transparent_30%),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:auto,44px_44px,44px_44px]" />
        <div className="container-wide relative">
          <div className="max-w-5xl">
            <h1 className="text-[clamp(3.1rem,8.5vw,8rem)] font-black leading-[0.88] tracking-[-0.08em]">All articles and planned nodes<span className="text-red">.</span></h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-black/68 md:text-xl">A mobile-first human index for AMTECH's operational AI article system: existing published guides, the new 40-node SEO knowledge graph, and the topic shelves that connect them.</p>
          </div>
        </div>
      </section>

      <section className="border-b-4 border-black bg-black py-16 text-white md:py-24">
        <div className="container-wide">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <Sparkles className="mb-6 h-7 w-7 text-red" />
              <h2 className="text-[clamp(2.2rem,5vw,4.7rem)] font-black leading-[0.94] tracking-[-0.06em]">Browse by topic.</h2>
            </div>
            <BookOpen className="hidden h-8 w-8 text-red sm:block" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {articleTopicGroups.map((group) => (
              <section key={group.title} className="border border-white/18 bg-white/[0.03] p-5">
                <h3 className="text-2xl font-black tracking-[-0.04em]">{group.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/62">{group.description}</p>
                <div className="mt-6 grid gap-3">
                  {getNodesByIds(group.nodeIds).slice(0, 5).map((node) => (
                    node.status === 'published' ? (
                      <Link key={node.id} to={node.href} className="flex items-start justify-between gap-4 border border-white/10 bg-black/25 p-4 text-sm font-bold leading-5 transition hover:border-red">
                        <span>{node.title}</span><ArrowRight className="mt-1 shrink-0 text-red" size={15} />
                      </Link>
                    ) : (
                      <div key={node.id} className="border border-white/10 bg-black/25 p-4 text-sm font-bold leading-5 text-white/72">{node.title}</div>
                    )
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-wide space-y-14">
          {nodesByType.map((group) => (
            <section key={group.type}>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-red"><RadioTower size={14} /> {group.type}</div>
                  <h2 className="text-3xl font-black tracking-[-0.05em] md:text-5xl">{group.label}</h2>
                </div>
                <span className="text-sm font-black uppercase tracking-[0.16em] text-black/42">{group.nodes.length} nodes</span>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.nodes.map((node) => <ArticleCard key={node.id} node={node} />)}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="bg-red py-16 text-white md:py-20">
        <div className="container-wide grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <MapPin className="mb-6 h-7 w-7" />
            <h2 className="text-4xl font-black leading-none tracking-[-0.06em] md:text-6xl">Use the graph like a map.</h2>
          </div>
          <p className="text-lg leading-8 text-white/82">Published articles are clickable now. Planned nodes are title-and-brief cards only, so the system can guide future writing without pretending those pages exist yet.</p>
        </div>
      </section>
    </main>
  );
}
