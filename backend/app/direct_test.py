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
    """直接测试Qwen API"""
    print("="*50)
    print("直接测试Qwen API")
    print(f"API Key: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}")
    print(f"API Endpoint: {QWEN3_API_ENDPOINT}")
    
    # 测试简单问候
    print("\n=== 测试简单问候 ===")
    formatted_messages = [{"role": "user", "content": "你好"}]
    response = await call_qwen_api(formatted_messages)
    print(f"响应: {response}")
    
    # 测试复杂查询
    print("\n=== 测试复杂查询 ===")
    formatted_messages = [{"role": "user", "content": "请介绍一下你自己"}]
    response = await call_qwen_api(formatted_messages)
    print(f"响应: {response}")
    
    # 测试多轮对话
    print("\n=== 测试多轮对话 ===")
    formatted_messages = [
        {"role": "user", "content": "你好"},
        {"role": "assistant", "content": "你好！我是通义千问，阿里巴巴集团旗下的超大规模语言模型。有什么可以帮助你的吗？"},
        {"role": "user", "content": "你能做什么？"}
    ]
    response = await call_qwen_api(formatted_messages)
    print(f"响应: {response}")
    
    print("="*50)

async def call_qwen_api(formatted_messages):
    """调用Qwen API"""
    print(f"请求消息: {json.dumps(formatted_messages, ensure_ascii=False)}")
    
    request_data = {
        "model": "qwen-plus",
        "messages": formatted_messages,
        "temperature": 0.7,
        "top_p": 0.8,
        "max_tokens": 2000
    }
    
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
            
            print(f"响应状态码: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and len(result["choices"]) > 0:
                    return result["choices"][0]["message"]["content"]
                else:
                    return f"无效的响应格式: {response.text}"
            else:
                try:
                    error_detail = response.json().get("error", {}).get("message", "Unknown error")
                except Exception:
                    error_detail = response.text
                return f"API错误: {error_detail}"
    
    except Exception as e:
        import traceback
        return f"请求错误: {str(e)}"

if __name__ == "__main__":
    asyncio.run(test_qwen_api())
