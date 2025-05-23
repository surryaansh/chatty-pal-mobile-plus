
import React from 'react';

export type MessageType = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`py-5 ${isUser ? 'bg-transparent' : 'bg-gray-800/30'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-white text-xs
            ${isUser ? 'bg-purple-500' : 'bg-teal-500'}`}>
            {isUser ? 'U' : 'AI'}
          </div>
          <div className="flex-1">
            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
