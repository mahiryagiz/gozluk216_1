#!/bin/bash

echo "🚀 Gözlük216 başlatılıyor..."

# 1. MySQL'i başlat
echo "📦 MySQL başlatılıyor..."
brew services start mysql 2>/dev/null

# MySQL'in hazır olmasını bekle
sleep 2
until mysql -u root -p1223334567 -e "SELECT 1" &>/dev/null; do
  echo "   MySQL bekleniyor..."
  sleep 1
done
echo "✅ MySQL hazır"

# 2. Backend API'yi başlat (arka planda)
echo "⚙️  Backend API başlatılıyor (port 5050)..."
cd GozlukApi
export DOTNET_ROOT="/opt/homebrew/opt/dotnet/libexec"
dotnet run --launch-profile http &
API_PID=$!
cd ..

# API'nin ayağa kalkmasını bekle
sleep 5
echo "✅ Backend API çalışıyor → http://localhost:5000"

# 3. Frontend'i başlat
echo "🎨 Frontend başlatılıyor (port 5173)..."
cd GozlukFrontend
npx vite --host &
FRONTEND_PID=$!
cd ..

sleep 3
echo ""
echo "========================================="
echo "✅ Tüm servisler çalışıyor!"
echo "========================================="
echo "🌐 Frontend  → http://localhost:5173"
echo "⚙️  Backend   → http://localhost:5050"
echo "📦 MySQL     → localhost:3306"
echo ""
echo "Durdurmak için: Ctrl+C"
echo "========================================="

# Ctrl+C ile hepsini durdur
trap "echo '🛑 Servisler durduruluyor...'; kill $API_PID $FRONTEND_PID 2>/dev/null; echo '✅ Durduruldu.'; exit 0" SIGINT SIGTERM

wait
