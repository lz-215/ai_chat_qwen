@echo off
echo 模拟Vercel部署环境...

REM 检查是否安装了必要的工具
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到npm，请安装Node.js
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到python，请安装Python
    exit /b 1
)

REM 安装必要的依赖
echo 安装必要的依赖...
pip install python-dotenv httpx
npm install -g serve

REM 构建前端
echo 构建前端应用...
cd frontend
call npm install
call npm run build
cd ..

REM 创建dist目录（如果不存在）
if not exist dist mkdir dist

REM 复制前端构建文件到dist目录
echo 复制前端构建文件...
xcopy /E /I /Y frontend\dist dist

REM 复制API文件到dist目录
echo 复制API文件...
if not exist dist\api mkdir dist\api
copy api\index.py dist\api\

REM 复制Vercel配置文件
echo 复制Vercel配置文件...
copy vercel.json dist\

REM 启动API服务器
echo 启动API服务器...
start cmd /k "python local_api_server.py"

REM 启动静态文件服务器
echo 启动静态文件服务器...
start cmd /k "serve -s dist -l 3000"

echo.
echo 模拟Vercel部署环境已启动！
echo API服务器运行在: http://localhost:8000
echo 应用运行在: http://localhost:3000
echo.
echo 这个环境模拟了Vercel的生产部署结构。
echo 按任意键停止服务...
pause > nul

REM 关闭所有启动的进程
taskkill /f /im python.exe
taskkill /f /im node.exe
