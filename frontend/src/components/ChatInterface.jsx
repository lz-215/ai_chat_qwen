import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useTranslation } from 'react-i18next';

// API基础URL
const API_BASE_URL = 'http://localhost:8001';

const ChatInterface = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, text: t('app.chat.welcomeMessage', 'Hello! I am the Qwen3-plus AI assistant. How can I help you today?'), sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState({ model: 'qwen-max', status: 'unknown', device: 'unknown' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 获取模型信息
  useEffect(() => {
    const fetchModelInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/models`);
        if (response.ok) {
          const data = await response.json();
          setModelInfo(data);
        }
      } catch (error) {
        console.error(t('app.chat.modelInfoError', 'Failed to get model information:'), error);
      }
    };

    fetchModelInfo();
  }, [t]);

  // 当语言切换时更新欢迎消息
  useEffect(() => {
    setMessages(prevMessages => {
      // 保留所有消息，但更新第一条欢迎消息
      if (prevMessages.length > 0 && prevMessages[0].id === 1 && prevMessages[0].sender === 'ai') {
        return [
          { ...prevMessages[0], text: t('app.chat.welcomeMessage', 'Hello! I am the Qwen3-plus AI assistant. How can I help you today?') },
          ...prevMessages.slice(1)
        ];
      }
      return prevMessages;
    });
  }, [i18n.language, t]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    console.log("1. 开始发送消息:", text);

    // 添加用户消息
    const userMessage = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 准备消息历史
      const messageHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // 添加当前用户消息
      messageHistory.push({ role: 'user', content: text });

      console.log("2. 准备发送API请求，消息历史:", messageHistory);

      // 调用后端API
      const apiUrl = `${API_BASE_URL}/api/chat`;
      console.log("3. API请求地址:", apiUrl);
      console.log("3.1 请求数据:", JSON.stringify({ 
        model: modelInfo.model || "qwen-plus",
        messages: messageHistory,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000
      }, null, 2));

      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            model: modelInfo.model || "qwen-plus",
            messages: messageHistory,
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000
          })
        });

        console.log("4. API响应状态:", response.status, response.statusText);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("4.1 API错误响应:", errorText);
          throw new Error(t('app.chat.apiError', 'API request failed: {{status}} - {{text}}',
            { status: response.status, text: errorText.substring(0, 100) }));
        }
      } catch (error) {
        console.error("4.2 API请求异常:", error);
        throw error;
      }

      const data = await response.json();
      console.log("5. API响应数据:", data);

      let assistantMessageText = t('app.chat.errorMessage', 'Sorry, an error occurred while processing your request.');
      if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        assistantMessageText = data.choices[0].message.content;
      } else if (data && data.error) {
        if (typeof data.error === 'string') {
          assistantMessageText = data.error;
        } else if (data.error.message && typeof data.error.message === 'string') {
          assistantMessageText = data.error.message;
        } else if (data.error.details && typeof data.error.details === 'string') {
          assistantMessageText = data.error.details;
        } 
      } else if (data && data.message && typeof data.message === 'string') {
         assistantMessageText = data.message;
      } else if (typeof data === 'string') {
        assistantMessageText = data;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: assistantMessageText,
        sender: 'ai'
      }]);
    } catch (error) {
      console.error("6. 错误详情:", error);
      console.error(t('app.chat.sendError', 'Error sending message:'), error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: t('app.chat.errorMessage', 'Sorry, an error occurred while processing your request.'),
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
      console.log("7. 消息处理完成");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-green-600 text-white p-2 text-center text-sm">
        <p>{t('app.chat.model_info')}: {modelInfo.model} | {t('app.chat.status')}: {t(`app.chat.${modelInfo.status}`, modelInfo.status)} | {t('app.chat.device')}: {modelInfo.device}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-300 p-4 bg-white">
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatInterface;
