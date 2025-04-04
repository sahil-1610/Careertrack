import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, MessageCircle, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ChatSidebar = ({
  chats = [], // Provide default empty array
  activeChat,
  onNewChat,
  onSelectChat,
  isMobile = false,
  isOpen,
  onToggle,
  onClose,
}) => {
  const router = useRouter();

  // Helper function to get chat title
  const getChatTitle = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      // Use first user message as title
      const firstMessage = chat.messages.find((m) => m.role === "user");
      if (firstMessage) {
        return (
          firstMessage.content.split("\n")[0].slice(0, 30) +
          (firstMessage.content.length > 30 ? "..." : "")
        );
      }
    }
    return chat.title || "New Conversation";
  };

  // Helper function to safely format date
  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? "" : format(dateObj, "MMM d");
  };

  // Update the click handler to use navigation
  const handleChatClick = (chatId) => {
    if (chatId) {
      onSelectChat?.(chatId);
      if (isMobile) {
        onClose?.();
      }
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-sidebar-border transition-all duration-300 ease-in-out",
        isMobile
          ? "fixed inset-y-0 left-0 z-40 w-80 transform bg-background/95 backdrop-blur-sm shadow-xl" +
              (isOpen ? " translate-x-0" : " -translate-x-full")
          : isOpen
          ? "relative w-80"
          : "w-0 overflow-hidden opacity-0"
      )}
    >
      <div
        className={cn(
          "p-4 border-b border-sidebar-border flex items-center justify-between",
          !isOpen && !isMobile && "hidden" // Hide content when sidebar is closed on desktop
        )}
      >
        <button
          type="button"
          onClick={onNewChat}
          className="w-full px-4 py-2 bg-mentor-accent hover:bg-purple-600 text-white rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-400/20 inline-flex items-center justify-center"
          disabled={!isOpen}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <div className="px-2 space-y-0">
          {" "}
          {/* Remove space-y-1 */}
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <button
                type="button"
                key={`chat-${chat.chatId}-${index}`}
                onClick={() => handleChatClick(chat.chatId)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-all duration-200 border-b border-sidebar-border/30 hover:bg-sidebar-accent/10",
                  "hover:shadow-sm hover:translate-x-0.5",
                  activeChat === chat.chatId
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2 shrink-0" />
                  <span className="font-medium truncate">
                    {getChatTitle(chat)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-sidebar-foreground/60">
                  <span className="truncate max-w-[180px]">
                    {chat.lastMessagePreview || "No messages yet"}
                  </span>
                  <span>{formatDate(chat.lastMessageTime)}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-10 text-center text-sidebar-foreground/60">
              <p>No previous chats</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default ChatSidebar;
