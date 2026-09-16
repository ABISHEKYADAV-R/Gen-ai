import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const storyIdea = formData.get("storyIdea")?.toString().trim();
    const storyTone = formData.get("storyTone")?.toString().trim();
    const image = formData.get("image");

    if (!storyIdea || !storyTone) {
      return NextResponse.json(
        { error: "Missing story idea or story tone." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are an expert storyteller for an artisan marketplace called CraftAI.

Create a compelling and authentic story for a handmade artisan product.

Story idea:
${storyIdea}

Tone:
${storyTone}

Write a warm and engaging artisan story that:
- Highlights the human craftsmanship
- Explains the inspiration behind the product
- Creates an emotional connection with the customer
- Feels authentic rather than AI-generated
- Does not invent specific facts that were not provided
- Is approximately 150-200 words

Return only the story text.
`;

    const contents: any[] = [{ text: prompt }];

    if (image instanceof File) {
      const arrayBuffer = await image.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      contents.push({
        inlineData: {
          mimeType: image.type || "image/jpeg",
          data: base64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
    });

    const story = response.text;

    return NextResponse.json({
      story,
      imageDescription:
        image instanceof File ? "Image analyzed by Gemini." : "",
    });
  } catch (error) {
    console.error("Generate story error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate story.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}