import { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

const useSocket = (onNewIncident) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
    });

    socketRef.current.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket reconnection attempt:', attemptNumber);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      setConnectionError('Reconnection failed');
    });

    // Listen for new incidents
    socketRef.current.on('newIncident', (incident) => {
      console.log('New incident received:', incident);
      if (onNewIncident && typeof onNewIncident === 'function') {
        onNewIncident(incident);
      }
    });
  }, [onNewIncident]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
  };
};

export default useSocket;
