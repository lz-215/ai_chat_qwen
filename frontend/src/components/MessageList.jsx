import React from 'react';
import { useTranslation } from 'react-i18next';

const MessageList = ({ messages }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-3/4 rounded-lg p-3 ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
            aria-label={message.sender === 'user' ? t('app.chat.userMessage', 'User message') : t('app.chat.aiMessage', 'AI message')}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
