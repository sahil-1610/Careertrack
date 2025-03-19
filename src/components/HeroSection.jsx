"use client";
import React from "react";
import Link from "next/link";
import { Button } from "./ui/moving-border";
import { LampContainer } from "./ui/lamp";

export default function HeroSection() {
  return (
    <>
      {/* Lamp Positioned at the Top */}
      <LampContainer className="absolute -top-16 left-0 w-full z-0" />

      {/* Hero Section */}
      <section className="relative pt-24 mt-10">
        <div className=" container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            Elevate Your Career With
            <span className="text-gradient-animated">AI-Powered</span> Guidance
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            An intelligent platform that analyzes your resume, prepares you for
            interviews, recommends relevant courses, and connects you with job
            opportunities tailored to your unique skills and ambitions.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <Link href="/profile">
              <Button variant="outline" className="rounded-full px-8 py-4">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview with Glowing Animation */}
          <div className=" mt-16 relative w-full max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden glass-effect p-1 shadow-[0_0_25px_rgba(74,222,255,0.5)] hover:shadow-[0_0_45px_rgba(74,222,255,0.8)] transition-all duration-500 animate-glow-pulse">
              <div className="w-full h-full bg-gray-900 rounded-xl relative border border-primary/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-3xl font-bold text-gradient animate-pulse-glow">
                    CareerTrack Dashboard
                  </h2>
                </div>

                {/* Floating Animations on Dashboard */}
                <div
                  className="absolute top-[20%] left-[20%] w-16 h-8 bg-primary/10 rounded-md blur-sm animate-float"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute top-[30%] right-[25%] w-20 h-6 bg-accent/10 rounded-md blur-sm animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute bottom-[25%] left-[30%] w-24 h-10 bg-primary/5 rounded-md blur-sm animate-float"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
            </div>

            {/* Stats Section with Fixes */}
            <div className="flex justify-center mt-12 gap-8 md:gap-16">
              <div
                className="text-center animate-slide-up opacity-0 animate-fade-in"
                style={{ animationDelay: "0.7s" }}
              >
                <div className="text-3xl font-bold text-primary animate-bounce-subtle">
                  93%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div
                className="text-center animate-slide-up opacity-0 animate-fade-in"
                style={{ animationDelay: "0.9s" }}
              >
                <div className="text-3xl font-bold text-primary animate-bounce-subtle">
                  15k+
                </div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div
                className="text-center animate-slide-up opacity-0 animate-fade-in"
                style={{ animationDelay: "1.1s" }}
              >
                <div className="text-3xl font-bold text-primary animate-bounce-subtle">
                  100+
                </div>
                <div className="text-sm text-muted-foreground">Partners</div>
              </div>
            </div>

            {/* Floating Background Effects */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl animate-rotate-orbit opacity-50"></div>
            <div
              className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl animate-rotate-orbit opacity-50"
              style={{ animationDelay: "2s", animationDirection: "reverse" }}
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}
