@echo off
echo 启动本地Vercel开发环境...

REM 安装必要的依赖
pip install python-dotenv httpx

REM 启动API服务器
start cmd /k "python local_api_server.py"

REM 构建并启动前端
cd frontend
start cmd /k "npm run build && npm run preview"
cd ..

echo 本地Vercel环境已启动！
echo API服务器运行在: http://localhost:8000
echo 前端应用运行在: http://localhost:4173
echo 按任意键停止服务...
pause > nul

REM 关闭所有启动的进程
taskkill /f /im python.exe
taskkill /f /im node.exe
