# 本地模拟Vercel部署指南

本指南将帮助您在本地环境中模拟Vercel部署，以便在部署到Vercel之前测试您的应用。

## 准备工作

1. 确保已安装以下软件：
   - Node.js 和 npm
   - Python 3.8+
   - Git

2. 创建`.env`文件并添加以下内容：
   ```
   QWEN3_API_KEY=您的API密钥
   QWEN3_API_ENDPOINT=https://api.qwen.ai/v1/chat/completions
   ```

## 使用方法

### 方法1：使用开发环境

这种方法适合开发过程中使用，前端使用Vite的开发服务器。

1. 运行安装脚本：
   ```
   setup_local_vercel.bat
   ```

2. 启动本地开发环境：
   ```
   run_local_vercel.bat
   ```

3. 访问以下地址：
   - 前端应用：http://localhost:4173
   - API服务器：http://localhost:8000

### 方法2：模拟生产环境

这种方法更接近Vercel的实际部署环境，使用静态文件服务器。

1. 运行模拟脚本：
   ```
   simulate_vercel.bat
   ```

2. 访问以下地址：
   - 应用：http://localhost:3000
   - API服务器：http://localhost:8000

## 文件说明

- `setup_local_vercel.bat` - 安装必要的依赖
- `run_local_vercel.bat` - 启动本地开发环境
- `local_api_server.py` - 本地API服务器，模拟Vercel的Serverless函数
- `simulate_vercel.bat` - 模拟Vercel生产环境

## 注意事项

1. 本地环境与Vercel环境可能存在差异，特别是在路由和环境变量处理方面。
2. 确保在`.env`文件中设置了正确的API密钥。
3. 如果遇到CORS问题，请检查API服务器是否正确设置了CORS头。
4. 本地模拟环境不包含Vercel的一些高级功能，如Edge Functions和Middleware。

## 部署到Vercel

测试完成后，您可以使用以下命令将项目部署到Vercel：

1. 安装Vercel CLI：
   ```
   npm install -g vercel
   ```

2. 登录Vercel：
   ```
   vercel login
   ```

3. 部署项目：
   ```
   vercel
   ```

4. 按照提示完成部署。

## 故障排除

- 如果API请求失败，请检查API密钥是否正确设置。
- 如果前端无法连接到API，请检查代理设置和CORS配置。
- 如果构建失败，请检查依赖项是否正确安装。
