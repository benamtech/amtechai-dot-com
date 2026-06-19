import { ArticleDefinition } from '../../lib/articles';

/**
 * DEPRECATED — kept only so existing article pages keep compiling.
 *
 * Page <head> (title, description, canonical, Open Graph, Twitter, JSON-LD, agent-map) is now owned
 * by the single runtime authority, src/components/seo/SeoManager.tsx, which reads the same registry
 * (src/lib/seo/pageMeta.ts) the prerenderer uses. This hook is intentionally a no-op to avoid two
 * writers racing over document.title during SPA navigation. Remove the call sites opportunistically.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useArticleHead(_article: ArticleDefinition) {
  // no-op: SeoManager owns the document head.
}
