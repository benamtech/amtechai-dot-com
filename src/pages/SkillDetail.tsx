import { useParams } from 'react-router-dom';
import { renderSkillContentHtml } from '../lib/skills/renderSkillContent';

/**
 * Renders the skill detail body from the skill data model via the shared React-free renderer —
 * the exact same HTML the prerenderer bakes into the static page. Page <head> (title, description,
 * canonical, OG, JSON-LD, agent-map) is owned by SeoManager + the meta registry, not here.
 */
export default function SkillDetail() {
  const { slug = '' } = useParams();
  return <div dangerouslySetInnerHTML={{ __html: renderSkillContentHtml(slug) }} />;
}
