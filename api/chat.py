from http.server import BaseHTTPRequestHandler
import json
import os
import httpx
import traceback
import time

# 从环境变量获取API密钥
QWEN3_API_KEY = os.environ.get("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.environ.get("QWEN3_API_ENDPOINT", "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation")

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

    def do_POST(self):
        try:
            print(f"收到POST请求: {self.path}")
            
            # 检查API密钥是否可用
            if not QWEN3_API_KEY:
                raise ValueError("API密钥未设置，请在环境变量或.env文件中设置QWEN3_API_KEY")
                
            content_length = int(self.headers.get('Content-Length', 0))
            print(f"内容长度: {content_length}")

            # 读取请求数据
            post_data = self.rfile.read(content_length)
            try:
                request_data = json.loads(post_data.decode('utf-8'))
            except json.JSONDecodeError as json_err:
                print(f"JSON解析错误: {str(json_err)}")
                print(f"原始数据: {post_data.decode('utf-8', errors='replace')}")
                raise
                
            print(f"请求数据: {json.dumps(request_data, ensure_ascii=False)[:200]}...")

            # 获取消息数据
            messages = request_data.get('messages', [])
            if not messages:
                raise ValueError("请求中缺少消息数据或消息为空")
                
            model = request_data.get('model', 'qwen-max')  # 默认使用qwen-max
            temperature = float(request_data.get('temperature', 0.7))
            top_p = float(request_data.get('top_p', 0.8))
            max_tokens = int(request_data.get('max_tokens', 2000))
            
            print(f"消息数量: {len(messages)}")
            
            # 验证消息格式
            for i, msg in enumerate(messages):
                if not isinstance(msg, dict):
                    raise ValueError(f"消息 {i} 不是有效的对象: {msg}")
                    
                print(f"消息 {i}: {json.dumps(msg, ensure_ascii=False)}")
                if 'role' not in msg or 'content' not in msg:
                    raise ValueError(f"消息格式错误: 缺少必要字段 role 或 content。消息: {msg}")
            
            # 确保消息格式符合DashScope规范
            valid_messages = []
            for msg in messages:
                if msg.get('role') in ['user', 'assistant', 'system']:
                    valid_messages.append(msg)
                else:
                    print(f"警告: 跳过角色无效的消息: {msg.get('role')}")
            
            if not valid_messages:
                raise ValueError("没有有效的消息")
                
            print(f"有效消息: {json.dumps(valid_messages, ensure_ascii=False)}")

            # 构建请求数据 - 适配阿里云DashScope API格式
            # qwen-max是正式环境的模型名称
            qwen_request = {
                "model": model,
                "messages": valid_messages,
                "temperature": temperature,
                "top_p": top_p
            }
            
            # 添加max_tokens参数，但避免为0
            if max_tokens > 0:
                qwen_request["max_tokens"] = max_tokens

            print(f"请求体: {json.dumps(qwen_request, ensure_ascii=False)}")
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
            print(f"API响应头: {response.headers}")
            
            try:
                response_text = response.text
                print(f"API原始响应: {response_text[:500]}...")
            except Exception as e:
                print(f"无法读取响应文本: {str(e)}")

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
