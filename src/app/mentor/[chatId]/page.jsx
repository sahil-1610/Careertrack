"use client";
import Footer from "@/components/Footer";
import Chat from "@/components/AiMentor/Chat";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();

  return (
    <main className="min-h-screen">
      <Chat key={params.chatId} initialChatId={params.chatId} />
      <Footer />
    </main>
  );
}
