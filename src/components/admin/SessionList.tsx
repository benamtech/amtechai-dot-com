import { ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { type AdminSession, formatDate } from './adminService';

interface SessionListProps {
  sessions: AdminSession[];
  selectedId: string | null;
  onSelect: (session: AdminSession) => void;
}

export default function SessionList({ sessions, selectedId, onSelect }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-black/50 text-sm">No intake sessions yet</div>
          <div className="text-black/30 text-xs mt-1">
            Sessions will appear here when clients complete the intake form
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {sessions.map((session) => {
        const isSelected = selectedId === session.id;
        const answers = session.answers || {};
        const clientName = (answers.clientName as string) || 'Unknown';
        const businessName = (answers.businessName as string) || '';
        const isComplete = session.status === 'completed';

        return (
          <button
            key={session.id}
            onClick={() => onSelect(session)}
            className={`w-full text-left px-4 py-3.5 border-b border-black/[0.06] transition-colors ${
              isSelected
                ? 'bg-red/5 border-l-2 border-l-red'
                : 'hover:bg-black/[0.02] border-l-2 border-l-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium truncate ${isSelected ? 'text-black' : 'text-black/70'}`}>
                    {clientName}
                  </span>
                  {isComplete ? (
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                  )}
                </div>
                {businessName && (
                  <div className="text-xs text-black/40 truncate mt-0.5">{businessName}</div>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-black/50 font-mono">{session.session_code}</span>
                  <span className="text-[10px] text-black/30">{formatDate(session.created_at)}</span>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-red' : 'text-black/30'}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
