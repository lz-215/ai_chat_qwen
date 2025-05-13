import requests
import json

def test_complex_query():
    """测试复杂查询"""
    print("=== 测试复杂查询 ===")
    url = "http://localhost:8000/api/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            {"role": "user", "content": "请介绍一下通义千问3.5的能力"}
        ]
    }

    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()

if __name__ == "__main__":
    test_complex_query()
