import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on('join-zone', (zoneId: string) => {
      socket.join(`zone:${zoneId}`);
    });

    socket.on('leave-zone', (zoneId: string) => {
      socket.leave(`zone:${zoneId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getSocketIO(): SocketIOServer {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

export function emitZoneUpdate(zoneId: string, data: unknown): void {
  if (io) {
    io.to(`zone:${zoneId}`).emit('zone-update', data);
    io.emit('heatmap-update', { zoneId, ...data as object });
  }
}
