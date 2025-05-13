import requests
import json

def test_models_api():
    """测试模型信息API"""
    try:
        response = requests.get('http://localhost:8000/api/models')
        print("模型API状态码:", response.status_code)
        if response.ok:
            print("模型API响应:", json.dumps(response.json(), ensure_ascii=False, indent=2))
            return True
        else:
            print("模型API错误:", response.text)
            return False
    except Exception as e:
        print("模型API异常:", str(e))
        return False

def test_chat_api():
    """测试聊天API"""
    try:
        payload = {
            "messages": [
                {"role": "user", "content": "你好"}
            ]
        }
        response = requests.post(
            'http://localhost:8000/api/chat',
            json=payload
        )
        print("聊天API状态码:", response.status_code)
        if response.ok:
            print("聊天API响应:", json.dumps(response.json(), ensure_ascii=False, indent=2))
            return True
        else:
            print("聊天API错误:", response.text)
            return False
    except Exception as e:
        print("聊天API异常:", str(e))
        return False

if __name__ == "__main__":
    print("===== 测试前后端API连通性 =====")
    print("\n1. 测试模型信息API")
    models_ok = test_models_api()
    
    print("\n2. 测试聊天API")
    chat_ok = test_chat_api()
    
    print("\n===== 测试结果汇总 =====")
    print("模型API:", "✓ 连通" if models_ok else "✗ 未连通")
    print("聊天API:", "✓ 连通" if chat_ok else "✗ 未连通") 