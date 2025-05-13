from http.server import BaseHTTPRequestHandler
import json
import os
import httpx

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

class handler(BaseHTTPRequestHandler):
    def set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.set_cors_headers()
        self.end_headers()
    
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
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
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                json=qwen_request,
                timeout=60.0
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"response": ai_response}).encode('utf-8'))
            else:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.set_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": f"API request failed with status code: {response.status_code}",
                    "details": response.text
                }).encode('utf-8'))
        
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
