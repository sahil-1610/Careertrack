import { connectDB } from "@/helpers/dbConfig";
import Chat from "@/models/aichat.model";
import User from "@/models/user.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { streamGeminiResponse } from "@/helpers/geminiChatBot";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const userId = await getDataFromToken(req);
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chat = await Chat.findOne({
      userId,
      chatId: params.chatId,
    });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    return new Response(JSON.stringify(chat), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch chat" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const dynamic = "force-dynamic";
