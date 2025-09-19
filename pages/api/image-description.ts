import type { NextApiRequest, NextApiResponse } from "next";
const IncomingForm = require("formidable").IncomingForm;
import fs from "fs";
import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const form = new IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Image upload failed" });
    }
    let imageDescription = "";
    if (files.image) {
      const imagePath = Array.isArray(files.image) ? files.image[0].filepath : files.image.filepath;
      imageDescription = await getImageDescription(imagePath);
    }
    return res.status(200).json({ imageDescription });
  });
}
