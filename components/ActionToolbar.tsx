"use client";

import React, { useState } from "react";
import { Copy, Check, Download, Printer, Share2, Sparkles } from "lucide-react";
import { sanitizeFileName } from "@/lib/utils";

interface ActionToolbarProps {
  title: string;
  content: string;
  platform?: string;
  createdAt?: string;
}

export function ActionToolbar({
  title,
  content,
  platform,
  createdAt,
}: ActionToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeFileName(title)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        if (navigator.share) {
          await navigator.share({
            title: title,
            text: `Check out this PRD for ${title} generated with PRD Craft`,
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        }
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="action-toolbar no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3.5 backdrop-blur-xl shadow-lg">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
            {title}
          </h4>
          <p className="text-[10px] text-zinc-400">
            {platform ? `Target: ${platform}` : "Production Specification"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Copy Markdown Button */}
        <button
          onClick={handleCopyMarkdown}
          id="copy-markdown-btn"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-750 hover:text-white active:scale-95"
          title="Copy raw Markdown to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
              <span>Copy Markdown</span>
            </>
          )}
        </button>

        {/* Download .md Button */}
        <button
          onClick={handleDownloadMd}
          id="download-markdown-btn"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 transition-all hover:border-brand-500 hover:bg-zinc-750 hover:text-white active:scale-95"
          title="Download as .md file"
        >
          <Download className="h-3.5 w-3.5 text-brand-400" />
          <span>Download .md</span>
        </button>

        {/* Print / Save PDF Button */}
        <button
          onClick={handlePrintPDF}
          id="print-pdf-btn"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 transition-all hover:border-violet-500 hover:bg-zinc-750 hover:text-white active:scale-95"
          title="Print or export as PDF"
        >
          <Printer className="h-3.5 w-3.5 text-violet-400" />
          <span>Print / PDF</span>
        </button>

        {/* Share Link Button */}
        <button
          onClick={handleShare}
          id="share-prd-btn"
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-xs font-medium text-zinc-200 transition-all hover:border-zinc-500 hover:bg-zinc-750 hover:text-white active:scale-95"
          title="Share link"
        >
          {shared ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-300 font-semibold">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
