@echo off
chcp 65001 >nul
echo ============================================
echo   GIS实验三 WebGIS 实验项目 - 启动脚本
echo ============================================
echo.
echo [1] 启动页面服务（端口 8000）...
start "GIS-页面服务" cmd /c "cd /d D:\GIS实验三 && python -m http.server 8000"
echo     页面服务已启动: http://localhost:8000/
echo.
echo [2] 检查本地瓦片文件...
if exist "D:\GIS实验三\tiles-data\china.mbtiles" (
    echo     发现 china.mbtiles，启动瓦片服务（端口 8080）...
    start "GIS-瓦片服务" cmd /c "cd /d D:\GIS实验三 && npx tileserver-gl-light tiles-data\china.mbtiles -p 8080"
    echo     瓦片服务已启动: http://localhost:8080/
) else (
    echo     未发现 china.mbtiles，将使用在线 OSM 底图。
    echo     china.mbtiles 生成中，请等待 Planetiler 完成后再重启本脚本。
)
echo.
echo ============================================
echo   请在浏览器中打开: http://localhost:8000/
echo   按任意键退出本窗口（服务会保持运行）
echo ============================================
pause >nul
