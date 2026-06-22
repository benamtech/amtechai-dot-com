import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import SeoManager from './components/seo/SeoManager';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import OurWork from './pages/OurWork';
import ScheduleDemo from './pages/ScheduleDemo';
import CostCalculator from './pages/CostCalculator';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Wholesale from './pages/Wholesale';
import Wholesale2 from './pages/Wholesale2';
import SellAIEmployees from './pages/SellAIEmployees';
import SalesBootcamp from './pages/SalesBootcamp';
import ScheduleCall from './pages/ScheduleCall';
import AIEmployeeClaim from './pages/AIEmployeeClaim';
import Apply from './pages/Apply';
import SalesRepApply from './pages/SalesRepApply';
import Articles from './pages/Articles';
import AllArticles from './pages/AllArticles';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Registry from './pages/Registry';
import Certificate from './pages/Certificate';
import { ChatGPTEstimateArticle, PaintingCostAIArticle, PressureWashingEstimateArticle } from './pages/AIEstimateArticles';
import AmtechVsChatgptClaude from './pages/articles/AmtechVsChatgptClaude';
import ClaudeSkillJobPricing from './pages/articles/ClaudeSkillJobPricing';
import LocalSeoKnowledgeGraphPlan from './pages/articles/LocalSeoKnowledgeGraphPlan';
import BusinessBrainFree from './pages/articles/BusinessBrainFree';
import SalisburyRetailSalesDataAI from './pages/articles/SalisburyRetailSalesDataAI';
import OkfAiReadableKnowledge from './pages/articles/OkfAiReadableKnowledge';
import WhatAgentsSeeWebsite from './pages/articles/WhatAgentsSeeWebsite';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoManager />
      <Routes>
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/wholesale-2" element={<Wholesale2 />} />
        <Route path="/sell-ai-employees" element={<SellAIEmployees />} />
        <Route path="/sales-bootcamp" element={<SalesBootcamp />} />
        <Route path="/claim" element={<AIEmployeeClaim />} />
        <Route path="/schedule-call" element={<ScheduleCall />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/info-sales-rep" element={<SalesRepApply />} />
        <Route path="/schedule-demo" element={<ScheduleDemo />} />
        <Route path="/shedule-demo" element={<ScheduleDemo />} />
        <Route path="/pay" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/our-work" element={<OurWork />} />
          <Route path="/cost-calculator" element={<CostCalculator />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/all" element={<AllArticles />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/:slug" element={<SkillDetail />} />
          <Route path="/registry" element={<Registry />} />
          <Route path="/certificates/:id" element={<Certificate />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
