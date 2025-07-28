/* eslint-disable */
import { NextRequest } from "next/server";

// Simple endpoint for backward compatibility
// We're now using HTTP polling instead of SSE for better reliability

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({
      message: "Room updates now use HTTP polling for better reliability",
      path: "/api/socket/io",
      status: "polling_mode",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function POST(request: NextRequest) {
  return new Response(
    JSON.stringify({
      message: "Room updates now use HTTP polling",
      status: "polling_mode",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
