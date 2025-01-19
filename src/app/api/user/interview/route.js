// app/api/interview/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user.models";
import { chatWithAI, generateAIResponse } from "@/helpers/geminiAIModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDB } from "@/helpers/dbConfig";
import InterviewQuestion from "@/models/interview.model"; // Import InterviewQuestion model

export async function POST(request) {
  try {
    // Ensure database connection is established
    await connectDB();

    // Token-based authentication
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use lean() for better performance and add timeout
    const user = await User.findById(userId)
      .select("-password -__v")
      .lean()
      .maxTimeMS(5000);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get interview data from request body
    const { position, description, experience } = await request.json();

    // Validate input
    if (!position || !description || !experience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Modified prompt to ensure cleaner JSON response
      const inputPrompt = `Generate exactly ${process.env.NEXT_PUBLIC_QUESTION_NUMBER} interview questions with answers for the following job:
      Position: ${position}
      Description: ${description}
      Experience: ${experience} years
      Return ONLY a valid JSON array of questions and answers in this format:
      [{"question": "question text", "correctAnswer": "answer text"}]`;

      // Get response from AI using the generateAIResponse function
      const responseText = await generateAIResponse(inputPrompt);

      // Remove any markdown code blocks and whitespace
      let cleanedResponse = responseText.replace(/```(json)?/g, "").trim();

      // Extract JSON array
      const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON array in response");
      }

      const generatedQuestions = JSON.parse(jsonMatch[0]);

      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        throw new Error("Invalid questions format from AI");
      }

      // Format questions with correctAnswer
      const questions = generatedQuestions.map((q) => ({
        question: q.question?.trim() || "",
        correctAnswer: q.correctAnswer?.trim() || "",
      }));

      if (questions.some((q) => !q.question || !q.correctAnswer)) {
        throw new Error("Some questions or answers are missing");
      }

      // Create new interview document
      const newInterview = new InterviewQuestion({
        user: userId, // Relate the interview question to the user
        jobTitle: position,
        jobDescription: description,
        jobExperience: Number(experience),
        questions: questions,
      });

      // Save interview to the InterviewQuestion collection
      await newInterview.save();

      // Add the new interview to the user's interviewQuestions array
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            interviewQuestions: newInterview._id, // Store the interview ID in the user model
          },
        },
        {
          new: true,
          maxTimeMS: 5000,
        }
      );

      return NextResponse.json({
        success: true,
        interview: newInterview,
      });
    } catch (error) {
      console.error("Interview generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate interview questions",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Interview generation error:", error);

    // Specific error handling for timeout
    if (
      error.name === "MongooseError" &&
      error.message.includes("buffering timed out")
    ) {
      return NextResponse.json(
        {
          error: "Database connection timed out",
          details: "Please try again",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate interview questions",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Ensure database connection
    await connectDB();

    // Get user ID from token
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Find interviews with proper error handling
    try {
      const interviews = await InterviewQuestion.find({ user: userId })
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean()
        .maxTimeMS(5000);

      // Return empty array if no interviews found
      if (!interviews) {
        return NextResponse.json({
          success: true,
          interviews: [],
          message: "No interviews found",
        });
      }

      return NextResponse.json({
        success: true,
        interviews,
        count: interviews.length,
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);

      // Handle specific database errors
      if (dbError.name === "MongoTimeoutError") {
        return NextResponse.json(
          { error: "Database request timed out" },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch interviews" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GET interviews error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
