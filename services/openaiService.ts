import { supabase } from "../src/integrations/supabase/client";

export const sendMessage = async (
  messageText: string,
  conversationHistory: any[] = []
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke("chat-with-ai", {
      body: {
        message: messageText,
        conversationHistory,
      },
    });

    if (error) {
      console.error("Error from Supabase Edge Function:", error);
      return "Error: Failed to get response from AI.";
    }

    return data?.response || "No response from AI.";
  } catch (err) {
    console.error("Unexpected error sending message:", err);
    return "Error: Something went wrong while contacting the AI.";
  }
};
