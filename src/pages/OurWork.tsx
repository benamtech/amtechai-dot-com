import OurWorkHero from '../components/our-work/OurWorkHero';
import OurWorkIntro from '../components/our-work/OurWorkIntro';
import DigitalFoundationSection from '../components/our-work/DigitalFoundationSection';
import AIEmployeesWorkSection from '../components/our-work/AIEmployeesWorkSection';
import AutomationSection from '../components/our-work/AutomationSection';
import OperatorSystemsSection from '../components/our-work/OperatorSystemsSection';
import ExamplesSection from '../components/our-work/ExamplesSection';
import HowWeBuildSection from '../components/our-work/HowWeBuildSection';
import OurWorkFitSection from '../components/our-work/OurWorkFitSection';
import OurWorkCTA from '../components/our-work/OurWorkCTA';

export default function OurWork() {
  return (
    <>
      <OurWorkHero />
      <OurWorkIntro />
      <DigitalFoundationSection />
      <AIEmployeesWorkSection />
      <AutomationSection />
      <OperatorSystemsSection />
      <ExamplesSection />
      <HowWeBuildSection />
      <OurWorkFitSection />
      <OurWorkCTA />
    </>
  );
}
