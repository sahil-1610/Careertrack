import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatInput = ({ onSendMessage, isDisabled = false }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (but not with Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="relative border rounded-xl overflow-hidden bg-background/50 glass-morphism mx-auto max-w-3xl">
      <Textarea
        ref={textareaRef}
        placeholder="Send a message"
        className="min-h-[45px] md:min-h-[56px] max-h-[200px] py-3 md:py-4 pr-12 md:pr-14 bg-transparent border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin text-sm md:text-base"
        value={message}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
      />
      <Button
        type="button"
        variant="default"
        size="icon"
        className={cn(
          "absolute right-2 bottom-1.5 md:bottom-2 h-8 w-8 md:h-9 md:w-9 rounded-full",
          isDisabled || !message.trim()
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100"
        )}
        onClick={handleSubmit}
        disabled={isDisabled || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
