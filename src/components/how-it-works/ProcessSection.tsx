import AnimatedSection from '../ui/AnimatedSection';

const steps = [
  {
    number: '01',
    title: 'The Interview',
    subtitle: 'We learn how your business actually thinks.',
    body: "This isn't a requirements gathering call. It's an interrogation of your operation. How do you make decisions? What does your best employee know that nobody else does? What happens at 2am when a lead comes in? What's the thing you wish you could clone yourself to handle?\n\nWe map your workflows, your decision trees, your pricing logic, your edge cases, your language. The depth of this conversation determines the intelligence of what we build.",
    detail: '60-90 minutes. The most important hour you\'ll spend.',
  },
  {
    number: '02',
    title: 'The Architecture',
    subtitle: 'We design the system around your reality.',
    body: "Based on the interview, we architect a custom AI system — not from a template, not from a preset, from scratch. This could be an AI Brain that knows your entire operation and makes decisions autonomously. An AI Employee that handles specific roles end-to-end. Or a combination that operates as a fully integrated extension of your team.\n\nWe determine what it needs to know, what it needs to access, what decisions it can make independently, and where it escalates to a human.",
    detail: 'Architecture delivered within 48 hours of the interview.',
  },
  {
    number: '03',
    title: 'The Build',
    subtitle: 'Custom intelligence. Not configuration.',
    body: "We build the AI system — trained on your data, your processes, your voice, your standards. We integrate it with your existing tools or set up new ones. CRM, calendar, phone system, email, databases, payment processors, whatever your operation touches.\n\nYou don't touch a dashboard. You don't drag and drop. You don't watch tutorials. We build it and hand you a system that works.",
    detail: 'Typical build: 1-2 weeks.',
  },
  {
    number: '04',
    title: 'The Launch',
    subtitle: 'Live means live. Not beta.',
    body: "When it goes live, it's operating. Making calls, answering questions, processing data, managing workflows, making decisions. You get a real-time dashboard showing everything the system touches — but you don't need to check it. It's doing the work.\n\nWe monitor, optimize, and refine as real-world data flows in. The system gets smarter every week.",
    detail: 'Most clients see measurable impact within 72 hours.',
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-white">
      <div className="container-wide py-20 md:py-34">
        <AnimatedSection>
          <p className="mono-label text-red">The Process</p>
          <h2 className="mt-4 max-w-2xl font-display text-display-lg text-black">
            Interview. Architect. Build. Launch.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-body-lg leading-relaxed text-black/50">
            Every system starts with understanding. The quality of what we build is directly
            proportional to how well we understand your operation.
          </p>
        </AnimatedSection>

        <div className="mt-12 mx-auto max-w-3xl md:mt-20">
          {steps.map((step, i) => (
            <div key={step.number} className="relative pb-16 pl-16 last:pb-0 md:pb-20 md:pl-24">
              {i < steps.length - 1 && (
                <div
                  className="absolute bottom-0 left-[23px] top-0 w-px bg-black/[0.06] md:left-[39px]"
                  aria-hidden="true"
                />
              )}

              <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-xl glass-bright md:h-20 md:w-20">
                <span className="font-mono text-sm font-medium text-red md:text-lg">
                  {step.number}
                </span>
              </div>

              <AnimatedSection>
                <h3 className="font-display text-display-sm text-black">{step.title}</h3>
                <p className="mt-2 font-body text-body-md font-medium text-black/60">
                  {step.subtitle}
                </p>
              </AnimatedSection>

              <div className="mt-6 space-y-4">
                {step.body.split('\n\n').map((para, j) => (
                  <AnimatedSection key={j} delay={0.05 * (j + 1)}>
                    <p className="font-body text-body-md leading-[1.75] text-black/50">
                      {para}
                    </p>
                  </AnimatedSection>
                ))}
                <AnimatedSection delay={0.15}>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.15em] text-black/25">
                    {step.detail}
                  </p>
                </AnimatedSection>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
