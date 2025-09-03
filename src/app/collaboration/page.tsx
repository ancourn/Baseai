"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Code, 
  MessageSquare, 
  Plus, 
  Copy, 
  Play, 
  Brain,
  LogOut,
  Send,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

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

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  type: "message" | "system";
  content: any;
  timestamp: Date;
}

export default function CollaborationPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<CollaborationRoom | null>(null);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [framework, setFramework] = useState("none");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [activeUsers, setActiveUsers] = useState<CollaborationUser[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Initialize socket connection
    const socketInstance = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    setSocket(socketInstance);

    // Socket event handlers
    socketInstance.on("connect", () => {
      console.log("Connected to collaboration server");
      toast.success("Connected to collaboration server");
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from collaboration server");
      toast.error("Disconnected from collaboration server");
    });

    socketInstance.on("room-joined", (data) => {
      setCurrentRoom(data.room);
      setCode(data.room.code);
      setLanguage(data.room.language);
      setFramework(data.room.framework || "none");
      setActiveUsers(data.users);
    });

    socketInstance.on("user-joined", (data) => {
      setActiveUsers(data.roomUsers);
      toast.success(`${data.user.name} joined the room`);
    });

    socketInstance.on("user-left", (data) => {
      setActiveUsers(data.roomUsers);
      toast.info("User left the room");
    });

    socketInstance.on("code-changed", (data) => {
      if (data.userId !== socketInstance.id) {
        setCode(data.code);
      }
    });

    socketInstance.on("message-received", (data) => {
      setMessages(prev => [...prev, data]);
    });

    socketInstance.on("generation-started", (data) => {
      setIsGenerating(true);
      toast.info("Code generation started...");
    });

    socketInstance.on("generation-completed", (data) => {
      setIsGenerating(false);
      setCode(data.generatedCode.code);
      toast.success("Code generated successfully!");
    });

    socketInstance.on("generation-failed", (data) => {
      setIsGenerating(false);
      toast.error(`Generation failed: ${data.error}`);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [isMounted]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleJoinRoom = () => {
    if (!userName.trim() || !roomId.trim()) {
      toast.error("Please enter your name and room ID");
      return;
    }

    const user = {
      name: userName.trim(),
      color: generateUserColor(),
      isTyping: false,
    };

    socket?.emit("join-room", {
      roomId: roomId.trim(),
      user,
    });
  };

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket?.emit("leave-room", { roomId: currentRoom.id });
      setCurrentRoom(null);
      setCode("");
      setMessages([]);
      setActiveUsers([]);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    if (currentRoom && socket) {
      socket.emit("code-change", {
        roomId: currentRoom.id,
        code: newCode,
      });
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentRoom) return;

    socket?.emit("send-message", {
      roomId: currentRoom.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleGenerateCode = () => {
    if (!prompt.trim() || !currentRoom) {
      toast.error("Please enter a prompt");
      return;
    }

    socket?.emit("generate-code", {
      roomId: currentRoom.id,
      prompt: prompt.trim(),
      language,
      framework: framework !== "none" ? framework : undefined,
    });

    setPrompt("");
  };

  const copyRoomId = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom.id);
      toast.success("Room ID copied to clipboard!");
    }
  };

  const generateUserColor = () => {
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
      "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
      "#ec4899", "#f43f5e",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                Join Collaboration Room
              </CardTitle>
              <CardDescription>
                Enter your name and room ID to start collaborating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Room ID</label>
                <Input
                  placeholder="Enter room ID or create new"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleJoinRoom} 
                className="w-full"
                disabled={!userName.trim() || !roomId.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Code className="h-6 w-6" />
              {currentRoom.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Room ID: {currentRoom.id}</Badge>
              <Button variant="outline" size="sm" onClick={copyRoomId}>
                <Copy className="h-3 w-3" />
              </Button>
              <Badge variant="outline">
                {activeUsers.length} user{activeUsers.length !== 1 ? "s" : ""} online
              </Badge>
            </div>
          </div>
          <Button variant="outline" onClick={handleLeaveRoom}>
            <LogOut className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
        </div>

        {/* Active Users */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                <Avatar className="h-6 w-6">
                  <AvatarFallback style={{ backgroundColor: user.color }}>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
                {user.isTyping && (
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Editor Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {}}
                      disabled={true}
                    >
                      <Brain className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Start coding together..."
                />
              </CardContent>
            </Card>

            {/* AI Generation Panel */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Prompt</label>
                  <Textarea
                    placeholder="Describe what you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <Button 
                  onClick={handleGenerateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 mb-4 overflow-y-auto">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-2">
                        {message.type === "message" && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarFallback style={{ backgroundColor: message.content.user.color }}>
                                {message.content.user.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{message.content.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm bg-muted p-2 rounded">
                                {message.content.text}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
