import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { storyIdea, storyTone } = await req.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { story: "API key is missing. Please configure GOOGLE_AI_API_KEY." },
        { status: 500 }
      );
    }

    const prompt = `Write a ${storyTone.toLowerCase()} story for an artisan based on this idea: ${storyIdea}`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.error("Gemini API Error:", response.status, await response.text());
      return NextResponse.json({ story: "Story generation failed due to an API error." }, { status: 500 });
    }

    const data = await response.json();
    const story = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Story generation failed.";
    return NextResponse.json({ story });
  } catch (error) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { story: "An error occurred while generating the story." },
      { status: 500 }
    );
  }
}
