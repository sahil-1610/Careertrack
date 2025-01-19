// app/api/interview/[id]/route.js
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.models";
import { connectDB } from "@/helpers/dbConfig";
import InterviewQuestion from "@/models/interview.model"; // Import the InterviewQuestion model

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
    //   console.log("Fetching interview with ID:", params.id);

    const interview = await InterviewQuestion.findById(interviewId);

    //   console.log(interview);

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
