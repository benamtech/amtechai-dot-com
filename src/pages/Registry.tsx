import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { renderRegistryContentHtml } from '../lib/skills/renderRegistryContent';
import RegistryVerifyWidget from '../components/skills/RegistryVerifyWidget';

/**
 * Renders the /registry body from the skills registry + transparency log via the shared React-free renderer —
 * the exact same HTML the prerenderer bakes into the static page (crawlers/agents/users see the full
 * materialization). The one interactive piece is the live verification widget: renderRegistryContent emits an
 * empty mount (#registry-verify-widget) and we portal RegistryVerifyWidget into it after the static HTML lands.
 * Page <head> is owned by SeoManager + the meta registry, not here.
 */
export default function Registry() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMount(containerRef.current?.querySelector<HTMLElement>('#registry-verify-widget') ?? null);
  }, []);

  return (
    <div ref={containerRef}>
      <div dangerouslySetInnerHTML={{ __html: renderRegistryContentHtml() }} />
      {mount && createPortal(<RegistryVerifyWidget />, mount)}
    </div>
  );
}
