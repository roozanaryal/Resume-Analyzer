"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  CheckCheck,
  Building2,
  User,
  ArrowLeft,
  Briefcase,
  FileText,
  Clock,
  Sparkles,
  Phone,
  Video,
} from "lucide-react";
import Link from "next/link";

export interface Message {
  id: string;
  sender: "user" | "other";
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: "pdf" | "doc";
  };
}

export interface Conversation {
  id: string;
  name: string;
  roleOrCompany: string;
  jobTitle: string;
  avatar: string;
  online: boolean;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    name: "Sarah Jenkins",
    roleOrCompany: "Tech Corp Inc. • HR Lead",
    jobTitle: "Senior React Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    online: true,
    unreadCount: 2,
    lastMessage: "We were impressed with your application! Are you available for a technical interview this Thursday?",
    lastMessageTime: "10:42 AM",
    messages: [
      {
        id: "m1",
        sender: "other",
        text: "Hi there! Thank you for applying for the Senior React Developer role at Tech Corp Inc.",
        timestamp: "Yesterday, 4:15 PM",
      },
      {
        id: "m2",
        sender: "user",
        text: "Thank you Sarah! I'm very excited about the position and the projects Tech Corp is working on.",
        timestamp: "Yesterday, 4:20 PM",
      },
      {
        id: "m3",
        sender: "other",
        text: "We reviewed your resume and profile analysis score. You scored 94% match!",
        timestamp: "10:40 AM",
      },
      {
        id: "m4",
        sender: "other",
        text: "We were impressed with your application! Are you available for a technical interview this Thursday?",
        timestamp: "10:42 AM",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Alex Rivera",
    roleOrCompany: "Design Studio • Talent Lead",
    jobTitle: "UI/UX Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    online: false,
    unreadCount: 0,
    lastMessage: "Thanks for sharing your portfolio. The team loved your case studies!",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "m10",
        sender: "user",
        text: "Hi Alex, here is my updated portfolio link and resume PDF.",
        timestamp: "Yesterday, 2:00 PM",
        attachment: {
          name: "Alex_Design_Portfolio_2026.pdf",
          size: "3.4 MB",
          type: "pdf",
        },
      },
      {
        id: "m11",
        sender: "other",
        text: "Thanks for sharing your portfolio. The team loved your case studies!",
        timestamp: "Yesterday, 3:30 PM",
      },
    ],
  },
  {
    id: "conv-3",
    name: "Michael Chang",
    roleOrCompany: "CloudScale Systems • Engineering Director",
    jobTitle: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    online: true,
    unreadCount: 0,
    lastMessage: "Great talking to you. We'll send the offer details shortly.",
    lastMessageTime: "Jul 28",
    messages: [
      {
        id: "m20",
        sender: "other",
        text: "Hello! We loved the interview session earlier today.",
        timestamp: "Jul 28, 11:00 AM",
      },
      {
        id: "m21",
        sender: "user",
        text: "Thank you Michael! It was a pleasure discussing the DevOps infrastructure roadmap with your team.",
        timestamp: "Jul 28, 11:15 AM",
      },
      {
        id: "m22",
        sender: "other",
        text: "Great talking to you. We'll send the offer details shortly.",
        timestamp: "Jul 28, 11:30 AM",
      },
    ],
  },
];

const QUICK_REPLIES = [
  "I'm available for an interview!",
  "Thank you for reaching out!",
  "Could you share more details about the salary range?",
  "I've attached my updated resume.",
];

export default function MessagingCenter({ userRole = "candidate" }: { userRole?: "candidate" | "hr" }) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [isTypingReply, setIsTypingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isTypingReply]);

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    // Clear unread count for selected conversation
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || newMessageText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: "Just now",
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConvId) {
          return {
            ...conv,
            lastMessage: text.trim(),
            lastMessageTime: "Just now",
            messages: [...conv.messages, userMsg],
          };
        }
        return conv;
      })
    );

    if (!textToSend) setNewMessageText("");

    // Simulate intelligent auto-reply after 1.5 seconds
    setIsTypingReply(true);
    setTimeout(() => {
      setIsTypingReply(false);

      const autoReplies = [
        "Thanks for your message! Our team is reviewing this right now and will get back to you shortly.",
        "Sounds great! I've forwarded this to the hiring manager.",
        "Appreciate the quick response. Let's schedule a call soon!",
      ];
      const randomReply = autoReplies[Math.floor(Math.random() * autoReplies.length)];

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "other",
        text: randomReply,
        timestamp: "Just now",
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === activeConvId) {
            return {
              ...conv,
              lastMessage: randomReply,
              lastMessageTime: "Just now",
              messages: [...conv.messages, botMsg],
            };
          }
          return conv;
        })
      );
    }, 1600);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roleOrCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white">
      {/* LEFT PANE: Conversations List */}
      <div className="lg:col-span-4 flex flex-col bg-gray-50/50 border-r border-gray-100 h-full overflow-hidden">
        {/* List Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-white shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">Messages</h1>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
              {conversations.reduce((acc, c) => acc + c.unreadCount, 0)} Unread
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
            />
          </div>
        </div>

        {/* Conversations Thread Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100/60 min-h-0">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all ${
                    isActive
                      ? "bg-white shadow-sm border-l-4 border-l-blue-600"
                      : "hover:bg-white/80"
                  }`}
                >
                  {/* Avatar with status indicator */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="h-12 w-12 rounded-2xl border border-gray-100 object-cover bg-white"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-gray-900 text-sm truncate">
                        {conv.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-600 truncate mb-1">
                      {conv.jobTitle}
                    </p>
                    <p className="text-xs text-gray-500 truncate font-medium">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Unread Badge */}
                  {conv.unreadCount > 0 && (
                    <span className="h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm font-medium">
              No conversations matching your search.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Chat Details & Thread */}
      <div className="lg:col-span-8 flex flex-col bg-white h-full overflow-hidden">
        {activeConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.name}
                    className="h-12 w-12 rounded-2xl border border-gray-100 object-cover bg-gray-50"
                  />
                  {activeConv.online && (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-tight">
                    {activeConv.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-0.5">
                    <span>{activeConv.roleOrCompany}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-bold">{activeConv.jobTitle}</span>
                  </div>
                </div>
              </div>

              {/* Quick Call Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Voice calling feature available soon!")}
                  className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Voice Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => alert("Video calling feature available soon!")}
                  className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Video Call"
                >
                  <Video className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 min-h-0">
              {activeConv.messages.map((msg) => {
                const isMe = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-3xl p-4 shadow-sm text-sm font-medium leading-relaxed ${
                        isMe
                          ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-gray-100"
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Attachment Card if present */}
                      {msg.attachment && (
                        <div
                          className={`mt-3 p-3 rounded-2xl border flex items-center gap-3 ${
                            isMe
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-gray-50 border-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                            <p className="text-[10px] opacity-80">{msg.attachment.size}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Receipts */}
                    <div className="flex items-center gap-1.5 mt-1 px-1 text-[11px] font-semibold text-gray-400">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTypingReply && (
                <div className="flex flex-col items-start animate-fade-in">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-6 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
                Quick Reply:
              </span>
              {QUICK_REPLIES.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(reply)}
                  className="px-3 py-1.5 rounded-full bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-200 text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message Composer */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => alert("Upload file capability integrated.")}
                  className="p-3 rounded-2xl border border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                  title="Attach File"
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Write your message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newMessageText.trim()}
                  className="p-3.5 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shrink-0 cursor-pointer"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <Briefcase className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-base font-bold text-gray-700">Select a conversation</p>
            <p className="text-xs">Choose a recruiter or candidate from the list to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
}
