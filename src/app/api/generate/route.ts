import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

// ─── Groq model chain (free tier: up to 14,400 req/day) ───────────────────────
const GROQ_MODELS = [
  "llama-3.3-70b-versatile",   // best quality, 1000 RPD
  "llama-3.1-8b-instant",      // very high limits, 14,400 RPD
  "gemma2-9b-it",              // fallback, 14,400 RPD
];

// ─── Gemini model chain (last resort) ─────────────────────────────────────────
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

function buildPrompt(count: number, difficultyInstruction: string, text: string) {
  return `You are an expert test creator. 
Extract key concepts from the following text and generate exactly ${count} multiple-choice questions at ${difficultyInstruction}.

Output strictly as a raw JSON array of objects fulfilling this structure:
[
  {
    "question": "The question string",
    "options": ["A", "B", "C", "D"],
    "answer": "The exact string of the correct option",
    "topic": "A 1-3 word classification of what concept this question tests (e.g. 'Photosynthesis', 'World War II')"
  }
]

Do not include any formatting, markdown wrappers, or extra text. ONLY return the JSON array.

--- Source Text ---
${text.slice(0, 30000)}`;
}

function isTransientError(err: any): boolean {
  const msg: string = err?.message || "";
  return (
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("503") ||
    msg.includes("quota") ||
    msg.includes("Too Many Requests") ||
    msg.includes("Service Unavailable") ||
    msg.includes("rate_limit") ||
    msg.includes("overloaded") ||
    msg.includes("404") ||
    msg.includes("not found")
  );
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to forge quizzes." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const extractedText = formData.get("text") as string | null;
    const count = parseInt(formData.get("count") as string || "5", 10);
    const difficulty = formData.get("difficulty") as string || "medium";

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json(
        { error: "Empty or invalid document text." },
        { status: 400 }
      );
    }

    const difficultyInstruction =
      difficulty === "mixed"
        ? "a MIXED difficulty level (e.g., approximately 30% easy, 40% medium, 30% hard)"
        : `a ${difficulty.toUpperCase()} difficulty level`;

    const prompt = buildPrompt(count, difficultyInstruction, extractedText);

    // ── 1. Try Groq first (primary — generous free tier) ──────────────────────
    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      const groq = new Groq({ apiKey: groqApiKey });

      for (const modelName of GROQ_MODELS) {
        try {
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
          });
          const raw = completion.choices[0]?.message?.content || "";
          const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
          const questions = JSON.parse(cleaned);
          console.log(`✅ Served by Groq / ${modelName}`);
          return NextResponse.json({ questions });
        } catch (err: any) {
          if (isTransientError(err)) {
            console.warn(`Groq model ${modelName} unavailable, trying next...`);
            continue;
          }
          throw err;
        }
      }
    } else {
      console.warn("GROQ_API_KEY not set — skipping Groq, falling back to Gemini.");
    }

    // ── 2. Fall back to Gemini ─────────────────────────────────────────────────
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      const genAI = new GoogleGenerativeAI(geminiApiKey);

      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          });
          const raw = result.response.text();
          const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
          const questions = JSON.parse(cleaned);
          console.log(`✅ Served by Gemini / ${modelName}`);
          return NextResponse.json({ questions });
        } catch (err: any) {
          if (isTransientError(err)) {
            console.warn(`Gemini model ${modelName} unavailable, trying next...`);
            continue;
          }
          throw err;
        }
      }
    }

    // ── 3. Everything exhausted ────────────────────────────────────────────────
    return NextResponse.json(
      { error: "All AI providers are currently busy. Please try again in a moment." },
      { status: 429 }
    );
  } catch (error: any) {
    console.error("API Pipeline Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
