import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { storyIdea, storyTone } = await req.json();

    if (!storyIdea || !storyTone) {
      return NextResponse.json(
        { error: "Missing storyIdea or storyTone." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Set GOOGLE_AI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const prompt = `Write a ${storyTone.toLowerCase()} story for an artisan based on this idea: ${storyIdea}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 400,
          },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API error:", data.error);
      return NextResponse.json(
        { error: "Gemini API error", details: data.error.message || data.error },
        { status: 500 }
      );
    }

    const story =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Story generation failed.";

    return NextResponse.json({ story });
  } catch (err) {
    console.error("Generate story error:", err);
    return NextResponse.json(
      { error: "Failed to generate story." },
      { status: 500 }
    );
  }
}
