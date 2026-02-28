'use client';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    connectSocket();
    socketRef.current = getSocket();
    return () => { disconnectSocket(); };
  }, []);

  return socketRef.current;
}
