import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Onboarding from './pages/Onboarding';
import WebsiteOnboarding from './pages/WebsiteOnboarding';
import OurWork from './pages/OurWork';
import Admin from './pages/Admin';
import ScheduleDemo from './pages/ScheduleDemo';
import CostCalculator from './pages/CostCalculator';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Wholesale from './pages/Wholesale';
import Wholesale2 from './pages/Wholesale2';
import SellAIEmployees from './pages/SellAIEmployees';
import SalesBootcamp from './pages/SalesBootcamp';
import ScheduleCall from './pages/ScheduleCall';
import Apply from './pages/Apply';
import SalesRepApply from './pages/SalesRepApply';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/wholesale" element={<Wholesale />} />
        <Route path="/wholesale-2" element={<Wholesale2 />} />
        <Route path="/sell-ai-employees" element={<SellAIEmployees />} />
        <Route path="/sales-bootcamp" element={<SalesBootcamp />} />
        <Route path="/schedule-call" element={<ScheduleCall />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/info-sales-rep" element={<SalesRepApply />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/website-onboarding" element={<WebsiteOnboarding />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/schedule-demo" element={<ScheduleDemo />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
