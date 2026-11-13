"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

export interface WebSocketMessage<T = unknown> {
  topic: string;
  event: string;
  payload: T;
  timestamp?: number;
}

export interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || "wss://api.xiventa.com/ws",
    autoConnect = false,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>("CLOSED");
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const listenersRef = useRef<Map<string, Set<(payload: any) => void>>>(new Map());

  const cleanupHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }, []);

  const send = useCallback((topic: string, event: string, payload: unknown = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        topic,
        event,
        payload,
        timestamp: Date.now(),
      };
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const subscribe = useCallback(
    <T = unknown>(topic: string, callback: (payload: T) => void) => {
      if (!listenersRef.current.has(topic)) {
        listenersRef.current.set(topic, new Set());
      }
      listenersRef.current.get(topic)!.add(callback as any);

      // Return unsubscribe cleanup function
      return () => {
        const listeners = listenersRef.current.get(topic);
        if (listeners) {
          listeners.delete(callback as any);
          if (listeners.size === 0) {
            listenersRef.current.delete(topic);
          }
        }
      };
    },
    []
  );

  const connect = useCallback(() => {
    if (typeof window === "undefined" || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setStatus("CONNECTING");
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("OPEN");
        reconnectAttemptsRef.current = 0;

        // Start heartbeat ping
        cleanupHeartbeat();
        heartbeatTimerRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, heartbeatInterval);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data && data.topic) {
            setLastMessage(data);
            const topicListeners = listenersRef.current.get(data.topic);
            if (topicListeners) {
              topicListeners.forEach((callback) => callback(data.payload));
            }
          }
        } catch {
          // Ignore non-JSON pong frames
        }
      };

      ws.onclose = () => {
        setStatus("CLOSED");
        cleanupHeartbeat();

        // Attempt reconnection if within threshold
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          setTimeout(() => {
            connect();
          }, reconnectInterval * Math.min(reconnectAttemptsRef.current, 3));
        }
      };

      ws.onerror = () => {
        setStatus("CLOSED");
      };
    } catch {
      setStatus("CLOSED");
    }
  }, [url, reconnectInterval, maxReconnectAttempts, heartbeatInterval, cleanupHeartbeat]);

  const disconnect = useCallback(() => {
    cleanupHeartbeat();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("CLOSED");
  }, [cleanupHeartbeat]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    status,
    lastMessage,
    send,
    subscribe,
    connect,
    disconnect,
    isConnected: status === "OPEN",
  };
}

