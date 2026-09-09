"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PRDViewer } from "@/components/PRDViewer";
import { ActionToolbar } from "@/components/ActionToolbar";
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Database,
  Code2,
  Palette,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PRDRecord } from "@/lib/types";

export default function PRDDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [prd, setPrd] = useState<PRDRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPRD() {
      try {
        setLoading(true);
        const res = await fetch(`/api/prds/${resolvedParams.id}`);
        const data = await res.json();
        if (data.success && data.prd) {
          setPrd(data.prd);
        } else {
          setError(data.error || "Specification not found.");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to load PRD.");
      } finally {
        setLoading(false);
      }
    }

    if (resolvedParams.id) {
      fetchPRD();
    }
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="text-xs text-zinc-400">Loading Technical Specification...</p>
      </div>
    );
  }

  if (error || !prd) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950/40 text-red-400 border border-red-500/20">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white">PRD Not Found</h2>
        <p className="mt-1 text-xs text-zinc-400">{error || "This document could not be located."}</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      {/* Back Button & Breadcrumbs */}
      <div className="no-print mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>

        <span className="text-[11px] text-zinc-500 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Generated {formatDate(prd.created_at)}
        </span>
      </div>

      {/* Header Info Card */}
      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-950/60 border border-brand-500/30 px-3 py-0.5 text-xs font-semibold text-brand-300 uppercase tracking-wide">
            <Layers className="h-3.5 w-3.5" />
            {prd.platform}
          </span>
          {prd.tech_stack?.frontend && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 border border-zinc-700">
              <Code2 className="h-3 w-3 text-brand-400" />
              {prd.tech_stack.frontend}
            </span>
          )}
          {prd.tech_stack?.database && (
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 border border-zinc-700">
              <Database className="h-3 w-3 text-emerald-400" />
              {prd.tech_stack.database}
            </span>
          )}
          {prd.ui_settings?.designStyle && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-950/50 px-2.5 py-0.5 text-xs text-violet-300 border border-violet-500/30">
              <Palette className="h-3 w-3 text-violet-400" />
              {prd.ui_settings.designStyle}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {prd.title}
        </h1>
      </div>

      {/* Action Toolbar */}
      <div className="mb-8">
        <ActionToolbar
          title={prd.title}
          content={prd.content}
          platform={prd.platform}
          createdAt={prd.created_at}
        />
      </div>

      {/* Document Content View */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <PRDViewer content={prd.content} />
      </div>
    </div>
  );
}
