"use client";

import React from "react";
import { Briefcase, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useLogout } from "@/features/auth/hooks";

export default function CandidateNavbar() {
  const pathname = usePathname();
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();

  const navLinks = [
    { label: "Find Jobs", href: "/find-jobs" },
    { label: "Saved Jobs", href: "/saved" },
    { label: "Messages", href: "/messages" },
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
          <div className="flex items-center gap-3 pl-4 border-l border-gray-100 h-10">
            <div className="text-right hidden sm:block ml-2">
              <p className="text-sm font-bold text-gray-900 tracking-tight leading-none mb-0.5">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {user?.role || "Candidate"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <UserIcon className="h-5 w-5" />
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
