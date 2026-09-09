"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  LayoutDashboard,
  PlusCircle,
  Zap,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { PRDRecord } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const { user, credits, loading: authLoading, openAuthModal, openTopupModal } =
    useAuth();

  const [prds, setPrds] = useState<PRDRecord[]>([]);
  const [loadingPrds, setLoadingPrds] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal();
      return;
    }
    if (user) {
      fetchUserPRDs();
    }
  }, [user, authLoading]);

  const fetchUserPRDs = async () => {
    try {
      setLoadingPrds(true);
      const res = await fetch("/api/prds");
      const data = await res.json();
      if (data.success) {
        setPrds(data.prds || []);
      }
    } catch (err) {
      console.error("Failed to load PRDs:", err);
    } finally {
      setLoadingPrds(false);
    }
  };

  const handleDeletePRD = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this PRD?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/prds/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPrds((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete PRD:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyLink = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      const url = `${window.location.origin}/prd/${id}`;
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const filteredPRDs = prds.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech_stack?.frontend?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform =
      platformFilter === "all" ||
      p.platform.toLowerCase() === platformFilter.toLowerCase();

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Dashboard Top Stats & Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Architecture Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Workspace Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your generated technical specifications, API schemas, and AI prompts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Credit Overview Card */}
          <div
            onClick={openTopupModal}
            className="flex items-center gap-3 rounded-2xl border border-brand-500/30 bg-brand-950/40 p-3.5 backdrop-blur-xl cursor-pointer hover:border-brand-500/60 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Credit Balance</div>
              <div className="text-lg font-bold text-white leading-tight">
                {credits}{" "}
                <span className="text-xs text-brand-400 font-normal">Credits</span>
              </div>
            </div>
          </div>

          <Link
            href="/wizard"
            id="dashboard-new-prd-btn"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New PRD</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search specifications by title, platform, stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["all", "website", "mobile", "desktop", "custom"].map((filter) => (
            <button
              key={filter}
              onClick={() => setPlatformFilter(filter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                platformFilter === filter
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* PRD Grid */}
      {loadingPrds ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-52 animate-pulse rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6"
            />
          ))}
        </div>
      ) : filteredPRDs.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Specifications Found</h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery
              ? "No PRDs match your search criteria. Try a different query."
              : "You haven't generated any PRDs yet. Launch the wizard to create your first specification."}
          </p>
          <Link
            href="/wizard"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-500 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Generate First PRD (50 Credits)</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPRDs.map((p) => {
            const isCopied = copiedId === p.id;
            const isDeleting = deletingId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => router.push(`/prd/${p.id}`)}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-xl transition-all duration-200 hover:border-brand-500/50 hover:bg-zinc-850/90 hover:shadow-xl hover:shadow-brand-500/10 cursor-pointer"
              >
                <div>
                  {/* Card Header: Platform badge & Date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-950/60 border border-brand-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-brand-300 uppercase tracking-wide">
                      <Layers className="h-3 w-3" />
                      {p.platform}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(p.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                    {p.title}
                  </h3>

                  {/* Tech stack highlights */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.tech_stack?.frontend && (
                      <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700/50">
                        {p.tech_stack.frontend.split(" ")[0]}
                      </span>
                    )}
                    {p.tech_stack?.database && (
                      <span className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-300 border border-zinc-700/50">
                        {p.tech_stack.database.split(" ")[0]}
                      </span>
                    )}
                    {p.ui_settings?.designStyle && (
                      <span className="rounded-md bg-violet-950/40 px-2 py-0.5 text-[10px] text-violet-300 border border-violet-500/30">
                        {p.ui_settings.designStyle.split(" ")[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <span className="text-[11px] font-semibold text-brand-400 group-hover:underline flex items-center gap-1">
                    Open PRD
                    <ExternalLink className="h-3 w-3" />
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleCopyLink(p.id, e)}
                      title="Copy PRD link"
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => handleDeletePRD(p.id, e)}
                      disabled={isDeleting}
                      title="Delete PRD"
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-950/50 hover:text-red-400 transition-colors"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
