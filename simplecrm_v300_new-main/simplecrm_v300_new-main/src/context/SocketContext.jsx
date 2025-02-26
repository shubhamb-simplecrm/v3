import React, { createContext, useState } from "react";
import { useRef, useEffect } from "react";
import io from "socket.io-client";
import EnvUtils from "../common/env-utils";
import { isSocketAllow } from "../utils/socket.utils";
export const SocketContext = createContext({ socket: null });

export const SocketProvider = ({ children }) => {
  const socketBaseUrl = EnvUtils.getValue("REACT_APP_SOCKET_BASE_URL");
  const socket = useRef(isSocketAllow ? io(socketBaseUrl) : null);

  useEffect(() => {
    if (socketBaseUrl) {
      socket.current?.on("connect", () => {
      });

      socket.current?.on("error", (msg) => {
      });
    }
    return () => {
      if (socket && socket.current) {
        socket.current?.removeAllListeners();
        socket.current?.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};
