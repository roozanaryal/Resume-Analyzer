import { Briefcase, Building2, LayoutDashboard, LogOut, PlusSquare, ChevronDown } from "lucide-react";
import React from "react";
import Link from "next/link";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PlusSquare, label: "Post Job", href: "/post-job" },
  { icon: Briefcase, label: "Manage Jobs", href: "/manage-jobs" },
  { icon: Building2, label: "Company Profile", href: "/company-profile" },
];

export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col pt-6 fixed inset-y-0 left-0 z-50">
        <div className="px-6 mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">JobPortal</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-100 text-gray-400">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 font-bold text-sm hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-gray-900 leading-tight">Welcome back!</h2>
            <p className="text-sm font-semibold text-gray-400">Here's what's happening with your jobs today.</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 tracking-tight">John Davis</p>
              <p className="text-xs font-semibold text-gray-400 leading-tight">Employer</p>
            </div>
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white shadow-md">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" 
                alt="Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 text-gray-300" />
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
