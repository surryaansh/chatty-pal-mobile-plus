
import React, { useState } from 'react';
import { ArrowUp, Plus } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative">
        <textarea
          className="w-full resize-none p-4 pr-14 bg-chatgpt-input rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          rows={1}
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{
            minHeight: '56px',
            maxHeight: '200px',
          }}
        />
        <div className="absolute right-2.5 bottom-2.5">
          {message.trim() ? (
            <button
              className="p-1.5 rounded-md bg-zinc-600 hover:bg-zinc-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={disabled}
            >
              <ArrowUp size={16} />
            </button>
          ) : (
            <button className="p-1.5 rounded-md text-zinc-400">
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
