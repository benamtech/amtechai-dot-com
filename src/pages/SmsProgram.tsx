import { LegalPage, Section, P, UL, A } from '../components/legal/LegalLayout';

const EFFECTIVE = 'October 3, 2026';

// The consent text below is the exact wording of the text-message box on the phone card where an owner
// gives their number (setting up an employee, or claiming one in the conversation). Change both together.
export const SMS_CONSENT =
  'Text me from my AI employee about my business. Message frequency varies. Message and data rates may apply. Reply HELP for help, STOP to stop. See amtechai.com/sms.';

export default function SmsProgram() {
  return (
    <LegalPage
      title="Text messages from your AI employee"
      intro="How AMTECH AI employees text the business owners they work for: who gets texts, how you opt in, what you will receive, and how to stop."
      effective={EFFECTIVE}
    >
      <Section heading="Who receives texts">
        <P>
          Only the owner of an AMTECH AI employee, at the mobile number they gave when they set the employee up or
          claimed it. AMTECH does not text anyone who has not opted in, and does not buy or rent phone numbers.
        </P>
      </Section>

      <Section heading="How you opt in">
        <P>
          When you set up an employee at amtechai.com, or claim one inside its conversation, a card asks for your
          mobile number. Beneath the number is a box you tick to receive texts. It reads:
        </P>
        <div
          id="sms-consent"
          className="my-4 border border-black/20 p-4 font-body text-sm text-black/80"
          style={{ borderRadius: 0 }}
        >
          <label className="flex items-start gap-3">
            <input type="checkbox" readOnly aria-label="Text-message consent" className="mt-1" />
            <span>{SMS_CONSENT}</span>
          </label>
        </div>
        <P>
          Ticking it is optional. Without it, your employee works from its web dashboard and texts you nothing.
        </P>
      </Section>

      <Section heading="What you will receive">
        <P>Texts from your employee about your own business. For example:</P>
        <UL
          items={[
            'Rita (Ridgeline Roofing): The Henderson estimate is done, $14,820. Want me to send it? Reply STOP to stop texts.',
            'Rita (Ridgeline Roofing): Mrs. Ortiz paid the $1,000 deposit for Thursday. Reply STOP to stop texts.',
            'Rita (Ridgeline Roofing): Two inspections booked tomorrow. Do you want the 8am or the 1pm one moved?',
          ]}
        />
        <P>Message frequency varies with your work. Message and data rates may apply.</P>
      </Section>

      <Section heading="Help and stopping">
        <P>
          Reply HELP for help, or email <A href="mailto:ben@amtechai.com">ben@amtechai.com</A>. Reply STOP at any
          time to stop; you will receive one confirmation and nothing after it. Reply START to begin again. Carriers
          are not liable for delayed or undelivered messages.
        </P>
      </Section>

      <Section heading="Your number">
        <P>
          No mobile information will be shared with third parties or affiliates for marketing or promotional
          purposes. Text-messaging opt-in data and consent are never shared with any third party. See our{' '}
          <A href="/privacy">Privacy Policy</A> and <A href="/terms">Terms</A>.
        </P>
      </Section>
    </LegalPage>
  );
}
