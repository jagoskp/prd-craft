import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { GeneratePRDRequest } from "@/lib/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function sanitizeMarkdownOutput(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();
  // Strip leading ```markdown or ```
  if (cleaned.startsWith("```markdown")) {
    cleaned = cleaned.substring(11).trimStart();
  } else if (cleaned.startsWith("```md")) {
    cleaned = cleaned.substring(5).trimStart();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3).trimStart();
  }

  // Strip trailing ```
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trimEnd();
  }

  return cleaned.trim();
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  // 1. Authenticate via server session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in to generate PRDs." },
      { status: 401 }
    );
  }

  let body: GeneratePRDRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const {
    platform,
    customPlatform,
    techStack,
    uiSettings,
    title,
    description,
    targetAudience,
    constraints,
  } = body;

  if (!description || description.trim().length < 10) {
    return NextResponse.json(
      { success: false, error: "Description must be at least 10 characters long." },
      { status: 400 }
    );
  }

  const effectivePlatform =
    platform === "custom" && customPlatform ? customPlatform : platform;

  // 2. Ensure user profile exists
  let userCredits = 0;
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("id, credits")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Create profile with 50 credits if first time
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Builder";

    await adminSupabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      credits: 50,
    });
    userCredits = 50;
  } else {
    userCredits = profile.credits ?? 0;
  }

  // 3. Deduct credits via RPC or fallback
  let creditDeducted = false;
  try {
    const { data: rpcSuccess, error: rpcError } = await supabase.rpc(
      "deduct_credits",
      {
        user_uuid: user.id,
        amount: 50,
      }
    );

    if (rpcError) {
      console.warn("RPC deduct_credits warning/error, checking direct credits:", rpcError);
      // Fallback: check profile credits directly and decrement safely
      if (userCredits >= 50) {
        const { error: updateError } = await adminSupabase
          .from("profiles")
          .update({ credits: userCredits - 50 })
          .eq("id", user.id);

        if (!updateError) {
          creditDeducted = true;
          userCredits -= 50;
        }
      }
    } else if (rpcSuccess === true) {
      creditDeducted = true;
      userCredits = Math.max(0, userCredits - 50);
    }
  } catch (deductErr) {
    console.error("Error during deduct_credits:", deductErr);
  }

  if (!creditDeducted) {
    return NextResponse.json(
      {
        success: false,
        error: "Insufficient credits. 50 credits required to generate a PRD.",
        creditsRemaining: userCredits,
      },
      { status: 402 }
    );
  }

  // 4. Safe AI Generation with Gemini & Instant Refund Failover
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    // Refund credits immediately
    await refundCredits(adminSupabase, user.id);
    return NextResponse.json(
      { success: false, error: "AI service configuration error (missing API key)." },
      { status: 500 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    const candidateModels = [
      "gemini-flash-latest",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
    ];

    const systemPrompt = `You are a Principal Product Architect and Senior Staff Software Engineer at a top tier Silicon Valley company (Linear, Stripe, Vercel).
Your mission is to craft an exhaustive, production-ready, deep, and actionable Product Requirements Document (PRD) tailored for engineering, design, and AI-assisted development (Cursor AI / Windsurf).

### PROJECT CONTEXT:
- **Project Title / Concept**: ${title || "Autonomous Application"}
- **Target Platform**: ${effectivePlatform}
- **Frontend Stack**: ${techStack.frontend || "Next.js 15 (App Router) + Tailwind CSS"}
- **Backend Stack**: ${techStack.backend || "Next.js Server Actions & Route Handlers"}
- **Database**: ${techStack.database || "PostgreSQL (Supabase)"}
- **Authentication**: ${techStack.auth || "Supabase Auth"}
- **Design Style**: ${uiSettings.designStyle || "Dark Tech (Linear / Vercel)"}
- **Theme & Color Palette**: ${uiSettings.colorPalette?.name || "Linear Violet"} (${uiSettings.themeMode || "dark"} mode)
  - Primary Accent: ${uiSettings.colorPalette?.primary || "#6366f1"}
  - Secondary Accent: ${uiSettings.colorPalette?.accent || "#8b5cf6"}
- **Typography**: ${uiSettings.typography?.name || "Inter"} (${uiSettings.typography?.description || "Crisp, hyper-legible"})
- **Target Audience**: ${targetAudience || "Tech-savvy professionals and builders"}
- **Key Constraints**: ${constraints || "None specified"}

### DETAILED USER REQUIREMENT:
${description}

---

### REQUIRED PRD OUTPUT FORMAT (GitHub-Flavored Markdown):
You MUST structure the output strictly with the following 6 numbered sections. Go extremely deep into concrete architectural details, schemas, and endpoint contracts. Do not provide high-level fluff or placeholders.

# ${title || "Product Requirements Document (PRD)"}

## 1. Executive Summary & Problem-Solution Fit
- **Problem Statement**: What core friction exists, for whom, and why existing solutions fail.
- **Proposed Solution**: High-level value proposition and system architecture.
- **Success Metrics & KPIs**: Concrete North Star metrics (DAU, latency, conversion %, token efficiency).
- **User Personas**: 2 distinct personas with their goals, pain points, and workflows.

## 2. Complete User Journeys & Screen Hierarchy
- **Information Architecture (IA)**: Tree diagram of screens, sub-routes, and modals.
- **Core User Journey Flow**: Step-by-step walkthrough from landing/onboarding to core value action.
- **Component Breakdown**: Key UI components per screen incorporating the ${uiSettings.designStyle} design style and ${uiSettings.themeMode} mode.
- **Micro-Interactions & State Management**: Loading skeletons, optimistic UI updates, error boundaries, empty states, and toast triggers.

## 3. Relational SQL Database Schema (DDL)
Provide production-ready PostgreSQL SQL schema DDL inside a \`\`\`sql code block:
- Include exact table definitions with UUID primary keys, foreign keys with ON DELETE CASCADE, NOT NULL constraints, column defaults, and timestamps.
- Include compound B-tree indexes for fast queries.
- Include Row Level Security (RLS) policies for multi-tenant isolation.
- Include database triggers/functions (e.g. updated_at auto-refresh, profile sync).

## 4. RESTful API Endpoints & Contracts
Provide a comprehensive Markdown table specifying all API routes:
| Method | Route | Auth Required | Request Body / Query Params | Success Response (200/201) | Error Codes |
|---|---|---|---|---|---|
(Include at least 6-8 core endpoints covering auth, resources, operations, webhooks, and billing/credits).

Provide JSON examples for key request & response payloads.

## 5. MVP vs Post-MVP Scope Matrix
| Feature Area | MVP (Phase 1 - Immediate Launch) | Post-MVP (Phase 2 - Growth & Scaling) | Out of Scope / Won't Do |
|---|---|---|---|
(Detail at least 8 distinct feature dimensions).

## 6. Ready-to-Copy \`.cursorrules\` & LLM Developer Instructions
Provide a copy-pasteable configuration block formatted inside a \`\`\`markdown or \`\`\`text code block for Cursor AI / Windsurf:
- Tech Stack rules and version constraints (${techStack.frontend}, ${techStack.backend}, ${techStack.database})
- Coding standards (TypeScript strict mode, error handling, component naming, server vs client boundary rules)
- Styling rules for ${uiSettings.designStyle} and color scheme (${uiSettings.colorPalette?.primary})
- Database query guidelines (RLS awareness, parameterized queries, avoid N+1)
- Prompting instructions for AI agents generating code in this repository.

---
Ensure all code blocks are properly syntax-highlighted. Produce an authoritative, world-class PRD document.`;

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        });
        const text = result.response.text();
        if (text && text.trim().length > 0) {
          responseText = text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate:`, err?.message || err);
      }
    }

    if (!responseText || responseText.trim().length === 0) {
      throw lastError || new Error("Empty response from AI model");
    }

    const cleanedContent = sanitizeMarkdownOutput(responseText);
    const prdTitle = title || "Autonomous Product Specification";

    // 5. Save PRD into database using admin client
    const { data: prdRecord, error: saveError } = await adminSupabase
      .from("prds")
      .insert({
        user_id: user.id,
        title: prdTitle,
        platform: effectivePlatform,
        tech_stack: techStack,
        ui_settings: uiSettings,
        content: cleanedContent,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save PRD into prds table:", saveError);
      // Even if DB save fails, we return the generated content to the user
      return NextResponse.json({
        success: true,
        prd: {
          id: `temp-${Date.now()}`,
          user_id: user.id,
          title: prdTitle,
          platform: effectivePlatform,
          tech_stack: techStack,
          ui_settings: uiSettings,
          content: cleanedContent,
          created_at: new Date().toISOString(),
        },
        warning: "Generated successfully, local cache created.",
      });
    }

    return NextResponse.json({
      success: true,
      prd: prdRecord,
      creditsRemaining: userCredits,
    });
  } catch (aiError: any) {
    console.error("Gemini AI Generation failed:", aiError);

    // Instant Refund on failure
    await refundCredits(adminSupabase, user.id);

    return NextResponse.json(
      {
        success: false,
        error:
          aiError?.message ||
          "AI Generation failed or timed out. Your 50 credits have been instantly refunded.",
        refunded: true,
      },
      { status: 500 }
    );
  }
}

async function refundCredits(adminSupabase: any, userId: string) {
  try {
    // Try RPC first: deduct_credits with negative amount = credit refund
    const { error: rpcError } = await adminSupabase.rpc("deduct_credits", {
      user_uuid: userId,
      amount: -50,
    });

    if (rpcError) {
      // Fallback direct update
      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (profile) {
        await adminSupabase
          .from("profiles")
          .update({ credits: (profile.credits || 0) + 50 })
          .eq("id", userId);
      }
    }
  } catch (err) {
    console.error("Failed to refund credits:", err);
  }
}
