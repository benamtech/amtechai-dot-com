import HeroSection from '../components/home/HeroSection';
import ProblemSection from '../components/home/ProblemSection';
import WhatWeBuildSection from '../components/home/WhatWeBuildSection';
import StagesSection from '../components/home/StagesSection';
import AIEmployeesSection from '../components/home/AIEmployeesSection';
import UseCasesSection from '../components/home/UseCasesSection';
import PartnershipSection from '../components/home/PartnershipSection';
import ForNotForSection from '../components/home/ForNotForSection';
import OfferPathsSection from '../components/home/OfferPathsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <WhatWeBuildSection />
      <StagesSection />
      <AIEmployeesSection />
      <UseCasesSection />
      <PartnershipSection />
      <ForNotForSection />
      <OfferPathsSection />
    </>
  );
}
