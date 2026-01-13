#!/usr/bin/env bash

# Instala o "Design Principles Skill for Claude Code" (design-principles)
# Fonte: https://github.com/Dammyjay93/claude-design-skill (MIT)

set -euo pipefail

SKILL_DIR="${HOME}/.claude/skills/design-principles"
SKILL_URL="https://raw.githubusercontent.com/Dammyjay93/claude-design-skill/main/skill/skill.md"

echo "Instalando skill design-principles do Claude Code..."
mkdir -p "${SKILL_DIR}"

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "${SKILL_URL}" -o "${SKILL_DIR}/skill.md"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "${SKILL_DIR}/skill.md" "${SKILL_URL}"
else
  echo "Erro: precisa de curl ou wget para baixar o skill.md" >&2
  exit 1
fi

echo "OK: instalado em ${SKILL_DIR}/skill.md"
echo "Reinicie o Claude Code para ativar."
echo "Uso: /design-principles"

