"use client";

import React from "react";
import MessagingCenter from "@/components/MessagingCenter";

export default function CandidateMessagesPage() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-white">
      <MessagingCenter userRole="candidate" />
    </div>
  );
}
