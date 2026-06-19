import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/amtech-vs-chatgpt-claude';

export default function AmtechVsChatgptClaude() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
