import React, { useRef, useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } group hover:bg-muted/50 transition-colors`}
    >
      <div className={`flex max-w-[80%] gap-2 px-4 py-2`}>
        <div
          className={`flex-1 rounded-lg p-4 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-start p-2 hover:bg-accent hover:text-accent-foreground rounded"
          title="Copy message"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

const ChatWindow = ({ messages, onSendMessage, isTyping }) => {
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom only when new message is added
  useEffect(() => {
    if (messagesEndRef.current && scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      const shouldAutoScroll =
        scrollArea.scrollHeight - scrollArea.scrollTop ===
        scrollArea.clientHeight;

      if (shouldAutoScroll) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full">
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center text-muted-foreground px-4">
                <h3 className="text-lg md:text-xl font-medium mb-2">
                  Welcome to CareerTrack AI Mentor
                </h3>
                <p className="text-sm md:text-base">
                  Start by asking a question about your career path or job
                  search
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="flex justify-start px-4">
                  <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                    <div className="animate-pulse">AI is typing...</div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <ChatInput onSendMessage={onSendMessage} isDisabled={isTyping} />
      </div>
    </div>
  );
};

export default ChatWindow;
