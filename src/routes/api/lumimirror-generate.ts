import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/lumimirror-generate")({
  server: {
    handlers: {
      POST: async () => {
        return new Response(JSON.stringify({ error: "This demo uses a local canvas overlay instead of an external API." }), {
          status: 410,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
