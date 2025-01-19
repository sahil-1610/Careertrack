"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";

export default function LatestFeedbackPage() {
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchLatestFeedback = async () => {
      try {
        const response = await fetch(
          `/api/user/interview/${params.id}/feedback`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch feedback");
        }

        const data = await response.json();
        if (data.success) {
          setFeedbackData(data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Error loading feedback data");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchLatestFeedback();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!feedbackData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">No feedback available yet</p>
      </div>
    );
  }

  return (
    <div className="p-10 mt-9">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is Your Interview Feedback</h2>
      <h2 className="text-blue-700 text-lg my-3">
        Your Overall Score is: <strong>{feedbackData.averageRating}/5</strong>
      </h2>
      <h2 className="text-sm text-gray-500 mb-6">
        Find below interview questions with correct answers, your answers, and
        feedback for improvement
      </h2>

      <div className="space-y-4">
        {feedbackData.questions.map((item, index) => (
          <Collapsible key={index} className="border rounded-lg">
            <CollapsibleTrigger className="w-full p-4 flex justify-between items-center bg-teal-500 hover:bg-gray-100 rounded-t-lg">
              <div className="flex  items-center">
                <span className="font-semibold text-blue-800">
                  Question {index + 1}
                </span>
                <span className="ml-4 text-gray-600">
                  Rating: {item.rating}/5
                </span>
              </div>
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 border-t">
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-700">Question:</h3>
                  <p className="mt-1">{item.question}</p>
                </div>
                <div>
                  <h3 className="font-medium text-blue-600">Your Answer:</h3>
                  <p className="mt-1">{item.userAnswer}</p>
                </div>
                <div>
                  <h3 className="font-medium text-green-600">
                    Correct Answer:
                  </h3>
                  <p className="mt-1">{item.correctAnswer}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded">
                  <h3 className="font-medium text-purple-400">Feedback:</h3>
                  <p className="mt-1 text-lime-300">{item.feedback}</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <div className="flex justify-end gap-6">
        <button
          onClick={() => {
            router.replace("/");
          }}
          className="mt-6 shadow-lg hover:shadow-xl bg-blue-400 text-white px-8 py-2 rounded-md transition duration-200 my-10"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
