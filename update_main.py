import re

# 读取main.py文件
with open('main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义要替换的部分
old_function = r"""async def generate_response_with_qwen\(messages\):
    \"\"\"使用通义千问API生成响应\"\"\"
    try:
        # 准备输入消息
        formatted_messages = \[\]
        for msg in messages:
            formatted_messages\.append\(\{\"role\": msg\.role, \"content\": msg\.content\}\)

        print\(f\"Received chat request with messages: \{formatted_messages\}\"\)
        print\(f\"QWEN3_API_KEY: \{QWEN3_API_KEY\[:5\]\}\.\.\.{QWEN3_API_KEY\[-5:\] if QWEN3_API_KEY else 'None'}\"\)
        print\(f\"QWEN3_API_ENDPOINT: \{QWEN3_API_ENDPOINT\}\"\)
        
        # 强制使用直接的Qwen3 API
        if QWEN3_API_KEY:
            print\(\"Using Qwen3 API directly\"\)
            try:
                response = await generate_with_qwen3_api\(formatted_messages\)
                print\(f\"Qwen3 API response: \{response\}\"\)
                return response
            except Exception as e:
                print\(f\"Error calling Qwen3 API: \{str\(e\)\}\"\)
                print\(\"Falling back to backup response\"\)
                return generate_fallback_response\(formatted_messages\)
        else:
            print\(\"No Qwen3 API key found\"\)
            raise HTTPException\(status_code=500, detail=\"Missing API key for Qwen3\"\)

    except httpx\.RequestError as e:
        print\(f\"API request error: \{str\(e\)\}\"\)
        # 使用备用响应
        return generate_fallback_response\(formatted_messages\)
    except Exception as e:
        import traceback
        error_detail = f\"Error: \{str\(e\)\}\\n\{traceback\.format_exc\(\)\}\"
        print\(error_detail\)
        # 使用备用响应
        return generate_fallback_response\(formatted_messages\)"""

# 新函数
new_function = """async def generate_response_with_qwen(messages):
    \"\"\"使用通义千问API生成响应\"\"\"
    try:
        # 准备输入消息
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({\"role\": msg.role, \"content\": msg.content})

        print(\"\\n\" + \"=\"*50)
        print(\"开始处理聊天请求\")
        print(f\"消息内容: {json.dumps(formatted_messages, ensure_ascii=False)}\")
        print(f\"API密钥: {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}\")
        print(f\"API端点: {QWEN3_API_ENDPOINT}\")
        
        # 使用Qwen API
        if QWEN3_API_KEY:
            print(\"直接调用Qwen API\")
            
            # 构建请求数据
            request_data = {
                \"model\": \"qwen-plus\",
                \"messages\": formatted_messages,
                \"temperature\": 0.7,
                \"top_p\": 0.8,
                \"max_tokens\": 2000
            }
            print(f\"请求数据: {json.dumps(request_data, ensure_ascii=False)}\")
            
            # 发送API请求
            try:
                print(\"发送API请求...\")
                async with httpx.AsyncClient(timeout=60.0) as client:
                    response = await client.post(
                        QWEN3_API_ENDPOINT,
                        headers={
                            \"Authorization\": f\"Bearer {QWEN3_API_KEY}\",
                            \"Content-Type\": \"application/json\"
                        },
                        json=request_data
                    )
                    
                    print(f\"响应状态码: {response.status_code}\")
                    
                    if response.status_code == 200:
                        result = response.json()
                        if \"choices\" in result and len(result[\"choices\"]) > 0:
                            api_response = result[\"choices\"][0][\"message\"][\"content\"]
                            print(f\"API响应内容: {api_response}\")
                            print(\"=\"*50 + \"\\n\")
                            return api_response
                        else:
                            print(f\"无效的API响应格式: {response.text}\")
                            print(\"使用备用响应\")
                            return generate_fallback_response(formatted_messages)
                    else:
                        try:
                            error_json = response.json()
                            error_detail = error_json.get(\"error\", {}).get(\"message\", \"Unknown error\")
                        except Exception:
                            error_detail = response.text
                        print(f\"API错误: {error_detail}\")
                        print(\"使用备用响应\")
                        return generate_fallback_response(formatted_messages)
            except Exception as e:
                print(f\"API请求错误: {str(e)}\")
                print(\"使用备用响应\")
                return generate_fallback_response(formatted_messages)
        else:
            print(\"未找到API密钥\")
            raise HTTPException(status_code=500, detail=\"Missing API key for Qwen\")

    except httpx.RequestError as e:
        print(f\"API请求错误: {str(e)}\")
        # 使用备用响应
        return generate_fallback_response(formatted_messages)
    except Exception as e:
        import traceback
        error_detail = f\"错误: {str(e)}\\n{traceback.format_exc()}\"
        print(error_detail)
        # 使用备用响应
        return generate_fallback_response(formatted_messages)"""

# 使用正则表达式替换
updated_content = re.sub(old_function, new_function, content, flags=re.DOTALL)

# 写回文件
with open('main.py', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("main.py has been updated successfully!")
