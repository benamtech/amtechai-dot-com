import { LegalPage, Section, Highlight, P, UL, A } from '../components/legal/LegalLayout';

const EFFECTIVE = 'October 3, 2026';
const CONTACT_EMAIL = 'ben@amtechai.com';

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What AMTECH collects, why we collect it, and what we will never do with it — including a specific, binding commitment about data we receive from Google."
      effective={EFFECTIVE}
    >
      <Section heading="Who we are">
        <P>
          AMTECH builds AI employees for small and mid-sized businesses — software that drafts estimates,
          answers messages, schedules work, and handles back-office admin on a business&rsquo;s behalf. This
          policy covers amtechai.com and the AMTECH applications served from it, including app.amtechai.com,
          agent.amtechai.com, and api.amtechai.com (together, the &ldquo;Service&rdquo;).
        </P>
        <P>
          Questions, requests, or deletion demands go to{' '}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>. A real person answers.
        </P>
      </Section>

      <Section heading="Information we collect">
        <P>We collect only what the Service needs to do the work you hired it to do.</P>
        <UL
          items={[
            <>
              <strong className="font-semibold text-black/80">Account information.</strong> Name, business name,
              email address, and phone number when you sign up, book a call, or apply.
            </>,
            <>
              <strong className="font-semibold text-black/80">Business content you give us.</strong> Pricing,
              documents, service descriptions, customer records, and the operating details you load in so the AI
              employee knows how your business actually runs.
            </>,
            <>
              <strong className="font-semibold text-black/80">Connected account data.</strong> When you connect a
              third-party account — Google/Gmail, QuickBooks, or a phone number — we receive data from that account
              under the permissions you grant, and we store the access tokens needed to keep the connection working.
            </>,
            <>
              <strong className="font-semibold text-black/80">Usage and device data.</strong> Pages viewed, actions
              taken, approximate location derived from IP, browser and device type. We use Google Analytics on the
              public marketing site.
            </>,
            <>
              <strong className="font-semibold text-black/80">Payment information.</strong> Payments are processed by
              Stripe. We receive confirmation and billing metadata. We never see or store full card numbers.
            </>,
          ]}
        />
      </Section>

      <Section heading="How we use information">
        <UL
          items={[
            'To operate the Service — draft estimates and messages, answer questions, schedule work, and carry out the tasks you or your team direct the AI employee to perform.',
            'To keep your AI employee accurate about your business, pricing, and customers.',
            'To authenticate you, secure accounts, prevent abuse, and debug failures.',
            'To bill you and to provide support.',
            'To send service and account notices, and — only if you opted in — occasional product email.',
            'To comply with law and enforce our terms.',
          ]}
        />
        <P>
          We do not sell personal information, and we do not share it with third parties for their own advertising
          or marketing.
        </P>
      </Section>

      <Highlight heading="Google user data">
        <P>
          When you connect a Google account, AMTECH requests only the scopes needed for the email work you have asked
          the AI employee to do:
        </P>
        <UL
          items={[
            <>
              <code className="font-mono text-sm text-black/70">gmail.send</code> — to send email you or your team
              have directed or approved, from your own mailbox.
            </>,
            <>
              <code className="font-mono text-sm text-black/70">gmail.readonly</code> — to read incoming messages in
              the connected mailbox so the AI employee can understand a customer thread and draft the right reply or
              follow-up.
            </>,
          ]}
        />
        <P>
          Gmail data is used solely to provide and improve these user-facing features. We do not use it for
          advertising. We do not sell it. We do not transfer it to third parties except as needed to provide the
          Service, for security, or to comply with law. We do not use Gmail data to train generalized AI or machine
          learning models. Humans do not read your Gmail data except where you explicitly ask us to (for example, a
          support request), where it is necessary for security or to investigate abuse, or where the law requires it.
        </P>
        <P>
          <strong className="font-semibold text-black/80">
            AMTECH&rsquo;s use and transfer of information received from Google APIs to any other app will adhere to
            the{' '}
            <A href="https://developers.google.com/terms/api-services-user-data-policy">
              Google API Services User Data Policy
            </A>
            , including the Limited Use requirements.
          </strong>
        </P>
        <P>
          You can disconnect AMTECH from your Google account at any time at{' '}
          <A href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</A>. When you
          disconnect, we stop accessing your Gmail data and delete the stored tokens. To have the Gmail-derived
          content we already hold deleted, email{' '}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> and we will delete it within 30 days.
        </P>
      </Highlight>

      <Section heading="AI processing and subprocessors">
        <P>
          The Service uses third-party AI model providers to generate drafts and answers. Content you give the AI
          employee — and connected-account content it needs to do a task — may be sent to these providers to produce
          that output. We use providers under enterprise/API terms that prohibit training their public models on our
          customers&rsquo; data.
        </P>
        <P>We rely on these categories of service providers, each bound to protect the data they handle:</P>
        <UL
          items={[
            'AI model providers — generating estimates, replies, and summaries.',
            'Supabase — database, authentication, and file storage.',
            'Netlify — hosting for the public site.',
            'Stripe — payment processing.',
            'Twilio — telephony and SMS.',
            'Google — Gmail integration and analytics on the marketing site.',
            'Intuit QuickBooks — accounting integration, when you connect it.',
          ]}
        />
      </Section>

      <Section heading="How we share information">
        <P>We share personal information only in these situations:</P>
        <UL
          items={[
            'With the service providers above, to run the Service.',
            'At your direction — for example, when your AI employee sends an email or estimate to a customer you told it to contact.',
            'When required by law, subpoena, or valid legal process, or to protect the rights, safety, and property of AMTECH, our customers, or the public.',
            'In connection with a merger, acquisition, or sale of assets — with notice to you, and subject to this policy.',
          ]}
        />
      </Section>

      <Section heading="Data retention">
        <P>
          We keep your account and business content for as long as your account is active, and for a reasonable
          period afterward to handle billing, disputes, and legal obligations. Connected-account tokens are deleted
          when you disconnect the integration. When you close your account or ask for deletion, we delete or
          de-identify your data within 30 days, except where we must retain records by law.
        </P>
      </Section>

      <Section heading="Security">
        <P>
          Data is encrypted in transit (TLS) and at rest. Integration tokens are stored encrypted and scoped to the
          minimum permissions the feature requires. Access to production data is limited to personnel who need it and
          is logged. No system is perfect; if a breach affects your data, we will notify you as required by law.
        </P>
      </Section>

      <Section heading="Your choices and rights">
        <UL
          items={[
            'Access, correct, or delete your information — email us and we will handle it.',
            'Disconnect any third-party integration at any time from your account, or from that provider directly.',
            'Opt out of marketing email using the unsubscribe link, or by replying and asking.',
            'Depending on where you live (including California, Colorado, Connecticut, Virginia, and the EEA/UK), you may have additional rights to access, port, correct, delete, or limit the use of your personal information, and to appeal a denial. We honor these requests regardless of where you live.',
          ]}
        />
        <P>
          We do not sell or share personal information as those terms are defined under the California Consumer
          Privacy Act, and we do not use it for cross-context behavioral advertising.
        </P>
      </Section>

      <Section heading="Calls, SMS, and recordings">
        <P>
          Parts of the Service place or receive calls and text messages on your behalf. You are responsible for
          having the consents that applicable law — including the TCPA and state recording laws — requires for the
          contacts you direct the Service to reach. Where calls are recorded or transcribed, we process those
          recordings to provide the Service and retain them under the schedule above.
        </P>
      </Section>

      <Section heading="Text messages from your AI employee">
        <P>
          When you set up or claim an AI employee and give us your mobile number, your employee texts you about your
          own business: work it finished, questions waiting on you, and replies to what you send it. You opt in by
          ticking the text-message box when you enter your number; the full program is described at{' '}
          <A href="/sms">amtechai.com/sms</A>. Message frequency varies with your work. Message and data rates may
          apply. Reply HELP for help and STOP to stop at any time; reply START to begin again.
        </P>
        <P>
          No mobile information will be shared with third parties or affiliates for marketing or promotional
          purposes. Information sharing with the subcontractors who run the service (Twilio, which delivers the
          messages) is permitted to provide it. All the categories of sharing described in this policy exclude
          text-messaging originator opt-in data and consent; this information will not be shared with any third
          parties.
        </P>
      </Section>

      <Section heading="Children">
        <P>
          The Service is built for businesses and is not directed to anyone under 18. We do not knowingly collect
          personal information from children. If we learn we have, we delete it.
        </P>
      </Section>

      <Section heading="International users">
        <P>
          AMTECH operates in the United States and stores data there. If you use the Service from outside the U.S.,
          you understand your information will be transferred to and processed in the U.S.
        </P>
      </Section>

      <Section heading="Changes to this policy">
        <P>
          We update this policy when the Service changes. The effective date at the top always reflects the current
          version. If a change materially affects how we handle your information, we will notify you by email or in
          the app before it takes effect.
        </P>
      </Section>

      <Section heading="Contact">
        <P>
          AMTECH &mdash; <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A> &middot;{' '}
          <A href="tel:+18058869173">(805) 886-9173</A>
        </P>
      </Section>
    </LegalPage>
  );
}
