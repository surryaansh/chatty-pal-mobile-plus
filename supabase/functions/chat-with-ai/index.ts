import { serve } from "https://deno.land/std/http/server.ts";
import OpenAI from "https://deno.land/x/openai@1.5.4/mod.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

serve(async (req) => {
  const { message, conversationHistory } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // ✅ GPT-4o
    messages: [
      ...conversationHistory,
      { role: "user", content: message },
    ],
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content || "No reply.";

  return new Response(JSON.stringify({ response: reply }), {
    headers: { "Content-Type": "application/json" },
  });
});
