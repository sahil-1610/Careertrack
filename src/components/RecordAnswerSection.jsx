"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSpeechToText from "react-hook-speech-to-text";
import Webcam from "react-webcam";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewId,
}) {
  const [userAnswers, setUserAnswers] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");

  // Prevent SSR issues
  const isClient = typeof window !== "undefined";

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Reset current transcript when switching questions
  useEffect(() => {
    setCurrentTranscript("");
    setHasSubmitted(false);
  }, [activeQuestionIndex]);

  // Update current transcript when speech results change
  useEffect(() => {
    if (isRecording && results.length > 0) {
      // Only take the latest result for the current recording session
      const latestTranscript = results[results.length - 1].transcript;
      setCurrentTranscript(latestTranscript);
    }
  }, [results, isRecording]);

  // Handle answer submission when recording stops
  useEffect(() => {
    const submitAnswer = async () => {
      if (!isRecording && currentTranscript.length > 10 && !hasSubmitted) {
        try {
          const currentQuestion = mockInterviewQuestion[activeQuestionIndex];

          if (!currentQuestion) {
            toast.error("No question found.");
            return;
          }

          const response = await fetch(
            `/api/user/interview/${interviewId}/start`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                questionId: currentQuestion._id,
                question: currentQuestion.question,
                correctAnswer: currentQuestion.correctAnswer,
                userAnswer: currentTranscript,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to submit answer");
          }

          const data = await response.json();

          if (data.success) {
            // Store the answer for this question
            setUserAnswers((prev) => ({
              ...prev,
              [activeQuestionIndex]: currentTranscript,
            }));
            toast.success("Answer submitted successfully!");

            setHasSubmitted(true);
          }
        } catch (error) {
          console.error("Error submitting answer:", error);
          toast.error("Error submitting answer.");
        }
      }
    };

    submitAnswer();
  }, [
    isRecording,
    currentTranscript,
    hasSubmitted,
    activeQuestionIndex,
    mockInterviewQuestion,
    interviewId,
  ]);

  const handleRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      // Clear results and start new recording
      setCurrentTranscript("");
      setHasSubmitted(false);
      startSpeechToText();
    }
  };

  // Prevent rendering on the server
  if (!isClient) return null;

  return (
    <div className="bg-blue-950 p-5 my-10 flex items-center justify-center flex-col rounded-lg">
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/web_cam.png"
          width={250}
          height={300}
          className="absolute"
          alt="Webcam Background"
          priority // Optional: Improves performance if the image is above the fold
          unoptimized // Optional: Use if serving from an external source without Next.js optimization
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      {/* Display current transcript */}
      {/* {currentTranscript && (
        <div className="mt-4 p-4 bg-white/10 rounded-lg w-full max-w-xl">
          <p className="text-white">{currentTranscript}</p>
        </div>
      )} */}

      <div>
        <button
          className={`mt-6 shadow-lg hover:shadow-xl ${
            hasSubmitted ? "bg-gray-400" : "bg-blue-400"
          } text-white px-8 py-2 rounded-md transition duration-200 my-10`}
          onClick={handleRecording}
          disabled={hasSubmitted}
        >
          {isRecording ? (
            <h2 className="text-red-800 flex gap-2">
              <MicrophoneIcon className="h-6 w-6" /> Stop Recording
            </h2>
          ) : (
            `${hasSubmitted ? "Answer Submitted" : "Record Answer"}`
          )}
        </button>
      </div>
    </div>
  );
}

export default RecordAnswerSection;
