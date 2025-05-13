import requests
import json
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()  # 从当前目录加载.env文件

# 获取API密钥和端点
QWEN3_API_KEY = os.getenv("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.getenv("QWEN3_API_ENDPOINT")

def check_qwen3_api():
    """检查Qwen3 API连接"""
    print("=== 检查Qwen3 API连接 ===")
    print(f"API Key: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}")
    print(f"API Endpoint: {QWEN3_API_ENDPOINT}")

    try:
        # 尝试使用原始端点
        response = requests.post(
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
            },
            verify=False  # 禁用SSL验证，仅用于测试
        )

        print(f"Response status code: {response.status_code}")
        if response.status_code == 200:
            print("Qwen API连接正常")
            result = response.json()
            print(f"API响应: {json.dumps(result, ensure_ascii=False)}")
            return True
        else:
            print(f"Qwen API连接异常: {response.text}")
            return False

    except Exception as e:
        import traceback
        print(f"检查Qwen API连接时出错: {str(e)}")
        print(traceback.format_exc())
        return False

# 运行检查
if __name__ == "__main__":
    check_qwen3_api()
