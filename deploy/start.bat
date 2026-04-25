@echo off
chcp 65001 >nul
title BeatForge Drum Machine Server
echo.
echo  ╔══════════════════════════════════════╗
echo  ║   BeatForge - 智能鼓机伴奏软件       ║
echo  ║   本地服务器已启动                    ║
echo  ╚══════════════════════════════════════╝
echo.

:: Get local IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        echo   本机访问: http://localhost:8080
        echo   局域网访问: http:%%b:8080
        echo.
    )
)

echo   在手机/平板浏览器中打开局域网地址即可使用
echo   按 Ctrl+C 停止服务器
echo.

:: Use Python to serve (most Windows have it)
where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server 8080 --bind 0.0.0.0
) else (
    where python3 >nul 2>nul
    if %errorlevel%==0 (
        python3 -m http.server 8080 --bind 0.0.0.0
    ) else (
        echo   [错误] 未找到 Python，请先安装 Python 3
        echo   下载地址: https://www.python.org/downloads/
        echo   安装时请勾选 "Add Python to PATH"
        pause
        exit /b 1
    )
)
