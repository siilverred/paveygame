@echo off
title Pavey Game - Offline Wi-Fi Server
echo ========================================================
echo   PAVEY BEAT THE STORM - LOCAL OFFLINE SERVER
echo ========================================================
echo.
echo Menjalankan server game offline lokal...
echo Pastikan Hotspot Laptop aktif jika ingin dimainkan oleh HP lain.
echo.
cd /d "%~dp0"
node scripts/offline_server.js
pause
