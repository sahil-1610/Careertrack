"use client";
import { AddinterviewCard } from "@/components/AddInterviewCard";
import { PreviousInterviewCard } from "@/components/PreviousInterviewCard";
import React from "react";
import Footer from "@/components/Footer";

function interview() {
  return (
    <div className="mt-17 px-6">
      <h1 className="text-2xl text-center font-bold mb-6">AI MOCK INTERVIEW</h1>
      <div className="mt-16 flex flex-col items-start">
        <div className="mb-8">
          {/* <h1 className="text-2xl text-center font-bold mb-6">
            Add New Interview
          </h1> */}
          <AddinterviewCard />
        </div>
        <div>
          <h1 className="text-2xl text-center font-bold mb-6">
            Previous Interviews
          </h1>
          <div className="flex flex-wrap gap-6  mb-10">
            <PreviousInterviewCard />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default interview;
