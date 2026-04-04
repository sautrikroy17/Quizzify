import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized. Please log in to forge quizzes." }, { status: 401 });
    }

    const formData = await req.formData();
    const extractedText = formData.get("text") as string | null;
    const count = parseInt(formData.get("count") as string || "5", 10);
    const difficulty = formData.get("difficulty") as string || "medium";

    if (!extractedText || !extractedText.trim()) {
      return NextResponse.json({ error: "Empty or invalid document text." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficultyInstruction = difficulty === "mixed"
      ? "a MIXED difficulty level (e.g., approximately 30% easy, 40% medium, 30% hard)"
      : `a ${difficulty.toUpperCase()} difficulty level`;

    const prompt = `You are an expert test creator. 
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
${extractedText.slice(0, 30000)}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const questions = JSON.parse(cleanedText);

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("API Pipeline Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}
