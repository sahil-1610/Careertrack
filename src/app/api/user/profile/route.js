import { NextResponse } from "next/server";
import { connectDB } from "@/helpers/dbConfig";
import User from "@/models/user.models";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Add route segment config to mark as dynamic
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Remove sensitive fields from update
    const { password, email, ...updateData } = data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
