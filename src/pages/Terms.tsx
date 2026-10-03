import { Link } from 'react-router-dom';
import { LegalPage, Section, P, UL, A } from '../components/legal/LegalLayout';

const EFFECTIVE = 'October 3, 2026';
const CONTACT_EMAIL = 'ben@amtechai.com';

/**
 * Legal entity and forum. Confirm both with counsel before relying on these terms —
 * changing them is a one-line edit here and nowhere else.
 */
const ENTITY = 'AMTECH';
const GOVERNING_LAW = 'the Commonwealth of Pennsylvania';
const VENUE = 'the state and federal courts located in Pennsylvania';

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The agreement between you and AMTECH: what we provide, what you are responsible for, and the limits on both sides."
      effective={EFFECTIVE}
    >
      <Section heading="Agreement to these terms">
        <P>
          These Terms of Service (the &ldquo;Terms&rdquo;) are a binding agreement between you &mdash; individually
          and on behalf of the business you represent (&ldquo;you&rdquo;) &mdash; and {ENTITY}
          &nbsp;(&ldquo;AMTECH,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;). By creating an account, connecting an
          integration, or using amtechai.com or any AMTECH application (the &ldquo;Service&rdquo;), you accept these
          Terms. If you do not agree, do not use the Service. If you accept on behalf of a business, you represent
          that you have authority to bind it.
        </P>
      </Section>

      <Section heading="What the Service is">
        <P>
          AMTECH provides AI employees: software that drafts estimates and messages, answers questions, schedules
          work, and handles back-office admin using information about your business that you provide or connect.
          Features change as we improve the product. We may add, modify, or discontinue functionality, and will give
          reasonable notice before a material reduction to a feature you actively rely on.
        </P>
      </Section>

      <Section heading="Your account">
        <UL
          items={[
            'You must be at least 18 and provide accurate registration information.',
            'You are responsible for credentials issued to you and your team, and for all activity under your account.',
            'Tell us promptly at ' + CONTACT_EMAIL + ' if you suspect unauthorized access.',
          ]}
        />
      </Section>

      <Section heading="Acceptable use">
        <P>You agree not to use the Service to:</P>
        <UL
          items={[
            'Break the law, or help anyone else break it — including telemarketing, anti-spam, consumer protection, recording-consent, fair housing, lending, and licensing rules.',
            'Send messages or place calls to people who have not given the consent applicable law requires, or who have opted out.',
            'Deceive people about who they are dealing with, or misrepresent AI-generated output as something it is not.',
            'Upload content you lack the rights to, or that is unlawful, infringing, or harmful.',
            'Probe, scrape, overload, reverse engineer, or circumvent the security or rate limits of the Service.',
            'Resell or provide the Service to third parties without a written agreement with us.',
          ]}
        />
        <P>
          We may suspend or terminate access for violations, and we may do so immediately where there is risk of
          legal exposure or harm.
        </P>
      </Section>

      <Section heading="AI output — read this one">
        <P>
          The Service generates drafts. Estimates, prices, messages, scopes of work, contracts, and analyses produced
          by an AI employee are starting points that <strong className="font-semibold text-black/80">you must review
          before they go out or get relied on</strong>. AI output can be wrong, incomplete, or confidently mistaken.
        </P>
        <P>
          AMTECH provides software. We do not provide legal, financial, tax, accounting, insurance, real estate, or
          engineering advice, and nothing the Service produces is a substitute for a licensed professional. You are
          responsible for what you send to your customers and for what you sign. Pricing, margins, scope,
          exclusions, warranty language, and compliance obligations remain yours to verify.
        </P>
      </Section>

      <Section heading="Your data and content">
        <P>
          You keep ownership of the business content, customer records, and materials you put into the Service
          (&ldquo;Your Data&rdquo;). You grant AMTECH a non-exclusive license to host, process, transmit, and display
          Your Data solely to operate and support the Service for you. You are responsible for having the rights and
          consents needed to give us Your Data, including any personal information about your customers.
        </P>
        <P>
          Output generated for you from Your Data is yours to use. How we handle personal information is described in
          our <Link to="/privacy" className="text-black underline decoration-red/40 underline-offset-2 transition-colors hover:decoration-red">Privacy Policy</Link>, which is part of these Terms.
        </P>
      </Section>

      <Section heading="Third-party integrations">
        <P>
          The Service connects to third-party platforms &mdash; Google/Gmail, Intuit QuickBooks, Stripe, Twilio, and
          others &mdash; at your direction. Your use of those platforms is governed by their own terms, and they
          control their own availability. Connecting an account authorizes AMTECH to access it within the permissions
          you grant. You may revoke access at any time; features that depend on the connection will stop working.
          Data received from Google APIs is handled under the{' '}
          <A href="https://developers.google.com/terms/api-services-user-data-policy">
            Google API Services User Data Policy
          </A>
          , including its Limited Use requirements.
        </P>
      </Section>

      <Section heading="Fees and payment">
        <P>
          Paid plans and engagements are billed at the amounts and intervals stated at purchase or in your order.
          Payments are processed by Stripe. Unless your written agreement says otherwise, fees are billed in advance,
          recur until canceled, and are non-refundable for periods already begun. You are responsible for applicable
          taxes. If a payment fails, we may suspend the Service until it is resolved. We will give at least 30
          days&rsquo; notice before a price increase takes effect.
        </P>
      </Section>

      <Section heading="Telephony and messaging compliance">
        <P>
          If you use calling or SMS features, you are the party responsible for consent, opt-out handling, calling
          hours, identification requirements, and recording disclosures under the TCPA, state law, and carrier rules.
          You will indemnify AMTECH for claims arising from contacts you directed the Service to make.
        </P>
      </Section>

      <Section heading="Text messages from your AI employee">
        <P>
          <strong>Program.</strong> AMTECH AI employee messages: texts from your AI employee to you about your
          business&rsquo;s work (finished work, questions waiting on you, and replies to your texts). Details at{' '}
          <A href="/sms">amtechai.com/sms</A>.
        </P>
        <P>
          <strong>Opting in.</strong> You opt in by entering your mobile number and ticking the text-message box when
          you set up or claim an employee. Texting is optional: your employee also works from its web dashboard.
        </P>
        <P>
          <strong>Frequency and cost.</strong> Message frequency varies with your work. Message and data rates may
          apply.
        </P>
        <P>
          <strong>Help and opting out.</strong> Reply HELP for help, or email{' '}
          <A href="mailto:ben@amtechai.com">ben@amtechai.com</A>. Reply STOP to stop receiving texts at any time;
          you will get one confirmation and nothing after it. Reply START to begin again.
        </P>
        <P>
          Carriers are not liable for delayed or undelivered messages. How we handle your number is in our{' '}
          <A href="/privacy">Privacy Policy</A>.
        </P>
      </Section>

      <Section heading="Intellectual property">
        <P>
          AMTECH owns the Service, including its software, models, prompts, interfaces, documentation, and branding.
          These Terms grant you a limited, non-exclusive, non-transferable right to use the Service during your
          subscription. You may not copy, modify, or create derivative works of the Service. Feedback you send us may
          be used without obligation to you.
        </P>
      </Section>

      <Section heading="Disclaimer of warranties">
        <P>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the fullest extent permitted
          by law, AMTECH disclaims all warranties, express or implied, including merchantability, fitness for a
          particular purpose, non-infringement, and any warranty that the Service will be uninterrupted, error-free,
          or that AI output will be accurate or suitable for your purpose.
        </P>
      </Section>

      <Section heading="Limitation of liability">
        <P>
          To the fullest extent permitted by law, AMTECH will not be liable for indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for lost profits, lost revenue, lost data, or business
          interruption, even if advised of the possibility. AMTECH&rsquo;s total aggregate liability arising out of or
          relating to these Terms or the Service will not exceed the greater of (a) the amounts you paid AMTECH in
          the twelve months before the event giving rise to the claim, or (b) one hundred U.S. dollars ($100).
        </P>
      </Section>

      <Section heading="Indemnification">
        <P>
          You will defend, indemnify, and hold harmless AMTECH from claims, damages, liabilities, and reasonable
          legal fees arising from Your Data, your use of the Service, your violation of these Terms, your violation
          of law, or output you sent, published, or relied on.
        </P>
      </Section>

      <Section heading="Term and termination">
        <P>
          You may stop using the Service and close your account at any time. We may suspend or terminate access for
          breach of these Terms, non-payment, or legal risk. On termination, your right to use the Service ends. You
          may request an export of Your Data within 30 days of termination; after that we may delete it as described
          in the Privacy Policy. Sections that by their nature should survive &mdash; ownership, disclaimers,
          limitation of liability, indemnification, and governing law &mdash; survive termination.
        </P>
      </Section>

      <Section heading="Changes to these terms">
        <P>
          We may update these Terms. The effective date at the top reflects the current version. For material
          changes, we will give notice by email or in the app before they take effect. Continuing to use the Service
          after that means you accept the updated Terms.
        </P>
      </Section>

      <Section heading="Governing law">
        <P>
          These Terms are governed by the laws of {GOVERNING_LAW}, without regard to its conflict-of-laws rules. You
          and AMTECH agree to the exclusive jurisdiction and venue of {VENUE} for any dispute that is not otherwise
          resolved. If any provision is held unenforceable, the rest remains in effect.
        </P>
      </Section>

      <Section heading="Contact">
        <P>
          {ENTITY} &mdash; <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> &middot;{' '}
          <A href="tel:+18058869173">(805) 886-9173</A>
        </P>
      </Section>
    </LegalPage>
  );
}
