#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../../.."

if ! command -v supabase >/dev/null 2>&1; then
  echo "Supabase CLI is not installed or not on PATH."
  echo "Install it, authenticate/link the project, then run this script again."
  echo "Migration file: supabase/migrations/20260618193000_create_ai_employee_claims.sql"
  exit 1
fi

supabase db push --help >/dev/null
supabase db push
