@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERRO] NPM nao encontrado. Instale o Node.js: https://nodejs.org/
  pause
  exit /b 1
)

echo Iniciando servidor em http://127.0.0.1:8080 ...
start "" "http://127.0.0.1:8080"
npm.cmd run start
