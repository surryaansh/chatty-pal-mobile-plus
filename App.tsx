import React, { useState, useEffect, useCallback } from 'react';
import { Message, SenderType, ChatSession } from './types';
import Header from './components/Header';
import WelcomeMessage from './components/WelcomeMessage';
import ChatMessageList from './components/ChatMessageList';
import ChatInputBar from './components/ChatInputBar';
import Sidebar from './components/Sidebar';

const generateChatTitle = (firstMessageText: string): string => {
  if (!firstMessageText) return `Chat @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const words = firstMessageText.split(' ');
  return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : firstMessageText;
};

const App: React.FC = () => {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [allChatSessions, setAllChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatReady, setChatReady] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setCurrentMessages([]);
    setActiveChatId(null);
    setChatReady(true);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedSession = allChatSessions.find(session => session.id === chatId);
    if (selectedSession) {
      setCurrentMessages([...selectedSession.messages]);
      setActiveChatId(chatId);
    }
    setIsSidebarOpen(false);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatReady) {
      console.warn("Chat is not ready. Cannot send message.");
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: SenderType.USER,
      timestamp: new Date(),
    };

    let currentSessionId = activeChatId;
    setCurrentMessages(prev => [...prev, userMessage]);

    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: generateChatTitle(text),
        messages: [userMessage],
        createdAt: new Date(),
      };
      setAllChatSessions(prev => [...prev, newSession]);
      setActiveChatId(currentSessionId);
    } else {
      setAllChatSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, userMessage] }
            : session
        )
      );
    }

    const aiMessageId = crypto.randomUUID();
    const aiPlaceholderMessage: Message = {
      id: aiMessageId, text: '', sender: SenderType.AI, timestamp: new Date()
    };

    setCurrentMessages(prev => [...prev, aiPlaceholderMessage]);
    setAllChatSessions(prev =>
      prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: [...session.messages, aiPlaceholderMessage] }
          : session
      )
    );

    setIsLoading(true);

    try {
      const conversationHistory = currentMessages.map(msg => ({
        role: msg.sender === SenderType.USER ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await fetch('/functions/v1/chat-with-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory }),
      });

      const data = await response.json();
      const aiText = data.response;

      const updatedAiMessage = { ...aiPlaceholderMessage, text: aiText, timestamp: new Date() };
      setCurrentMessages(prev =>
        prev.map(msg => (msg.id === aiMessageId ? updatedAiMessage : msg))
      );
      setAllChatSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: session.messages.map(msg =>
                  msg.id === aiMessageId ? updatedAiMessage : msg
                ),
              }
            : session
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      const fallbackMsg = "SuruGPT encountered a problem. Please try again! 🛠️";
      const errorMessage = { ...aiPlaceholderMessage, text: fallbackMsg, timestamp: new Date() };
      setCurrentMessages(prev =>
        prev.map(msg => (msg.id === aiMessageId ? errorMessage : msg))
      );
      setAllChatSessions(prev =>
        prev.map(session =>
          session.id === currentSessionId
            ? {
                ...session,
                messages: session.messages.map(msg =>
                  msg.id === aiMessageId ? errorMessage : msg
                ),
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chatReady, activeChatId, currentMessages]);

  const showWelcome = !activeChatId && currentMessages.length === 0 && chatReady;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#2D2A32] overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleToggleSidebar} 
        onNewChat={handleNewChat}
        chatSessions={allChatSessions}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
      />
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 sidebar-overlay" 
          onClick={handleToggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      <div className="relative z-10 flex flex-col flex-grow h-full bg-[#393641]">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="flex-grow flex flex-col overflow-hidden">
          {showWelcome ? (
            <WelcomeMessage />
          ) : (
            <>
              <ChatMessageList messages={currentMessages} />
              <ChatInputBar isLoading={isLoading} onSend={handleSendMessage} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
