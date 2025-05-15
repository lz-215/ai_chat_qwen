from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
import traceback
import time
from urllib.parse import parse_qs, urlparse

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions")

# 调试信息
print(f"API Key: {'已设置' if QWEN3_API_KEY else '未设置'}")
print(f"API Endpoint: {QWEN3_API_ENDPOINT}")

# 如果API密钥未设置，尝试从.env文件加载
if not QWEN3_API_KEY:
    try:
        import dotenv
        dotenv.load_dotenv()
        QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
        QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", QWEN3_API_ENDPOINT)
        print(f"从.env加载: API Key: {'已设置' if QWEN3_API_KEY else '未设置'}")
        print(f"从.env加载: API Endpoint: {QWEN3_API_ENDPOINT}")
    except ImportError:
        print("dotenv 模块未安装，无法从.env文件加载")
    except Exception as e:
        print(f"加载.env文件时出错: {str(e)}")

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

    def do_GET(self):
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            query_params = parse_qs(parsed_url.query)

            print(f"收到GET请求: {self.path}")
            print(f"请求头: {dict(self.headers)}")
            print(f"查询参数: {query_params}")

            # 添加测试端点
            if path.startswith('/api/test'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.set_cors_headers()
                self.end_headers()

                response_data = {
                    "status": "ok",
                    "message": "API测试端点正常工作",
                    "env": {
                        "QWEN3_API_KEY_SET": bool(QWEN3_API_KEY),
                        "API_ENDPOINT": QWEN3_API_ENDPOINT,
                        "QWEN_MODEL_NAME": os.environ.get("QWEN_MODEL_NAME", "qwen-plus")
                    },
                    "headers": dict(self.headers),
                    "path": self.path,
                    "method": self.command
                }

                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                return

            # 处理模型信息请求
            if path.startswith('/api/models'):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.set_cors_headers()
                self.end_headers()

                response_data = {
                    "model": os.environ.get("QWEN_MODEL_NAME", "qwen-plus"),
                    "api_type": "Qwen API (DashScope)",
                    "status": "API mode (Vercel)",
                    "device": "Qwen Cloud"
                }

                print(f"发送模型信息响应: {json.dumps(response_data, ensure_ascii=False)}")
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                return

            # 默认响应
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found", "path": path}).encode('utf-8'))

        except Exception as e:
            print(f"处理GET请求时出错: {str(e)}")
            print(traceback.format_exc())

            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e),
                "traceback": traceback.format_exc() if os.environ.get("DEBUG") == "true" else None
            }).encode('utf-8'))

    def do_POST(self):
        try:
            parsed_url = urlparse(self.path)
            path = parsed_url.path

            print(f"收到POST请求: {self.path}")
            print(f"请求头: {dict(self.headers)}")

            # 处理聊天请求
            if path.startswith('/api/chat'):
                print(f"处理聊天POST请求: {self.path}")

                # 检查API密钥是否可用
                if not QWEN3_API_KEY:
                    print("错误: API密钥未设置")
                    raise ValueError("API密钥未设置，请在环境变量中设置QWEN3_API_KEY")
                else:
                    print(f"API密钥已设置: {QWEN3_API_KEY[:4]}...{QWEN3_API_KEY[-4:]}")

                content_length = int(self.headers.get('Content-Length', 0))
                print(f"内容长度: {content_length}")

                # 读取请求数据
                post_data = self.rfile.read(content_length)
                print(f"原始请求数据: {post_data.decode('utf-8', errors='replace')}")

                try:
                    request_data = json.loads(post_data.decode('utf-8'))
                    print(f"成功解析JSON数据: {json.dumps(request_data, ensure_ascii=False)[:200]}")
                except json.JSONDecodeError as json_err:
                    print(f"JSON解析错误: {str(json_err)}")
                    print(f"原始数据: {post_data.decode('utf-8', errors='replace')}")

                    # 尝试处理可能的字符串消息
                    try:
                        text_content = post_data.decode('utf-8', errors='replace').strip()
                        if text_content:
                            # 如果是纯文本，将其作为用户消息处理
                            request_data = {
                                "messages": [{"role": "user", "content": text_content}]
                            }
                            print(f"将纯文本转换为消息: {json.dumps(request_data, ensure_ascii=False)}")
                        else:
                            raise ValueError("请求体为空或无法解析")
                    except Exception as text_err:
                        print(f"尝试处理纯文本时出错: {str(text_err)}")
                        raise json_err

                print(f"解析后的请求数据: {json.dumps(request_data, ensure_ascii=False)}")

                # 获取消息数据
                messages = request_data.get('messages')
                
                # 如果没有messages字段，返回明确的错误
                if messages is None:
                    print("错误: 请求中缺少messages参数")
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.set_cors_headers()
                    self.end_headers()
                    
                    error_data = {
                        "error": True,
                        "code": "missing_required_parameter",
                        "message": "you must provide a messages parameter",
                        "request_id": f"req_{int(time.time())}_{abs(hash(str(request_data)[:20])) % 10000}",
                        "status_code": 400
                    }
                    self.wfile.write(json.dumps(error_data).encode('utf-8'))
                    return
                
                # 确保消息是列表
                if not isinstance(messages, list):
                    print(f"消息不是列表，当前类型: {type(messages)}")
                    if isinstance(messages, str):
                        try:
                            # 尝试解析可能是字符串形式的JSON
                            messages = json.loads(messages)
                            print(f"从字符串解析消息: {json.dumps(messages, ensure_ascii=False)}")
                        except:
                            # 如果无法解析，将其作为单条消息处理
                            messages = [{"role": "user", "content": messages}]
                            print(f"将字符串转换为单条消息: {json.dumps(messages, ensure_ascii=False)}")
                    else:
                        # 其他类型转为字符串作为消息内容
                        messages = [{"role": "user", "content": str(messages)}]
                        print(f"将非列表消息转换为列表: {json.dumps(messages, ensure_ascii=False)}")

                if not messages:
                    print("错误: 请求中缺少消息数据或消息为空")
                    print(f"请求数据结构: {json.dumps(request_data, ensure_ascii=False)}")
                    raise ValueError("请求中缺少消息数据或消息为空，请确保请求包含messages字段")

                model = request_data.get('model', os.environ.get("QWEN_MODEL_NAME", "qwen-plus"))
                temperature = float(request_data.get('temperature', 0.7))
                top_p = float(request_data.get('top_p', 0.8))
                max_tokens = int(request_data.get('max_tokens', 2000))

                print(f"消息数量: {len(messages)}")
                print(f"模型: {model}")
                print(f"参数: temperature={temperature}, top_p={top_p}, max_tokens={max_tokens}")

                # 验证消息格式
                for i, msg in enumerate(messages):
                    if not isinstance(msg, dict):
                        print(f"错误: 消息 {i} 不是有效的对象: {msg}")
                        # 尝试修复格式
                        if isinstance(msg, str):
                            messages[i] = {"role": "user", "content": msg}
                            print(f"已修复消息 {i}: {json.dumps(messages[i], ensure_ascii=False)}")
                        else:
                            raise ValueError(f"消息 {i} 不是有效的对象且无法修复: {msg}")

                    # 检查并修复缺少字段的消息
                    if 'role' not in msg:
                        msg['role'] = 'user'
                        print(f"为消息 {i} 添加默认角色 'user'")

                    if 'content' not in msg:
                        if isinstance(msg, dict) and len(msg) > 0:
                            # 尝试使用第一个非role字段作为content
                            for key, value in msg.items():
                                if key != 'role' and isinstance(value, str):
                                    msg['content'] = value
                                    print(f"为消息 {i} 使用字段 '{key}' 的值作为content: {value}")
                                    break

                        if 'content' not in msg:
                            msg['content'] = "Empty message"
                            print(f"为消息 {i} 添加默认content")

                # 确保消息格式符合DashScope规范
                valid_messages = []
                for msg in messages:
                    if msg.get('role') in ['user', 'assistant', 'system']:
                        valid_messages.append(msg)
                    else:
                        print(f"警告: 角色无效，将 '{msg.get('role')}' 转换为 'user'")
                        msg['role'] = 'user'
                        valid_messages.append(msg)

                if not valid_messages:
                    print("错误: 没有有效的消息")
                    raise ValueError("没有有效的消息，请确保至少有一条有效的用户消息")

                print(f"有效消息: {json.dumps(valid_messages, ensure_ascii=False)}")

                # 构建请求数据 - 使用兼容OpenAI的格式，直接将请求发送给DashScope兼容模式接口
                qwen_request = {
                    "model": model,
                    "messages": valid_messages,
                    "temperature": temperature,
                    "top_p": top_p
                }

                # 添加max_tokens参数，但避免为0
                if max_tokens > 0:
                    qwen_request["max_tokens"] = max_tokens

                print(f"最终发给DashScope的请求体: {json.dumps(qwen_request, ensure_ascii=False)}")
                print(f"准备调用DashScope API: {QWEN3_API_ENDPOINT}")

                # 添加请求ID，便于跟踪
                request_id = f"req_{int(time.time())}_{abs(hash(str(valid_messages)[:20])) % 10000}"
                print(f"请求ID: {request_id}")

                # 调用DashScope API，增加重试逻辑
                max_retries = 2
                retry_count = 0

                while retry_count <= max_retries:
                    try:
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
                        break
                    except httpx.TimeoutException:
                        retry_count += 1
                        if retry_count <= max_retries:
                            print(f"请求超时，正在重试 ({retry_count}/{max_retries})...")
                            time.sleep(1)  # 重试前等待1秒
                        else:
                            raise ValueError("API请求多次超时，请稍后重试")
                    except Exception as e:
                        print(f"API请求异常: {str(e)}")
                        raise

                print(f"API响应状态码: {response.status_code}")

                if response.status_code == 200:
                    try:
                        result = response.json()
                        print(f"API响应内容: {json.dumps(result, ensure_ascii=False)[:200]}...")

                        # 从兼容OpenAI格式的响应中提取内容
                        ai_response = "无法解析的响应格式"

                        if result and isinstance(result, dict):
                            # 检查是否为OpenAI格式响应
                            if "choices" in result and isinstance(result["choices"], list) and len(result["choices"]) > 0:
                                first_choice = result["choices"][0]
                                if "message" in first_choice and isinstance(first_choice["message"], dict):
                                    ai_response = first_choice["message"].get("content", "消息内容为空")
                                    print(f"成功从OpenAI格式choices[0].message.content提取回复: {ai_response[:100]}...")
                            # 检查是否为DashScope原生响应格式
                            elif "output" in result and isinstance(result["output"], dict):
                                output = result["output"]
                                # 在choices中查找回复
                                choices = output.get("choices")
                                if choices and isinstance(choices, list) and len(choices) > 0:
                                    choice = choices[0]
                                    if "message" in choice and isinstance(choice["message"], dict):
                                        ai_response = choice["message"].get("content", "消息内容为空")
                                        print(f"成功从DashScope格式choices[0].message.content提取回复: {ai_response[:100]}...")
                                # 直接查找message结构
                                elif "message" in output and isinstance(output["message"], dict):
                                    ai_response = output["message"].get("content", "消息内容为空")
                                    print(f"成功从output.message.content提取回复: {ai_response[:100]}...")
                                # 查找text字段
                                elif "text" in output:
                                    ai_response = output["text"]
                                    print(f"成功从output.text提取回复: {ai_response[:100]}...")
                            else:
                                print(f"未知的输出格式: {json.dumps(result, ensure_ascii=False)}")
                        else:
                            print(f"响应不是有效的JSON对象: {result}")

                        self.send_response(200)
                        self.send_header('Content-Type', 'application/json')
                        self.set_cors_headers()
                        self.end_headers()

                        usage = {}
                        if "usage" in result and isinstance(result["usage"], dict):
                            usage = result["usage"]

                        response_data = {
                            "response": ai_response,
                            "request_id": request_id,
                            "usage": usage
                        }
                        print(f"发送响应: {json.dumps(response_data, ensure_ascii=False)[:200]}...")
                        self.wfile.write(json.dumps(response_data).encode('utf-8'))
                    except json.JSONDecodeError:
                        print(f"无法解析API响应为JSON: {response.text[:200]}")
                        raise ValueError(f"API返回了无效的JSON响应: {response.text[:100]}...")
                else:
                    print(f"API错误响应: {response.text[:200]}...")
                    error_message = "未知错误"
                    error_code = "unknown_error"

                    # 尝试解析错误响应
                    try:
                        error_json = response.json()
                        if error_json and isinstance(error_json, dict):
                            error_message = error_json.get("message", "未知错误")
                            error_code = error_json.get("code", "unknown_error")

                            # 检查嵌套的错误结构
                            error_obj = error_json.get("error")
                            if error_obj and isinstance(error_obj, dict):
                                if not error_message or error_message == "未知错误":
                                    error_message = error_obj.get("message", "未知错误")
                                if error_code == "unknown_error":
                                    error_code = error_obj.get("code", "unknown_error")
                    except:
                        error_message = response.text[:100] if response.text else "未能解析错误响应"

                    self.send_response(response.status_code)
                    self.send_header('Content-Type', 'application/json')
                    self.set_cors_headers()
                    self.end_headers()

                    error_data = {
                        "error": True,
                        "code": error_code,
                        "message": error_message,
                        "request_id": request_id,
                        "status_code": response.status_code
                    }
                    print(f"发送错误响应: {json.dumps(error_data, ensure_ascii=False)}")
                    self.wfile.write(json.dumps(error_data).encode('utf-8'))
                return

            # 默认响应
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode('utf-8'))

        except Exception as e:
            print(f"处理请求时出错: {str(e)}")
            print(traceback.format_exc())

            self.send_response(400 if isinstance(e, ValueError) else 500)
            self.send_header('Content-Type', 'application/json')
            self.set_cors_headers()
            self.end_headers()

            error_data = {
                "error": True,
                "message": str(e),
                "traceback": traceback.format_exc() if os.environ.get("DEBUG") == "true" else None
            }
            print(f"发送错误响应: {json.dumps(error_data, ensure_ascii=False)}")
            self.wfile.write(json.dumps(error_data).encode('utf-8'))
