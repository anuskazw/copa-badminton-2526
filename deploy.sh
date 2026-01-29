#!/bin/bash

# Script para subir el proyecto al repositorio de GitHub
# Ejecutar desde la carpeta copa-badminton

echo "🏸 Subiendo Copa Bádminton a GitHub..."

# Inicializar repositorio
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Tablón de partidos Copa Femenina de Clubes 2025/2026"

# Añadir remote
git remote add origin https://github.com/anuskazw/copa-badminton-2526.git

# Crear rama main y subir
git branch -M main
git push -u origin main

echo "✅ ¡Proyecto subido!"
echo ""
echo "Siguiente paso:"
echo "1. Ve a https://github.com/anuskazw/copa-badminton-2526/settings/pages"
echo "2. En 'Build and deployment' selecciona 'GitHub Actions'"
echo "3. El sitio estará disponible en: https://anuskazw.github.io/copa-badminton-2526"
