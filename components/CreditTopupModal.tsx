"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { X, Zap, Check, Sparkles, ShieldCheck } from "lucide-react";

export function CreditTopupModal() {
  const { isTopupModalOpen, closeTopupModal, credits, refreshCredits } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isTopupModalOpen) return null;

  const handleTopup = async () => {
    try {
      setLoading(true);
      setSuccessMsg(null);
      const res = await fetch("/api/credits/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: selectedPlan }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshCredits();
        setSuccessMsg(`Successfully added +${selectedPlan} credits to your account!`);
        setTimeout(() => {
          setSuccessMsg(null);
          closeTopupModal();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      credits: 100,
      price: "$9",
      perPRD: "$4.50 / PRD",
      badge: "Starter",
      description: "Generate 2 complete comprehensive PRDs",
    },
    {
      credits: 250,
      price: "$19",
      perPRD: "$3.80 / PRD",
      badge: "Most Popular",
      popular: true,
      description: "Generate 5 complete PRDs with full .cursorrules",
    },
    {
      credits: 500,
      price: "$35",
      perPRD: "$3.50 / PRD",
      badge: "Pro Architect",
      description: "Generate 10 comprehensive architectural specs",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={closeTopupModal}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/95 p-6 shadow-2xl backdrop-blur-xl z-10 animate-slide-up">
        {/* Ambient Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />

        <button
          onClick={closeTopupModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          id="topup-modal-close-button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Top Up PRD Credits
          </h3>
          <p className="mt-1 text-xs text-zinc-400">
            Current balance: <strong className="text-brand-300 font-semibold">{credits} Credits</strong> (50 credits per PRD)
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.credits;
            return (
              <div
                key={p.credits}
                onClick={() => setSelectedPlan(p.credits)}
                className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-brand-500 bg-brand-950/30 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-850"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow">
                    Popular
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300">
                      {p.badge}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-white">
                    +{p.credits}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium">
                    Credits
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <div className="text-sm font-bold text-white">{p.price}</div>
                  <div className="text-[10px] text-zinc-500">{p.perPRD}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleTopup}
          disabled={loading}
          id="confirm-topup-button"
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:shadow-brand-500/40 hover:scale-[1.01] active:scale-98 disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {loading ? "Recharging Account..." : `Add +${selectedPlan} Credits Now`}
          </span>
        </button>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" />
          <span>Instant balance update • Zero subscription lock-in</span>
        </div>
      </div>
    </div>
  );
}
