// ✅ Updated: helpers/geminiChatBot.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.CHAT_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function getGeminiResponse({ messages }) {
  console.log("🧠 Original app messages:", JSON.stringify(messages, null, 2));

  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : msg.role,
    parts: [{ text: msg.content }],
  }));

  console.log(
    "📦 Formatted for Gemini:",
    JSON.stringify(formattedMessages, null, 2)
  );

  const isNewChat = formattedMessages.length === 1;

  try {
    if (isNewChat) {
      console.log("💬 Calling generateContent (single-turn)...");
      const result = await model.generateContent(
        formattedMessages[0].parts[0].text
      );
      console.log("✅ Gemini single-turn response:", result.response.text());
      return result.response.text();
    }

    // ❗ Ensure first message in chat history is "user"
    if (formattedMessages[0].role !== "user") {
      throw new Error("First message in multi-turn chat must be from user.");
    }

    console.log("💬 Calling startChat + sendMessage (multi-turn)...");
    const chat = model.startChat({ history: formattedMessages.slice(0, -1) });

    const lastMessage = formattedMessages.at(-1).parts[0].text;
    const result = await chat.sendMessage(lastMessage);

    console.log("✅ Gemini chat response:", result.response.text());
    return result.response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    throw error;
  }
}

export async function streamGeminiResponse({ messages }) {
  const formattedMessages = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : msg.role,
    parts: [{ text: msg.content }],
  }));

  try {
    const isNewChat = formattedMessages.length === 1;
    let response;

    if (isNewChat) {
      response = await model.generateContentStream(
        formattedMessages[0].parts[0].text
      );
    } else {
      const chat = model.startChat({
        history: formattedMessages.slice(0, -1),
      });
      const prompt = formattedMessages.at(-1).parts[0].text;
      response = await chat.sendMessageStream(prompt);
    }

    // Return the actual stream iterator
    return response.stream;
  } catch (error) {
    console.error("Streaming Error:", error);
    throw error;
  }
}
