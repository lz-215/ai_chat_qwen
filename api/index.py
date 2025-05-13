from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
from urllib.parse import parse_qs

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/models'):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
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
                
                # 构建请求数据
                qwen_request = {
                    "model": "qwen-plus",
                    "messages": messages,
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "max_tokens": 2000
                }
                
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
                    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    
                    self.wfile.write(json.dumps({"response": ai_response}).encode())
                else:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    
                    error_message = f"API request failed with status code: {response.status_code}"
                    self.wfile.write(json.dumps({"error": error_message}).encode())
            
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            
            return
        
        self.send_response(404)
        self.end_headers()
        return
