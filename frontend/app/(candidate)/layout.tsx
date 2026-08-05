"use client";

import React from "react";
import CandidateNavbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMessages = pathname === "/messages";

  return (
    <ProtectedRoute>
      <div className={`relative flex flex-col bg-white ${isMessages ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        {/* Shared Background Decor */}
        <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
        <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

        <CandidateNavbar />
        {isMessages ? (
          <main className="relative z-10 w-full flex-1 min-h-0 overflow-hidden">
            {children}
          </main>
        ) : (
          <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:py-10 md:px-12 lg:px-24">
            {children}
          </main>
        )}
      </div>
    </ProtectedRoute>
  );
}

