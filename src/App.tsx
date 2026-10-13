import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import ServerPage from './components/ServerPage';
import SeoManager from './components/seo/SeoManager';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SeoManager />
      <Routes>
        <Route path="/schedule-demo" element={<ServerPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<ServerPage />} />
          <Route path="/how-it-works" element={<ServerPage />} />
          <Route path="/about" element={<ServerPage />} />
          <Route path="/pricing" element={<ServerPage />} />
          <Route path="/painters" element={<ServerPage />} />
          <Route path="/contractors" element={<ServerPage />} />
          <Route path="/articles" element={<ServerPage />} />
          <Route path="/articles/all" element={<ServerPage />} />
          <Route path="/privacy" element={<ServerPage />} />
          <Route path="/terms" element={<ServerPage />} />
          <Route path="/sms" element={<ServerPage />} />
          <Route path="/articles/write-pressure-washing-estimate-with-ai" element={<ServerPage />} />
          <Route path="/articles/estimate-painting-cost-ai" element={<ServerPage />} />
          <Route path="/articles/create-estimate-with-chatgpt" element={<ServerPage />} />
          <Route path="/articles/amtech-vs-chatgpt-claude" element={<ServerPage />} />
          <Route path="/articles/build-claude-skill-job-pricing" element={<ServerPage />} />
          <Route path="/articles/build-local-seo-plan-with-chatgpt" element={<ServerPage />} />
          <Route path="/articles/business-brain-free" element={<ServerPage />} />
          <Route path="/articles/garden-center-spring-buy-plan-ai" element={<ServerPage />} />
          <Route path="/articles/what-is-okf-ai-readable-knowledge" element={<ServerPage />} />
          <Route path="/articles/what-ai-agents-see-when-they-read-your-website" element={<ServerPage />} />
          <Route path="/articles/what-japan-sovereign-ai-means-for-american-small-business" element={<ServerPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
