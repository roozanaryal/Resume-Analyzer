import React from "react";
import CandidateNavbar from "@/components/Navbar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Shared Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />
      <div className="fixed right-[-5%] top-[20%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-violet-50/50 blur-3xl pointer-events-none" />

      <CandidateNavbar />
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:py-10 md:px-12 lg:px-24">
        {children}
      </main>
    </div>
  );
}
