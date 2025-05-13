from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
from urllib.parse import parse_qs

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

# 添加CORS支持
def add_cors_headers(handler):
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    handler.send_header('Access-Control-Max-Age', '86400')

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()
        return

    def do_GET(self):
        if self.path.startswith('/api/models'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            add_cors_headers(self)
            self.end_headers()

            response = {
                "model": "qwen-plus",
                "api_type": "Qwen API",
                "status": "API mode",
                "device": "Qwen Cloud"
            }

            self.wfile.write(json.dumps(response).encode())
            return

        self.send_response(404)
        add_cors_headers(self)
        self.end_headers()
        return

    def do_POST(self):
        if self.path.startswith('/api/chat'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))

            # 处理聊天请求
            try:
                messages = request_data.get('messages', [])

                # 构建请求数据 - 正确的Qwen API格式
                qwen_request = {
                    "model": "qwen-plus",
                    "messages": messages,
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "max_tokens": 2000
                }

                # 调用Qwen API，禁用SSL验证（仅用于测试）
                print(f"正在调用Qwen API: {QWEN3_API_ENDPOINT}")
                print(f"请求数据: {json.dumps(qwen_request, ensure_ascii=False)}")

                try:
                    response = httpx.post(
                        QWEN3_API_ENDPOINT,
                        headers={
                            "Authorization": f"Bearer {QWEN3_API_KEY}",
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        json=qwen_request,
                        timeout=60.0,
                        verify=False  # 禁用SSL验证，仅用于测试
                    )
                    print(f"API响应状态码: {response.status_code}")
                except Exception as e:
                    import traceback
                    print(f"调用API时出错: {str(e)}")
                    print(traceback.format_exc())
                    raise

                if response.status_code == 200:
                    result = response.json()
                    print(f"API响应内容: {json.dumps(result, ensure_ascii=False)}")
                    # 使用正确的Qwen API响应格式
                    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')

                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    add_cors_headers(self)
                    self.end_headers()

                    self.wfile.write(json.dumps({"response": ai_response}).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    add_cors_headers(self)
                    self.end_headers()

                    error_message = f"API request failed with status code: {response.status_code}, response: {response.text}"
                    self.wfile.write(json.dumps({"error": error_message}).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                add_cors_headers(self)
                self.end_headers()

                self.wfile.write(json.dumps({"error": str(e)}).encode())

            return

        self.send_response(404)
        add_cors_headers(self)
        self.end_headers()
        return
