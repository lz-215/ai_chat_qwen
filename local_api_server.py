import http.server
import socketserver
import json
import os
import httpx
import sys
import traceback
from urllib.parse import parse_qs, urlparse
from dotenv import load_dotenv

# 加载环境变量 (移到这里，确保在导入自定义模块前执行)
print("正在加载环境变量...")
load_dotenv(verbose=True)

# 导入我们新的 Qwen API 调用模块
from backend.qwen_api import call_qwen_api, QWEN_API_KEY as QWEN_PLUS_API_KEY, QWEN_MODEL_NAME as QWEN_PLUS_MODEL_NAME, QWEN_API_BASE as QWEN_PLUS_API_BASE

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation")

# 打印新的 Qwen Plus API 配置信息
print("\n--- Qwen Plus API (compatible-mode) ---")
print(f"Qwen Plus API Key (from qwen_api.py via env or default): {'是' if QWEN_PLUS_API_KEY else '否'}")
print(f"Qwen Plus Model (from qwen_api.py via env or default): {QWEN_PLUS_MODEL_NAME}")
print(f"Qwen Plus API Base (from qwen_api.py): {QWEN_PLUS_API_BASE}")
print("-------------------------------------\n")

print(f"API密钥是否已设置: {'是' if QWEN3_API_KEY else '否'}")
print(f"API端点: {QWEN3_API_ENDPOINT}")

if not QWEN3_API_KEY:
    print("警告: QWEN3_API_KEY 环境变量未设置。请确保在.env文件中配置了正确的API密钥。")
    print("当前工作目录:", os.getcwd())
    print("尝试查看.env文件是否存在:", os.path.exists(".env"))
    
    # 尝试从.env文件直接读取
    try:
        with open(".env", "r") as env_file:
            for line in env_file:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    if key == "QWEN3_API_KEY" and value:
                        QWEN3_API_KEY = value
                        print(f"从.env文件直接读取API密钥: {'成功' if QWEN3_API_KEY else '失败'}")
                        # 设置为环境变量
                        os.environ["QWEN3_API_KEY"] = QWEN3_API_KEY
    except Exception as e:
        print(f"尝试读取.env文件时出错: {str(e)}")

# 检查端口是否被占用，如果被占用则选择其他端口
PORT = 8001
try:
    with socketserver.TCPServer(("", PORT), None) as test_server:
        pass
except OSError:
    print(f"警告: 端口 {PORT} 已被占用，尝试使用其他端口...")
    for port_candidate in range(PORT + 1, PORT + 100):
        try:
            with socketserver.TCPServer(("", port_candidate), None) as test_server:
                PORT = port_candidate
                print(f"选择新端口: {PORT}")
                break
        except OSError:
            continue
    else:
        print(f"错误: 端口 {PORT} 及后续尝试的端口均被占用。请检查端口占用情况。")
        # 在这种情况下，可能需要退出或抛出异常，因为服务器无法启动
        # sys.exit(1) # 可以考虑，但这会直接终止脚本

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
                "api_type": "Qwen API (DashScope)",
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

            try:
                messages = request_data.get('messages', [])
                stream_requested = request_data.get('stream', False) # 前端可以发送 'stream': true 来请求流式输出

                if not messages:
                    raise ValueError("请求体中缺少 'messages' 字段或为空。")

                # 验证消息格式
                for i, msg in enumerate(messages):
                    if 'role' not in msg or 'content' not in msg:
                        raise ValueError(f"消息格式错误: 缺少必要字段 role 或 content。消息: {msg}")
                
                # 调用新的 qwen_api 模块
                api_response = call_qwen_api(messages, stream=stream_requested)

                if stream_requested:
                    # 处理流式响应 (基础实现，可能需要根据具体前端需求调整)
                    # http.server 不像 FastAPI 那样原生支持优雅的流式响应
                    # 这里我们尝试发送 SSE (Server-Sent Events)
                    if isinstance(api_response, httpx.Response) or isinstance(api_response, requests.Response): # 确保是 Response 对象
                        self.send_response(200)
                        self.send_header('Content-type', 'text/event-stream')
                        self.send_header('Cache-Control', 'no-cache')
                        self.add_cors_headers()
                        self.end_headers()
                        
                        try:
                            for line in api_response.iter_lines():
                                if line:
                                    # Dashscope SSE 格式通常是 "data: {...}\n\n"
                                    # 我们直接转发从 call_qwen_api 收到的原始行
                                    self.wfile.write(line + b'\n\n') # SSE 要求事件以双换行结束
                                    self.wfile.flush() #确保立即发送
                            # Dashscope 流的结束通常由一个特殊的 data: [DONE] 事件表示
                            # call_qwen_api 中的流式处理逻辑应负责处理这个
                            # 这里我们只是确保所有缓冲的数据都已发送
                            self.wfile.flush()
                        except Exception as stream_err:
                            print(f"处理流式响应时出错: {stream_err}")
                            # 尝试发送一个错误事件到客户端（如果头部已发送）
                            error_event = f"event: error\ndata: {json.dumps({'error': 'Stream processing error', 'details': str(stream_err)})}\n\n"
                            try:
                                self.wfile.write(error_event.encode('utf-8'))
                                self.wfile.flush()
                            except Exception as final_err:
                                print(f"无法向客户端发送流错误: {final_err}")
                        finally:
                            if hasattr(api_response, 'close'): # 关闭原始响应流
                                api_response.close()
                    else: # 如果 call_qwen_api 返回了错误字典而不是 Response 对象
                        self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.add_cors_headers()
                        self.end_headers()
                        error_message = api_response.get("error", "Stream API call failed internally")
                        details = api_response.get("details", "")
                        self.wfile.write(json.dumps({"error": error_message, "details": details}).encode())

                else:
                    # 处理非流式响应
                    if api_response and "error" not in api_response:
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.add_cors_headers()
                        self.end_headers()
                        # qwen_api.py 返回的已经是符合 OpenAI 格式的 JSON
                        self.wfile.write(json.dumps(api_response).encode())
                    else:
                        status_code = 500 # 默认内部服务器错误
                        error_message = "API 调用失败"
                        details = ""
                        if isinstance(api_response, dict):
                             error_message = api_response.get("error", error_message)
                             details = api_response.get("details", "")
                             # 尝试从 details 中提取更具体的 status_code (如果API返回了类似HTTP的错误结构)
                             if isinstance(details, dict) and "status_code" in details:
                                 status_code = details.get("status_code", 500)
                        
                        self.send_response(status_code)
                        self.send_header('Content-type', 'application/json')
                        self.add_cors_headers()
                        self.end_headers()
                        self.wfile.write(json.dumps({"error": error_message, "details": details}).encode())

            except ValueError as ve: # 处理请求数据验证错误
                self.send_response(400) # Bad Request
                self.send_header('Content-type', 'application/json')
                self.add_cors_headers()
                self.end_headers()
                error_message = f"请求无效: {str(ve)}"
                print(error_message)
                self.wfile.write(json.dumps({"error": error_message}).encode())
            
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.add_cors_headers()
                self.end_headers()

                error_message = f"处理请求时发生错误: {str(e)}"
                print(error_message)
                print(traceback.format_exc())
                self.wfile.write(json.dumps({"error": error_message}).encode())

            return

        self.send_response(404)
        self.add_cors_headers()
        self.end_headers()
        return

if __name__ == "__main__":
    try:
        with socketserver.TCPServer(("", PORT), VercelHandler) as httpd:
            print(f"本地API服务器运行在 http://localhost:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"服务器启动错误: {str(e)}")
        print(traceback.format_exc())
