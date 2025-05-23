
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import Sidebar from '@/components/Sidebar';
import ChatInput from '@/components/ChatInput';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useChatGPT } from '@/hooks/useChatGPT';
import LoadingDots from '@/components/LoadingDots';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, sendMessage, isLoading } = useChatGPT();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);
  
  return (
    <div className="flex h-screen bg-chatgpt-darker text-white">
      {/* Sidebar - only rendered as default on desktop */}
      {(!isMobile || isSidebarOpen) && (
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      )}
      
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <ChatHeader toggleSidebar={toggleSidebar} />
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto pt-4 pb-32">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div>
              {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="py-6 bg-zinc-800/30">
                  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-4">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-teal-500 text-white text-xs">
                        AI
                      </div>
                      <div className="flex-1 pt-2">
                        <LoadingDots />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Chat Input */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-chatgpt-darker via-chatgpt-darker to-transparent pt-10 pb-3">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
