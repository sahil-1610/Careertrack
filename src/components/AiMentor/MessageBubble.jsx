import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MessageBubble = ({
  content,
  role,
  timestamp,
  isTyping = false,
  isStreaming = false,
}) => {
  // Change this line to check for both "ai" and "assistant" roles
  const isAI = role === "ai" || role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in mb-2 md:mb-4 transition-all duration-200",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[90%] md:max-w-[80%] px-3 py-2 md:px-4 md:py-3 rounded-2xl transform transition-all duration-200 hover:scale-[1.02]",
          isAI
            ? "bg-gray-200 text-gray-800 rounded-bl-none shadow-sm"
            : "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none shadow-md"
        )}
      >
        {isStreaming ? (
          <div className="flex items-center">
            <span className="animate-pulse">{content}</span>
          </div>
        ) : isTyping ? (
          <div className="flex items-center">
            <span>AI is thinking</span>
            <span className="typing-dots"></span>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap break-words">{content}</div>
            <div
              className={cn(
                "text-xs mt-1",
                isAI ? "text-muted-foreground" : "text-white/70"
              )}
            >
              {format(timestamp, "h:mm a")}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
