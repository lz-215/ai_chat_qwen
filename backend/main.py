import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx # 用于在 FastAPI 内部进行异步 HTTP 请求（如果需要调用 qwen_api.py 中的 requests 同步函数，需要特殊处理）
import json

# 首先加载环境变量
from dotenv import load_dotenv
print("Backend main.py: 正在加载 .env 文件...")
# 指定 .env 文件路径，因为 uvicorn 可能从项目根目录启动，也可能工作目录已是 backend
# 尝试相对于当前文件定位 .env (假设 .env 在项目根目录, main.py 在 backend/)
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env') 
if not os.path.exists(dotenv_path):
    # 如果上一级目录没有，则尝试当前目录 (万一 .env 被放在了 backend/)
    dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(dotenv_path):
        # 最后尝试项目根目录（如果脚本是从项目根目录运行的）
        dotenv_path = '.env'

if load_dotenv(dotenv_path=dotenv_path, verbose=True):
    print(f"Backend main.py: 已从 {os.path.abspath(dotenv_path)} 加载 .env 文件")
else:
    print(f"Backend main.py: 未找到 .env 文件于 {os.path.abspath(dotenv_path)} 或其他尝试的路径，或文件为空。请确保 API 密钥已通过其他方式设置。")

# 尝试从 .qwen_api 导入 (因为 main.py 和 qwen_api.py 都在 backend 目录下)
# 如果直接在 backend 目录运行 uvicorn main:app, 那么 qwen_api 就是同级模块
try:
    from .qwen_api import call_qwen_api, QWEN_API_KEY, QWEN_MODEL_NAME
except ImportError:
    # 如果作为脚本直接运行，或者 PYTHONPATH 设置问题，尝试绝对导入
    # 这通常在 uvicorn 环境下不是问题，但为了本地测试方便可以保留
    from qwen_api import call_qwen_api, QWEN_API_KEY, QWEN_MODEL_NAME

app = FastAPI()

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，生产环境中应配置为您的前端域名
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有 HTTP 方法
    allow_headers=["*"],  # 允许所有 HTTP 请求头
)

@app.on_event("startup")
async def startup_event():
    print(f"FastAPI 启动，Qwen API Key 已加载: {'是' if QWEN_API_KEY else '否'}")
    print(f"Qwen Model: {QWEN_MODEL_NAME}")

# 定义请求体模型 (可选，但推荐用于类型提示和验证)
from pydantic import BaseModel, Field
from typing import List, Dict, Union

class Message(BaseModel):
    role: str
    content: str

class ChatRequestBody(BaseModel):
    messages: List[Message]
    stream: bool = False
    # 可以根据需要添加其他参数，如 model, temperature 等
    # model: Union[str, None] = None # 如果允许前端指定模型

@app.post("/api/chat")
async def chat_endpoint(body: ChatRequestBody):
    messages_data = [msg.dict() for msg in body.messages]
    stream_requested = body.stream

    try:
        api_response = call_qwen_api(messages_data, stream=stream_requested)

        if stream_requested:
            if not (isinstance(api_response, httpx.Response) or isinstance(api_response, requests.Response)):
                # 如果 call_qwen_api 内部出错并返回了字典而不是 Response 对象
                error_detail = api_response.get("details", "Stream initialization failed")
                raise HTTPException(status_code=500, detail=error_detail)
            
            async def sse_generator():
                try:
                    for line in api_response.iter_lines():
                        if line:
                            yield f"data: {line.decode('utf-8')}\n\n"
                        # Dashscope 的 SSE 流中，[DONE] 信号是 data: [DONE]
                        if line and line.decode('utf-8').strip() == "[DONE]":
                            break 
                except Exception as e:
                    print(f"Error during streaming: {e}")
                    # 可以尝试发送一个错误事件，但这比较复杂，取决于客户端如何处理
                    yield f"event: error\ndata: {json.dumps({'error': 'Error during stream', 'details': str(e)})}\n\n"
                finally:
                    if hasattr(api_response, 'close'):
                        api_response.close()
            
            return StreamingResponse(sse_generator(), media_type="text/event-stream")
        else:
            # 非流式响应，call_qwen_api 应该返回一个字典
            if "error" in api_response:
                raise HTTPException(status_code=api_response.get("status_code", 500), detail=api_response.get("details", api_response.get("error")))
            return api_response

    except requests.exceptions.RequestException as e:
        print(f"调用 Qwen API 时发生网络错误: {e}")
        raise HTTPException(status_code=503, detail=f"API service unavailable: {str(e)}")
    except Exception as e:
        print(f"处理 /api/chat 请求时发生未知错误: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/models") # 与您之前 local_api_server.py 中的端点保持一致
async def get_models_info():
    return {
        "model": QWEN_MODEL_NAME, # 从 qwen_api 导入的模型名称
        "api_type": "Qwen API (DashScope via FastAPI)",
        "status": "API mode (FastAPI)",
        "device": "Qwen Cloud"
    }

if __name__ == "__main__":
    # 这部分是为了可以直接用 python main.py 启动 (主要用于调试)
    # 生产环境/标准部署还是用 uvicorn main:app
    import uvicorn
    print("运行 FastAPI 应用 (用于直接 python main.py 调试)...")
    print("请注意：直接运行可能不如 uvicorn 高效，且热重载可能行为不同。")
    uvicorn.run(app, host="0.0.0.0", port=8000) 