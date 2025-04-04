import { connectDB } from "@/helpers/dbConfig";
import Chat from "@/models/aichat.model";
import User from "@/models/user.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { streamGeminiResponse } from "@/helpers/geminiChatBot";

export async function POST(req) {
  try {
    await connectDB();

    const userId = await getDataFromToken(req);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const { chatId, message } = await req.json();

    let chat = await Chat.findOne({ chatId, userId: user._id });
    if (!chat) {
      chat = new Chat({ userId: user._id, chatId, messages: [] });
    }

    const isNewChat = chat.messages.length === 0;

    const systemPrompt = {
      role: "system",
      content:
        "You are CareerTrack Mentor – an AI Mentor specialized in guiding people with careers in the technology industry. Focus only on tech career-related queries such as: choosing tech roles, job search strategies, resume advice, interview preparation, in-demand skills, career growth, workplace challenges, salary negotiation, and tech freelancing. For non-tech career questions, respond with: 'I'm here to help with tech career-related questions. Let's focus on your job, goals, or professional growth in the tech world!' Be friendly, clear, and provide actionable advice.",
    };

    let messages;
    if (isNewChat) {
      messages = [
        {
          role: "user",
          content: `${systemPrompt.content}\n\nNow answer this: ${message.content}`,
        },
      ];
    } else {
      const history = chat.messages.slice(-10);
      if (history[0]?.role !== "user") {
        history.unshift({ role: "user", content: "Let's begin." });
      }
      messages = [...history, { role: "user", content: message.content }];
    }

    if (!isNewChat) {
      chat.messages.push({
        role: "user",
        content: message.content,
        timestamp: new Date(),
      });
    }

    const stream = await streamGeminiResponse({ messages });

    if (!stream || typeof stream[Symbol.asyncIterator] !== "function") {
      throw new Error("Invalid stream response from Gemini");
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let fullResponse = "";

          try {
            for await (const chunk of stream) {
              const text = chunk.text();
              fullResponse += text;

              // Send text without "data:" prefix
              controller.enqueue(encoder.encode(text));
            }

            // Save the complete message
            chat.messages.push({
              role: "assistant",
              content: fullResponse.trim(),
              timestamp: new Date(),
            });
            await chat.save();
          } catch (streamError) {
            console.error("Stream chunk error:", streamError);
            controller.error(streamError);
          }
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain", // Changed from text/event-stream
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const userId = await getDataFromToken(req);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const chats = await Chat.find({ userId: user._id }).sort({ updatedAt: -1 });

    const processedChats = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return {
        _id: chat._id,
        chatId: chat.chatId,
        userId: chat.userId,
        messages: chat.messages,
        lastMessagePreview: lastMessage
          ? lastMessage.content.substring(0, 50) + "..."
          : "",
        lastMessageTime: lastMessage ? lastMessage.timestamp : new Date(),
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    return new Response(JSON.stringify(processedChats), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch chats" }),
      {
        status: error.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export const dynamic = "force-dynamic";
