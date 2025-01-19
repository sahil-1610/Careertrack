"use client";
import { AddinterviewCard } from "@/components/AddInterviewCard";
import { PreviousInterviewCard } from "@/components/PreviousInterviewCard";
import React, { useEffect, useState } from "react";
import Footer from "@/components/Footer";

function Interview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch("/api/user/interview", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        setInterviews(data.interviews);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="mt-16">
      <h1 className="text-2xl text-center font-bold mb-6">AI MOCK INTERVIEW</h1>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-8 w-full">
          <AddinterviewCard />
        </div>
        <div className="w-full">
          <h1 className="text-2xl text-center font-bold mb-6">
            Previous Interviews
          </h1>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : interviews.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center mb-10">
              {interviews.map((interview) => (
                <PreviousInterviewCard
                  key={interview._id}
                  interview={interview}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No interviews available.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Interview;
