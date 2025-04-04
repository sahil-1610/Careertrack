import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { ArrowDown, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const viewportRef = React.useRef(null);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    React.useEffect(() => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }, [children]);

    const handleScroll = () => {
      const viewport = viewportRef.current;
      if (viewport) {
        const isNotAtBottom =
          viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight >
          100;
        setShowScrollButton(isNotAtBottom);
      }
    };

    const scrollToBottom = () => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    };

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="h-full w-full rounded-[inherit]"
          onScroll={handleScroll}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />

        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <ArrowDown size={20} />
          </button>
        )}
      </ScrollAreaPrimitive.Root>
    );
  }
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        "flex touch-none select-none transition-colors",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
);
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
