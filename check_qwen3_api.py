import httpx
import json
import asyncio
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv("backend/.env")

# 获取API密钥和端点
QWEN3_API_KEY = os.getenv("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.getenv("QWEN3_API_ENDPOINT")

async def check_qwen3_api():
    """检查Qwen3 API连接"""
    print("=== 检查Qwen3 API连接 ===")
    print(f"API Key: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}")
    print(f"API Endpoint: {QWEN3_API_ENDPOINT}")

    try:
        # 尝试使用不同的IP地址
        # 这里我们尝试使用IP地址而不是域名，以解决DNS解析问题
        # 注意：这只是一个示例，实际IP地址可能不同
        # 您可能需要使用nslookup或ping命令找到正确的IP地址

        # 尝试使用原始端点
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                QWEN3_API_ENDPOINT,
                headers={
                    "Authorization": f"Bearer {QWEN3_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "qwen-plus",  # 使用qwen-plus而不是qwen3-plus
                    "messages": [{"role": "user", "content": "你好"}],
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "max_tokens": 2000
                }
            )

            print(f"Response status code: {response.status_code}")
            if response.status_code == 200:
                print("Qwen3 API连接正常")
                print(f"API响应: {response.text}")
                return True
            else:
                print(f"Qwen3 API连接异常: {response.text}")
                return False

    except Exception as e:
        import traceback
        print(f"检查Qwen3 API连接时出错: {str(e)}")
        print(traceback.format_exc())
        return False

# 运行检查
if __name__ == "__main__":
    asyncio.run(check_qwen3_api())
