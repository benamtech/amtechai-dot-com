import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { renderSkillContentHtml } from '../lib/skills/renderSkillContent';
import RecomputeWidget from '../components/skills/RecomputeWidget';

/**
 * Renders the skill detail body from the skill data model via the shared React-free renderer —
 * the exact same HTML the prerenderer bakes into the static page. Page <head> (title, description,
 * canonical, OG, JSON-LD, agent-map) is owned by SeoManager + the meta registry, not here.
 *
 * The one interactive piece is the live recompute widget: renderSkillContent emits an empty mount
 * (`[data-recompute-widget]`) in the "Source & verification" section, and we portal RecomputeWidget
 * into it after the static HTML lands. The static badge stays meaningful without JS; this hydrates on top.
 */
export default function SkillDetail() {
  const { slug = '' } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMount(containerRef.current?.querySelector<HTMLElement>('[data-recompute-widget]') ?? null);
  }, [slug]);

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: renderSkillContentHtml(slug) }} />
      {mount && createPortal(<RecomputeWidget slug={slug} />, mount)}
    </div>
  );
}
