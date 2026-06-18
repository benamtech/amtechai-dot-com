#!/usr/bin/env node
import { createHmac } from 'node:crypto';
import { handler } from '../../../netlify/functions/sms-entry.mjs';

process.env.SMS_ENTRY_TEST_MODE = '1';
process.env.WEB_FORM_URL = process.env.WEB_FORM_URL || 'https://amtechai.com/claim';

const cases = [
  ['hello', 'Claim your AMTECH AI Employee here:'],
  ['HELP', 'AMTECH AI Employee. Claim yours at'],
  ['STOP', 'You won&apos;t get more texts.'],
];

for (const [body, expected] of cases) {
  const res = await handler({
    httpMethod: 'POST',
    path: '/sms-entry',
    headers: {},
    body: new URLSearchParams({ Body: body }).toString(),
  });
  console.log(body, res.statusCode, res.body);
  if (res.statusCode !== 200 || !res.body.includes(expected)) {
    process.exitCode = 1;
  }
}

delete process.env.SMS_ENTRY_TEST_MODE;
process.env.TWILIO_AUTH_TOKEN = 'test-auth-token';
process.env.TWILIO_SMS_WEBHOOK_URL = 'https://amtechai.com/sms-entry';

const signedBody = new URLSearchParams({ Body: 'AGENT', From: '+18055550142' }).toString();
const signature = sign(process.env.TWILIO_SMS_WEBHOOK_URL, signedBody, process.env.TWILIO_AUTH_TOKEN);
const signed = await handler({
  httpMethod: 'POST',
  path: '/sms-entry',
  headers: { 'x-twilio-signature': signature },
  body: signedBody,
});
console.log('signed', signed.statusCode, signed.body);
if (signed.statusCode !== 200 || !signed.body.includes('Claim your AMTECH AI Employee here:')) {
  process.exitCode = 1;
}

const rejected = await handler({
  httpMethod: 'POST',
  path: '/sms-entry',
  headers: { 'x-twilio-signature': 'bad-signature' },
  body: signedBody,
});
console.log('bad-signature', rejected.statusCode, rejected.body);
if (rejected.statusCode !== 403) {
  process.exitCode = 1;
}

function sign(url, body, token) {
  const base = Array.from(new URLSearchParams(body).entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc, [key, value]) => acc + key + value, url);
  return createHmac('sha1', token).update(base).digest('base64');
}
