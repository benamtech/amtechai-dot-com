import { supabase } from '../../lib/supabase';

export interface IntakeSession {
  id: string;
  session_code: string;
  status: string;
  current_step: number;
  answers: Record<string, unknown>;
}

export async function createSession(sessionCode: string): Promise<IntakeSession | null> {
  const { data, error } = await supabase
    .from('intake_sessions')
    .insert({ session_code: sessionCode, answers: {}, current_step: 0 })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Failed to create intake session:', error);
    return null;
  }
  return data;
}

export async function loadSession(sessionCode: string): Promise<IntakeSession | null> {
  const { data, error } = await supabase
    .from('intake_sessions')
    .select('*')
    .eq('session_code', sessionCode)
    .maybeSingle();

  if (error) {
    console.error('Failed to load intake session:', error);
    return null;
  }
  return data;
}

export async function updateSession(
  sessionId: string,
  updates: { current_step?: number; answers?: Record<string, unknown>; status?: string }
): Promise<void> {
  const { error } = await supabase
    .from('intake_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) {
    console.error('Failed to update intake session:', error);
  }
}

export async function uploadFile(
  sessionId: string,
  fieldKey: string,
  file: File
): Promise<{ fileName: string; filePath: string } | null> {
  const ext = file.name.split('.').pop();
  const storagePath = `${sessionId}/${fieldKey}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('intake-files')
    .upload(storagePath, file);

  if (uploadError) {
    console.error('Failed to upload file:', uploadError);
    return null;
  }

  const { error: dbError } = await supabase.from('intake_files').insert({
    session_id: sessionId,
    field_key: fieldKey,
    file_name: file.name,
    file_path: storagePath,
    file_size: file.size,
    mime_type: file.type || `application/${ext}`,
  });

  if (dbError) {
    console.error('Failed to record file in DB:', dbError);
    return null;
  }

  return { fileName: file.name, filePath: storagePath };
}

export async function getSessionFiles(
  sessionId: string,
  fieldKey?: string
): Promise<Array<{ id: string; file_name: string; file_path: string; field_key: string }>> {
  let query = supabase
    .from('intake_files')
    .select('id, file_name, file_path, field_key')
    .eq('session_id', sessionId);

  if (fieldKey) {
    query = query.eq('field_key', fieldKey);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to get session files:', error);
    return [];
  }
  return data || [];
}

export async function deleteFile(fileId: string, filePath: string): Promise<void> {
  await supabase.storage.from('intake-files').remove([filePath]);
  await supabase.from('intake_files').delete().eq('id', fileId);
}
