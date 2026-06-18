#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

service_dir="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
service_path="$service_dir/amtech-provision-hook.service"
bundle_dir="$(pwd)"

mkdir -p "$service_dir"

cat > "$service_path" <<EOF
[Unit]
Description=AMTECH AI Employee provision hook
After=network-online.target

[Service]
Type=simple
WorkingDirectory=$bundle_dir
ExecStart=$bundle_dir/scripts/run_provision_hook.sh
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
EOF

echo "Wrote $service_path"

if command -v systemctl >/dev/null 2>&1; then
  systemctl --user daemon-reload || true
  echo
  echo "To enable and start:"
  echo "  systemctl --user enable --now amtech-provision-hook.service"
  echo "  systemctl --user status amtech-provision-hook.service"
  echo
  echo "If the service should keep running after logout:"
  echo "  sudo loginctl enable-linger $USER"
fi
