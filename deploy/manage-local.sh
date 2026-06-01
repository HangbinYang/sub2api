#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_COMPOSE="${SCRIPT_DIR}/docker-compose.local.yml"
CODEX_COMPOSE="${SCRIPT_DIR}/docker-compose.codex.yml"

compose() {
  sudo -n docker compose -f "${BASE_COMPOSE}" -f "${CODEX_COMPOSE}" "$@"
}

usage() {
  cat <<'EOF'
Usage:
  ./deploy/manage-local.sh redeploy   Rebuild local code image and recreate sub2api
  ./deploy/manage-local.sh restart    Restart only the sub2api container
  ./deploy/manage-local.sh logs       Follow sub2api logs
  ./deploy/manage-local.sh ps         Show compose service status
  ./deploy/manage-local.sh config     Render merged compose config
EOF
}

cmd="${1:-redeploy}"

case "${cmd}" in
  redeploy)
    compose build sub2api
    compose up -d --no-deps sub2api
    compose ps sub2api
    ;;
  restart)
    compose restart sub2api
    compose ps sub2api
    ;;
  logs)
    compose logs -f --tail 100 sub2api
    ;;
  ps)
    compose ps
    ;;
  config)
    compose config
    ;;
  *)
    usage
    exit 1
    ;;
esac
