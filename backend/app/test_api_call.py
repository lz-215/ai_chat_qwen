import asyncio
import httpx
import json
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv("../.env")

# 获取API密钥和端点
QWEN3_API_KEY = os.getenv("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.getenv("QWEN3_API_ENDPOINT")

async def test_qwen_api():
    """测试Qwen API调用"""
    print("="*50)
    print("测试Qwen API调用")
    print(f"API Key: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}")
    print(f"API Endpoint: {QWEN3_API_ENDPOINT}")
    
    request_data = {
        "model": "qwen-plus",
        "messages": [{"role": "user", "content": "你好，请介绍一下你自己"}],
        "temperature": 0.7,
        "top_p": 0.8,
        "max_tokens": 2000
    }
    print(f"Request data: {json.dumps(request_data, ensure_ascii=False)}")
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                QWEN3_API_ENDPOINT,
                headers={
                    "Authorization": f"Bearer {QWEN3_API_KEY}",
                    "Content-Type": "application/json"
                },
                json=request_data
            )
            
            print(f"Response status code: {response.status_code}")
            print(f"Response headers: {response.headers}")
            print(f"Response body: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    print(f"Generated response: {result['choices'][0]['message']['content']}")
                else:
                    print(f"Invalid response format: {response.text}")
            else:
                try:
                    error_detail = response.json().get("error", {}).get("message", "Unknown error")
                except Exception:
                    error_detail = response.text
                print(f"API Error: {error_detail}")
    
    except Exception as e:
        import traceback
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
    
    print("="*50)

if __name__ == "__main__":
    asyncio.run(test_qwen_api())
