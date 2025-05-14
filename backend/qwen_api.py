'''
此模块用于与 Qwen-plus API 进行交互。
'''
import os
import requests
import json

# 从环境变量或直接赋值API密钥和模型名称
QWEN_API_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
QWEN_API_KEY = os.getenv("QWEN3_API_KEY")
if not QWEN_API_KEY:
    raise ValueError("错误：环境变量 QWEN3_API_KEY 未设置或为空。请在 .env 文件中配置。")
QWEN_MODEL_NAME = os.getenv("QWEN_MODEL_NAME", "qwen-plus")

def call_qwen_api(messages, stream=False):
    '''
    调用 Qwen-plus API。

    参数:
        messages (list): 一个包含消息对象的列表，例如 [{"role": "user", "content": "你好"}]
        stream (bool): 是否使用流式传输。默认为 False。

    返回:
        dict or requests.Response: 如果 stream 为 False，则返回 API 响应的 JSON 对象；
                                   如果 stream 为 True，则返回原始的 Response 对象以进行流式处理。
    '''
    print(f"[qwen_api] call_qwen_api called. Stream: {stream}")
    headers = {
        "Authorization": f"Bearer {QWEN_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": QWEN_MODEL_NAME,
        "messages": messages,
        "stream": stream
    }
    print(f"[qwen_api] Sending payload to {QWEN_API_BASE}: {json.dumps(payload, indent=2, ensure_ascii=False)}")

    try:
        response = requests.post(QWEN_API_BASE, headers=headers, json=payload, stream=stream, timeout=60)
        print(f"[qwen_api] Received response from Qwen API. Status: {response.status_code}")
        response.raise_for_status()  # 如果状态码不是 2xx，则抛出 HTTPError

        if stream:
            print("[qwen_api] Returning stream response object.")
            return response
        else:
            response_json = response.json()
            print(f"[qwen_api] Returning non-stream JSON response: {json.dumps(response_json, indent=2, ensure_ascii=False)}")
            return response_json
    except requests.exceptions.HTTPError as http_err:
        print(f"[qwen_api] HTTP error occurred: {http_err}")
        print(f"[qwen_api] Response content from Qwen (on error): {http_err.response.text if http_err.response else 'No response body'}")
        try:
            error_details = http_err.response.json() if http_err.response else {"error": str(http_err), "details": "No response body"}
            return {"error": "Qwen API HTTP error", "details": error_details, "status_code": http_err.response.status_code if http_err.response else 500}
        except json.JSONDecodeError:
            return {"error": "Qwen API HTTP error (undecodable)", "details": http_err.response.text if http_err.response else 'No response body', "status_code": http_err.response.status_code if http_err.response else 500}
    except requests.exceptions.RequestException as e:
        print(f"[qwen_api] RequestException occurred: {e}")
        if hasattr(e, 'response') and e.response is not None:
            try:
                print(f"[qwen_api] Error details: {e.response.json()}")
                return {"error": "API call failed", "details": e.response.json(), "status_code": e.response.status_code}
            except json.JSONDecodeError:
                print(f"[qwen_api] Cannot parse error response: {e.response.text}")
                return {"error": "API call failed (undecodable)", "details": e.response.text, "status_code": e.response.status_code}
        return {"error": "API call failed", "details": str(e), "status_code": 503}
    except Exception as ex:
        print(f"[qwen_api] An unexpected error occurred in call_qwen_api: {ex}")
        import traceback
        traceback.print_exc()
        return {"error": "Unexpected error in API call logic", "details": str(ex), "status_code": 500}

if __name__ == "__main__":
    # 这是一个简单的测试示例
    test_messages = [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "你好，请介绍一下你自己。"
        }
    ]

    print("--- 非流式调用测试 ---")
    non_stream_response = call_qwen_api(test_messages)
    print(f"API 响应: {json.dumps(non_stream_response, indent=2, ensure_ascii=False)}")

    # 确保在环境变量中也设置了 QWEN_API_KEY，如果上面的默认值不是你想要的
    # print(f"使用的 API Key: {QWEN_API_KEY[:5]}...{QWEN_API_KEY[-5:]}")
    # print(f"使用的模型: {QWEN_MODEL_NAME}")
    # print(f"使用的API基地址: {QWEN_API_BASE}")

    print("\n--- 流式调用测试 ---")
    # 对于流式调用，您需要迭代处理响应内容
    # 注意：此示例仅打印原始块，实际应用中您需要解析 SSE (Server-Sent Events)
    stream_response = call_qwen_api(test_messages, stream=True)
    if isinstance(stream_response, requests.Response):
        print("流式响应状态码:", stream_response.status_code)
        try:
            for chunk in stream_response.iter_lines(): # iter_lines 通常用于处理文本流
                if chunk:
                    # 假设每个块都是一个独立的 JSON 对象或者需要特殊处理的 SSE 事件
                    # 在 Dashscope 的兼容模式下，流式输出通常是 SSE 格式
                    # 例如： data: {"id": "...", "object": "...", ...}
                    decoded_chunk = chunk.decode('utf-8')
                    print(decoded_chunk)
                    # 实际应用中，您可能需要解析 SSE 事件，例如：
                    # if decoded_chunk.startswith("data: "): 
                    #     data_json_str = decoded_chunk[len("data: "):]
                    #     if data_json_str.strip() == "[DONE]":
                    #         print("Stream finished.")
                    #         break
                    #     try:
                    #         data_obj = json.loads(data_json_str)
                    #         # 处理 data_obj.choices[0].delta.content 等
                    #         print(f"流式数据块: {data_obj}")
                    #     except json.JSONDecodeError:
                    #         print(f"无法解析流式JSON块: {data_json_str}")
        except Exception as e:
            print(f"处理流式响应时发生错误: {e}")
    else:
        print(f"流式调用失败: {stream_response}") 