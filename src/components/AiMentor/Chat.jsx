"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ChatSidebar from "@/components/AiMentor/ChatSidebar";
import ChatWindow from "@/components/AiMentor/ChatWindow";
import { ChevronRight, Menu, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

function Chat({ initialChatId = null }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [activeChat, setActiveChat] = useState(initialChatId);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Change initial state to true
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Handle sidebar state based on mobile/desktop
  useEffect(() => {
    if (isMobile !== undefined) {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);

  const handleAuthError = (status) => {
    if (status === 401) {
      router.push("/login");
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch("/api/user/mentor");
      if (!response.ok) {
        handleAuthError(response.status);
        return;
      }
      const chatHistory = await response.json();
      setChats(chatHistory);

      // If we have an initialChatId, find the chat in the history first
      if (initialChatId) {
        const existingChat = chatHistory.find(
          (chat) => chat.chatId === initialChatId
        );
        if (existingChat) {
          setActiveChat(initialChatId);
          setMessages(existingChat.messages || []);
        } else {
          // Only fetch individual chat if not found in history
          const chatResponse = await fetch(`/api/user/mentor/${initialChatId}`);
          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            setActiveChat(initialChatId);
            setMessages(chatData.messages || []);
          }
        }
      } else if (chatHistory.length > 0) {
        const latestChat = chatHistory[0];
        setActiveChat(latestChat.chatId);
        setMessages(latestChat.messages || []);
        router.push(`/mentor/${latestChat.chatId}`);
      }
    } catch (error) {
      toast.error("Failed to fetch chat history");
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, [initialChatId]); // Add initialChatId as dependency

  // Function to update chat preview in sidebar
  const updateChatPreview = (chatId, messageContent) => {
    if (!chatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastMessagePreview: messageContent,
              lastMessageTime: new Date(),
            }
          : chat
      )
    );
  };

  // Function to update chat title with first message
  const updateChatTitle = (chatId, messageContent) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              title:
                chat.title === "New Conversation"
                  ? messageContent.split("\n")[0].slice(0, 30) +
                    (messageContent.length > 30 ? "..." : "")
                  : chat.title,
            }
          : chat
      )
    );
  };

  // Function to select a chat
  const handleSelectChat = async (chatId) => {
    try {
      const chatResponse = await fetch(`/api/user/mentor/${chatId}`);
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        setActiveChat(chatId);
        setMessages(chatData.messages || []);
        router.replace(`/mentor/${chatId}`);
      }
    } catch (error) {
      toast.error("Failed to load chat");
    }

    // Only close sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Function to create a new chat
  const handleNewChat = () => {
    const newChatId = uuidv4();
    const newChat = {
      chatId: newChatId,
      title: "New Conversation", // This will be updated with first message
      lastMessagePreview: "Start a new conversation",
      lastMessageTime: new Date(),
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    router.replace(`/mentor/${newChatId}`);
    setActiveChat(newChatId);
    setMessages([]);

    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Function to toggle sidebar with device context
  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarOpen(false);
    }
  };

  // Function to send a message
  const handleSendMessage = async (content) => {
    const currentChatId = activeChat || uuidv4();

    if (!activeChat) {
      handleNewChat();
    }

    const newMessage = {
      id: uuidv4(),
      content,
      role: "user", // Make sure this is "user" not "ai"
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    updateChatPreview(currentChatId, content);

    // Update chat title if this is the first message
    const currentChat = chats.find((chat) => chat.chatId === currentChatId);
    if (currentChat && currentChat.title === "New Conversation") {
      updateChatTitle(currentChatId, content);
    }

    try {
      setIsTyping(true);
      const response = await fetch("/api/user/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: currentChatId,
          message: newMessage,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast.error("API usage limit exceeded. Please try again later.");
          return;
        }
        handleAuthError(response.status);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = {
        id: uuidv4(),
        role: "assistant", // This should be "assistant" or "ai"
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiMessage]);

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          aiMessage.content += text;
          aiMessage.isStreaming = false;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessage.id ? { ...aiMessage } : msg
            )
          );
        }

        updateChatPreview(currentChatId, aiMessage.content);
      } catch (error) {
        console.error("Error reading stream:", error);
      } finally {
        setIsTyping(false);
      }
    } catch (error) {
      toast.error(
        error.message === "API_CREDIT_LIMIT_EXCEEDED"
          ? "API usage limit exceeded. Please try again later."
          : "Failed to get AI response"
      );
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-mentor-dark relative">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-background/50 glass-morphism">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-2 h-10 w-10 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              onClick={toggleSidebar}
            >
              {sidebarOpen && !isMobile ? (
                <ChevronRight size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>
            <h1 className="text-xl text-center font-semibold">AI Mentor</h1>
          </div>

          <button
            type="button"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground"
          >
            <User size={20} />
          </button>
        </header>

        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

export default Chat;
