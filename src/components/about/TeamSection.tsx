import { Code2, Handshake } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';

const team = [
  {
    icon: Code2,
    role: 'Founder & CEO',
    focus: 'Technical Architect',
    bio: 'Full-stack developer. AI systems architect. The person who actually builds the technology. Background in web development, application design, AI automation, and digital marketing \u2014 which means he understands both the technology and the business problems it solves. Built AMTECH from the first line of code and still personally configures the AI for every new client, because the quality of the discovery conversation determines the quality of everything that follows. Has spent years watching contractors lose jobs to voicemail and built the product to fix it. Obsessive about craft. Impatient with mediocrity. Believes the businesses that built America deserve technology that was previously only accessible to companies a hundred times their size.',
  },
  {
    icon: Handshake,
    role: 'Co-Founder',
    focus: 'Sales & Relationships',
    bio: 'The relationship layer. The person who finds the contractors and home service businesses that need AMTECH, understands exactly what they\u2019re struggling with, and makes sure the solution actually fits their operation. Brings a network-first, trust-first approach to business development that aligns with how tradespeople actually make decisions \u2014 they don\u2019t buy software, they partner with people they believe in. If you get on a call with AMTECH, he\u2019s probably the first voice you\u2019ll hear. And he\u2019ll probably already know more about your industry\u2019s specific pain points than you expect \u2014 because he\u2019s had the same conversation with hundreds of contractors, landscapers, roofers, and home service owners, and has spent years understanding exactly where the revenue leaks are.',
  },
];

export default function TeamSection() {
  return (
    <section className="bg-white">
      <div className="container-wide py-24 md:py-34">
        <AnimatedSection>
          <h2 className="font-display text-display-lg text-black">
            The people behind the machine.
          </h2>
        </AnimatedSection>

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {team.map((member, i) => (
            <AnimatedSection key={member.role} delay={0.1 * i}>
              <div className="flex flex-col">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-black/[0.06] bg-[#FAFAFA]">
                  <member.icon size={28} className="text-red" strokeWidth={1.5} />
                </div>

                <div className="mt-6">
                  <p className="font-display text-lg font-bold text-black">
                    {member.role}
                  </p>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-red">
                    {member.focus}
                  </p>
                </div>

                <p className="mt-5 font-body text-body-sm leading-[1.8] text-black/50">
                  {member.bio}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
