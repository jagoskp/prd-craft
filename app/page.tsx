"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  Sparkles,
  ArrowRight,
  Database,
  Bot,
  Zap,
  CheckCircle2,
  Code2,
  Shield,
  Layers,
  Terminal,
  FileCheck,
  ChevronRight,
  Cpu,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const { user, openAuthModal } = useAuth();
  const [activePreviewTab, setActivePreviewTab] = useState<
    "schema" | "api" | "cursorrules" | "summary"
  >("cursorrules");

  return (
    <div className="relative overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-radial-glow blur-3xl opacity-60" />

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center">
        {/* Release / Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-300 backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.2)] mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span>Engineered for Cursor AI & Windsurf Next-Gen Coding</span>
          <ChevronRight className="h-3 w-3 text-brand-400" />
        </div>

        {/* Hero Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          Turn Product Ideas into{" "}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            Production-Grade PRDs
          </span>{" "}
          in Seconds
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
          The autonomous AI architect that generates relational SQL schemas with RLS, comprehensive REST API contracts, 12 design style specifications, and ready-to-copy <code className="text-brand-300 font-mono text-sm bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">.cursorrules</code>.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/wizard"
            id="hero-cta-wizard"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-brand-200" />
            <span>Launch PRD Wizard</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          {!user ? (
            <button
              onClick={openAuthModal}
              id="hero-cta-signin"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <span>Sign In (50 Free Credits)</span>
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <span>View Dashboard</span>
            </Link>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Next.js 15 & Supabase SSR
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Gemini 1.5 Architecture Model
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Instant PDF & .md Export
          </span>
        </div>
      </section>

      {/* INTERACTIVE SPEC PREVIEW SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Real Output Inspection
          </h2>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            What Your Engineers & AI Coding Assistants Receive
          </h3>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
          {/* Preview Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-zinc-400">
                NexusFlow-SaaS-Specification.md
              </span>
            </div>

            <div className="flex items-center gap-1 pt-2 sm:pt-0">
              <button
                onClick={() => setActivePreviewTab("cursorrules")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activePreviewTab === "cursorrules"
                    ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Bot className="h-3.5 w-3.5" />
                .cursorrules
              </button>
              <button
                onClick={() => setActivePreviewTab("schema")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activePreviewTab === "schema"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                SQL DDL Schema
              </button>
              <button
                onClick={() => setActivePreviewTab("api")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activePreviewTab === "api"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                API Contracts
              </button>
              <button
                onClick={() => setActivePreviewTab("summary")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  activePreviewTab === "summary"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <FileCheck className="h-3.5 w-3.5" />
                Executive Summary
              </button>
            </div>
          </div>

          {/* Tab Preview Content */}
          <div className="p-6 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto bg-zinc-950/60 max-h-[420px]">
            {activePreviewTab === "cursorrules" && (
              <pre className="text-zinc-300">
                <span className="text-zinc-500"># .cursorrules configuration for NexusFlow SaaS</span>
                {"\n"}
                <span className="text-brand-400">---</span>
                {"\n"}
                <span className="text-emerald-400">tech_stack:</span>
                {"\n"}  frontend: Next.js 15 (App Router with async cookies) + Tailwind CSS
                {"\n"}  backend: Next.js Server Actions & Route Handlers
                {"\n"}  database: Supabase PostgreSQL (Row Level Security enforced)
                {"\n"}  ai_engine: Google Gemini 1.5 Flash
                {"\n"}
                <span className="text-emerald-400">coding_guidelines:</span>
                {"\n"}  - Always use TypeScript in strict mode. No implicit any.
                {"\n"}  - Server Components must use `await cookies()` for Next.js 15 compatibility.
                {"\n"}  - UI must adhere to Dark Tech styling (Zinc-950 base, Zinc-800 borders, Indigo accents).
                {"\n"}  - Every SQL operation must respect multi-tenant RLS policies using `auth.uid()`.
                {"\n"}  - All AI generation actions must implement try/catch failover with automatic credit refunds.
              </pre>
            )}

            {activePreviewTab === "schema" && (
              <pre className="text-zinc-300">
                <span className="text-purple-400">CREATE TABLE</span> <span className="text-yellow-300">public.organizations</span> (
                {"\n"}  id <span className="text-sky-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                {"\n"}  name <span className="text-sky-400">TEXT NOT NULL</span>,
                {"\n"}  slug <span className="text-sky-400">TEXT UNIQUE NOT NULL</span>,
                {"\n"}  created_at <span className="text-sky-400">TIMESTAMPTZ NOT NULL DEFAULT now()</span>
                {"\n"});
                {"\n\n"}
                <span className="text-purple-400">CREATE TABLE</span> <span className="text-yellow-300">public.projects</span> (
                {"\n"}  id <span className="text-sky-400">UUID PRIMARY KEY DEFAULT gen_random_uuid()</span>,
                {"\n"}  org_id <span className="text-sky-400">UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE</span>,
                {"\n"}  title <span className="text-sky-400">TEXT NOT NULL</span>,
                {"\n"}  status <span className="text-sky-400">TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft'</span>,
                {"\n"}  metadata <span className="text-sky-400">JSONB DEFAULT '&#123;&#125;'::jsonb</span>,
                {"\n"}  created_at <span className="text-sky-400">TIMESTAMPTZ NOT NULL DEFAULT now()</span>
                {"\n"});
                {"\n\n"}
                <span className="text-zinc-500">-- Multi-Tenant Row Level Security</span>
                {"\n"}
                <span className="text-purple-400">ALTER TABLE</span> public.projects <span className="text-purple-400">ENABLE ROW LEVEL SECURITY</span>;
                {"\n"}
                <span className="text-purple-400">CREATE POLICY</span> <span className="text-emerald-400">"Members can view organization projects"</span>
                {"\n"}  <span className="text-purple-400">ON</span> public.projects <span className="text-purple-400">FOR SELECT</span>
                {"\n"}  <span className="text-purple-400">USING</span> (org_id <span className="text-purple-400">IN</span> (SELECT org_id FROM public.org_members WHERE user_id = auth.uid()));
              </pre>
            )}

            {activePreviewTab === "api" && (
              <pre className="text-zinc-300">
                | Method | Endpoint | Auth | Description | Status Codes |
                {"\n"}
                |---|---|---|---|---|
                {"\n"}
                | <span className="text-emerald-400">POST</span> | <span className="text-sky-300">/api/v1/projects</span> | JWT Bearer | Creates a new workspace project | 201 Created, 400 Bad Request, 401 Unauthorized |
                {"\n"}
                | <span className="text-sky-400">GET</span>  | <span className="text-sky-300">/api/v1/projects</span> | JWT Bearer | Lists paginated projects for active org | 200 OK, 401 Unauthorized |
                {"\n"}
                | <span className="text-amber-400">PATCH</span>| <span className="text-sky-300">/api/v1/projects/:id</span> | JWT Bearer | Updates project title, status or metadata | 200 OK, 404 Not Found |
                {"\n"}
                | <span className="text-red-400">DELETE</span>| <span className="text-sky-300">/api/v1/projects/:id</span> | JWT Bearer | Soft deletes or cascades project deletion | 204 No Content, 403 Forbidden |
                {"\n"}
                | <span className="text-emerald-400">POST</span> | <span className="text-sky-300">/api/v1/webhooks/stripe</span> | Stripe Sig | Processes customer subscription lifecycle | 200 OK, 400 Invalid Signature |
              </pre>
            )}

            {activePreviewTab === "summary" && (
              <div className="space-y-3 font-sans text-xs text-zinc-300">
                <h4 className="text-sm font-bold text-white">1. Executive Summary & Problem-Solution Fit</h4>
                <p>
                  <strong>Problem:</strong> Development teams lose hundreds of engineering hours navigating vague requirements, disparate API contracts, and unaligned database structures.
                </p>
                <p>
                  <strong>Solution:</strong> A single-source-of-truth technical blueprint synthesizing UI hierarchies, DDL database schemas with Row Level Security, and IDE instructions for Cursor/Windsurf agents.
                </p>
                <p>
                  <strong>North Star Metrics:</strong> 99.9% build pass rate on first AI generation, 4x faster time-to-MVP, sub-100ms API endpoint latency.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Engineered for Precision
          </h2>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Built for Modern Founders & Full-Stack Developers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all hover:border-brand-500/50 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 mb-4">
              <Database className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">PostgreSQL & RLS Schemas</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Synthesizes complete SQL table definitions, primary/foreign key relationships with ON DELETE CASCADE, compound indexes, and production Row Level Security policies.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all hover:border-violet-500/50 hover:shadow-[0_0_25px_rgba(139,92,246,0.15)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 mb-4">
              <Bot className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Cursor & Windsurf Rules</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Provides ready-to-paste <code className="text-brand-300">.cursorrules</code> with strict coding standards, styling conventions, server vs client boundaries, and framework guidelines.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition-all hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-base font-bold text-white">Zero-Bug Failover Engine</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Protected by atomic database RPC credit deductions and instant refund failovers if the AI model or network encounters any timeout or error.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/40 bg-gradient-to-b from-brand-950/40 via-zinc-900 to-zinc-950 p-8 sm:p-14 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 p-0.5 shadow-lg shadow-brand-500/40 mb-6">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950">
              <Flame className="h-7 w-7 text-brand-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Build Your Next Unicorn Product?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-zinc-400">
            Generate your first complete PRD in under 30 seconds with 50 free credits on sign up.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/wizard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-brand-500/30 transition-all hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Free PRD Wizard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
