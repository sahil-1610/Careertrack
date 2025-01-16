import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/user.models";
import { connectDB } from "@/helpers/dbConfig";

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

    const interview = user.interviewQuestions.find(
      (q) => q._id.toString() === params.id
    );

    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
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
