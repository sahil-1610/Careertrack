"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QuestionsSection from "@/components/QuestionsSection";
import RecordAnswerSection from "@/components/RecordAnswerSection";
import Link from "next/link";

function InterviewStart({ params }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`/api/user/interview/${params.id}/start`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Interview not found");
        }

        const data = await response.json();
        setMockInterviewQuestion(data.interview.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInterview();
    }
  }, [params.id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        {/* Show placeholder div when Previous button is hidden */}
        {activeQuestionIndex > 0 ? (
          <button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            className="shadow-lg hover:shadow-xl bg-blue-400 text-white px-6 py-2 rounded-md transition duration-200"
          >
            Previous Question
          </button>
        ) : (
          <div className="w-40"></div> // Placeholder to keep Next button aligned
        )}

        {activeQuestionIndex < mockInterviewQuestion.length - 1 ? (
          <button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="shadow-lg hover:shadow-xl bg-blue-400 text-white px-6 py-2 rounded-md transition duration-200"
          >
            Next Question
          </button>
        ) : (
          <Link href={"/interview/" + params.id + "/feedback"}>
            <button className="shadow-lg hover:shadow-xl bg-red-500 text-white px-6 py-2 rounded-md transition duration-200">
              End Interview
            </button>
          </Link>
        )}
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Questions */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video / Audio Recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
          interviewId={params.id}
        />
      </div>
    </div>
  );
}

export default InterviewStart;
