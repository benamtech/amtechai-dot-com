#!/usr/bin/env node
import { randomBytes } from 'node:crypto';

const secret = randomBytes(48).toString('base64url');

console.log('CLAIM_LINK_SECRET=' + secret);
console.log('');
console.log('Paste this value into Netlify as CLAIM_LINK_SECRET. Keep it server-side only.');
