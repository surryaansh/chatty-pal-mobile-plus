
import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
let chat: Chat | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "Gemini API key not found. Please set the `API_KEY` environment variable. Chat functionality will be disabled."
  );
}

export const initChatSession = async (): Promise<boolean> => {
  if (!ai) {
    console.error("Gemini AI SDK not initialized due to missing API key.");
    return false;
  }
  // If chat object already exists, we assume it's usable unless explicitly reset.
  if (chat) return true; 

  try {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash-preview-04-17',
      // Optional: Add system instructions or other configurations
      // config: {
      //   systemInstruction: "You are a helpful and concise assistant.",
      // }
    });
    console.log("Gemini chat session initialized.");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini chat session:", error);
    return false;
  }
};

// Function to explicitly start a new chat session, resetting context
export const startNewGeminiChatSession = async (): Promise<boolean> => {
  if (!ai) {
     console.error("Gemini AI SDK not initialized. Cannot start new chat session.");
     return false;
  }
  chat = null; // Force re-initialization of the chat object
  console.log("Previous Gemini chat context cleared for new session.");
  return initChatSession();
};


export const sendMessageStream = async (
  messageText: string
): Promise<AsyncIterable<GenerateContentResponse> | null> => {
  if (!chat) { // Ensure chat is initialized if null (e.g., after a reset or initial load error)
    const initialized = await initChatSession();
    if (!initialized || !chat) {
      console.error("Chat session is not initialized. Cannot send message.");
      async function* errorStream() {
        yield { text: "Error: Chat session not initialized. Check API key and console.", candidates: [], usageMetadata: undefined  };
      }
      return errorStream();
    }
  }

  const content: Content = { parts: [{ text: messageText }], role: "user" };

  try {
    // The SDK's chat.sendMessageStream will use its internal history for context.
    const result = await chat.sendMessageStream({ message: content });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    async function* errorStream() {
        yield { text: "Error communicating with the AI. Please try again.", candidates: [], usageMetadata: undefined  };
    }
    return errorStream();
  }
};

export const isChatAvailable = (): boolean => {
  return !!API_KEY && !!ai;
};

// getChatHistory is removed as App.tsx now manages multi-session history.
// The Gemini SDK `chat.history` is internal to the Chat object for its own context.

// Ensure chat is initialized on load if API key is present,
// but only if `chat` is not already set (e.g. by a previous explicit initialization).
if (API_KEY && !chat) {
  initChatSession();
}
