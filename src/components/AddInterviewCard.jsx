import React, { useState } from "react";
import { API } from "@/utils/api";
import { FeatureBlockAnimatedCard } from "./ui/FeatureBlockAnimatedCard";
import { IconLoader } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

// Throttling function to limit requests per minute
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function AddinterviewCard() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    position: "",
    description: "",
    experience: "",
  });

  // Add a state to track the time of the last request
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Calculate the time passed since the last request
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;

    // If it's less than 5 seconds, delay the request
    if (timeSinceLastRequest < 5000) {
      const delayTime = 5000 - timeSinceLastRequest;
      await delay(delayTime);
    }

    try {
      const response = await fetch(API.USER.INTERVIEW, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // This is important for sending cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.details || "Failed to generate interview"
        );
      }

      const data = await response.json();

      if (data.success && data.interview?._id) {
        setShowForm(false);
        setLastRequestTime(Date.now());
        router.push(`/interview/${data.interview._id}`);
      } else {
        throw new Error(
          data.error || data.details || "Invalid response format"
        );
      }
    } catch (error) {
      console.error("Failed to start interview:", error);
      setError(
        error.message === "Failed to fetch"
          ? "Network error. Please check your connection and try again."
          : error.message ||
              "Failed to generate interview questions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowForm(true)}
        className="max-w-sm mx-auto cursor-pointer"
      >
        <FeatureBlockAnimatedCard />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl w-full max-w-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl text-center font-bold text-gray-800 dark:text-white">
                  Start New Interview
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Fill in the details below to begin your AI mock interview
                  session
                </p>
              </div>

              {error && (
                <div className="p-3 text-red-500 bg-red-100 rounded-lg dark:bg-red-900/50">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Job Position / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Job Description / Tech Stack
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                    rows="4"
                    placeholder="e.g. React, Node, Express, MongoDB"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    required
                    min="0"
                    max="50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  type="submit"
                  // onClick={`/interview/{data.interview._id}/start`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader className="animate-spin mr-2" />
                      <span>Generating interview...</span>
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
