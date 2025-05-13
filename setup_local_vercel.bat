@echo off
echo 安装Vercel CLI和必要依赖...
npm install -g vercel
pip install -r requirements.txt

echo 安装前端依赖...
cd frontend
npm install
cd ..

echo 设置完成！
