"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IconChevronLeft, IconLoader } from "@tabler/icons-react";
import Webcam from "react-webcam";
import Image from "next/image";
import { LightBulbIcon } from "@heroicons/react/24/outline";

export default function InterviewPage() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  return (
    <>
      <button
        onClick={() => router.push("/")}
        className="justify-start absolute left-0 top-0 flex items-center gap-2 text-blue-500 hover:text-blue-600 transition duration-300"
      >
        <IconChevronLeft size={20} />
        Back to Home
      </button>
      <div className="max-w-4xl mx-auto mb-5 mt-28 relative">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Let&apos;s Get You Ready For Your Interview
        </h1>
      </div>

      <div className="my-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col my-5 gap-5 w-full">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                <strong>Job Title/Job Position:</strong> {interview.jobTitle}
              </h2>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                <strong>Job Description/Tech Stack:</strong>{" "}
                {interview.jobDescription}
              </h2>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                <strong>Years of Experience:</strong> {interview.jobExperience}
              </h2>
            </div>

            <div className="p-6 bg-yellow-100 dark:bg-yellow-700 rounded-lg border border-yellow-300 shadow-md">
              <h2 className="flex gap-2 items-center text-yellow-600 dark:text-yellow-200 font-semibold">
                <LightBulbIcon className="h-6 w-6" />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-yellow-500 dark:text-yellow-200">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </h2>
            </div>
            <div className="flex gap-3">
              {!webCamenabled && (
                <button
                  onClick={() => setWebCamenabled(true)}
                  className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 hover:shadow-xl transition duration-300"
                >
                  Enable Webcam
                </button>
              )}
              <button
                onClick={() => router.push(`/interview/${params.id}/start`)}
                className="bg-green-600 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-xl hover:bg-green-700 transition duration-300"
              >
                Start Interview
              </button>
            </div>
          </div>

          <div className="bg-blue-950 p-5 flex flex-col items-center  border rounded-lg shadow-lg w-full relative">
            <div className="relative w-full max-w-md h-80 flex items-center justify-center mt-14">
              {!webCamenabled ? (
                <Image
                  src="/web_cam.png"
                  width={250}
                  height={300}
                  alt="Webcam Background"
                  className="rounded-lg shadow-md"
                />
              ) : (
                <Webcam
                  onUserMedia={() => setWebCamenabled(true)}
                  onUserMediaError={() => setWebCamenabled(false)}
                  mirrored={true}
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
