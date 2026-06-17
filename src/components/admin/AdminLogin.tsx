import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

const ADMIN_HASH = '54ed5ac7857d9580';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'amtech_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export default function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const hash = await hashPassword(password);
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem('amtech_admin', hash);
      onAuthenticated();
    } else {
      setError(true);
      setPassword('');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-black/[0.06] bg-white p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-red/30 bg-red/5 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-widest uppercase text-black">
                Admin Access
              </h1>
              <p className="text-xs text-black/40 tracking-wider uppercase mt-0.5">
                AMTECH // Intake Review
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-black/40 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-black/[0.06] px-4 py-3 text-sm text-black font-mono outline-none transition-colors focus:border-red/50 placeholder:text-black/30"
              placeholder="Enter admin password"
              autoFocus
            />

            {error && (
              <div className="flex items-center gap-2 mt-3 text-red text-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Invalid password</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-5 btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>
        </div>

        <p className="text-center text-[9px] text-black/30 tracking-widest uppercase mt-6">
          Encrypted Session // Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const stored = sessionStorage.getItem('amtech_admin');
  if (!stored) return false;
  return stored === ADMIN_HASH;
}
