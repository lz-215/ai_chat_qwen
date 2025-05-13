import requests
import json
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 获取API密钥和端点
QWEN3_API_KEY = os.getenv("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.getenv("QWEN3_API_ENDPOINT")

def test_qwen_api():
    """测试Qwen API连接"""
    print("=== 测试Qwen API连接 ===")
    print(f"API Key: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}")
    print(f"API Endpoint: {QWEN3_API_ENDPOINT}")

    try:
        # 构建请求数据
        payload = {
            "model": "qwen-plus",
            "messages": [{"role": "user", "content": "你好"}],
            "temperature": 0.7,
            "top_p": 0.8,
            "max_tokens": 2000
        }
        
        # 发送请求
        response = requests.post(
            QWEN3_API_ENDPOINT,
            headers={
                "Authorization": f"Bearer {QWEN3_API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload,
            verify=False  # 禁用SSL验证，仅用于测试
        )
        
        print(f"Response status code: {response.status_code}")
        if response.status_code == 200:
            print("Qwen API连接正常")
            print(f"API响应: {response.text}")
            return True
        else:
            print(f"Qwen API连接异常: {response.text}")
            return False
            
    except Exception as e:
        import traceback
        print(f"测试Qwen API连接时出错: {str(e)}")
        print(traceback.format_exc())
        return False

if __name__ == "__main__":
    test_qwen_api()
