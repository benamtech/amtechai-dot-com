#!/usr/bin/env node
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
  process.exit(1);
}

const endpoint = `${url.replace(/\/$/, '')}/rest/v1/ai_employee_claims?select=id,client_id,provision_status&limit=1`;
const res = await fetch(endpoint, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
});

const text = await res.text();
if (!res.ok) {
  console.error(`ai_employee_claims verification failed: ${res.status} ${text}`);
  process.exit(1);
}

console.log('ai_employee_claims reachable through Supabase REST.');
console.log(text || '[]');
