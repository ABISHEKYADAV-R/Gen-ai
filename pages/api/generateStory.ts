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
    const prompt = `Write a simple, unique story for an artisan. Do not use any names. Describe how they worked to create their craft, the challenges they overcame, and how they sell their work to customers. Use this idea: ${storyIdea}. Make the tone: ${storyTone}. Add some relevant emojis to make it engaging. The artisan's work is represented by: ${imageDescription}. Incorporate this into the story, but do not mention any file names.`;

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
