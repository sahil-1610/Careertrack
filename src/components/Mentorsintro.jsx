"use client";
import { WavyBackground } from "./ui/wavy-background";
import { AnimatedTooltip } from "./ui/animated-tooltip";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const mentors = [
  {
    id: 1,
    name: "AI ",
    designation: "Career Agent",
    image:
      "https://images.unsplash.com/photo-1673255745677-e36f618550d1?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    name: "AI",
    designation: "Web Developer Agent",
    image:
      "https://images.unsplash.com/photo-1677442135730-64f105e0ea05?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "AI",
    designation: "ML Agent",
    image:
      "https://images.unsplash.com/photo-1625314868143-20e93ce3ff33?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

function Mentorsintro() {
  return (
    <>
      <div className="relative h-[40rem] overflow-hidden flex items-center justify-center">
        <WavyBackground className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl md:text-4xl lg:text-7xl text-white font-bold text-center mb-8">
            Meet Our{" "}
            <span className="text-gradient-animated">AI Instructors</span>
          </h2>
          <p className="text-base md:text-lg text-white text-center mb-4">
            Discover the talented professionals who will guide your Tech journey
          </p>
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={mentors} />
          </div>
        </WavyBackground>
      </div>
      {/* <div className="mt-12 text-center animate-fade-in animate-delay-500">
        <Link
          href="/mentor"
          className="inline-flex items-center text-slate-100 hover:text-slate-300 transition-colors"
        >
          Interact with Mentors <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div> */}
    </>
  );
}

export default Mentorsintro;
