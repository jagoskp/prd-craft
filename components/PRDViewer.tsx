"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, Code, Database, Table as TableIcon, Bot, FileText } from "lucide-react";

interface PRDViewerProps {
  content: string;
}

export function PRDViewer({ content }: PRDViewerProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Code Block Component with Copy Button
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    if (inline) {
      return (
        <code
          className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[13px] text-brand-300 border border-zinc-700/50"
          {...props}
        >
          {children}
        </code>
      );
    }

    const handleCopy = async () => {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="relative my-5 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-xl group">
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/60 px-4 py-2 text-xs text-zinc-400">
          <span className="font-mono text-[11px] uppercase tracking-wider text-brand-400 font-semibold">
            {language || "code"}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-zinc-200 selection:bg-brand-500/30">
          <pre className="!bg-transparent !p-0 !m-0">{children}</pre>
        </div>
      </div>
    );
  };

  // Extract sections if user wants tabbed views
  const filterContent = () => {
    if (activeTab === "all") return content;
    
    // Split by markdown headers
    const sections = content.split(/(?=##\s+\d+\.)/g);
    
    if (activeTab === "schema") {
      const match = sections.find((s) => s.toLowerCase().includes("schema") || s.toLowerCase().includes("database"));
      return match || "## 3. Relational SQL Database Schema (DDL)\n\n" + content;
    }
    if (activeTab === "api") {
      const match = sections.find((s) => s.toLowerCase().includes("api") || s.toLowerCase().includes("endpoint"));
      return match || "## 4. RESTful API Endpoints & Contracts\n\n" + content;
    }
    if (activeTab === "cursorrules") {
      const match = sections.find((s) => s.toLowerCase().includes("cursorrules") || s.toLowerCase().includes("instructions"));
      return match || "## 6. Ready-to-Copy .cursorrules\n\n" + content;
    }
    return content;
  };

  return (
    <div className="prd-container relative">
      {/* Quick Section Switcher / Filter Bar */}
      <div className="no-print mb-6 flex flex-wrap items-center gap-1.5 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === "all"
              ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          Full PRD Specification
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === "schema"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          Database Schema (DDL)
        </button>
        <button
          onClick={() => setActiveTab("api")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === "api"
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <TableIcon className="h-3.5 w-3.5" />
          API Contracts
        </button>
        <button
          onClick={() => setActiveTab("cursorrules")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            activeTab === "cursorrules"
              ? "bg-violet-500/20 text-violet-300 border border-violet-500/40"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
          }`}
        >
          <Bot className="h-3.5 w-3.5" />
          .cursorrules for AI
        </button>
      </div>

      {/* Main Markdown Body with prose styling */}
      <article className="prose prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:text-white prose-h1:border-b prose-h1:border-zinc-800 prose-h1:pb-4 prose-h2:text-xl prose-h2:text-zinc-100 prose-h2:mt-8 prose-h2:mb-3 prose-h3:text-base prose-h3:text-brand-300 prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-table:my-6 prose-th:bg-zinc-900/80 prose-th:p-3 prose-th:text-xs prose-th:font-semibold prose-th:text-zinc-200 prose-td:p-3 prose-td:text-xs prose-td:text-zinc-300 prose-td:border-t prose-td:border-zinc-800">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            table: ({ children, ...props }) => (
              <div className="my-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60 shadow-md">
                <table className="w-full text-left text-xs text-zinc-300" {...props}>
                  {children}
                </table>
              </div>
            ),
            th: ({ children, ...props }) => (
              <th className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-3 font-semibold text-zinc-200" {...props}>
                {children}
              </th>
            ),
            td: ({ children, ...props }) => (
              <td className="border-b border-zinc-800/60 px-4 py-3 align-top" {...props}>
                {children}
              </td>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote className="border-l-4 border-brand-500 bg-brand-950/20 px-4 py-2 rounded-r-xl my-4 text-zinc-300" {...props}>
                {children}
              </blockquote>
            ),
          }}
        >
          {filterContent()}
        </ReactMarkdown>
      </article>
    </div>
  );
}
