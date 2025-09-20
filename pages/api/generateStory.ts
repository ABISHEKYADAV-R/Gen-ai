import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";
const IncomingForm = require("formidable").IncomingForm;
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const GEMINI_API_KEY = "AIzaSyCx1Fzdpo5Hs6ewlaLhG-o_7REu9Q5yljk";
const VISION_API_KEY = "AIzaSyBQAUxG8BmJN4wXsYZ6kw3T7fg_ZvZPJOs";

async function getImageDescription(imagePath: string): Promise<string> {
  const imageData = fs.readFileSync(imagePath, { encoding: "base64" });
  const visionRes = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageData },
            features: [{ type: "LABEL_DETECTION", maxResults: 1 }],
          },
        ],
      }),
    }
  );
  const visionData = await visionRes.json();
  const label = visionData?.responses?.[0]?.labelAnnotations?.[0]?.description;
  return label || "a craft image";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Image upload failed" });
    }
    const storyIdea = fields.storyIdea as string;
    const storyTone = fields.storyTone as string;
    let imageDescription = "";
    if (files.image) {
      const imagePath = Array.isArray(files.image) ? files.image[0].filepath : files.image.filepath;
      imageDescription = await getImageDescription(imagePath);
    }
    const prompt = `You are helping an artisan tell their authentic story. Write a compelling, personal narrative in first person about how this artisan created their ${imageDescription || 'handcrafted piece'}. 

The story should include:
- The inspiration behind creating this piece
- The specific materials chosen and why
- Step-by-step crafting process with vivid details
- Challenges and difficulties encountered during creation (material problems, technique struggles, time constraints, learning new skills)
- How they overcame these obstacles with persistence and creativity
- The emotional journey and satisfaction of completion
- What makes this piece unique and special

Story context: ${storyIdea}
Tone: ${storyTone}

Make it feel like a real artisan speaking directly to potential customers. Include specific crafting details, emotional moments, and the human story behind the creation. Use emojis sparingly and naturally. The story should be 150-250 words and feel authentic, not generic.

Example structure:
"When I first envisioned this piece... The biggest challenge came when... After several attempts... What makes this special is..."`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.8,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 400
            }
          }),
        }
      );
      const data: any = await response.json();
      if (data.error) {
        return res.status(500).json({ error: "Gemini API error", details: data.error });
      }
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        const story = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ story, imageDescription });
      } else {
        return res.status(500).json({ error: "Story generation failed.", details: data });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate story.", details: error });
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data: any = await response.json();
      if (data.error) {
        return res.status(500).json({ error: "Gemini API error", details: data.error });
      }
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        const story = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ story, imageDescription });
      } else {
        return res.status(500).json({ error: "Story generation failed.", details: data });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to generate story.", details: error });
    }
  });
}
