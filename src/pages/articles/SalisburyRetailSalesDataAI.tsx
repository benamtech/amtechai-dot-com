import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/garden-center-spring-buy-plan-ai';

export default function SalisburyRetailSalesDataAI() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
