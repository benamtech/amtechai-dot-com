import AnimatedSection from '../ui/AnimatedSection';

const capabilities = [
  {
    category: 'Communication',
    items: [
      'Inbound and outbound voice calls with natural conversation',
      'Email drafting, sending, and response management',
      'SMS and text-based follow-up sequences',
      'Live transfer to your team when a human is needed',
    ],
  },
  {
    category: 'Operations',
    items: [
      'Appointment scheduling with calendar integration',
      'Job scoping and estimation based on your pricing',
      'Workflow automation across your entire tech stack',
      'Document generation — proposals, invoices, contracts',
    ],
  },
  {
    category: 'Intelligence',
    items: [
      'Lead qualification with your specific criteria',
      'Sentiment analysis and conversation scoring',
      'Real-time dashboards with every metric that matters',
      'Continuous learning from every interaction and outcome',
    ],
  },
];

const industries = [
  'Home services & contracting',
  'Real estate & wholesaling',
  'Landscaping & lawn care',
  'Political campaigns',
  'Nonprofits & advocacy',
  'Professional services',
  'E-commerce & DTC',
  'Healthcare practices',
];

export default function IncludedSection() {
  return (
    <section className="bg-white">
      <div className="container-wide py-20 md:py-34">
        <AnimatedSection>
          <p className="mono-label mb-4 text-red">Capabilities</p>
          <h2 className="max-w-3xl font-display text-display-lg text-black">
            If Your Business Does It, We Can Build AI to Do It Better.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-body-lg leading-[1.75] text-black/50">
            The scope of what we build is limited only by what your business needs. Every system
            is custom. Here&rsquo;s the territory we cover:
          </p>
        </AnimatedSection>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((group, i) => (
            <AnimatedSection key={group.category} delay={0.1 * i}>
              <div className="glass-card h-full p-7 sm:p-8">
                <p className="mono-label mb-6 text-red">{group.category}</p>
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-red" aria-hidden="true" />
                      <p className="font-body text-body-sm leading-[1.7] text-black/60">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="mt-16 border-t border-black/[0.06] pt-12">
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
              <div className="md:w-1/3">
                <h3 className="font-display text-display-sm text-black">
                  Built for any industry.
                </h3>
                <p className="mt-3 font-body text-body-sm leading-relaxed text-black/40">
                  If you have customers, processes, and decisions &mdash; we can automate and
                  amplify them.
                </p>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-0 divide-y divide-black/[0.06] border-y border-black/[0.06] sm:grid-cols-2 sm:divide-y-0 sm:border-y-0">
                  {industries.map((industry, i) => (
                    <div
                      key={industry}
                      className="flex items-center gap-3 py-3 sm:border-b sm:border-black/[0.06]"
                    >
                      <span className="font-mono text-xs text-red/50">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-body text-body-sm text-black/60">{industry}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="mt-16 glass-card p-7 sm:p-10">
            <p className="font-display text-display-sm text-black">
              This list is not exhaustive. It can&rsquo;t be.
            </p>
            <p className="mt-4 max-w-2xl font-body text-body-md leading-[1.75] text-black/50">
              Every business we work with introduces new problems to solve, new systems to
              integrate, new workflows to automate. That&rsquo;s what makes this work
              interesting &mdash; and it&rsquo;s why we don&rsquo;t sell presets. If your
              business needs it, we build it.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
