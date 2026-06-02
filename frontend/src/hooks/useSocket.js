import { useEffect, useRef } from 'react';
import { getSocket } from '../api/socket';

export const useSocket = (event, callback) => {
  const socket = getSocket();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!socket) return;
    const handler = (...args) => callbackRef.current(...args);
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket, event]);
};
