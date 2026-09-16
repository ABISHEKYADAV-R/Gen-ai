import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";

async function getImageDescription(imageBuffer: Buffer): Promise<string> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_VISION_API_KEY not set, using fallback description");
    return "handcrafted item";
  }

  try {
    const imageData = imageBuffer.toString("base64");
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
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
                { type: "TEXT_DETECTION", maxResults: 5 },
              ],
            },
          ],
        }),
      }
    );

    const visionData: any = await visionRes.json();

    if (visionData.error) {
      console.error("Vision API error:", visionData.error);
      return "handcrafted item";
    }

    const response = visionData?.responses?.[0];
    if (!response) return "a handcrafted item";

    const labels: string[] =
      response.labelAnnotations?.map((l: any) => l.description) || [];
    const objects: string[] =
      response.localizedObjectAnnotations?.map((o: any) => o.name) || [];

    const craftKeywords = [
      "wood","craft","ceramic","textile","metal","clay","handmade",
      "art","sculpture","pottery","jewelry","fabric","leather",
    ];

    const craftTerms = labels.filter((label) =>
      craftKeywords.some((kw) => label.toLowerCase().includes(kw))
    );

    let description =
      craftTerms[0] || objects[0] || labels[0] || "handcrafted item";

    const materialKeywords = [
      "wood","ceramic","clay","metal","fabric","leather",
      "stone","glass","bamboo","silver","gold",
    ];
    const materials = labels.filter((label) =>
      materialKeywords.some((m) => label.toLowerCase().includes(m))
    );

    if (
      materials.length > 0 &&
      !description.toLowerCase().includes(materials[0].toLowerCase())
    ) {
      description = `${materials[0]} ${description}`;
    }

    return description || "handcrafted item";
  } catch (error) {
    console.error("Vision API request failed:", error);
    return "handcrafted item";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ imageDescription: "handcrafted item" });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageDescription = await getImageDescription(buffer);
    return NextResponse.json({ imageDescription });
  } catch (error) {
    console.error("image-description error:", error);
    return NextResponse.json(
      { error: "Image processing failed." },
      { status: 500 }
    );
  }
}
