import http.server
import socketserver
import json
import os
import httpx
from urllib.parse import parse_qs, urlparse
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

PORT = 8000

class VercelHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="api", **kwargs)
    
    # 添加CORS支持
    def add_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '86400')

    def do_OPTIONS(self):
        self.send_response(200)
        self.add_cors_headers()
        self.end_headers()
        return

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/models'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.add_cors_headers()
            self.end_headers()

            response = {
                "model": "qwen-plus",
                "api_type": "Qwen API",
                "status": "API mode (Local)",
                "device": "Qwen Cloud"
            }

            self.wfile.write(json.dumps(response).encode())
            return
        
        # 对于其他GET请求，使用默认处理
        return super().do_GET()

    def do_POST(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path.startswith('/api/chat'):
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

                print(f"发送请求到Qwen API: {QWEN3_API_ENDPOINT}")
                print(f"请求数据: {json.dumps(qwen_request, ensure_ascii=False)}")
                
                # 调用Qwen API
                response = httpx.post(
                    QWEN3_API_ENDPOINT,
                    headers={
                        "Authorization": f"Bearer {QWEN3_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json=qwen_request,
                    timeout=60.0
                )

                if response.status_code == 200:
                    result = response.json()
                    print(f"API响应内容: {json.dumps(result, ensure_ascii=False)}")
                    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')

                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.add_cors_headers()
                    self.end_headers()

                    self.wfile.write(json.dumps({"response": ai_response}).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.add_cors_headers()
                    self.end_headers()

                    error_message = f"API请求失败，状态码: {response.status_code}, 响应: {response.text}"
                    print(error_message)
                    self.wfile.write(json.dumps({"error": error_message}).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.add_cors_headers()
                self.end_headers()

                error_message = f"处理请求时发生错误: {str(e)}"
                print(error_message)
                self.wfile.write(json.dumps({"error": error_message}).encode())

            return

        self.send_response(404)
        self.add_cors_headers()
        self.end_headers()
        return

if __name__ == "__main__":
    with socketserver.TCPServer(("", PORT), VercelHandler) as httpd:
        print(f"本地API服务器运行在 http://localhost:{PORT}")
        httpd.serve_forever()
