#!/bin/bash

# 0️⃣ Sicherstellen, dass wir im richtigen Verzeichnis sind
cd ~/maynsta-one/mayn-maynsta || exit 1

# 1️⃣ Backup erstellen
cp -r ./app ./app_backup
cp ./next.config.mjs ./next.config.mjs.bak

# 2️⃣ Lockfiles bereinigen (nur einen Paketmanager behalten)
echo "Bereinige Lockfiles..."
if [ -f "pnpm-lock.yaml" ]; then
    echo "pnpm detected, removing npm lockfile..."
    rm -f package-lock.json
else
    echo "npm detected, removing pnpm lockfile..."
    rm -f pnpm-lock.yaml
fi

# 3️⃣ Next.js config anpassen (Turbopack root setzen)
echo "Passe next.config.mjs an..."
# Prüfen ob turbopack.root schon existiert
grep -q "turbopack" next.config.mjs
if [ $? -ne 0 ]; then
    # Fügt root-Konfiguration hinzu
    sed -i '/export default nextConfig;/i\
nextConfig.turbopack = { root: __dirname };' next.config.mjs
fi

# 4️⃣ Problematische Patterns aus app und config löschen
patterns=("supabase)" "@/lib/supabase/supabaseBrowser" "experimental.turbo")

echo "Entferne problematische Patterns..."
for pattern in "${patterns[@]}"; do
    files=$(grep -rl "$pattern" ./app ./next.config.mjs 2>/dev/null)
    if [ ! -z "$files" ]; then
        echo "Bearbeite Dateien für Pattern: $pattern"
        echo "$files" | xargs sed -i "/$pattern/d"
    fi
done

# 5️⃣ Abhängigkeiten installieren
echo "Installiere Dependencies..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm install
else
    npm install
fi

# 6️⃣ Build ausführen
echo "Führe Build aus..."
if [ -f "pnpm-lock.yaml" ]; then
    pnpm run build
else
    npm run build
fi

echo "✅ Deployment-Vorbereitung abgeschlossen!"
echo "Backup ist unter ./app_backup und ./next.config.mjs.bak gespeichert."
