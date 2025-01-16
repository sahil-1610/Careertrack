import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/helpers/dbConfig";
import User from "@/models/user.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import PdfParse from "pdf-parse";
import { generateAIResponse } from "@/helpers/geminiAIModel";

const validateFormData = (formData) => {
  const resumeFile = formData.get("resume");
  const jobDescription = formData.get("jobDescription");

  if (!resumeFile || !jobDescription) {
    throw new Error("Resume file and job description are required");
  }

  if (resumeFile.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  return { resumeFile, jobDescription };
};

const processResumeText = async (resumeFile) => {
  try {
    const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
    const pdfData = await PdfParse(resumeBuffer);
    const resumeText = pdfData.text.trim();

    if (!resumeText) {
      throw new Error("Failed to extract text from the resume");
    }

    return resumeText;
  } catch (error) {
    throw new Error(`PDF Processing error: ${error.message}`);
  }
};

const getAiFeedback = async (resumeText, jobDescription) => {
  const inputPrompt = `
    Analyze the following resume and job description:
    Resume: ${resumeText}
    Job Description: ${jobDescription}

    Provide detailed feedback in JSON format:
    {
      matchPercentage,
      missingSkills,
      improvementSuggestions,
      formattingFeedback
    }
  `;

  try {
    const result = await generateAIResponse(inputPrompt);
    const cleanedResponse = result.replace(/```(json)?/g, "").trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    throw new Error(`AI Processing error: ${error.message}`);
  }
};

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Extract user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Fetch the user
    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract and validate form data
    const formData = await request.formData();
    const { resumeFile, jobDescription } = validateFormData(formData);

    // Process resume and get feedback
    const resumeText = await processResumeText(resumeFile);
    const feedback = await getAiFeedback(resumeText, jobDescription);

    console.log("Feedback:", feedback);

    // Construct the new resume feedback object
    const newResumeFeedback = {
      _id: new mongoose.Types.ObjectId(),
      improvementSuggestions: feedback.improvementSuggestions,
      missingSkills: feedback.missingSkills,
      formattingFeedback: feedback.formattingFeedback,
      similarityScore: Number(feedback.matchPercentage),
      jobDescription: String(jobDescription),
      createdAt: new Date(),
    };

    console.log("New Feedback Object:", newResumeFeedback);

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          resumefeedback: {
            $each: [newResumeFeedback],
            $position: 0,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update resume feedback");
    }

    console.log("Updated User:", updatedUser);

    // Respond with success
    return NextResponse.json({ success: true, feedback }, { status: 200 });
  } catch (error) {
    console.error("Resume feedback error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: error.name === "MongooseError" ? 503 : 500 }
    );
  }
}
