import ArticlePage from '../components/articles/ArticlePage';
import { useArticleHead } from '../components/articles/useArticleHead';
import { articles } from '../lib/knowledge/articles/estimate-prompts';

export function PressureWashingEstimateArticle() {
  const article = articles['write-pressure-washing-estimate-with-ai'];
  useArticleHead(article);
  return <ArticlePage article={article} />;
}

export function PaintingCostAIArticle() {
  const article = articles['estimate-painting-cost-ai'];
  useArticleHead(article);
  return <ArticlePage article={article} />;
}

export function ChatGPTEstimateArticle() {
  const article = articles['create-estimate-with-chatgpt'];
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
