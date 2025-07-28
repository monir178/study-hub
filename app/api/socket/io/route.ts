import { NextRequest } from "next/server";

// Simple endpoint that returns Socket.IO connection info
export async function GET(_req: NextRequest) {
  return new Response(
    JSON.stringify({
      message: "Socket.IO endpoint - use WebSocket connection",
      path: "/api/socket/io",
      transports: ["websocket", "polling"],
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

export async function POST(_req: NextRequest) {
  return new Response("Method not allowed", { status: 405 });
}
