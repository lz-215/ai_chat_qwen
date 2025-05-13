import requests
import json
import time

def test_api_with_logs():
    """测试API并打印详细日志"""
    print("="*50)
    print("测试API并打印详细日志")
    
    # 测试/api/models端点
    print("\n=== 测试/api/models端点 ===")
    url = "http://localhost:8000/api/models"
    response = requests.get(url)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # 测试/api/chat端点 - 简单问候
    print("\n=== 测试/api/chat端点 - 简单问候 ===")
    url = "http://localhost:8000/api/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            {"role": "user", "content": "你好"}
        ]
    }
    print(f"Request: {json.dumps(data, ensure_ascii=False)}")
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # 等待一下，让服务器有时间处理和打印日志
    time.sleep(1)
    
    # 测试/api/chat端点 - 复杂查询
    print("\n=== 测试/api/chat端点 - 复杂查询 ===")
    url = "http://localhost:8000/api/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            {"role": "user", "content": "请介绍一下你自己"}
        ]
    }
    print(f"Request: {json.dumps(data, ensure_ascii=False)}")
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # 等待一下，让服务器有时间处理和打印日志
    time.sleep(1)
    
    # 测试/api/chat端点 - 多轮对话
    print("\n=== 测试/api/chat端点 - 多轮对话 ===")
    url = "http://localhost:8000/api/chat"
    headers = {"Content-Type": "application/json"}
    data = {
        "messages": [
            {"role": "user", "content": "你好"},
            {"role": "assistant", "content": "你好！我是通义千问，阿里巴巴集团旗下的超大规模语言模型。有什么可以帮助你的吗？"},
            {"role": "user", "content": "你能做什么？"}
        ]
    }
    print(f"Request: {json.dumps(data, ensure_ascii=False)}")
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    print("="*50)

if __name__ == "__main__":
    test_api_with_logs()
