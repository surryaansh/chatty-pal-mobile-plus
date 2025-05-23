
import { useState, useCallback, useEffect } from 'react';
import { MessageType } from '../components/ChatMessage';
import { useToast } from '@/components/ui/use-toast';

export const useChatGPT = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('chatgpt-api-key');
    setApiKey(savedApiKey);
  }, []);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Create and add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Check if API key exists
      if (!apiKey) {
        setTimeout(() => {
          const aiMessage: MessageType = {
            id: (Date.now() + 1).toString(),
            content: "Please add your OpenAI API key in the settings to use ChatGPT.",
            role: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsLoading(false);
        }, 1500);
        return;
      }
      
      // In a real implementation, this would call the OpenAI API
      // This is a mock implementation for demonstration
      setTimeout(() => {
        const aiMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: getResponseForPrompt(content),
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 2000);
      
      // For a real implementation with OpenAI API:
      /*
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content }
          ],
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }
      
      const aiMessage: MessageType = {
        id: Date.now().toString() + 1,
        content: data.choices[0]?.message?.content || 'No response',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      */
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, toast]);
  
  return {
    messages,
    sendMessage,
    isLoading,
    apiKey
  };
};

// Mock responses for demonstration
function getResponseForPrompt(prompt: string): string {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('hello') || promptLower.includes('hi')) {
    return "Hello! How can I help you today?";
  }
  
  if (promptLower.includes('weather')) {
    return "I'm sorry, I don't have access to real-time weather data. You would need to check a weather service or app for that information.";
  }
  
  if (promptLower.includes('name')) {
    return "I'm ChatGPT, a language model created by OpenAI. How can I assist you?";
  }
  
  return "This is a demo version. To get real responses from ChatGPT, you'll need to add your OpenAI API key in the settings.";
}
