import { supabase } from '../../lib/supabase';

export interface AdminSession {
  id: string;
  session_code: string;
  status: string;
  current_step: number;
  answers: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AdminFile {
  id: string;
  session_id: string;
  field_key: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export async function fetchAllSessions(): Promise<AdminSession[]> {
  const { data, error } = await supabase
    .from('intake_sessions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch sessions:', error);
    return [];
  }
  return data || [];
}

export async function fetchSessionFiles(sessionId: string): Promise<AdminFile[]> {
  const { data, error } = await supabase
    .from('intake_files')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch files:', error);
    return [];
  }
  return data || [];
}

export function getFilePublicUrl(filePath: string): string {
  const { data } = supabase.storage.from('intake-files').getPublicUrl(filePath);
  return data.publicUrl;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
