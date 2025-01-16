// app/api/interview/route.js
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user.models";
import { chatWithAI } from "@/helpers/geminiAIModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDB } from "@/helpers/dbConfig";

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
      [{"question": "question text", "answer": "answer text"}]`;

      // Get response from AI using the chatWithAI function
      const responseText = await chatWithAI(inputPrompt);

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

      // Format questions
      const questions = generatedQuestions.map((q) => ({
        question: q.question?.trim() || "",
        answer: q.answer?.trim() || "",
      }));

      if (questions.some((q) => !q.question || !q.answer)) {
        throw new Error("Some questions or answers are missing");
      }

      // Create new interview document
      const newInterview = {
        _id: new mongoose.Types.ObjectId(),
        jobtittle: position,
        jobdescription: description,
        jobexperience: Number(experience),
        questions: questions,
        createdAt: new Date(),
      };

      // Update user with new interview questions with timeout
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            interviewQuestions: {
              $each: [newInterview],
              $position: 0,
            },
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
