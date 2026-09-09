export interface PlatformOption {
  id: string;
  name: string;
  iconName: string;
  description: string;
  badge?: string;
  defaultStack: {
    frontend: string;
    backend: string;
    database: string;
    auth: string;
    hosting: string;
  };
}

export const PLATFORMS: PlatformOption[] = [
  {
    id: "website",
    name: "Web Application / SaaS",
    iconName: "Globe",
    description: "Modern cloud-native web platform, interactive dashboard, or enterprise SaaS.",
    badge: "Most Popular",
    defaultStack: {
      frontend: "Next.js 15 (App Router) + Tailwind CSS",
      backend: "Next.js API Routes & Server Actions",
      database: "PostgreSQL (Supabase / Prisma)",
      auth: "Supabase Auth / NextAuth",
      hosting: "Vercel / Cloudflare",
    },
  },
  {
    id: "mobile",
    name: "Mobile App (iOS & Android)",
    iconName: "Smartphone",
    description: "Cross-platform mobile application with native performance and smooth gestures.",
    badge: "Cross-Platform",
    defaultStack: {
      frontend: "React Native (Expo SDK 52) + NativeWind",
      backend: "Node.js (NestJS / Fastify) + tRPC",
      database: "PostgreSQL + Redis Cache",
      auth: "Clerk / Supabase Auth",
      hosting: "EAS / AWS ECS",
    },
  },
  {
    id: "desktop",
    name: "Desktop Application",
    iconName: "Monitor",
    description: "High-performance desktop app for macOS, Windows, and Linux with native OS hooks.",
    badge: "Native OS",
    defaultStack: {
      frontend: "Tauri v2 + React 19 + Tailwind",
      backend: "Rust Native Core / SQLite local",
      database: "SQLite (Local) + Turso Cloud Sync",
      auth: "OAuth PKCE / Local Encryption",
      hosting: "GitHub Releases / Tauri Auto-Updater",
    },
  },
  {
    id: "custom",
    name: "Custom / Multi-Platform",
    iconName: "Layers",
    description: "Microservices, browser extensions, CLI tools, or distributed architecture.",
    badge: "Flexible",
    defaultStack: {
      frontend: "Custom Frontend / Multi-client",
      backend: "Go / Python FastAPI / GraphQL",
      database: "PostgreSQL / ClickHouse / MongoDB",
      auth: "Custom JWT / Keycloak",
      hosting: "Kubernetes / Docker",
    },
  },
];

export const FRONTEND_OPTIONS = [
  { id: "nextjs", name: "Next.js 15 (App Router)", tag: "React 19" },
  { id: "react", name: "React 19 + Vite / Tailwind", tag: "SPA" },
  { id: "vue", name: "Nuxt 3 / Vue 3 + Tailwind", tag: "Vue" },
  { id: "svelte", name: "SvelteKit 2 + Tailwind", tag: "Fast" },
  { id: "expo", name: "React Native (Expo SDK 52)", tag: "Mobile" },
  { id: "flutter", name: "Flutter 3.x", tag: "Cross-Platform" },
  { id: "tauri", name: "Tauri v2 + React", tag: "Desktop" },
  { id: "electron", name: "Electron + Next.js", tag: "Desktop" },
];

export const BACKEND_OPTIONS = [
  { id: "next_api", name: "Next.js Server Actions & Route Handlers", tag: "Full-Stack" },
  { id: "fastapi", name: "Python FastAPI + Pydantic v2", tag: "AI / ML Ready" },
  { id: "nestjs", name: "Node.js (NestJS + TypeScript)", tag: "Enterprise" },
  { id: "express", name: "Node.js (Express / Fastify)", tag: "Lightweight" },
  { id: "golang", name: "Go (Fiber / Gin / Chi)", tag: "High Concurrency" },
  { id: "rust", name: "Rust (Actix-web / Axum)", tag: "Blazing Fast" },
  { id: "trpc", name: "tRPC + Node.js End-to-End Type Safety", tag: "Type-Safe" },
  { id: "serverless", name: "AWS Lambda / Cloudflare Workers", tag: "Edge / Serverless" },
];

export const DATABASE_OPTIONS = [
  { id: "supabase", name: "PostgreSQL (Supabase with RLS)", tag: "Relational + Auth" },
  { id: "postgres", name: "PostgreSQL (Neon / AWS RDS / Prisma)", tag: "Relational" },
  { id: "mongodb", name: "MongoDB Atlas + Mongoose", tag: "Document NoSQL" },
  { id: "mysql", name: "MySQL / PlanetScale (Vitess)", tag: "Relational" },
  { id: "sqlite", name: "SQLite / Turso (LibSQL Edge)", tag: "Embedded / Edge" },
  { id: "redis", name: "Redis / Upstash (KV & Caching)", tag: "In-Memory" },
  { id: "dynamodb", name: "Amazon DynamoDB", tag: "Scalable NoSQL" },
  { id: "clickhouse", name: "ClickHouse (Analytics Engine)", tag: "Columnar OLAP" },
];

export interface DesignStyleOption {
  id: string;
  name: string;
  description: string;
  vibe: string;
  cssHighlights: string;
  bestFor: string;
}

export const DESIGN_STYLES: DesignStyleOption[] = [
  {
    id: "minimal",
    name: "Minimalist Clean",
    description: "Generous whitespace, ultra-sharp borderlines, focus on content hierarchy.",
    vibe: "Apple & Notion aesthetic",
    cssHighlights: "border-zinc-200 dark:border-zinc-800, subtle shadows, crisp typography",
    bestFor: "Productivity tools, documentation, writing apps",
  },
  {
    id: "dark-tech",
    name: "Dark Tech (Linear / Vercel)",
    description: "Deep zinc/obsidian palette, subtle grid lines, violet glow accents, frosted glass.",
    vibe: "Developer & SaaS modern standard",
    cssHighlights: "bg-zinc-950, border-zinc-800, glow effects, indigo/violet highlights",
    bestFor: "Dev tools, SaaS dashboards, AI apps",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism Modern",
    description: "Translucent layers, multi-stop backdrop blurs, soft diffused gradient backdrops.",
    vibe: "iOS & macOS VisionOS feel",
    cssHighlights: "backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/10",
    bestFor: "Creative suites, modern Web3, audio players",
  },
  {
    id: "brutalist",
    name: "Neo-Brutalism",
    description: "High-contrast thick borders, bold hard drop shadows, punchy neon colors.",
    vibe: "Gumroad & Figma community feel",
    cssHighlights: "border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold",
    bestFor: "Gen-Z apps, indie maker tools, portfolio sites",
  },
  {
    id: "material",
    name: "Material You (M3)",
    description: "Dynamic tonal palettes, pill navigation bars, soft rounded containers.",
    vibe: "Google Android 14 & Pixel ecosystem",
    cssHighlights: "rounded-3xl, tonal elevation cards, ripple feedback",
    bestFor: "Mobile-first apps, enterprise dashboards, utility tools",
  },
  {
    id: "retro",
    name: "Retro Synthwave / Arcade",
    description: "Vibrant magenta & cyan neon glows, CRT scanlines, 80s arcade energy.",
    vibe: "Cyberpunk 80s nostalgia",
    cssHighlights: "neon text-glows, dark purple canvas, chromatic gradient borders",
    bestFor: "Gaming platforms, music apps, Web3 gaming",
  },
  {
    id: "neumorphism",
    name: "Soft Neumorphism",
    description: "Subtle dual-shadow embossed surfaces creating tactile 3D extrusion.",
    vibe: "Physical hardware interface feel",
    cssHighlights: "soft dual inset/outset shadows, seamless surface blend",
    bestFor: "Smart home controllers, audio plugins, calculators",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk High-Tech",
    description: "High contrast neon yellow & electric cyan, angled chamfers, telemetry UI.",
    vibe: "Sci-Fi HUD & tactical software",
    cssHighlights: "clip-path chamfered corners, scanlines, monospace badges",
    bestFor: "Crypto trading terminals, DevOps monitoring, security tools",
  },
  {
    id: "bento-grid",
    name: "Bento Grid Layout",
    description: "Modular card grids with variable aspect ratios, interactive preview chips.",
    vibe: "Apple Keynote & Raycast style",
    cssHighlights: "grid grid-cols-12 gap-4, interactive hover spotlight cards",
    bestFor: "Landing pages, feature showcases, analytics summaries",
  },
  {
    id: "corporate-clean",
    name: "Corporate Clean Enterprise",
    description: "Structured tabular layouts, professional navy & slate tones, dense information.",
    vibe: "Stripe & Salesforce institutional trust",
    cssHighlights: "slate-900 typography, subtle borders, high contrast readability",
    bestFor: "Fintech, healthcare, B2B enterprise SaaS",
  },
  {
    id: "pastel-soft",
    name: "Pastel Soft & Friendly",
    description: "Gentle lavender, peach, and mint palettes with organic rounded corners.",
    vibe: "Duolingo & Headspace friendliness",
    cssHighlights: "rounded-2xl, soft pastel pills, comforting neutral backgrounds",
    bestFor: "Mental health, wellness, education, lifestyle apps",
  },
  {
    id: "monomode",
    name: "High-Contrast Monomode",
    description: "Strict monochrome black and white with high-contrast text and zero distraction.",
    vibe: "Terminal, Teenage Engineering minimalism",
    cssHighlights: "grayscale only, 1px sharp borders, pure black & pure white",
    bestFor: "Minimal note-taking, code readers, terminal apps",
  },
];

export interface ColorPaletteOption {
  id: string;
  name: string;
  primary: string;
  accent: string;
  preview: string[];
  description: string;
}

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: "linear-violet",
    name: "Linear Indigo & Violet",
    primary: "#6366f1",
    accent: "#8b5cf6",
    preview: ["#6366f1", "#8b5cf6", "#18181b", "#09090b"],
    description: "Electric indigo with ambient violet glow for high-end dev tools.",
  },
  {
    id: "tailwind-blue",
    name: "Tailwind Ocean Blue",
    primary: "#0ea5e9",
    accent: "#38bdf8",
    preview: ["#0ea5e9", "#38bdf8", "#0f172a", "#0284c7"],
    description: "Vibrant cyan & sky blue tones trusted by top modern web applications.",
  },
  {
    id: "supabase-emerald",
    name: "Supabase Emerald Green",
    primary: "#10b981",
    accent: "#34d399",
    preview: ["#10b981", "#34d399", "#064e3b", "#052e16"],
    description: "Fresh emerald green representing speed, growth, and reliability.",
  },
  {
    id: "spotify-neon",
    name: "Spotify Neon Green",
    primary: "#22c55e",
    accent: "#84cc16",
    preview: ["#22c55e", "#84cc16", "#121212", "#18181b"],
    description: "Electric lime & punchy green on dark matte surfaces.",
  },
  {
    id: "sunset-orange",
    name: "Sunset Amber & Orange",
    primary: "#f97316",
    accent: "#fbbf24",
    preview: ["#f97316", "#fbbf24", "#7c2d12", "#1c1917"],
    description: "Warm, energetic amber and fiery orange accents.",
  },
  {
    id: "monochrome",
    name: "Obsidian & Chrome",
    primary: "#f4f4f5",
    accent: "#a1a1aa",
    preview: ["#f4f4f5", "#a1a1aa", "#27272a", "#09090b"],
    description: "Pure grayscale monochromatic luxury.",
  },
];

export interface TypographyOption {
  id: string;
  name: string;
  family: string;
  sampleText: string;
  description: string;
  recommendedFor: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  {
    id: "inter",
    name: "Inter",
    family: "font-sans",
    sampleText: "The quick brown fox jumps over the lazy dog. 1234567890",
    description: "The gold standard of digital UI typography. Crisp, hyper-legible at small sizes.",
    recommendedFor: "General SaaS, Dashboards, Data tables",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "font-sans",
    sampleText: "Geometric, modern, friendly and punchy headline presence.",
    description: "Geometric sans-serif with friendly curves and high visual appeal.",
    recommendedFor: "Consumer apps, E-commerce, EdTech",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "font-sans",
    sampleText: "Clean precision engineered for modern mobile and desktop screens.",
    description: "Low-contrast geometric sans serif designed for screen legibility.",
    recommendedFor: "Fintech, Mobile Apps, Modern Portfolio",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    family: "font-sans",
    sampleText: "Sophisticated modern neo-grotesque with distinct personality.",
    description: "Fresh contemporary typography with elegant curves and tech appeal.",
    recommendedFor: "AI Startups, Web3, Creative Agencies",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    family: "font-sans",
    sampleText: "Tech-forward, monospace-inspired brutalist readability.",
    description: "Proportional sans-serif with distinct monospace idiosyncrasies.",
    recommendedFor: "Developer Tools, Crypto, Hardware UI",
  },
];

export interface QuickTemplate {
  id: string;
  title: string;
  badge: string;
  platform: string;
  description: string;
  constraints: string;
  suggestedStack: {
    frontend: string;
    backend: string;
    database: string;
  };
  styleId: string;
}

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: "micro-saas",
    title: "AI Video Repurposing Micro-SaaS",
    badge: "Micro-SaaS",
    platform: "website",
    description:
      "A B2B SaaS tool that ingests long-form YouTube videos, transcribes them using Whisper AI, extracts viral hooks and timestamps, and automatically generates 9:16 short-form reels with animated subtitles and background music for TikTok, Instagram Reels, and YouTube Shorts. Includes credit system, Stripe subscriptions, and multi-tenant team workspaces.",
    constraints:
      "Must support webhook callbacks for async video rendering queue. Max video upload 500MB. Export in MP4 1080p 60fps.",
    suggestedStack: {
      frontend: "Next.js 15 (App Router) + Tailwind CSS",
      backend: "Next.js Server Actions & Fastify Video Worker",
      database: "PostgreSQL (Supabase with RLS)",
    },
    styleId: "dark-tech",
  },
  {
    id: "marketplace",
    title: "Curated Remote Developer Marketplace",
    badge: "Marketplace",
    platform: "website",
    description:
      "A high-trust two-sided marketplace connecting verified senior engineering contractors with tech startups. Features automated coding skill verification, escrow milestone payments, real-time messaging, calendar interview booking, contract e-signatures, and AI matching score based on tech stack synergy.",
    constraints:
      "Stripe Connect escrow payment holds until milestone sign-off. Encrypted file attachments for NDA contracts.",
    suggestedStack: {
      frontend: "Next.js 15 (App Router) + Tailwind CSS",
      backend: "Node.js (NestJS + TypeScript)",
      database: "PostgreSQL (Neon / AWS RDS / Prisma)",
    },
    styleId: "corporate-clean",
  },
  {
    id: "dev-tool",
    title: "API Performance & Latency Monitor CLI + Web HUD",
    badge: "Developer Tool",
    platform: "custom",
    description:
      "A developer observability platform combining a lightweight CLI agent with a real-time web dashboard. Monitors microservice HTTP/gRPC endpoint latencies, SSL expiry, anomaly spikes, and automatic alert notifications to Slack/Discord/PagerDuty with distributed trace visualization.",
    constraints:
      "Telemetry ingestion must handle 50,000 requests/sec with p99 latency < 20ms. Single binary Go CLI agent.",
    suggestedStack: {
      frontend: "Next.js 15 (App Router) + Tailwind CSS",
      backend: "Go (Fiber / Gin / Chi)",
      database: "ClickHouse (Analytics Engine)",
    },
    styleId: "cyberpunk",
  },
  {
    id: "mobile-utility",
    title: "AI Nutrition & Macro Tracker with Photo Scan",
    badge: "Mobile Utility",
    platform: "mobile",
    description:
      "A mobile health and fitness app where users snap a photo of any meal or grocery barcode to instantly receive accurate macro breakdowns (calories, protein, carbs, fats, micronutrients) using multimodal vision AI. Includes personalized weekly meal plans, Apple Health & Google Fit sync, water tracker, and streak gamification.",
    constraints:
      "Offline-first SQLite local caching for meal logging. Vision recognition response under 2.5 seconds.",
    suggestedStack: {
      frontend: "React Native (Expo SDK 52)",
      backend: "Python FastAPI + Pydantic v2",
      database: "PostgreSQL (Supabase with RLS)",
    },
    styleId: "minimal",
  },
];
