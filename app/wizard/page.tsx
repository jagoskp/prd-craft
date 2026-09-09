"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import confetti from "canvas-confetti";
import {
  PLATFORMS,
  FRONTEND_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
  DESIGN_STYLES,
  COLOR_PALETTES,
  TYPOGRAPHY_OPTIONS,
  QUICK_TEMPLATES,
} from "@/lib/constants";
import type { WizardFormData, PRDRecord } from "@/lib/types";
import {
  Globe,
  Smartphone,
  Monitor,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Wand2,
  AlertCircle,
  Loader2,
  Palette,
  Type,
  Layout,
  FileCode2,
  FileText,
  RotateCcw,
} from "lucide-react";
import { PRDViewer } from "@/components/PRDViewer";
import { ActionToolbar } from "@/components/ActionToolbar";

const PLATFORM_ICONS: Record<string, any> = {
  Globe,
  Smartphone,
  Monitor,
  Layers,
};

export default function WizardPage() {
  const router = useRouter();
  const { user, credits, refreshCredits, openAuthModal, openTopupModal } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [formData, setFormData] = useState<WizardFormData>({
    platform: "website",
    customPlatform: "",
    techStack: {
      frontend: "Next.js 15 (App Router) + Tailwind CSS",
      backend: "Next.js Server Actions & Route Handlers",
      database: "PostgreSQL (Supabase with RLS)",
      auth: "Supabase Auth",
    },
    uiSettings: {
      designStyle: "Dark Tech (Linear / Vercel)",
      colorPalette: COLOR_PALETTES[0],
      themeMode: "dark",
      typography: {
        name: "Inter",
        family: "font-sans",
        description: "Crisp, hyper-legible at small sizes",
      },
    },
    title: "",
    description: "",
    constraints: "",
    targetAudience: "",
  });

  // UI / Async Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedPRD, setGeneratedPRD] = useState<PRDRecord | null>(null);

  // Auto-apply stack preset whenever platform changes or by clicking preset button
  const applyStackPreset = (platformId: string) => {
    const platform = PLATFORMS.find((p) => p.id === platformId);
    if (platform) {
      setFormData((prev) => ({
        ...prev,
        techStack: {
          frontend: platform.defaultStack.frontend,
          backend: platform.defaultStack.backend,
          database: platform.defaultStack.database,
          auth: platform.defaultStack.auth,
        },
      }));
    }
  };

  const handlePlatformSelect = (platformId: string) => {
    setFormData((prev) => ({ ...prev, platform: platformId }));
    applyStackPreset(platformId);
  };

  const handleTemplateSelect = (templateId: string) => {
    const t = QUICK_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (t) {
      const matchedStyle =
        DESIGN_STYLES.find((s) => s.id === t.styleId)?.name ||
        "Dark Tech (Linear / Vercel)";
      setFormData((prev) => ({
        ...prev,
        platform: t.platform,
        title: t.title,
        description: t.description,
        constraints: t.constraints,
        techStack: {
          ...prev.techStack,
          frontend: t.suggestedStack.frontend,
          backend: t.suggestedStack.backend,
          database: t.suggestedStack.database,
        },
        uiSettings: {
          ...prev.uiSettings,
          designStyle: matchedStyle,
        },
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (formData.platform === "custom" && !formData.customPlatform?.trim()) {
        return false;
      }
      return true;
    }
    if (step === 2) {
      return (
        !!formData.techStack.frontend &&
        !!formData.techStack.backend &&
        !!formData.techStack.database
      );
    }
    if (step === 6) {
      return (
        formData.description.trim().length >= 20 &&
        (formData.title.trim().length > 0 || formData.description.length > 0)
      );
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerate = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    if (credits < 50) {
      openTopupModal();
      return;
    }

    if (!validateStep(6)) {
      setGenerationError(
        "Please provide a descriptive product overview of at least 20 characters."
      );
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationError(null);

      const payload = {
        platform: formData.platform,
        customPlatform: formData.customPlatform,
        techStack: formData.techStack,
        uiSettings: formData.uiSettings,
        title:
          formData.title.trim() ||
          `${formData.platform.toUpperCase()} Solution Specification`,
        description: formData.description,
        targetAudience: formData.targetAudience,
        constraints: formData.constraints,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 402) {
          openTopupModal();
        }
        throw new Error(data.error || "Failed to generate PRD");
      }

      // Successful generation!
      setGeneratedPRD(data.prd);
      await refreshCredits();

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#8b5cf6", "#10b981", "#38bdf8"],
        });
      } catch {
        // Confetti optional
      }
    } catch (err: any) {
      setGenerationError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  // If a PRD is generated, show the output screen with action toolbar
  if (generatedPRD) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span>PRD Successfully Generated & Saved</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {generatedPRD.title}
            </h1>
          </div>
          <button
            onClick={() => {
              setGeneratedPRD(null);
              setCurrentStep(1);
            }}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Generate Another PRD</span>
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="mb-8">
          <ActionToolbar
            title={generatedPRD.title}
            content={generatedPRD.content}
            platform={generatedPRD.platform}
            createdAt={generatedPRD.created_at}
          />
        </div>

        {/* PRD Content Body */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <PRDViewer content={generatedPRD.content} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Wizard Header & Progress */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/40 px-3 py-1 text-xs font-semibold text-brand-300 mb-3">
          <Wand2 className="h-3.5 w-3.5 text-brand-400" />
          <span>Interactive 6-Step AI Architecture Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Configure Your Product Blueprint
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
          Select platform, stack, and design preferences to synthesize a deep, production-grade PRD.
        </p>

        {/* Step Progress Indicator */}
        <div className="mt-6 flex items-center justify-between">
          {[
            { step: 1, label: "Platform", icon: Layout },
            { step: 2, label: "Stack", icon: FileCode2 },
            { step: 3, label: "Design", icon: Palette },
            { step: 4, label: "Theme", icon: Sparkles },
            { step: 5, label: "Type", icon: Type },
            { step: 6, label: "Spec", icon: FileText },
          ].map((s) => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            const StepIcon = s.icon;
            return (
              <div
                key={s.step}
                onClick={() => {
                  if (s.step < currentStep || validateStep(currentStep)) {
                    setCurrentStep(s.step);
                  }
                }}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  isCurrent
                    ? "text-brand-400 scale-105"
                    : isCompleted
                    ? "text-emerald-400"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border text-xs font-bold transition-all ${
                    isCurrent
                      ? "border-brand-500 bg-brand-950/60 shadow-[0_0_15px_rgba(99,102,241,0.4)] text-white"
                      : isCompleted
                      ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span className="hidden sm:inline-block mt-1.5 text-[11px] font-medium">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress Line */}
        <div className="relative mt-3 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Body Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {generationError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-300 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">Generation Notice</p>
              <p>{generationError}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Platform Selection */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Step 1: Choose Target Platform</h2>
              <p className="text-xs text-zinc-400">
                Where will your software run? This tailors architecture, UI paradigms, and deployment configurations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {PLATFORMS.map((p) => {
                const IconComponent = PLATFORM_ICONS[p.iconName] || Globe;
                const isSelected = formData.platform === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handlePlatformSelect(p.id)}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-950/30 shadow-[0_0_20px_rgba(99,102,241,0.25)]"
                        : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-850"
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute top-3 right-3 rounded-full bg-zinc-800 px-2 py-0.5 text-[9px] font-semibold text-brand-300 border border-brand-500/20">
                        {p.badge}
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-brand-500 text-white"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{p.name}</h3>
                        <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {formData.platform === "custom" && (
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 animate-fade-in">
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Specify Custom Target Environment:
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chrome Extension + Microservices, Embedded IoT Dashboard, CLI..."
                  value={formData.customPlatform || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customPlatform: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Tech Stack Selection */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-white">Step 2: Define Tech Stack</h2>
                <p className="text-xs text-zinc-400">
                  Select key layers or click Auto-Preset to apply optimal architecture for {formData.platform}.
                </p>
              </div>
              <button
                onClick={() => applyStackPreset(formData.platform)}
                className="flex items-center gap-1.5 rounded-xl border border-brand-500/40 bg-brand-950/40 px-3 py-1.5 text-xs font-medium text-brand-300 hover:bg-brand-900/40 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span>Auto-Recommend Stack</span>
              </button>
            </div>

            {/* Frontend */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                1. Frontend Framework
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FRONTEND_OPTIONS.map((f) => {
                  const isSelected = formData.techStack.frontend === f.name;
                  return (
                    <div
                      key={f.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          techStack: { ...prev.techStack, frontend: f.name },
                        }))
                      }
                      className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/40 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{f.name}</div>
                      <div className="text-[10px] text-zinc-500">{f.tag}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Backend */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                2. Backend & API Layer
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BACKEND_OPTIONS.map((b) => {
                  const isSelected = formData.techStack.backend === b.name;
                  return (
                    <div
                      key={b.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          techStack: { ...prev.techStack, backend: b.name },
                        }))
                      }
                      className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/40 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{b.name}</div>
                      <div className="text-[10px] text-zinc-500">{b.tag}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Database */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                3. Database & Storage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DATABASE_OPTIONS.map((d) => {
                  const isSelected = formData.techStack.database === d.name;
                  return (
                    <div
                      key={d.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          techStack: { ...prev.techStack, database: d.name },
                        }))
                      }
                      className={`cursor-pointer rounded-xl border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/40 text-white shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{d.name}</div>
                      <div className="text-[10px] text-zinc-500">{d.tag}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Design Style (12 selectable style cards) */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Step 3: Visual Design Style</h2>
              <p className="text-xs text-zinc-400">
                Pick from 12 modern design aesthetics to guide component specs, UI architecture, and styling rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {DESIGN_STYLES.map((style) => {
                const isSelected = formData.uiSettings.designStyle === style.name;
                return (
                  <div
                    key={style.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        uiSettings: { ...prev.uiSettings, designStyle: style.name },
                      }))
                    }
                    className={`relative flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-950/40 shadow-[0_0_18px_rgba(99,102,241,0.25)]"
                        : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-850"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">{style.name}</h4>
                        {isSelected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-400 leading-normal">
                        {style.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[10px] text-brand-300 font-medium">
                      Best for: {style.bestFor}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Colors & Theme Mode */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Step 4: Color Palette & Theme Mode</h2>
              <p className="text-xs text-zinc-400">
                Choose a pre-built signature palette and default theme mode for the generated project.
              </p>
            </div>

            {/* Theme Mode Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Default Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "dark", label: "Dark Mode (Recommended)", desc: "Zinc & Obsidian deep base" },
                  { id: "light", label: "Light Mode", desc: "Crisp white & neutral slate" },
                  { id: "system", label: "System Sync", desc: "Automatic OS preference" },
                ].map((mode) => {
                  const isSelected = formData.uiSettings.themeMode === mode.id;
                  return (
                    <div
                      key={mode.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          uiSettings: {
                            ...prev.uiSettings,
                            themeMode: mode.id as any,
                          },
                        }))
                      }
                      className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                          : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{mode.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{mode.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Palettes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Signature Accent Palette
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COLOR_PALETTES.map((palette) => {
                  const isSelected =
                    formData.uiSettings.colorPalette.id === palette.id;
                  return (
                    <div
                      key={palette.id}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          uiSettings: {
                            ...prev.uiSettings,
                            colorPalette: palette,
                          },
                        }))
                      }
                      className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-950/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                          : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-850"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{palette.name}</h4>
                          {isSelected && (
                            <Check className="h-3.5 w-3.5 text-brand-400" />
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {palette.description}
                        </p>
                      </div>

                      {/* Swatches */}
                      <div className="flex items-center gap-1.5">
                        {palette.preview.map((color, idx) => (
                          <div
                            key={idx}
                            className="h-5 w-5 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Typography Selection */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Step 5: Typography Engine</h2>
              <p className="text-xs text-zinc-400">
                Choose a type family optimized for high-density interface readability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {TYPOGRAPHY_OPTIONS.map((font) => {
                const isSelected =
                  formData.uiSettings.typography.name === font.name;
                return (
                  <div
                    key={font.id}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        uiSettings: {
                          ...prev.uiSettings,
                          typography: {
                            name: font.name,
                            family: font.family,
                            description: font.description,
                          },
                        },
                      }))
                    }
                    className={`flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-brand-500 bg-brand-950/30 shadow-[0_0_18px_rgba(99,102,241,0.25)]"
                        : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-850"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{font.name}</span>
                        {isSelected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                        {font.description}
                      </p>
                    </div>

                    <div className="mt-4 rounded-lg bg-zinc-900/90 border border-zinc-800 p-3 text-xs text-zinc-200">
                      <p className="italic">{font.sampleText}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Description & Prompt Engine */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-lg font-bold text-white">Step 6: Describe Your Product & Features</h2>
              <p className="text-xs text-zinc-400">
                Select a quick template or describe your idea in depth. The richer the description, the deeper the generated schema and API routes.
              </p>
            </div>

            {/* Quick Templates Chips */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Quick Template Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateSelect(tpl.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-brand-500/60 hover:bg-brand-950/30 hover:text-white active:scale-95"
                  >
                    <Sparkles className="h-3 w-3 text-brand-400" />
                    <span>{tpl.badge}: {tpl.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Title Input */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Product Name / Working Title:
              </label>
              <input
                type="text"
                placeholder="e.g. NexusFlow AI, DevSync Terminal, PulseMetrics..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* 1000 Character Textarea with Live Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Core Requirements & User Flow (Min 20 characters):
                </label>
                <span
                  className={`text-[11px] font-mono ${
                    formData.description.length > 950
                      ? "text-amber-400"
                      : "text-zinc-500"
                  }`}
                >
                  {formData.description.length}/1000 chars
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={1000}
                placeholder="Describe what the product does, who uses it, key workflow steps, third-party integrations, and edge cases..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-white placeholder-zinc-500 leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Constraints & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Target Audience / Primary Users:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineers, B2B Founders..."
                  value={formData.targetAudience || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      targetAudience: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Key Technical Constraints / Integrations:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Under 100ms latency, Stripe Webhooks, GDPR..."
                  value={formData.constraints || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      constraints: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Summary Pill Review */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Configuration Snapshot:</span>{" "}
              <span className="text-brand-300">{formData.platform}</span> •{" "}
              <span>{formData.techStack.frontend}</span> •{" "}
              <span>{formData.techStack.database}</span> •{" "}
              <span className="text-violet-300">{formData.uiSettings.designStyle}</span>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-5">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isGenerating}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              id="wizard-next-step-button"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-40"
            >
              <span>Next Step</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || formData.description.trim().length < 20}
              id="generate-prd-submit-btn"
              className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synthesizing Architecture with Gemini...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-300" />
                  <span>Generate PRD (50 Credits)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
