from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
import sys
import traceback

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

# 调试信息
print(f"API Key: {'已设置' if QWEN3_API_KEY else '未设置'}")
print(f"API Endpoint: {QWEN3_API_ENDPOINT}")

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
            print(f"收到POST请求: {self.path}")
            content_length = int(self.headers.get('Content-Length', 0))
            print(f"内容长度: {content_length}")

            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            print(f"请求数据: {json.dumps(request_data, ensure_ascii=False)[:200]}...")

            messages = request_data.get('messages', [])
            print(f"消息数量: {len(messages)}")

            # 构建请求数据
            qwen_request = {
                "model": "qwen-plus",
                "messages": messages,
                "temperature": 0.7,
                "top_p": 0.8,
                "max_tokens": 2000
            }

            print(f"准备调用Qwen API: {QWEN3_API_ENDPOINT}")
            print(f"请求头: Authorization: Bearer {'*' * 8}")

            try:
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

                print(f"API响应状态码: {response.status_code}")

                if response.status_code == 200:
                    result = response.json()
                    print(f"API响应内容: {json.dumps(result, ensure_ascii=False)[:200]}...")
                    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')

                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.set_cors_headers()
                    self.end_headers()

                    response_data = {"response": ai_response}
                    print(f"发送响应: {json.dumps(response_data, ensure_ascii=False)[:200]}...")
                    self.wfile.write(json.dumps(response_data).encode('utf-8'))
                else:
                    print(f"API错误响应: {response.text[:200]}...")
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.set_cors_headers()
                    self.end_headers()

                    error_data = {
                        "error": f"API request failed with status code: {response.status_code}",
                        "details": response.text
                    }
                    print(f"发送错误响应: {json.dumps(error_data, ensure_ascii=False)[:200]}...")
                    self.wfile.write(json.dumps(error_data).encode('utf-8'))

            except Exception as api_error:
                print(f"调用API时出错: {str(api_error)}")
                print(traceback.format_exc())
                raise

        except Exception as e:
            print(f"处理请求时出错: {str(e)}")
            print(traceback.format_exc())

            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()

            error_data = {"error": str(e), "traceback": traceback.format_exc()}
            print(f"发送异常响应: {json.dumps(error_data, ensure_ascii=False)[:200]}...")
            self.wfile.write(json.dumps(error_data).encode('utf-8'))
