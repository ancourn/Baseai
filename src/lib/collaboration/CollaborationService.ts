import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServerIO } from "socket.io";

interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  cursor?: { x: number; y: number };
  isTyping: boolean;
  lastSeen: Date;
}

interface CollaborationRoom {
  id: string;
  name: string;
  users: CollaborationUser[];
  code: string;
  language: string;
  framework?: string;
  createdAt: Date;
  lastActivity: Date;
}

export class CollaborationService {
  private static instance: CollaborationService;
  private io: ServerIO | null = null;
  private rooms: Map<string, CollaborationRoom> = new Map();
  private users: Map<string, CollaborationUser> = new Map();

  static getInstance(): CollaborationService {
    if (!CollaborationService.instance) {
      CollaborationService.instance = new CollaborationService();
    }
    return CollaborationService.instance;
  }

  initialize(server: NetServer | NetServerIO): void {
    this.io = new ServerIO(server, {
      cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
        methods: ["GET", "POST"],
      },
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Join room
      socket.on("join-room", async (data: { roomId: string; user: Omit<CollaborationUser, "id" | "lastSeen"> }) => {
        await this.handleJoinRoom(socket, data);
      });

      // Leave room
      socket.on("leave-room", (data: { roomId: string }) => {
        this.handleLeaveRoom(socket, data);
      });

      // Code changes
      socket.on("code-change", (data: { roomId: string; code: string; selection?: any }) => {
        this.handleCodeChange(socket, data);
      });

      // Disconnect
      socket.on("disconnect", () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private async handleJoinRoom(socket: any, data: { roomId: string; user: Omit<CollaborationUser, "id" | "lastSeen"> }): Promise<void> {
    const { roomId, user } = data;
    
    // Get or create room
    let room = this.rooms.get(roomId);
    if (!room) {
      room = await this.createRoom(roomId, `Room ${roomId}`);
      this.rooms.set(roomId, room);
    }

    // Create user
    const collaborationUser: CollaborationUser = {
      ...user,
      id: socket.id,
      lastSeen: new Date(),
    };

    this.users.set(socket.id, collaborationUser);

    // Add user to room
    const existingUserIndex = room.users.findIndex(u => u.id === socket.id);
    if (existingUserIndex >= 0) {
      room.users[existingUserIndex] = collaborationUser;
    } else {
      room.users.push(collaborationUser);
    }

    // Join socket room
    socket.join(roomId);

    // Notify room
    this.io?.to(roomId).emit("user-joined", {
      user: collaborationUser,
      roomUsers: room.users,
    });

    // Send current room state to user
    socket.emit("room-joined", {
      room: {
        id: room.id,
        name: room.name,
        code: room.code,
        language: room.language,
        framework: room.framework,
      },
      users: room.users,
    });

    console.log(`User ${socket.id} joined room ${roomId}`);
  }

  private handleLeaveRoom(socket: any, data: { roomId: string }): void {
    const { roomId } = data;
    const room = this.rooms.get(roomId);
    const user = this.users.get(socket.id);

    if (room && user) {
      // Remove user from room
      room.users = room.users.filter(u => u.id !== socket.id);

      // Notify room
      this.io?.to(roomId).emit("user-left", {
        userId: socket.id,
        roomUsers: room.users,
      });

      // Delete room if empty
      if (room.users.length === 0) {
        this.rooms.delete(roomId);
      }

      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    }
  }

  private handleCodeChange(socket: any, data: { roomId: string; code: string; selection?: any }): void {
    const { roomId, code, selection } = data;
    const room = this.rooms.get(roomId);
    const user = this.users.get(socket.id);

    if (room && user) {
      // Update room code
      room.code = code;
      room.lastActivity = new Date();

      // Broadcast to other users
      socket.to(roomId).emit("code-changed", {
        userId: socket.id,
        code,
        selection,
        timestamp: new Date(),
      });

      console.log(`Code changed in room ${roomId} by user ${socket.id}`);
    }
  }

  private handleDisconnect(socket: any): void {
    const user = this.users.get(socket.id);

    if (user) {
      // Remove user from all rooms
      for (const [roomId, room] of this.rooms.entries()) {
        const userIndex = room.users.findIndex(u => u.id === socket.id);
        if (userIndex >= 0) {
          room.users.splice(userIndex, 1);

          // Notify room
          this.io?.to(roomId).emit("user-left", {
            userId: socket.id,
            roomUsers: room.users,
          });

          // Delete room if empty
          if (room.users.length === 0) {
            this.rooms.delete(roomId);
          }
        }
      }

      // Remove user
      this.users.delete(socket.id);

      console.log(`User ${socket.id} disconnected`);
    }
  }

  private async createRoom(id: string, name: string): Promise<CollaborationRoom> {
    return {
      id,
      name,
      users: [],
      code: "// Welcome to collaborative coding!\\n// Start typing to collaborate with your team.",
      language: "typescript",
      framework: undefined,
      createdAt: new Date(),
      lastActivity: new Date(),
    };
  }

  // Public methods for room management
  getRooms(): CollaborationRoom[] {
    return Array.from(this.rooms.values());
  }

  getRoom(roomId: string): CollaborationRoom | undefined {
    return this.rooms.get(roomId);
  }

  getActiveUsers(): CollaborationUser[] {
    return Array.from(this.users.values()).filter(user => 
      Date.now() - user.lastSeen.getTime() < 5 * 60 * 1000 // 5 minutes
    );
  }

  // Generate random color for users
  generateUserColor(): string {
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
      "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
      "#ec4899", "#f43f5e",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const collaborationService = CollaborationService.getInstance();
