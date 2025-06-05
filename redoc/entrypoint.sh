#!/bin/bash
export PATH="$PATH:/usr/local/bin"
# Tableau des URLs des spécifications
SPEC_URLS=(
  "https://localhost:5173/api/user/doc/json"
#   "http://service2:8080/openapi.json"
)

# Dossier de destination pour les spécifications
DEST_DIR="/app/services/json"

# Créer le dossier s'il n'existe pas
mkdir -p "$DEST_DIR"

# Télécharger chaque spécification
for url in "${SPEC_URLS[@]}"; do
  filename=$(basename "$url")
  
  curl -s "$url" -o "$DEST_DIR/$filename"
done

# Lancer Redoc pour chaque spécification
for file in "$DEST_DIR"/*.json; do
  redoc-cli serve "$file" &
done

# Attendre que tous les processus Redoc se terminent
wait
