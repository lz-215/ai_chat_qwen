from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import httpx
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
import dashscope
from dashscope.embeddings.text_embedding import TextEmbedding
import json
import traceback

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# JWT设置
SECRET_KEY = os.getenv("SECRET_KEY", "YOUR_SECRET_KEY_HERE")  # 在生产环境中使用环境变量
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dashscope API Key
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY")
QWEN_MODEL_NAME = os.getenv("QWEN_MODEL_NAME", "qwen-plus")

# Qwen3 API 设置
QWEN3_API_KEY = os.getenv("QWEN3_API_KEY")
QWEN3_API_ENDPOINT = os.getenv("QWEN3_API_ENDPOINT", "https://api.qwen.ai/v1/chat/completions")

# 密码哈希工具
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="AI Chat API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置DashScope API
dashscope.api_key = DASHSCOPE_API_KEY

async def generate_response_with_qwen(messages):
    """使用通义千问API生成响应"""
    # 准备输入消息
    formatted_messages = []
    for msg in messages:
        formatted_messages.append({"role": msg.role, "content": msg.content})

    print("\n" + "="*50)
    print("开始处理 Qwen-plus 聊天请求")
    print(f"API 端点: {QWEN3_API_ENDPOINT}")
    print(f"使用模型: qwen-plus")
    print(f"消息内容: {json.dumps(formatted_messages, ensure_ascii=False, indent=2)}") # 打印格式化后的消息
    # print(f"API密钥 (部分): {QWEN3_API_KEY[:5]}...{QWEN3_API_KEY[-5:] if QWEN3_API_KEY else 'None'}") # 出于安全考虑，可以选择不打印密钥

    # 检查 API Key 是否存在
    if not QWEN3_API_KEY:
        print("错误: 未找到 Qwen API 密钥 (QWEN3_API_KEY)")
        raise HTTPException(status_code=500, detail="Missing API key for Qwen")

    # 构建请求数据
    request_data = {
        "model": "qwen-plus", # 确保使用正确的模型名称
        "messages": formatted_messages,
        "temperature": 0.7,
        "top_p": 0.8,
        "max_tokens": 2000
    }
    print(f"构造的请求数据: {json.dumps(request_data, ensure_ascii=False, indent=2)}")

    try:
        print("发送 API 请求至 Qwen...")
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                QWEN3_API_ENDPOINT,
                headers={
                    "Authorization": f"Bearer {QWEN3_API_KEY}",
                    "Content-Type": "application/json"
                },
                json=request_data
            )

            print(f"API 响应状态码: {response.status_code}")

            if response.status_code == 200:
                result = response.json()
                # print(f"原始 API 响应体: {json.dumps(result, ensure_ascii=False, indent=2)}") # 用于调试
                if "choices" in result and len(result["choices"]) > 0 and "message" in result["choices"][0] and "content" in result["choices"][0]["message"]:
                    api_response = result["choices"][0]["message"]["content"]
                    print(f"成功获取 API 响应内容.")
                    print("="*50 + "\n")
                    return api_response
                else:
                    print(f"错误: 无效的 API 响应格式。响应体: {response.text}")
                    print("将使用备用响应。")
                    return generate_fallback_response(formatted_messages)
            else:
                error_detail = "未知错误"
                try:
                    error_json = response.json()
                    error_detail = error_json.get("error", {}).get("message", response.text)
                except Exception:
                    error_detail = response.text
                print(f"错误: Qwen API 返回错误状态码 {response.status_code}。详情: {error_detail}")
                print("将使用备用响应。")
                return generate_fallback_response(formatted_messages)

    except httpx.TimeoutException as e:
        print(f"错误: API 请求超时。详情: {str(e)}")
        print(f"堆栈跟踪: {traceback.format_exc()}")
        print("将使用备用响应。")
        return generate_fallback_response(formatted_messages)
    except httpx.RequestError as e:
        print(f"错误: API 请求失败 (网络相关)。详情: {str(e)}")
        print(f"堆栈跟踪: {traceback.format_exc()}")
        print("将使用备用响应。")
        return generate_fallback_response(formatted_messages)
    except Exception as e:
        error_detail = f"错误: 处理 Qwen API 请求时发生意外错误。详情: {str(e)}"
        print(error_detail)
        print(f"堆栈跟踪: {traceback.format_exc()}")
        print("将使用备用响应。")
        return generate_fallback_response(formatted_messages)

def generate_fallback_response(formatted_messages):
    """生成备用响应，当API调用失败时使用"""
    # 获取用户消息内容
    user_message = ""
    for msg in formatted_messages:
        if msg["role"] == "user":
            user_message = msg["content"]
            break

    print(f"Generating fallback response for: {user_message}")

    # 简单的模式匹配
    if "你好" in user_message or "hello" in user_message.lower():
        return "你好！我是AI助手，有什么可以帮助你的吗？"
    elif "介绍" in user_message or "是什么" in user_message:
        return "我是AI助手。我可以回答问题、提供信息、进行对话等。有什么我可以帮助你的吗？"
    elif "天气" in user_message:
        return "抱歉，我无法获取实时天气信息。建议您查看天气预报应用或网站获取最新天气情况。"
    elif "谢谢" in user_message or "感谢" in user_message:
        return "不客气！如果还有其他问题，随时可以问我。"
    else:
        return f"我收到了您的消息：\"{user_message}\"。作为AI助手，我会尽力提供帮助。请问有什么具体问题需要解答吗？"

async def generate_with_dashscope_api(formatted_messages):
    """使用DashScope API生成响应"""
    try:
        if not DASHSCOPE_API_KEY:
            raise HTTPException(status_code=500, detail="Missing DashScope API key")

        # 调用DashScope API
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
                headers={
                    "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": QWEN_MODEL_NAME,
                    "input": {
                        "messages": formatted_messages
                    },
                    "parameters": {
                        "temperature": 0.7,
                        "top_p": 0.8,
                        "result_format": "message"
                    }
                }
            )

            if response.status_code != 200:
                error_detail = response.json().get("message", "Unknown error")
                raise HTTPException(status_code=response.status_code, detail=f"DashScope API Error: {error_detail}")

            result = response.json()
            if "output" in result and "message" in result["output"]:
                return result["output"]["message"]["content"]
            else:
                raise HTTPException(status_code=500, detail="Invalid DashScope API response format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DashScope API error: {str(e)}")

# 用户模型
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

# 测试用户数据库 - 在生产环境中，这应该是一个真正的数据库
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": pwd_context.hash("secret"),
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderland",
        "email": "alice@example.com",
        "hashed_password": pwd_context.hash("password"),
        "disabled": False,
    },
}

# 令牌模型
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# 登录请求模型
class LoginRequest(BaseModel):
    username: str
    password: str

# Messages模型
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    response: str

class MediaMeta(BaseModel):
    title: str
    description: str
    image: str

# 密码验证与令牌创建函数
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)
    return None

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def fetch_og_meta(url: str) -> MediaMeta:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, "html.parser")
        def get_meta(property_name, fallback=""):
            tag = soup.find("meta", property=property_name) or soup.find("meta", attrs={"name": property_name})
            return tag["content"] if tag and tag.has_attr("content") else fallback

        title = get_meta("og:title", soup.title.string if soup.title else "")
        description = get_meta("og:description", "")
        image = get_meta("og:image", "")

        return MediaMeta(title=title, description=description, image=image)

@app.get("/api/fetch-media-meta", response_model=MediaMeta)
async def fetch_media_meta(url: str):
    """
    获取媒体链接的分享内容（标题、描述、图片）
    """
    try:
        meta = await fetch_og_meta(url)
        return meta
    except Exception as e:
        return MediaMeta(title="Failed to fetch", description=str(e), image="")

# 认证相关路由
@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: LoginRequest):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """获取当前登录用户信息"""
    return current_user

# Routes
@app.get("/")
async def read_root():
    return {"message": "Welcome to the AI Chat API"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not request.messages:
            raise HTTPException(status_code=400, detail="No messages provided")

        # 打印请求信息到控制台
        print("="*50)
        print(f"Received chat request: {request}")

        # 调用Qwen-plus API生成回复
        ai_response = await generate_response_with_qwen(request.messages)

        # 打印响应信息到控制台
        print(f"Generated response: {ai_response}")
        print("="*50)

        return ChatResponse(response=ai_response)

    except Exception as e:
        import traceback
        error_detail = f"Error: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def get_model_info():
    """获取模型信息"""
    # 返回Qwen-plus模型信息
    return {
        "model": "qwen-plus",
        "api_type": "Qwen API",
        "status": "API mode",
        "device": "Qwen Cloud"
    }

if __name__ == "__main__":
    import uvicorn
    import logging
    # 设置日志级别为DEBUG
    logging.basicConfig(level=logging.DEBUG)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_level="debug")
