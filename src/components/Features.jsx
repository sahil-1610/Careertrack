"use client";
import Link from "next/link";
import {
  FileText,
  Video,
  Briefcase,
  Book,
  MessageSquare,
  FileUser,
} from "lucide-react";
import { BackgroundGradient } from "./ui/background-gradient";

function Features() {
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-white/90" />,
      title: "AI Resume Analysis",
      description:
        "Get detailed insights and suggestions to optimize your resume for specific job roles and increase your chances of getting noticed by recruiters.",
    },
    {
      icon: <FileUser className="h-8 w-8 text-white/90" />,
      title: "AI Resume Generator",
      description:
        "Get detailed Resume for specific job roles and increase your chances of getting noticed by recruiters.",
    },
    {
      icon: <Video className="h-8 w-8 text-white/90" />,
      title: "AI Mock Interviews",
      description:
        "Practice with our intelligent interview simulator that provides real-time feedback on your responses, helping you prepare for the real thing.",
    },
    {
      icon: <Book className="h-8 w-8 text-white/90" />,
      title: "Course Recommendations",
      description:
        "Discover personalized course suggestions that bridge your skill gaps and align with your career goals and target job requirements.",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-white/90" />,
      title: "Smart Job Portal",
      description:
        "Browse through curated job listings that match your profile and get AI-powered insights on how to improve your application for each role.",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-white/90" />,
      title: "AI Career Mentor",
      description:
        "Get instant guidance from our AI mentor on career decisions, job applications, and professional development strategies.",
    },
  ];

  return (
    <div className="py-12 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30 animate-float"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            Powerful Capabilities
          </h2>
          <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="text-gradient-animated"> Advanced Features</span>{" "}
            to Accelerate Your Career
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {features.map((feature, index) => (
            <div key={index} className="flex justify-center">
              <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                  <div className="rounded-full bg-secondary/50 w-14 h-14 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
                    {feature.title}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">
                    {feature.description}
                  </p>
                </div>
              </BackgroundGradient>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;
