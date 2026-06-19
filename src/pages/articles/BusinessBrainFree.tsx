import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/business-brain-free';

export default function BusinessBrainFree() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
