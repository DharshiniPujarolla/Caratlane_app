import { createFileRoute } from "@tanstack/react-router";

function getImageMimeType(imageDataUrl: string) {
  if (imageDataUrl.startsWith("data:")) {
    const match = imageDataUrl.match(/^data:([^;]+);/);
    return match?.[1] ?? "image/png";
  }

  return "image/png";
}

function getImageBase64(imageDataUrl: string) {
  if (!imageDataUrl.startsWith("data:")) {
    return imageDataUrl;
  }

  const separatorIndex = imageDataUrl.indexOf(",");
  if (separatorIndex === -1) {
    return imageDataUrl;
  }

  return imageDataUrl.slice(separatorIndex + 1);
}

function getGeminiPrompt(jewelryDescription: string, placementHints?: Record<string, unknown>) {
  const placementText = placementHints
    ? [
        "Placement guidance:",
        `- anchorX: ${placementHints.anchorX ?? 0.5}`,
        `- anchorY: ${placementHints.anchorY ?? 0.56}`,
        `- scale: ${placementHints.scale ?? 0.3}`,
        `- rotation: ${placementHints.rotation ?? 0}`,
        `- curvature: ${placementHints.curvature ?? 0.12}`,
        `- perspective: ${placementHints.perspective ?? 0.06}`,
        `- pendantDrop: ${placementHints.pendantDrop ?? 0.1}`,
        `- neckWidth: ${placementHints.neckWidth ?? 0.16}`,
        `- shoulderWidth: ${placementHints.shoulderWidth ?? 0.28}`,
      ].join(" ")
    : "";

  return [
    "Create a photorealistic virtual try-on image for a necklace or pendant.",
    "Use the provided selfie as the base image and place the jewelry naturally on the person's neck and upper chest.",
    `Jewelry description: ${jewelryDescription}`,
    placementText,
    "Keep the necklace centered on the body, follow the neck curvature, let the pendant hang naturally, and preserve the face, skin, hair, clothing, and background realism.",
    "Do not add extra objects or distort the person's appearance. The result should look like a premium jewelry photoshoot.",
  ].join(" ");
}

export const Route = createFileRoute("/api/lumimirror-generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            imageDataUrl?: string;
            jewelryDescription?: string;
            placementHints?: Record<string, unknown>;
          };

          const imageDataUrl = body.imageDataUrl;
          const jewelryDescription = body.jewelryDescription?.trim() || "necklace";

          if (!imageDataUrl) {
            return new Response(JSON.stringify({ error: "An image is required." }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "GEMINI_API_KEY is not configured." }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: getGeminiPrompt(jewelryDescription, body.placementHints) },
                      {
                        inlineData: {
                          mimeType: getImageMimeType(imageDataUrl),
                          data: getImageBase64(imageDataUrl),
                        },
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
            return new Response(JSON.stringify({ error: "Gemini image generation failed.", details: errorText }), {
              status: response.status,
              headers: { "content-type": "application/json" },
            });
          }

          const data = (await response.json()) as {
            candidates?: Array<{
              content?: {
                parts?: Array<{
                  text?: string;
                  inlineData?: {
                    data?: string;
                    mimeType?: string;
                  };
                }>;
              };
            }>;
          };

          const imagePart = data.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
          const imageData = imagePart?.inlineData?.data;

          if (!imageData) {
            return new Response(JSON.stringify({ error: "Gemini did not return an image." }), {
              status: 502,
              headers: { "content-type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ image: `data:${imagePart?.inlineData?.mimeType || "image/png"};base64,${imageData}` }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unable to generate the try-on image." }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
