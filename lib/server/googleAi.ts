export function getGeminiApiKey(): string {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    ""
  ).trim();
}

export function getVisionApiKey(): string {
  return (
    process.env.GOOGLE_VISION_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_API_KEY ||
    ""
  ).trim();
}

export function missingAiKeyResponse(service: "Gemini" | "Google Vision") {
  return {
    error: `${service} is not configured. Set GEMINI_API_KEY and/or GOOGLE_VISION_API_KEY in the server environment.`,
  };
}

export interface VisionAnalysis {
  labels: string[];
  objects: string[];
  texts: string[];
  materials: string[];
  description: string;
  rawError?: string;
}

const MATERIAL_KEYWORDS = [
  "wood",
  "ceramic",
  "clay",
  "metal",
  "fabric",
  "leather",
  "stone",
  "glass",
  "bamboo",
  "silver",
  "gold",
  "cotton",
  "silk",
  "wool",
  "bronze",
  "copper",
  "pottery",
  "textile",
  "linen",
];

export async function analyzeImageWithVision(
  base64: string
): Promise<VisionAnalysis> {
  const apiKey = getVisionApiKey();
  if (!apiKey) {
    throw new Error("Google Vision API key is not configured");
  }

  const visionRes = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [
              { type: "LABEL_DETECTION", maxResults: 15 },
              { type: "OBJECT_LOCALIZATION", maxResults: 8 },
              { type: "TEXT_DETECTION", maxResults: 5 },
            ],
          },
        ],
      }),
    }
  );

  const visionData = await visionRes.json();
  if (!visionRes.ok || visionData.error) {
    const message =
      visionData?.error?.message ||
      `Vision API request failed with status ${visionRes.status}`;
    throw new Error(message);
  }

  const response = visionData?.responses?.[0];
  if (response?.error?.message) {
    throw new Error(response.error.message);
  }

  const labels: string[] =
    response?.labelAnnotations?.map((label: { description?: string }) =>
      label.description || ""
    ).filter(Boolean) || [];
  const objects: string[] =
    response?.localizedObjectAnnotations?.map((obj: { name?: string }) =>
      obj.name || ""
    ).filter(Boolean) || [];
  const texts: string[] =
    response?.textAnnotations?.map((text: { description?: string }) =>
      text.description || ""
    ).filter(Boolean) || [];

  const materials = labels.filter((label) =>
    MATERIAL_KEYWORDS.some((material) =>
      label.toLowerCase().includes(material)
    )
  );

  const craftTerms = labels.filter((label) =>
    /wood|craft|ceramic|textile|metal|clay|handmade|art|sculpture|pottery|jewelry|fabric|leather/i.test(
      label
    )
  );

  const description =
    craftTerms[0] ||
    objects[0] ||
    labels[0] ||
    "handcrafted item";

  return { labels, objects, texts, materials, description };
}

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-flash-latest",
];

export async function generateGeminiText(options: {
  prompt: string;
  imageBase64?: string;
  mimeType?: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const parts: Array<Record<string, unknown>> = [{ text: options.prompt }];
  if (options.imageBase64) {
    parts.push({
      inline_data: {
        mime_type: options.mimeType || "image/jpeg",
        data: options.imageBase64,
      },
    });
  }

  let lastError = "Story generation failed.";

  for (const model of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: options.temperature ?? 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: options.maxOutputTokens ?? 800,
          },
        }),
      }
    );

    const data = await response.json();
    if (data?.error) {
      lastError = data.error.message || lastError;
      continue;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    }

    lastError = "Gemini returned an empty response.";
  }

  throw new Error(lastError);
}

export function extractJsonObject(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }
  return JSON.parse(jsonMatch[0]) as Record<string, unknown>;
}
