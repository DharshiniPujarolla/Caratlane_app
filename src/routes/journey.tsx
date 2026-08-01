import { createFileRoute } from "@tanstack/react-router";
import Journey from "@/components/Journey";

export const Route = createFileRoute("/journey")({
  component: Journey,
});