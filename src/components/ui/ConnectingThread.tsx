import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ConnectingThread() {
  return (
    <section className="border-y border-black-border bg-black-rich">
      <div className="container-wide flex flex-col items-center gap-3 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-body text-body-sm font-medium text-gray-400">
          <span className="text-red">Everything we build connects.</span>{' '}
          Start with what you need. The infrastructure grows with you.
        </p>
        <Link
          to="/schedule-demo"
          className="inline-flex shrink-0 items-center gap-2 font-body text-sm font-medium text-red transition-colors hover:text-red-bright"
        >
          Get started
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
