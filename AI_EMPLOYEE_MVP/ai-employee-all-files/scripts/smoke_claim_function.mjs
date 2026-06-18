#!/usr/bin/env node
import { handler } from '../../../netlify/functions/claim.mjs';

process.env.CLAIM_TEST_MODE = process.env.CLAIM_TEST_MODE || '1';
process.env.CLAIM_TEST_CODE = process.env.CLAIM_TEST_CODE || '000000';
process.env.CLAIM_TEST_SKIP_SUPABASE = process.env.CLAIM_TEST_SKIP_SUPABASE || '1';
process.env.PROVISION_HOOK_URL = process.env.PROVISION_HOOK_URL || 'http://127.0.0.1:18787/provision';
process.env.PROVISION_HOOK_TOKEN = process.env.PROVISION_HOOK_TOKEN || 'test-token';

const payload = {
  phone: '+18055550142',
  code: process.env.CLAIM_TEST_CODE,
  owns_business: true,
  supervisor_name: 'Marcus',
  agent_name: 'Rex',
  timezone: 'America/Los_Angeles',
  consent_accepted: true,
  consent_text_version: '1.0.0',
  answers: {
    q1_business: 'Scoop Dogg, dog waste pickup for yards, been at it about 3 years',
    q2_team: 'me plus two part-time route techs',
    q3_office_work: 'scheduling routes, quoting new yards, chasing late payments',
    q4_tools: 'Gmail and Google Sheets',
    q5_money: 'roughly 120k a year, about 25 dollars per weekly yard',
    q6_ideal_customer: 'multi-dog homes and small HOAs on recurring weekly plans',
    q7_friction_customer: 'one-time deep cleans who price shop and never rebook',
  },
};

async function invoke(path, body) {
  const res = await handler({
    httpMethod: 'POST',
    path,
    body: JSON.stringify(body),
  });
  const parsed = res.body ? JSON.parse(res.body) : {};
  console.log(path, res.statusCode, parsed);
  if (res.statusCode >= 400) process.exitCode = 1;
  return parsed;
}

await invoke('/claim/send-code', { phone: payload.phone });
await invoke('/claim/verify-and-claim', payload);
