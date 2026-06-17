import { Link } from 'react-router-dom';
import { Calculator, ArrowRight } from 'lucide-react';
import PricingHero from '../components/pricing/PricingHero';
import PricingWhatShapesPrice from '../components/pricing/PricingWhatShapesPrice';
import PricingReferencePoints from '../components/pricing/PricingReferencePoints';
import PricingWhatYoureReplacing from '../components/pricing/PricingWhatYoureReplacing';
import PricingCTA from '../components/pricing/PricingCTA';

function CalculatorBanner() {
  return (
    <div className="bg-white border-y border-black/[0.06]">
      <div className="container-narrow py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <Calculator size={20} className="text-red mt-0.5 shrink-0" />
          <div>
            <p className="mono-label mb-1 text-black/30">Want a number now?</p>
            <p className="font-body text-[15px] sm:text-[17px] font-semibold leading-snug tracking-tight text-black/80 max-w-md">
              Use our Cost Calculator to estimate your project before booking a call.
            </p>
          </div>
        </div>
        <Link
          to="/cost-calculator"
          className="btn-secondary shrink-0 !px-7 !py-3 !text-xs"
        >
          Open Calculator
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <PricingHero />
      <CalculatorBanner />
      <PricingWhatShapesPrice />
      <PricingReferencePoints />
      <PricingWhatYoureReplacing />
      <PricingCTA />
    </>
  );
}
