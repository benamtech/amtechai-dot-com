import type { ArticleDefinition } from '../../articles';
import { article as businessBrainFree } from './business-brain-free.ts';
import { article as localSeoPlan } from './build-local-seo-plan-with-chatgpt.ts';
import { article as gardenCenterBuyPlan } from './garden-center-spring-buy-plan-ai.ts';
import { article as amtechVsChatgpt } from './amtech-vs-chatgpt-claude.ts';
import { article as claudeSkillPricing } from './build-claude-skill-job-pricing.ts';
import { article as okfAiReadableKnowledge } from './what-is-okf-ai-readable-knowledge.ts';
import { articles as estimatePrompts } from './estimate-prompts.ts';

/**
 * Every published article's full ArticleDefinition, keyed by slug. React-free so build
 * tooling (OKF emitter, prerenderer, DB seed) can import it. This is the consolidated content
 * model the React pages, the bundle, and (in Phase 3) the database all project from.
 */
export const articleDefinitions: Record<string, ArticleDefinition> = {
  [businessBrainFree.slug]: businessBrainFree,
  [localSeoPlan.slug]: localSeoPlan,
  [gardenCenterBuyPlan.slug]: gardenCenterBuyPlan,
  [amtechVsChatgpt.slug]: amtechVsChatgpt,
  [claudeSkillPricing.slug]: claudeSkillPricing,
  [okfAiReadableKnowledge.slug]: okfAiReadableKnowledge,
  ...estimatePrompts,
};

export function getArticleDefinition(slug: string): ArticleDefinition | undefined {
  return articleDefinitions[slug];
}
