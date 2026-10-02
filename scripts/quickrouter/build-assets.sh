#!/usr/bin/env bash
# Regenerate the QuickRouter raster assets from the vector sources.
#
# The mark, wordmark and social preview are authored as SVG; this script turns
# them into the PNG/ICO files that browsers, iOS and social crawlers expect.
# Requires Google Chrome (for SVG rasterisation) and python3 with Pillow.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ASSETS="$ROOT/public/quickrouter"
CHROME="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if [[ ! -x "$CHROME" ]]; then
  echo "Google Chrome not found at $CHROME (set CHROME_BIN to override)" >&2
  exit 1
fi

shoot() { # shoot <svg> <out.png> <width> <height> <scale> <opaque|transparent>
  local svg="$1" out="$2" w="$3" h="$4" scale="$5" bg="$6"
  local -a flags=(--headless=new --disable-gpu --hide-scrollbars
    --force-device-scale-factor="$scale" --window-size="$w,$h")
  if [[ "$bg" == transparent ]]; then
    flags+=(--default-background-color=00000000)
  fi
  "$CHROME" "${flags[@]}" --screenshot="$out" "file://$svg" >/dev/null 2>&1
}

shoot "$ASSETS/preview.svg" "$ASSETS/preview.png" 1200 630 1 opaque
shoot "$ASSETS/favicon.svg" "$WORK/favicon-512.png" 64 64 8 transparent
shoot "$ASSETS/apple-touch-icon.svg" "$ASSETS/apple-touch-icon.png" 180 180 1 opaque

python3 - "$WORK/favicon-512.png" "$ASSETS/favicon.ico" "$ROOT/public/favicon.ico" <<'PY'
import sys
from PIL import Image

source, *targets = sys.argv[1:]
image = Image.open(source).convert('RGBA')
for target in targets:
    image.save(target, format='ICO', sizes=[(64, 64), (48, 48), (32, 32), (16, 16)])
    print(f'wrote {target}')
PY

echo "assets rebuilt in $ASSETS"
