import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(serverPath = "/api/socket/io") {
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.NEXT_PUBLIC_SITE_URL || "", {
        path: serverPath,
        addTrailingSlash: false,
      });
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [serverPath]);

  return socket.current;
}
