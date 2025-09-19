import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { storyIdea, storyTone } = req.body;
  if (!storyIdea || !storyTone) {
    return res.status(400).json({ error: "Missing storyIdea or storyTone." });
  }

  const apiKey = "AIzaSyCx1Fzdpo5Hs6ewlaLhG-o_7REu9Q5yljk"; // ✅ store in .env.local
  const prompt = `Write a ${storyTone.toLowerCase()} story for an artisan based on this idea: ${storyIdea}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ]
        }),
      }
    );

    const data = await response.json();

    // ✅ Correct path to generated text
    const story =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Story generation failed.";

    res.status(200).json({ story });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate story." });
  }
}
