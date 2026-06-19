import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/what-is-okf-ai-readable-knowledge';

export default function OkfAiReadableKnowledge() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
