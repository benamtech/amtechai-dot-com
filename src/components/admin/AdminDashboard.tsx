import { useState, useEffect } from 'react';
import { LogOut, RefreshCw, Inbox } from 'lucide-react';
import SessionList from './SessionList';
import SessionDetail from './SessionDetail';
import { type AdminSession, fetchAllSessions } from './adminService';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [selected, setSelected] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    const data = await fetchAllSessions();
    setSessions(data);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    const data = await fetchAllSessions();
    setSessions(data);
    if (selected) {
      const updated = data.find((s) => s.id === selected.id);
      if (updated) setSelected(updated);
    }
    setRefreshing(false);
  }

  function handleLogout() {
    sessionStorage.removeItem('amtech_admin');
    onLogout();
  }

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const inProgressCount = sessions.filter((s) => s.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="border-b border-black/[0.06] bg-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-[0.15em] uppercase text-black">
              AMTECH <span className="text-red">//</span> Intake Admin
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-3 ml-4 pl-4 border-l border-black/[0.06]">
            <span className="text-[10px] tracking-wider uppercase text-black/40">
              {sessions.length} total
            </span>
            <span className="text-[10px] tracking-wider uppercase text-green-600">
              {completedCount} complete
            </span>
            <span className="text-[10px] tracking-wider uppercase text-yellow-700">
              {inProgressCount} active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-black/40 hover:text-black transition-colors disabled:opacity-30"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-black/40 hover:text-red border border-transparent hover:border-black/[0.06] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full lg:w-[360px] border-r border-black/[0.06] bg-white flex flex-col flex-shrink-0 ${
            selected ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-3 border-b border-black/[0.06]">
            <div className="text-[10px] tracking-[0.2em] uppercase text-black/50">
              Client Sessions
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-xs text-black/50 tracking-wider">Loading sessions...</div>
            </div>
          ) : (
            <SessionList sessions={sessions} selectedId={selected?.id || null} onSelect={setSelected} />
          )}
        </div>

        <div className={`flex-1 bg-[#FAFAFA] flex flex-col ${selected ? 'flex' : 'hidden lg:flex'}`}>
          {selected ? (
            <SessionDetail session={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Inbox className="w-10 h-10 text-black/30 mx-auto mb-3" />
                <div className="text-sm text-black/50">Select a session to review</div>
                <div className="text-xs text-black/30 mt-1">
                  Click on a client from the left panel
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
