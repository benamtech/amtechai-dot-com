import { motion } from 'framer-motion';

export default function ApplyConfirmation({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 font-['Inter',sans-serif]">
      <div className="max-w-[560px] w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#E11D2A] mb-6">
            Application Complete
          </p>
          <h1 className="font-black text-[clamp(3rem,10vw,3.25rem)] tracking-[-0.04em] text-white leading-[1.0] mb-8">
            You're in.
          </h1>
          <p className="text-[1.1rem] leading-[1.75] text-[#6b7280] mb-10">
            A confirmation has been sent to{' '}
            <span className="text-white">{email}</span>.
            <br /><br />
            Within 48 hours you will receive a link to schedule your intake call. On that call we review your market, configure your agent, and schedule your first batch campaign.
            <br /><br />
            Come ready to run.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-[1.25rem] text-white font-semibold"
        >
          Welcome to AMTECH Operators.
        </motion.p>
      </div>
    </div>
  );
}
