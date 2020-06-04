@echo off
if "%OS%" == "Windows_NT" setlocal

setlocal enabledelayedexpansion
set INSTALLER_HOME="%~dp0"

call node %INSTALLER_HOME%\resources\app\index.js