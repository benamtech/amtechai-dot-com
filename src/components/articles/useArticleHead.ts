import { useEffect } from 'react';
import { ArticleDefinition } from '../../lib/articles';

const DEFAULT_TITLE = 'AMTECH. — Your Next Employee Is a Computer';

/**
 * Sets the document title and meta description for an article page while it is mounted,
 * restoring the defaults on unmount. The prerendered static HTML already ships the correct
 * <head> for crawlers (see scripts/okf/prerender.ts); this keeps the client-side title in
 * sync during SPA navigation between routes.
 */
export function useArticleHead(article: ArticleDefinition) {
  useEffect(() => {
    document.title = `${article.title} | AMTECH AI`;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute('content', article.description);

    return () => {
      document.title = DEFAULT_TITLE;
      if (previousDescription) meta?.setAttribute('content', previousDescription);
    };
  }, [article.title, article.description]);
}
