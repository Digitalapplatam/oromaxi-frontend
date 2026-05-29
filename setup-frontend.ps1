# OROMAXI Frontend Setup Script
# Ejecuta este script en PowerShell desde la carpeta frontend

Write-Host "🚀 Iniciando setup del Frontend OROMAXI..." -ForegroundColor Cyan

# 1. Configurar Git
Write-Host "`n📦 Configurando Git..." -ForegroundColor Yellow
git config user.name "Digitalapplatam"
git config user.email "crojas@orocash.ec"

# 2. Inicializar repositorio git si no existe
if (-not (Test-Path ".\.git")) {
    Write-Host "Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "feat: Initialize OROMAXI frontend with Next.js 14"
} else {
    Write-Host "Repositorio Git ya existe" -ForegroundColor Green
}

# 3. Instalar dependencias
Write-Host "`n📚 Instalando dependencias con npm..." -ForegroundColor Yellow
npm install

# 4. Verificar instalación
Write-Host "`n✅ Setup completado!" -ForegroundColor Green
Write-Host "`nPróximos pasos:" -ForegroundColor Cyan
Write-Host "1. Para desarrollo local: npm run dev"
Write-Host "2. Frontend estará en: http://localhost:3000"
Write-Host "3. Para subir a GitHub:"
Write-Host "   git remote add origin https://github.com/Digitalapplatam/oromaxi-frontend.git"
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host "4. Para deploy a Vercel: vercel deploy"
