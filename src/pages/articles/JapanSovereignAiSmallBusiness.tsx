import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/what-japan-sovereign-ai-means-for-american-small-business';

export default function JapanSovereignAiSmallBusiness() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
