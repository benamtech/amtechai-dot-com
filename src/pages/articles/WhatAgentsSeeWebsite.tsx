import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/what-ai-agents-see-when-they-read-your-website';

export default function WhatAgentsSeeWebsite() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
