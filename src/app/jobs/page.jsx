"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import JobSection from "@/components/JobSection"; // Correct import path

export default function Jobs() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] ">
      <div>
        <JobSection />
      </div>
      <Footer />
    </main>
  );
}
