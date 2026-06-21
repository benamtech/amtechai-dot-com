import { renderHubContentHtml } from '../lib/skills/renderHubContent';

/**
 * Renders the /skills hub body from the skills registry via the shared React-free renderer — the
 * exact same HTML the prerenderer bakes into the static page. The hub is self-bootstrapping for
 * agents (instruction block + decision tree + enumerated, link-rich skill list + machine catalog).
 * Page <head> (title, description, canonical, OG, JSON-LD, agent-map) is owned by SeoManager + the
 * meta registry, not here.
 */
export default function Skills() {
  return <div dangerouslySetInnerHTML={{ __html: renderHubContentHtml() }} />;
}
