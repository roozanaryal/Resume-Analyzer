import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as messagesApi from "./api";

export const useConversations = (options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: messagesApi.getConversations,
    refetchInterval: options?.refetchInterval,
  });
};

export const useMessages = (roomId: string, options?: { refetchInterval?: number }) => {
  return useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => messagesApi.getMessages(roomId),
    enabled: !!roomId,
    refetchInterval: options?.refetchInterval,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.sendMessage,
    onSuccess: (data, variables) => {
      // Invalidate messages for this room
      queryClient.invalidateQueries({ queryKey: ["messages", variables.roomId] });
      // Invalidate conversations list so it shows updated last message
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useStartConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: messagesApi.startConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};
