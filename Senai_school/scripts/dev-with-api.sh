#!/usr/bin/env bash
# Sobe o backend (porta 3000) e o Vite (5173). Uso: bash scripts/dev-with-api.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# Repositório do backend é irmão de Trabalho_Final_DesSis_Front (pasta pai de Senai_school)
BACK="$(cd "$ROOT/../.." && pwd)/Trabalho_Final_DesSis_Back"
if [[ ! -f "$BACK/package.json" ]]; then
  BACK="${BACKEND_DIR:-}"
fi
if [[ ! -f "$BACK/package.json" ]]; then
  echo "Pasta do backend não encontrada: $BACK"
  echo "Defina BACKEND_DIR=/caminho/absoluto/Trabalho_Final_DesSis_Back e rode de novo."
  exit 1
fi

echo "==> Backend: $BACK"
(cd "$BACK" && (test -d node_modules || npm install) && node src/server.js) &
BACK_PID=$!
echo "Backend PID=$BACK_PID (log no terminal)"

sleep 2
echo "==> Frontend: $ROOT"
cd "$ROOT"
(test -d node_modules || npm install)
trap 'kill $BACK_PID 2>/dev/null || true' EXIT
npm run dev
