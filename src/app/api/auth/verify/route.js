// app/api/auth/verify/route.js

export const dynamic = "force-dynamic"; // ✅ Forces Next.js to always run dynamically
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request) {
  try {
    const decodedToken = getDataFromToken(request);

    // If token is valid, return successful response
    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: decodedToken._id,
          email: decodedToken.email,
          username: decodedToken.username,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // If token verification fails, return unauthorized
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
