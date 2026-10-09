import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import SeoManager from './components/seo/SeoManager';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Painters from './pages/Painters';
import Contractors from './pages/Contractors';
import ScheduleDemo from './pages/ScheduleDemo';
import Articles from './pages/Articles';
import AllArticles from './pages/AllArticles';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import SmsProgram from './pages/SmsProgram';
import { ChatGPTEstimateArticle, PaintingCostAIArticle, PressureWashingEstimateArticle } from './pages/AIEstimateArticles';
import AmtechVsChatgptClaude from './pages/articles/AmtechVsChatgptClaude';
import ClaudeSkillJobPricing from './pages/articles/ClaudeSkillJobPricing';
import LocalSeoKnowledgeGraphPlan from './pages/articles/LocalSeoKnowledgeGraphPlan';
import BusinessBrainFree from './pages/articles/BusinessBrainFree';
import SalisburyRetailSalesDataAI from './pages/articles/SalisburyRetailSalesDataAI';
import OkfAiReadableKnowledge from './pages/articles/OkfAiReadableKnowledge';
import WhatAgentsSeeWebsite from './pages/articles/WhatAgentsSeeWebsite';
import JapanSovereignAiSmallBusiness from './pages/articles/JapanSovereignAiSmallBusiness';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoManager />
      <Routes>
        <Route path="/schedule-demo" element={<ScheduleDemo />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/painters" element={<Painters />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/all" element={<AllArticles />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sms" element={<SmsProgram />} />
          <Route path="/articles/write-pressure-washing-estimate-with-ai" element={<PressureWashingEstimateArticle />} />
          <Route path="/articles/estimate-painting-cost-ai" element={<PaintingCostAIArticle />} />
          <Route path="/articles/create-estimate-with-chatgpt" element={<ChatGPTEstimateArticle />} />
          <Route path="/articles/amtech-vs-chatgpt-claude" element={<AmtechVsChatgptClaude />} />
          <Route path="/articles/build-claude-skill-job-pricing" element={<ClaudeSkillJobPricing />} />
          <Route path="/articles/build-local-seo-plan-with-chatgpt" element={<LocalSeoKnowledgeGraphPlan />} />
          <Route path="/articles/business-brain-free" element={<BusinessBrainFree />} />
          <Route path="/articles/garden-center-spring-buy-plan-ai" element={<SalisburyRetailSalesDataAI />} />
          <Route path="/articles/what-is-okf-ai-readable-knowledge" element={<OkfAiReadableKnowledge />} />
          <Route path="/articles/what-ai-agents-see-when-they-read-your-website" element={<WhatAgentsSeeWebsite />} />
          <Route path="/articles/what-japan-sovereign-ai-means-for-american-small-business" element={<JapanSovereignAiSmallBusiness />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
