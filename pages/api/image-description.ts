import type { NextApiRequest, NextApiResponse } from "next";
const IncomingForm = require("formidable").IncomingForm;
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const VISION_API_KEY = "AIzaSyCrZEbvt6bT2-pHE-Ty8CrOjZ7kxCG8D2I";

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
            features: [
              { type: "LABEL_DETECTION", maxResults: 10 },
              { type: "OBJECT_LOCALIZATION", maxResults: 5 },
              { type: "TEXT_DETECTION", maxResults: 5 }
            ],
          },
        ],
      }),
    }
  );
  
  const visionData: any = await visionRes.json();
  console.log("Vision API response:", JSON.stringify(visionData, null, 2));
  
  const response = visionData?.responses?.[0];
  
  if (!response) {
    return "a handcrafted item";
  }
  
  // Extract labels
  const labels = response.labelAnnotations?.map((label: any) => label.description) || [];
  
  // Extract objects
  const objects = response.localizedObjectAnnotations?.map((obj: any) => obj.name) || [];
  
  // Extract text (if any)
  const texts = response.textAnnotations?.map((text: any) => text.description) || [];
  
  // Create a descriptive text based on detected features
  let description = "";
  
  // Prioritize craft-related terms
  const craftTerms = labels.filter((label: string) => 
    label.toLowerCase().includes('wood') || 
    label.toLowerCase().includes('craft') || 
    label.toLowerCase().includes('ceramic') || 
    label.toLowerCase().includes('textile') || 
    label.toLowerCase().includes('metal') || 
    label.toLowerCase().includes('clay') || 
    label.toLowerCase().includes('handmade') ||
    label.toLowerCase().includes('art') ||
    label.toLowerCase().includes('sculpture') ||
    label.toLowerCase().includes('pottery') ||
    label.toLowerCase().includes('jewelry') ||
    label.toLowerCase().includes('fabric') ||
    label.toLowerCase().includes('leather')
  );
  
  if (craftTerms.length > 0) {
    description = craftTerms[0];
  } else if (objects.length > 0) {
    description = objects[0];
  } else if (labels.length > 0) {
    description = labels[0];
  } else {
    description = "handcrafted item";
  }
  
  // Add material context if detected
  const materials = labels.filter((label: string) =>
    ['wood', 'ceramic', 'clay', 'metal', 'fabric', 'leather', 'stone', 'glass', 'bamboo', 'silver', 'gold'].some(material =>
      label.toLowerCase().includes(material)
    )
  );
  
  if (materials.length > 0 && !description.toLowerCase().includes(materials[0].toLowerCase())) {
    description = `${materials[0]} ${description}`;
  }
  
  return description || "handcrafted item";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ multiples: false });
  form.parse(req, async (err: any, fields: any, files: any) => {
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
