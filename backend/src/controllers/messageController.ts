import type { Response } from "express";
import { prisma } from "../config/db.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  body: any;
  params: any;
}

export const getConversations = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get all chat rooms where the user is a participant
    const rooms = await prisma.chatRoom.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
                companyName: true,
                bio: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedConversations = [];

    for (const room of rooms) {
      // If the user is a candidate, they can only see conversations if the HR has sent them a message first (i.e. room has messages)
      if (userRole === "CANDIDATE" && room.messages.length === 0) {
        continue;
      }

      // Find the other participant
      const otherParticipant = room.participants.find((p) => p.userId !== userId);
      const otherUser = otherParticipant?.user;

      let displayName = "User";
      if (otherUser) {
        if (userRole === "HR" && otherUser.role === "CANDIDATE") {
          // Recruiter is looking at candidate name. Check if candidate applied to any job posted by this HR
          const hasApplied = await prisma.application.findFirst({
            where: {
              userId: otherUser.id,
              job: {
                employerId: userId,
              },
            },
          });
          if (hasApplied) {
            displayName = otherUser.name;
          } else {
            displayName = "Candidate"; // fallback or mask name if not applied
          }
        } else {
          displayName = otherUser.name;
        }
      }

      const lastMessageObj = room.messages[room.messages.length - 1];
      const lastMessageText = lastMessageObj ? lastMessageObj.content : "No messages yet";
      const lastMessageTime = lastMessageObj
        ? new Date(lastMessageObj.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";

      const roleOrCompany = otherUser?.role === "HR"
        ? (otherUser.companyName || "Recruiter")
        : "Job Applicant";

      // Calculate unread count for messages sent by the other participant that are not read
      const unreadCount = room.messages.filter(
        (m) => m.senderId !== userId && !m.isRead
      ).length;

      formattedConversations.push({
        id: room.id,
        name: displayName,
        roleOrCompany,
        jobTitle: otherUser?.role === "HR" ? "Hiring Manager" : "Candidate",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        online: true, // simplified representation
        unreadCount,
        lastMessage: lastMessageText,
        lastMessageTime,
        messages: room.messages.map((m) => ({
          id: m.id,
          sender: m.senderId === userId ? "user" : "other",
          text: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })),
      });
    }

    return res.status(200).json(formattedConversations);
  } catch (error: any) {
    console.error("Error in getConversations:", error);
    return res.status(500).json({ message: "Error fetching conversations", error: error.message });
  }
};

export const getMessages = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { roomId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mark messages in this room sent by other user as read
    await prisma.message.updateMany({
      where: {
        chatRoomId: roomId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        chatRoomId: roomId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      sender: m.senderId === userId ? "user" : "other",
      text: m.content,
      timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));

    return res.status(200).json(formattedMessages);
  } catch (error: any) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};

export const sendMessage = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { roomId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    // Find the receiver (the other participant in the chat room)
    const otherParticipant = await prisma.chatRoomParticipant.findFirst({
      where: {
        chatRoomId: roomId,
        userId: {
          not: userId,
        },
      },
    });

    if (!otherParticipant) {
      return res.status(404).json({ message: "Chat room or participant not found" });
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: userId,
        receiverId: otherParticipant.userId,
        chatRoomId: roomId,
      },
    });

    const formattedMessage = {
      id: message.id,
      sender: "user",
      text: message.content,
      timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return res.status(201).json(formattedMessage);
  } catch (error: any) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

export const startConversation = async (req: any, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user?.role === "CANDIDATE") {
      return res.status(403).json({ message: "Candidates cannot start a conversation" });
    }

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId is required" });
    }

    if (userId === targetUserId) {
      return res.status(400).json({ message: "Cannot start a conversation with yourself" });
    }

    // Check if conversation already exists
    const existingParticipant = await prisma.chatRoomParticipant.findFirst({
      where: {
        userId,
        chatRoom: {
          participants: {
            some: {
              userId: targetUserId,
            },
          },
        },
      },
      include: {
        chatRoom: true,
      },
    });

    if (existingParticipant) {
      return res.status(200).json({ chatRoomId: existingParticipant.chatRoomId });
    }

    // Create new chat room
    const chatRoom = await prisma.chatRoom.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: targetUserId },
          ],
        },
      },
    });

    return res.status(201).json({ chatRoomId: chatRoom.id });
  } catch (error: any) {
    console.error("Error in startConversation:", error);
    return res.status(500).json({ message: "Error starting conversation", error: error.message });
  }
};
