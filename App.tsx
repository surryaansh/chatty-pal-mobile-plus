import React, { useState, useEffect, useCallback } from 'react';
import { Message, SenderType, ChatSession } from './types';
import Header from './components/Header';
import WelcomeMessage from './components/WelcomeMessage';
import ChatMessageList from './components/ChatMessageList';
import ChatInputBar from './components/ChatInputBar';
import Sidebar from './components/Sidebar';
import { 
  initChatSession, 
  sendMessageStream, 
  isChatAvailable as checkChatAvailability,
  startNewGeminiChatSession
} from './services/geminiService';

const generateChatTitle = (firstMessageText: string): string => {
  if (!firstMessageText) return `Chat @ ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  const words = firstMessageText.split(' ');
  if (words.length > 4) {
    return words.slice(0, 4).join(' ') + '...';
  }
  return firstMessageText;
};

const App: React.FC = () => {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [allChatSessions, setAllChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatReady, setChatReady] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = async () => {
      const available = checkChatAvailability();
      if (available) {
        const ready = await initChatSession();
        setChatReady(ready);
        if(ready && currentMessages.length > 0 && currentMessages[0].text.includes("API key")) {
            setCurrentMessages([]); // Clear API key message if chat is now ready
        }
      } else {
        setChatReady(false);
        setCurrentMessages([{
          id: crypto.randomUUID(),
          text: "Oh no! SuruGPT can't connect right now. Please tell my human to check the API key settings! ✨",
          sender: SenderType.AI,
          timestamp: new Date()
        }]);
      }
    };
    initializeApp();
  }, []); 

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = async () => {
    setCurrentMessages([]);
    setActiveChatId(null);
    await startNewGeminiChatSession(); // Reset AI's context
    setChatReady(true); // Assume chat is ready after reset if API key is valid
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedSession = allChatSessions.find(session => session.id === chatId);
    if (selectedSession) {
      setCurrentMessages([...selectedSession.messages]); // Load messages from selected session
      setActiveChatId(chatId);
    }
    setIsSidebarOpen(false);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatReady) {
      console.warn("Chat is not ready. Cannot send message.");
      // Add an error message to currentMessages if needed
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: SenderType.USER,
      timestamp: new Date(),
    };

    let currentSessionId = activeChatId;

    // Update current messages for immediate UI feedback
    setCurrentMessages(prevMessages => [...prevMessages, userMessage]);

    if (!currentSessionId) { // New chat session
      currentSessionId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: generateChatTitle(text),
        messages: [userMessage],
        createdAt: new Date(),
      };
      setAllChatSessions(prevSessions => [...prevSessions, newSession]);
      setActiveChatId(currentSessionId);
    } else { // Existing chat session
      setAllChatSessions(prevSessions =>
        prevSessions.map(session =>
          session.id === currentSessionId
            ? { ...session, messages: [...session.messages, userMessage] }
            : session
        )
      );
    }
    
    setIsLoading(true);
    const aiMessageId = crypto.randomUUID();
    const aiPlaceholderMessage: Message = { 
      id: aiMessageId, text: '', sender: SenderType.AI, timestamp: new Date() 
    };

    // Add AI placeholder to currentMessages
    setCurrentMessages(prevMessages => [...prevMessages, aiPlaceholderMessage]);
    
    // Add AI placeholder to allChatSessions
    if (currentSessionId) { // Should always be true here
        setAllChatSessions(prevSessions =>
            prevSessions.map(session =>
              session.id === currentSessionId
                ? { ...session, messages: [...session.messages, aiPlaceholderMessage] }
                : session
            )
          );
    }

    let accumulatedAiText = '';
    try {
      const stream = await sendMessageStream(text);
      if (stream) {
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            accumulatedAiText += chunkText;
            const updatedAiMessage = { ...aiPlaceholderMessage, text: accumulatedAiText, timestamp: new Date() };
            
            setCurrentMessages(prevMessages =>
              prevMessages.map(msg => (msg.id === aiMessageId ? updatedAiMessage : msg))
            );
            
            if (currentSessionId) {
              setAllChatSessions(prevSessions =>
                prevSessions.map(session =>
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
            }
          }
        }
        if (accumulatedAiText.trim() === '') {
          const fallbackMsg = "Hmm, SuruGPT is a bit puzzled. Could you try asking in a different way? 🤔";
          const updatedFallbackMessage = { ...aiPlaceholderMessage, text: fallbackMsg, timestamp: new Date() };
          setCurrentMessages(prevMessages =>
            prevMessages.map(msg => (msg.id === aiMessageId ? updatedFallbackMessage : msg))
          );
          if (currentSessionId) {
            setAllChatSessions(prevSessions =>
                prevSessions.map(session =>
                  session.id === currentSessionId
                    ? { ...session, messages: session.messages.map(msg => msg.id === aiMessageId ? updatedFallbackMessage : msg) }
                    : session
                )
            );
          }
        }
      } else {
        const errorMsg = "It seems there was a hiccup sending your message to SuruGPT! Please try again. 🚧";
        const updatedErrorMessage = { ...aiPlaceholderMessage, text: errorMsg, timestamp: new Date() };
        setCurrentMessages(prevMessages =>
            prevMessages.map(msg => (msg.id === aiMessageId ? updatedErrorMessage : msg))
        );
        if (currentSessionId) {
            setAllChatSessions(prevSessions =>
                prevSessions.map(session =>
                  session.id === currentSessionId
                    ? { ...session, messages: session.messages.map(msg => msg.id === aiMessageId ? updatedErrorMessage : msg) }
                    : session
                )
            );
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      const errorText = error instanceof Error && error.message.startsWith("Error:") ? error.message : "SuruGPT encountered a little problem! Please try again. 🛠️";
      const finalErrorMessage = { ...aiPlaceholderMessage, text: errorText, timestamp: new Date() };
      setCurrentMessages(prevMessages =>
        prevMessages.map(msg => (msg.id === aiMessageId ? finalErrorMessage : msg))
      );
       if (currentSessionId) {
            setAllChatSessions(prevSessions =>
                prevSessions.map(session =>
                  session.id === currentSessionId
                    ? { ...session, messages: session.messages.map(msg => msg.id === aiMessageId ? finalErrorMessage : msg) }
                    : session
                )
            );
        }
    } finally {
      setIsLoading(false);
    }
  }, [chatReady, activeChatId]);

  const showWelcome = !activeChatId && currentMessages.length === 0 && chatReady;
  const showApiErrorWelcome = currentMessages.length === 1 && currentMessages[0].text.includes("API key") && !chatReady;

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
          {showWelcome || showApiErrorWelcome ? ( 
             showApiErrorWelcome && !chatReady ? <ChatMessageList messages={currentMessages} isLoadingAiResponse={false} /> : <WelcomeMessage />
          ) : (
            <ChatMessageList messages={currentMessages} isLoadingAiResponse={isLoading} />
          )}
        </main>
        <ChatInputBar onSendMessage={handleSendMessage} isLoading={isLoading} isChatAvailable={chatReady} />
      </div>
    </div>
  );
};

export default App;
