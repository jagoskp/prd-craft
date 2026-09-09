"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  Zap,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  User as UserIcon,
  ChevronDown,
  FileText,
} from "lucide-react";
import { AuthModal } from "./AuthModal";
import { CreditTopupModal } from "./CreditTopupModal";

export function Navbar() {
  const { user, profile, credits, loading, signOut, openAuthModal, openTopupModal } =
    useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Builder";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform active:scale-95"
            id="nav-brand-logo"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 p-0.5 shadow-md shadow-brand-500/20 transition-all duration-300 group-hover:shadow-brand-500/40">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                PRD<span className="text-brand-400">Craft</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                AI Architect
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/wizard"
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                pathname === "/wizard"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              }`}
            >
              <PlusCircle className="h-4 w-4 text-brand-400" />
              Generate PRD
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Area */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-lg bg-zinc-800" />
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Glowing Credit Badge */}
                <button
                  onClick={openTopupModal}
                  id="nav-credits-badge"
                  title="Click to recharge credits"
                  className="group relative flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-950/40 px-3 py-1 text-xs font-semibold text-brand-300 backdrop-blur-md transition-all duration-200 hover:border-brand-500/60 hover:bg-brand-900/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                  <Zap className="h-3.5 w-3.5 text-brand-400 transition-transform group-hover:scale-110" />
                  <span>
                    <strong className="text-white">{credits}</strong> Credits
                  </span>
                  <span className="hidden sm:inline-block text-[10px] text-brand-400/80 font-normal pl-0.5">
                    +Topup
                  </span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    id="user-profile-menu-button"
                    className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1.5 pl-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-850"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-violet-500 text-xs font-bold text-white uppercase">
                      {displayName.charAt(0)}
                    </div>
                    <span className="hidden max-w-[120px] truncate text-xs sm:inline-block font-medium">
                      {displayName}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-zinc-800 bg-zinc-900/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 animate-fade-in">
                        <div className="border-b border-zinc-800 px-3 py-2">
                          <p className="text-xs font-semibold text-zinc-200">
                            {displayName}
                          </p>
                          <p className="truncate text-[11px] text-zinc-400">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/wizard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          >
                            <PlusCircle className="h-3.5 w-3.5 text-brand-400" />
                            New PRD Wizard
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          >
                            <FileText className="h-3.5 w-3.5 text-zinc-400" />
                            My Saved PRDs
                          </Link>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              openTopupModal();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-brand-300 hover:bg-brand-950/40"
                          >
                            <Zap className="h-3.5 w-3.5 text-brand-400" />
                            Get More Credits
                          </button>
                        </div>
                        <div className="border-t border-zinc-800 pt-1">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              signOut();
                            }}
                            id="nav-sign-out-button"
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                id="nav-signin-button"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 transition-all duration-300 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95"
              >
                <UserIcon className="h-3.5 w-3.5" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal />
      {/* Topup Modal */}
      <CreditTopupModal />
    </>
  );
}
