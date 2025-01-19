"use client";
import React from "react";
import { LightBulbIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeach = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("sorry your browser does not support Speech function");
    }
  };
  return (
    mockInterviewQuestion && (
      <div className=" bg-blue-950 p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQuestion &&
            mockInterviewQuestion.map((item, index) => (
              <h2
                key={item._id}
                className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer 
                      ${
                        activeQuestionIndex === index
                          ? "bg-blue-700 text-white"
                          : "bg-slate-500"
                      }`}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <SpeakerWaveIcon
          className="h-6 w-6 cursor-pointer"
          onClick={() =>
            textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.question)
          }
        />
        <div className="border rounded-lg p-5 bg-gray-900 mt-10">
          <h2 className="flex gap-2 items-center text-purple-400 ">
            <LightBulbIcon className="h-6 w-6" />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-primary my-2 text-purple-400 ">
            {process.env.NEXT_PUBLIC_INFORMATION}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;
