import { useState, useEffect } from 'react';
import { Download, FileText, Image, ExternalLink, CheckCircle, Clock, X } from 'lucide-react';
import { KEY_LABELS } from '../website-onboarding/intakeScript';
import {
  type AdminSession,
  type AdminFile,
  fetchSessionFiles,
  getFilePublicUrl,
  formatFileSize,
  formatDate,
} from './adminService';

interface SessionDetailProps {
  session: AdminSession;
  onClose: () => void;
}

const SECTION_ORDER = [
  { label: 'Client Info', keys: ['clientName', 'businessName'] },
  { label: 'Colors & Design', keys: ['colorsFeeling', 'colorsDetail'] },
  { label: 'Logo', keys: ['hasLogo', 'logoFiles', 'logoChanges'] },
  { label: 'Content & Copy', keys: ['contentPhrasing', 'servicesListed', 'serviceAreas', 'contactInfo'] },
  { label: 'Photos & Visuals', keys: ['photosRemove', 'photoFiles', 'photosContext'] },
  { label: 'Business Goals', keys: ['marketingGoals', 'businessGoals'] },
];

function FileCard({ file }: { file: AdminFile }) {
  const url = getFilePublicUrl(file.file_path);
  const isImage = file.mime_type.startsWith('image/');

  return (
    <div className="border border-black/[0.06] bg-[#FAFAFA] p-3 flex items-center gap-3 group">
      <div className="w-9 h-9 border border-black/[0.06] bg-white flex items-center justify-center flex-shrink-0">
        {isImage ? (
          <Image className="w-4 h-4 text-black/40" />
        ) : (
          <FileText className="w-4 h-4 text-black/40" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-black/70 truncate">{file.file_name}</div>
        <div className="text-[10px] text-black/50 mt-0.5">
          {formatFileSize(file.file_size)} &middot; {file.mime_type}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {isImage && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-black/50 hover:text-black transition-colors"
            title="Preview"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <a
          href={url}
          download={file.file_name}
          className="p-1.5 text-black/50 hover:text-red transition-colors"
          title="Download"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function SessionDetail({ session, onClose }: SessionDetailProps) {
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  useEffect(() => {
    setLoadingFiles(true);
    fetchSessionFiles(session.id).then((f) => {
      setFiles(f);
      setLoadingFiles(false);
    });
  }, [session.id]);

  const answers = session.answers || {};
  const isComplete = session.status === 'completed';

  const filesByField: Record<string, AdminFile[]> = {};
  files.forEach((f) => {
    if (!filesByField[f.field_key]) filesByField[f.field_key] = [];
    filesByField[f.field_key].push(f);
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-black/[0.06] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-black">
              {(answers.clientName as string) || 'Unknown Client'}
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-wider uppercase border ${
                isComplete
                  ? 'border-green-900 text-green-400 bg-green-950/30'
                  : 'border-yellow-900 text-yellow-500 bg-yellow-950/30'
              }`}
            >
              {isComplete ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
              {isComplete ? 'Complete' : 'In Progress'}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-xs text-black/40 font-mono">{session.session_code}</span>
            <span className="text-xs text-black/50">{formatDate(session.created_at)}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!loadingFiles && Object.keys(answers).length === 0 && files.length === 0 && (
          <div className="border border-black/[0.06] bg-white p-6 text-center">
            <Clock className="w-8 h-8 text-black/50 mx-auto mb-3" />
            <div className="text-sm text-black/60 font-medium mb-1">No answers collected</div>
            <div className="text-xs text-black/50 leading-relaxed">
              This session was opened but closed before any questions were answered.
              {session.current_step > 0 && (
                <span className="block mt-1">The conversation reached step {session.current_step} of the intake script.</span>
              )}
            </div>
          </div>
        )}

        {SECTION_ORDER.map((section) => {
          const hasContent = section.keys.some((key) => {
            const val = answers[key];
            if (val !== null && val !== undefined && val !== '') return true;
            if (filesByField[key]?.length) return true;
            return false;
          });

          if (!hasContent) return null;

          return (
            <div key={section.label}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[10px] tracking-[0.25em] uppercase text-red font-bold">
                  {section.label}
                </h3>
                <div className="flex-1 h-px bg-black/[0.06]" />
              </div>

              <div className="space-y-3">
                {section.keys.map((key) => {
                  const val = answers[key];
                  const fieldFiles = filesByField[key];
                  const hasVal = val !== null && val !== undefined && val !== '';
                  const hasFiles = fieldFiles && fieldFiles.length > 0;

                  if (!hasVal && !hasFiles) return null;

                  return (
                    <div key={key} className="border border-black/[0.06] bg-white p-4">
                      <div className="text-[10px] tracking-[0.15em] uppercase text-black/40 mb-1.5">
                        {KEY_LABELS[key] || key}
                      </div>

                      {hasVal && (
                        <div className="text-sm text-black/70 leading-relaxed whitespace-pre-wrap">
                          {Array.isArray(val) ? (val as string[]).join(', ') : String(val)}
                        </div>
                      )}

                      {hasFiles && (
                        <div className={`space-y-2 ${hasVal ? 'mt-3' : ''}`}>
                          {fieldFiles.map((f) => (
                            <FileCard key={f.id} file={f} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {loadingFiles && files.length === 0 && (
          <div className="text-center py-8 text-black/50 text-xs tracking-wider">
            Loading files...
          </div>
        )}
      </div>
    </div>
  );
}
