"use client";

import React from "react";
import MessagingCenter from "@/components/MessagingCenter";

export default function CandidateMessagesPage() {
  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col overflow-hidden bg-white">
      <MessagingCenter userRole="candidate" />
    </div>
  );
}
