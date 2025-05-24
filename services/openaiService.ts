
import { supabase } from "@/integrations/supabase/client";

let isAvailable = true;

export const initChatSession = async (): Promise<boolean> => {
  // For OpenAI through Supabase, we don't need to initialize a session
  // Just check if we can reach our edge function
  try {
    // Test connection to our edge function
    const { error } = await supabase.functions.invoke('chat-with-ai', {
      body: { message: 'test', conversationHistory: [] }
    });
    
    if (error) {
      console.error("OpenAI service not available:", error);
      isAvailable = false;
      return false;
    }
    
    isAvailable = true;
    console.log("OpenAI chat service initialized.");
    return true;
  } catch (error) {
    console.error("Failed to initialize OpenAI chat service:", error);
    isAvailable = false;
    return false;
  }
};

export const startNewGeminiChatSession = async (): Promise<boolean> => {
  // For OpenAI, we don't maintain server-side sessions
  // Each conversation's context is managed client-side
  console.log("New OpenAI chat session started (context reset).");
  return true;
};

export const sendMessageStream = async (
  messageText: string,
  conversationHistory: any[] = []
): Promise<AsyncIterable<any> | null> => {
  if (!isAvailable) {
    console.error("OpenAI service is not available. Cannot send message.");
    const errorStream = async function* () {
      yield { text: "Error: OpenAI service not initialized. Check API key and console." };
    };
    return errorStream();
  }

  try {
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: { 
        message: messageText,
        conversationHistory: conversationHistory
      }
    });

    if (error) {
      throw error;
    }

    // Create an async iterable for the streaming response
    const stream = async function* () {
      if (data) {
        // If we get a direct response (non-streaming), yield it
        yield { text: data.response || data.text || "Response received" };
      } else {
        yield { text: "Error: No response from OpenAI service" };
      }
    };

    return stream();
  } catch (error) {
    console.error("Error sending message to OpenAI:", error);
    const errorStream = async function* () {
      yield { text: "Error communicating with the AI. Please try again." };
    };
    return errorStream();
  }
};

export const isChatAvailable = (): boolean => {
  return isAvailable;
};

// Initialize on load
initChatSession();
