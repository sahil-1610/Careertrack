"use client";
import { useState } from "react";
import { ResumeUpload } from "./ResumeUpload";
import { Analyzer } from "./Analyzer";
import { API } from "@/utils/api";

export function ResumeAnalyzer() {
  const [roleSearch, setRoleSearch] = useState("");
  const [file, setFile] = useState(null);
  const [analysisResults, setAnalysisResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    validateInputs(uploadedFile, roleSearch);
  };

  const validateInputs = (currentFile, currentRole) => {
    if (currentFile && currentRole.trim()) {
      setIsValid(true);
      setValidationMessage("Ready to analyze! Click the button below.");
    } else {
      setIsValid(false);
      setValidationMessage(
        !currentFile
          ? "Please upload your resume"
          : "Please specify the role you're interested in"
      );
    }
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setRoleSearch(value);
    validateInputs(file, value);
  };

  const handleAnalyze = async () => {
    if (!isValid) {
      setValidationMessage("Please provide both a role and upload a resume");
      return;
    }

    setLoading(true);
    setShowResults(false);
    setValidationMessage("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", roleSearch);

      console.log("Analyzing resume...");

      const response = await fetch("/api/user/resume", {
        method: "POST",
        // Remove the Content-Type header - let browser set it automatically for FormData
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.success && data.feedback) {
        // Calculate match percentage for display
        const matchPercentage = data.feedback.matchPercentage || 0;
        setFeedbackText(`Match Score: ${matchPercentage}%`);
        setAnalysisResults(data.feedback);
        setShowResults(true);
      } else {
        throw new Error(
          data.error || "Analysis failed - invalid response format"
        );
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setValidationMessage(`Error: ${error.message}`);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {!showResults ? (
        <>
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={roleSearch}
              onChange={handleRoleChange}
              placeholder="Which role are you searching for?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-800 text-gray-800"
            />
          </div>
          <ResumeUpload onFileUpload={handleFileUpload} />

          {validationMessage && (
            <div
              className={`text-center mt-4 ${
                isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {validationMessage}
            </div>
          )}

          <div className="flex justify-center mt-4 mb-6">
            <button
              onClick={handleAnalyze}
              disabled={!isValid || loading}
              className={`shadow-[inset_0_0_0_2px_#616467] px-12 py-4 rounded-full tracking-widest uppercase font-bold transition duration-200
                ${
                  isValid && !loading
                    ? "text-black hover:bg-[#616467] hover:text-white dark:text-neutral-200 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed"
                }`}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-8">
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Analysis Results
            </h3>

            <div className="mb-6 text-2xl font-bold text-center dark:text-white">
              {feedbackText}
            </div>

            {analysisResults.missingSkills?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 dark:text-white">
                  Missing Skills:
                </h4>
                <ul className="list-disc pl-5 dark:text-gray-300">
                  {analysisResults.missingSkills.map((skill, index) => (
                    <li key={index} className="mb-1">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysisResults.improvementSuggestions?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 dark:text-white">
                  Suggested Improvements:
                </h4>
                <ul className="list-disc pl-5 dark:text-gray-300">
                  {analysisResults.improvementSuggestions.map(
                    (suggestion, index) => (
                      <li key={index} className="mb-1">
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {analysisResults.formattingFeedback && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 dark:text-white">
                  Format Review:
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {analysisResults.formattingFeedback}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => {
                setShowResults(false);
                setFile(null);
                setRoleSearch("");
                setIsValid(false);
                setValidationMessage("");
              }}
              className="px-8 py-2 rounded-full relative bg-slate-700 text-white text-sm hover:shadow-2xl hover:shadow-white/[0.1] transition duration-200 border border-slate-600"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}

      {loading && <Analyzer loading={loading} setLoading={setLoading} />}
    </div>
  );
}
