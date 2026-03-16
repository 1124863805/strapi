#!/bin/bash
# 发布所有 @leao1 包到 npm（排除 examples 和 private 包）
set -e

REGISTRY="https://registry.npmjs.org/"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 临时替换 workspace:* 为 ^1.0.0（发布时需要）
echo "Replacing workspace:* with ^1.0.0 for publish..."
find packages -name "package.json" ! -path "*/node_modules/*" -exec sed -i '' 's/"@leao1\/\([^"]*\)": "workspace:\*"/"@leao1\/\1": "^1.0.0"/g' {} \;

# 发布顺序：按依赖层级（先发布无依赖的，再发布有依赖的）
# 注：pack-up 若已发布可跳过
PACKAGES=(
  "packages/vendor/pack-up"
  "packages/utils/typescript"
  "packages/utils/logger"
  "packages/core/types"
  "packages/core/permissions"
  "packages/core/utils"
  "packages/core/database"
  "packages/core/data-transfer"
  "packages/generators/generators"
  "packages/vendor/icons"
  "packages/vendor/primitives"
  "packages/vendor/design-system"
  "packages/core/admin"
  "packages/core/content-type-builder"
  "packages/core/content-manager"
  "packages/core/email"
  "packages/core/upload"
  "packages/core/review-workflows"
  "packages/core/content-releases"
  "packages/core/core"
  "packages/plugins/color-picker"
  "packages/plugins/documentation"
  "packages/plugins/graphql"
  "packages/plugins/i18n"
  "packages/plugins/users-permissions"
  "packages/providers/email-nodemailer"
  "packages/providers/email-sendmail"
  "packages/providers/upload-local"
  "packages/vendor/sdk-plugin"
  "packages/cli/create-leao-app"
  "packages/cli/create-leao"
  "packages/core/leao"
)

for pkg in "${PACKAGES[@]}"; do
  pkg_json="$ROOT/$pkg/package.json"
  if [ ! -f "$pkg_json" ]; then
    continue
  fi
  if grep -q '"private": true' "$pkg_json" 2>/dev/null; then
    echo "Skipping private: $pkg"
    continue
  fi
  name=$(node -p "require('$pkg_json').name")
  echo "Publishing $name..."
  (cd "$ROOT/$pkg" && npm publish --registry="$REGISTRY" --access=public 2>&1) || echo "  (may already exist or need auth)"
done

echo "Done. Note: workspace:* was replaced with ^1.0.0 for publish."
