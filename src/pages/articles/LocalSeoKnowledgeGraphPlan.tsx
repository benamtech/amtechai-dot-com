import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/build-local-seo-plan-with-chatgpt';

export default function LocalSeoKnowledgeGraphPlan() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
