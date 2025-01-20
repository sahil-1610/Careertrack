"use client";
import React from "react";
import { Boxes } from "./ui/background-boxes";
import { cn } from "@/lib/utils";

export function MentorSection() {
  return (
    <div className="relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <h1 className={"text-4xl text-white relative z-20"}>
        Personal Mentorship
      </h1>
      {/* Zapier Chatbot Embed */}
      <div className="relative z-20 mt-8">
        <iframe
          src="https://interfaces.zapier.com/embed/chatbot/cm65c4l8l000oqpxppezk2pe8"
          height="500px"
          width="700px"
          allow="clipboard-write *"
          style={{ border: "none" }}
        ></iframe>
      </div>
    </div>
  );
}
