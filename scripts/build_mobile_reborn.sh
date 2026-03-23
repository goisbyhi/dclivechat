#!/bin/sh
set -eu

ROOT="/Users/minjun/Documents/질문/dclivechat"
VERSION="3.0.4-20260324-mobile1"
PRELUDE="$ROOT/src/mobile-reborn-prelude.js"
CORE="$ROOT/min.js"
OUT="$ROOT/min.mobile.reborn.js"

{
    printf '/* dclivechat mobile reborn build %s */\n' "$VERSION"
    cat "$PRELUDE"
    printf '\n'
    cat "$CORE"
} > "$OUT"

perl -0pi -e "s/2\\.4\\.6-20260323/$VERSION/g" "$OUT"
