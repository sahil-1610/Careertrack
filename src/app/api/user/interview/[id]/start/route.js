import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.models";
import { connectDB } from "@/helpers/dbConfig";
import InterviewQuestion from "@/models/interview.model"; // Import the InterviewQuestion model
import InterviewAttempt from "@/models/InterviewAttempt.model";
import { chatWithAI, generateAIResponse } from "@/helpers/geminiAIModel";

export async function GET(request, { params }) {
  try {
    // Ensure database connection
    await connectDB();

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the interview question by ID
    const interviewId = params.id;
    // console.log("Fetching interview with ID:", params.id);

    const interview = await InterviewQuestion.findById(interviewId);

    // console.log(interview);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, interview });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
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

    const { questionId, question, correctAnswer, userAnswer } =
      await request.json();

    if (!questionId || !question || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details:
            "All fields (questionId, question, correctAnswer, userAnswer) are required",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(userId).select("-password -__v");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate AI feedback
    const feedbackPrompt = `Analyze the provided data:  
      - Question: ${question}  
      - Correct Answer: ${correctAnswer}  
      - User Answer: ${userAnswer}  
      Compare the user's answer with the correct answer and provide constructive feedback on how to improve it.  
      - Keep the feedback concise (3 to 5 lines).  
      - Rate the user's answer on a scale of 0 to 5.  
      Return **only** a valid JSON array in the following format:  
      [  
        { "feedback": "feedback text", "rating": rating (0-5) }  
      ]`;

    const responseText = await generateAIResponse(feedbackPrompt);
    const cleanedResponse = responseText.replace(/```(json)?/g, "").trim();
    const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("Could not find JSON array in response");
    }

    const feedbackRating = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(feedbackRating) || feedbackRating.length === 0) {
      throw new Error("Invalid feedbackRating format from AI");
    }

    // Find or create interview attempt
    let interviewAttempt = await InterviewAttempt.findOne({
      interviewId: interviewId,
      "questions.questionId": { $ne: questionId }, // Ensure question hasn't been answered
    }).sort({ attemptNumber: -1 });

    if (!interviewAttempt) {
      // Get the highest attempt number for this interview
      const lastAttempt = await InterviewAttempt.findOne({
        interviewId: interviewId,
      }).sort({ attemptNumber: -1 });

      const attemptNumber = lastAttempt ? lastAttempt.attemptNumber + 1 : 1;

      interviewAttempt = new InterviewAttempt({
        interviewId: interviewId,
        attemptNumber: attemptNumber,
        questions: [],
      });
    }

    // Add the question response to the attempt
    interviewAttempt.questions.push({
      questionId: questionId,
      question: question,
      correctAnswer: correctAnswer,
      userAnswer: userAnswer,
      feedback: feedbackRating[0].feedback,
      rating: feedbackRating[0].rating,
    });

    await interviewAttempt.save();

    // Update the interview document as well
    const interview = await InterviewQuestion.findById(interviewId);
    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const answerData = {
      userId: userId,
      questionId: questionId,
      userAnswer: userAnswer,
      submittedAt: new Date(),
      question: question,
      correctAnswer: correctAnswer,
      feedback: feedbackRating[0].feedback,
      rating: feedbackRating[0].rating,
    };

    if (!interview.answers) {
      interview.answers = [];
    }

    const answerIndex = interview.answers.findIndex(
      (answer) => answer.userId.toString() === userId.toString()
    );

    if (answerIndex === -1) {
      interview.answers.push(answerData);
    } else {
      interview.answers[answerIndex] = {
        ...interview.answers[answerIndex],
        ...answerData,
      };
    }

    await interview.save();

    return NextResponse.json({
      success: true,
      message: "Answer submitted successfully",
      data: {
        interviewId,
        questionId,
        attemptNumber: interviewAttempt.attemptNumber,
        feedback: feedbackRating[0].feedback,
        rating: feedbackRating[0].rating,
        answerId:
          answerIndex === -1
            ? interview.answers[interview.answers.length - 1]._id
            : interview.answers[answerIndex]._id,
      },
    });
  } catch (error) {
    console.error("Error processing interview answer:", error);
    return NextResponse.json(
      {
        error: "Failed to process interview answer",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
