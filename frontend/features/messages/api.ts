import { api } from "@/lib/axios";

export const getConversations = async () => {
  const response = await api.get("/messages/conversations");
  return response.data;
};

export const getMessages = async (roomId: string) => {
  const response = await api.get(`/messages/conversations/${roomId}`);
  return response.data;
};

export const sendMessage = async ({ roomId, content }: { roomId: string; content: string }) => {
  const response = await api.post(`/messages/conversations/${roomId}`, { content });
  return response.data;
};

export const startConversation = async (targetUserId: string) => {
  const response = await api.post("/messages/start", { targetUserId });
  return response.data;
};
