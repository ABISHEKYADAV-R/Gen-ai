import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { storyIdea, storyTone } = await req.json();
  const apiKey = "AIzaSyCx1Fzdpo5Hs6ewlaLhG-o_7REu9Q5yljk";
  const prompt = `Write a ${storyTone.toLowerCase()} story for an artisan based on this idea: ${storyIdea}`;

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + apiKey, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();
  const story = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Story generation failed.";
  return NextResponse.json({ story });
}
