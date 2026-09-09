"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { X, Sparkles, Mail, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    demoSignIn,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Failed to initiate Google login.");
      setLoading(false);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const res = await signInWithEmail(email);
      if (res.success) {
        setMessage(res.message || "Magic login link sent! Check your inbox.");
      } else {
        setError(res.message || "Error sending magic link.");
      }
    } catch (err: any) {
      setError(err?.message || "Error sending link.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      await demoSignIn();
    } catch (err: any) {
      setError(err?.message || "Error signing into demo profile.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl z-10 animate-slide-up">
        {/* Glow Header */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          id="auth-modal-close-button"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Branding Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-brand-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
              <Sparkles className="h-6 w-6 text-brand-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Welcome to <span className="text-brand-400">PRD Craft</span>
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Sign in to generate full-stack PRDs with 50 complimentary credits
          </p>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            {message}
          </div>
        )}

        <div className="space-y-3">
          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            id="google-signin-submit-button"
            className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-800/90 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-750 hover:shadow-md disabled:opacity-50"
          >
            {/* Google SVG Logo */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-zinc-800" />
            <span className="absolute bg-zinc-900 px-3 text-[11px] uppercase tracking-wider text-zinc-500">
              Or instant test mode
            </span>
          </div>

          {/* Quick Demo Sign-in Button */}
          <button
            onClick={handleDemo}
            disabled={loading}
            id="demo-signin-button"
            className="flex w-full items-center justify-between rounded-xl border border-brand-500/30 bg-brand-950/40 px-4 py-2.5 text-xs font-medium text-brand-200 transition-all hover:border-brand-500/60 hover:bg-brand-900/40"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-400" />
              <span>Instant Demo Account (50 Free Credits)</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-brand-400" />
          </button>

          {/* Email Magic Link Form */}
          <form onSubmit={handleEmail} className="mt-3 space-y-2">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-850 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-50"
            >
              Send Magic Sign-In Link
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-5 flex items-center justify-center gap-1 text-[11px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
          <span>Secure authentication powered by Supabase SSR</span>
        </div>
      </div>
    </div>
  );
}
