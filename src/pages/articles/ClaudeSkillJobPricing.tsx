import ArticlePage from '../../components/articles/ArticlePage';
import { useArticleHead } from '../../components/articles/useArticleHead';
import { article } from '../../lib/knowledge/articles/build-claude-skill-job-pricing';

export default function ClaudeSkillJobPricing() {
  useArticleHead(article);
  return <ArticlePage article={article} />;
}
