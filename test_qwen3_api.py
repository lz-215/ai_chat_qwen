import requests
import json

def test_models_endpoint():
    """测试/api/models端点"""
    print("=== 测试/api/models端点 ===")
    response = requests.get("http://localhost:8000/api/models")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()

def test_chat_endpoint():
    """测试/api/chat端点"""
    print("=== 测试/api/chat端点 ===")
    url = "http://localhost:8000/api/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            {"role": "user", "content": "你好"}
        ]
    }

    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()

if __name__ == "__main__":
    test_models_endpoint()
    test_chat_endpoint()
