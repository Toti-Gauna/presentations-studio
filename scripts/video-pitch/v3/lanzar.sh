#!/bin/bash
# lanzar.sh <plan.json> <carpeta> [procesos]: reparte la línea de tiempo del plan entre procesos de render y espera.
plan="$1"; out="$2"; n="${3:-4}"
D=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['dur'])" "$plan")
cd /home/user/presentations-studio || exit 1
for i in $(seq 0 $((n-1))); do
  a=$(python3 -c "import sys;print(round(int(sys.argv[1])*float(sys.argv[2])/int(sys.argv[3]),3))" "$i" "$D" "$n")
  b=$(python3 -c "import sys;print(round((int(sys.argv[1])+1)*float(sys.argv[2])/int(sys.argv[3])+0.05,3))" "$i" "$D" "$n")
  node scripts/video-pitch/.render-v3.cjs "$plan" "$out" "$a" "$b" > "$out.r$i.log" 2>&1 &
done
wait
cat "$out".r*.log
