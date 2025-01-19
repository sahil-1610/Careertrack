// app/api/user/interview/[id]/feedback/route.js
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { connectDB } from "@/helpers/dbConfig";
import InterviewAttempt from "@/models/InterviewAttempt.model";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const interviewId = params.id;
    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Find the latest attempt
    const latestAttempt = await InterviewAttempt.findOne({
      interviewId: interviewId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestAttempt) {
      return NextResponse.json(
        { error: "No attempt found for this interview" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const totalRating = latestAttempt.questions.reduce(
      (sum, question) => sum + (question.rating || 0),
      0
    );
    const averageRating = (
      totalRating / latestAttempt.questions.length
    ).toFixed(1);

    return NextResponse.json({
      success: true,
      data: {
        attemptNumber: latestAttempt.attemptNumber,
        averageRating: averageRating,
        totalQuestions: latestAttempt.questions.length,
        questions: latestAttempt.questions.map((q) => ({
          question: q.question,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          feedback: q.feedback,
          rating: q.rating,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback", details: error.message },
      { status: 500 }
    );
  }
}
