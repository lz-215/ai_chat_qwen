# 部署指南

本文档提供了将AI聊天应用部署到Vercel的详细步骤。

## 前提条件

1. 一个[Vercel](https://vercel.com)账户
2. 一个[GitHub](https://github.com)账户（用于存储代码）
3. 有效的Qwen3 API密钥

## 部署步骤

### 1. 准备代码仓库

1. 将项目代码推送到GitHub仓库：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

### 2. 在Vercel上部署

1. 登录[Vercel](https://vercel.com)
2. 点击"New Project"
3. 导入你的GitHub仓库
4. 配置项目：
   - 框架预设：选择"Other"
   - 构建命令：`cd frontend && npm install && npm run build`
   - 输出目录：`frontend/dist`
   - 安装命令：`npm install`
   - 根目录：`/`

5. 配置环境变量：
   - `QWEN3_API_KEY`: 你的Qwen3 API密钥
   - `QWEN3_API_ENDPOINT`: Qwen3 API端点（默认为https://api.qwen.ai/v1/chat/completions）

6. 点击"Deploy"开始部署

### 3. 验证部署

1. 部署完成后，Vercel会提供一个URL（例如：https://your-project-name.vercel.app）
2. 访问该URL，确保应用正常运行
3. 测试聊天功能，确保API请求正常工作

### 4. 自定义域名（可选）

1. 在Vercel项目设置中，进入"Domains"选项卡
2. 添加你的自定义域名
3. 按照Vercel提供的说明配置DNS记录

## 故障排除

如果部署过程中遇到问题，请检查以下几点：

1. 确保所有环境变量都已正确设置
2. 检查Vercel的构建日志，查找可能的错误
3. 确保API密钥有效且未过期
4. 检查前端代码中的API请求路径是否正确

## 更新部署

当你对代码进行更改并推送到GitHub仓库时，Vercel会自动重新部署你的应用。

## 注意事项

- 确保不要将敏感信息（如API密钥）直接硬编码在代码中
- 使用环境变量来存储敏感信息
- 定期检查API使用情况，避免超出限制
