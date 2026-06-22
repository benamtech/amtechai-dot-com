import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams } from 'react-router-dom';
import { renderCertificateContentHtml, certificateEntryFor } from '../lib/skills/renderCertificateContent';
import RecomputeWidget from '../components/skills/RecomputeWidget';

/**
 * Renders a single certificate detail body from the generated certificate registry via the shared React-free
 * renderer — the exact same HTML the prerenderer bakes per certificate id. The live recompute widget is
 * portaled into the [data-recompute-widget] mount and verifies the underlying skill (cert is per-skill today).
 * Page <head> is owned by SeoManager + the meta registry.
 */
export default function Certificate() {
  const { id = '' } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const entry = certificateEntryFor(id);

  useEffect(() => {
    setMount(containerRef.current?.querySelector<HTMLElement>('[data-recompute-widget]') ?? null);
  }, [id]);

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: renderCertificateContentHtml(id) }} />
      {mount && entry && createPortal(<RecomputeWidget slug={entry.slug} />, mount)}
    </div>
  );
}
