#!/bin/bash

# 进入前端目录
cd frontend

# 安装依赖
npm install

# 构建前端
npm run build

# 返回根目录
cd ..

# 打印构建完成信息
echo "Build completed successfully!"
