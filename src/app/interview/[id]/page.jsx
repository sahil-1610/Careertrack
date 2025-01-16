"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconChevronLeft, IconLoader } from "@tabler/icons-react";
import Webcam from "react-webcam";
import { LuWebcam } from "react-icons/lu";
import { LightBulbIcon } from "@heroicons/react/24/outline";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [webCamenabled, setWebCamenabled] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`/api/user/interview/${params.id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Interview not found");
        }

        const data = await response.json();
        console.log(data);
        setInterview(data.interview);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <IconLoader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/interview")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <IconChevronLeft size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  if (!interview?.questions?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>No questions found</p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <IconChevronLeft size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <>
      <div className="max-w-4xl mx-auto mb-5 mt-28 relative">
        <button
          onClick={() => router.push("/")}
          className="absolute left-0 flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <IconChevronLeft size={20} />
          Back to Home
        </button>
        <h1 className="text-2xl text-center font-bold mb-2">
          Let&apos;s Get You Ready For Your Interview
        </h1>
      </div>

      <div className="my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col my-5 gap-5">
            <div className="flex flex-col gap-5 p-5 rounded-lg border border-gray-300 shadow-md">
              <h2 className="text-lg font-semibold">
                <strong>Job Title/Job Position :</strong>
                {interview.jobtittle}
              </h2>
              <h2 className="text-lg font-semibold">
                <strong>Job Description/Tech Stack :</strong>
                {interview.jobdescription}
              </h2>
              <h2 className="text-lg font-semibold">
                <strong>Years of Experience :</strong>
                {interview.jobexperience}
              </h2>
            </div>

            <div className="p-5 border rounded-lg border-yellow-300 shadow-md">
              <h2 className="flex gap-2 items-center text-yellow-600 font-semibold">
                <LightBulbIcon className="h-6 w-6" />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-yellow-500">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </h2>
            </div>
          </div>

          <div className="flex justify-center items-center flex-col my-10">
            {webCamenabled ? (
              <Webcam
                onUserMedia={() => setWebCamenabled(true)}
                onUserMediaError={() => setWebCamenabled(false)}
                mirrored={true}
                videoConstraints={{
                  facingMode: "user",
                }}
                className="w-full max-w-md h-80 object-cover rounded-lg shadow-md"
              />
            ) : (
              <>
                <LuWebcam className="h-40 w-40 p-5 bg-blue-100 rounded-lg border text-black" />
                <button
                  onClick={() => setWebCamenabled(true)}
                  className="mt-5 px-8 py-2 rounded-full bg-blue-600 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200"
                >
                  Enable Webcam and Mic
                </button>
              </>
            )}

            <button className="mt-6 shadow-lg hover:shadow-xl bg-blue-600 text-white px-8 py-2 rounded-md transition duration-200">
              Start Interview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
