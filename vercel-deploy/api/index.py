from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
from urllib.parse import parse_qs

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

# 调试信息
print(f"API密钥前5位: {QWEN3_API_KEY[:5] if QWEN3_API_KEY else 'None'}")
print(f"API端点: {QWEN3_API_ENDPOINT}")

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()
        return

    def do_GET(self):
        if self.path.startswith('/api/models'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            response = {
                "model": "qwen-plus",
                "api_type": "Qwen API",
                "status": "API mode",
                "device": "Qwen Cloud",
                "api_key_status": "Available" if QWEN3_API_KEY else "Missing",
                "api_endpoint": QWEN3_API_ENDPOINT
            }

            self.wfile.write(json.dumps(response).encode())
            return

        # 添加健康检查端点
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
            return

        self.send_response(404)
        self.send_header('Access-Control-Allow-Origin', '*')
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

                # 检查API密钥是否存在
                if not QWEN3_API_KEY:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "API密钥未设置，请在Vercel中配置QWEN3_API_KEY环境变量"}).encode())
                    return

                # 调用Qwen API
                try:
                    print(f"正在调用Qwen API: {QWEN3_API_ENDPOINT}")
                    print(f"请求数据: {json.dumps(qwen_request, ensure_ascii=False)}")

                    response = httpx.post(
                        QWEN3_API_ENDPOINT,
                        headers={
                            "Authorization": f"Bearer {QWEN3_API_KEY}",
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        json=qwen_request,
                        timeout=60.0
                    )
                    print(f"API响应状态码: {response.status_code}")
                except Exception as e:
                    print(f"调用API时出错: {str(e)}")
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"调用API时出错: {str(e)}"}).encode())
                    return

                if response.status_code == 200:
                    result = response.json()
                    print(f"API响应内容: {json.dumps(result, ensure_ascii=False)}")
                    # 使用正确的Qwen API响应格式
                    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')

                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()

                    self.wfile.write(json.dumps({"response": ai_response}).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()

                    error_message = f"API请求失败，状态码: {response.status_code}, 响应: {response.text}"
                    self.wfile.write(json.dumps({"error": error_message}).encode())

            except Exception as e:
                print(f"处理请求时发生错误: {str(e)}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                self.wfile.write(json.dumps({"error": f"处理请求时发生错误: {str(e)}"}).encode())

            return

        self.send_response(404)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        return
