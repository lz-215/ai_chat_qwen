import os
import sys

# 读取main.py文件
with open('backend/app/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 删除generate_with_qwen3_api函数
start_marker = "async def generate_with_qwen3_api(formatted_messages):"
end_marker = "def generate_fallback_response(formatted_messages):"

start_index = content.find(start_marker)
end_index = content.find(end_marker)

if start_index != -1 and end_index != -1:
    # 删除函数
    content = content[:start_index] + content[end_index:]
    print("Successfully removed generate_with_qwen3_api function")
else:
    print("Could not find generate_with_qwen3_api function")

# 更新/api/models端点
start_marker = "@app.get(\"/api/models\")"
end_marker = "}"

start_index = content.find(start_marker)
if start_index != -1:
    # 找到函数结束的位置
    end_index = content.find(end_marker, start_index)
    if end_index != -1:
        end_index += 1  # 包含结束的大括号

        # 新的函数实现
        new_function = '''@app.get("/api/models")
async def get_model_info():
    """获取模型信息"""
    # 返回Qwen-plus模型信息
    return {
        "model": "qwen-plus",
        "api_type": "Qwen API",
        "status": "API mode",
        "device": "Qwen Cloud"
    }'''

        # 替换函数
        content = content[:start_index] + new_function + content[end_index:]
        print("Successfully updated /api/models endpoint")
    else:
        print("Could not find end of /api/models function")
else:
    print("Could not find /api/models endpoint")

# 写回文件
with open('backend/app/main.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("main.py has been updated successfully!")
