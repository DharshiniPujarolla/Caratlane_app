import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const requestSchema = z.object({
  selfieImage: z.string().min(1),
  productId: z.string().min(1),
});

type GeminiInlineDataPart = {
  inlineData?: {
    mimeType?: string;
    data?: string;
  };
};

async function getGeminiApiKey(): Promise<string | undefined> {
  try {
    const cloudflareModule = await import("cloudflare:workers");
    const cloudflareEnv = (cloudflareModule as { env?: Record<string, string | undefined> }).env;
    const fromWorkersEnv = cloudflareEnv?.GEMINI_API_KEY;

    if (typeof fromWorkersEnv === "string" && fromWorkersEnv.trim()) {
      return fromWorkersEnv;
    }
  } catch {
    // Fall back to local process env in non-Cloudflare runtimes.
  }

  const fromProcessEnv = process.env.GEMINI_API_KEY;
  return typeof fromProcessEnv === "string" && fromProcessEnv.trim()
    ? fromProcessEnv
    : undefined;
}

export const Route = createFileRoute("/api/lumimirror-generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;

        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Expected a JSON request body." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const parsed = requestSchema.safeParse(payload);
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "Missing selfieImage or productId." }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const apiKey = await getGeminiApiKey();
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        const { selfieImage, productId } = parsed.data;
        const mimeMatch = selfieImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
        const mimeType = mimeMatch?.[1] ?? "image/png";
        const base64Data = selfieImage.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");

        // IMPORTANT: gemini-2.5-flash-image is the FREE TIER model (500 requests/day, no billing).
        // Do NOT change this to gemini-3.1-flash-image or gemini-3-pro-image-preview —
        // those require billing enabled and have zero free quota.
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType,
                        data: base64Data,
                      },
                    },
                    {
                      text: `Create a polished virtual try-on image by naturally adding the selected jewellery item for product ID ${productId} onto the person in the selfie. Keep the person's appearance, pose, expression, background, and everything else unchanged while making the jewellery look realistic and well-placed.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            }),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          return new Response(JSON.stringify({ error: "Gemini request failed.", details: errorText }), {
            status: response.status,
            headers: { "content-type": "application/json" },
          });
        }

        const data = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: GeminiInlineDataPart[];
            };
          }>;
        };

        const generatedPart = data.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
        const generatedImageData = generatedPart?.inlineData?.data;

        if (!generatedImageData) {
          return new Response(JSON.stringify({ error: "No generated image was returned by Gemini." }), {
            status: 502,
            headers: { "content-type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({
            image: `data:${generatedPart?.inlineData?.mimeType ?? mimeType};base64,${generatedImageData}`,
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      },
    },
  },
});