# Quick Git Sync with Batch file wrapper
# This allows you to double-click the file to run it

@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "sync.ps1"
pause
