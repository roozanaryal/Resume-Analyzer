"use client";

import React from "react";
import { Briefcase, Bookmark, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CandidateNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "Find Jobs", href: "/find-jobs" },
    { label: "Saved Jobs", href: "/saved" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:py-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-10">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-all active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-white shadow-lg">
              <Briefcase className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Jagir
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-blue-600 relative after:absolute after:bottom-[-22px] after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Options Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/saved"
            className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer hidden sm:block p-1"
          >
            <Bookmark className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100 h-10">
            <div className="text-right hidden sm:block ml-2">
              <p className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-0.5">
                Mary Johnson
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                Candidate
              </p>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white shadow-md border border-gray-50 shrink-0">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mary"
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>
      </nav>
    </div>
  );
}
