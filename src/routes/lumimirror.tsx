import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, LoaderCircle, Sparkles, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { detectNecklacePlacementForImage } from "@/lib/necklace-placement";
import { getRecommendation } from "@/lib/lumimirror-recommend";

const occasionOptions = ["Office", "Casual", "Traditional", "Wedding"] as const;
type OccasionOption = (typeof occasionOptions)[number];


export const Route = createFileRoute("/lumimirror")({
  head: () => ({
    meta: [
      { title: "LumiMirror — Try on jewellery" },
      {
        name: "description",
        content: "Try on jewellery with upload and outfit presets in LumiMirror.",
      },
    ],
  }),
  component: LumiMirrorPage,
});

function LumiMirrorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"capture" | "result">("capture");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedImageError, setGeneratedImageError] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState("Your selfie");
  const [activeInput, setActiveInput] = useState<"selfie" | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionOption>("Office");

  const recommendation = useMemo(() => getRecommendation({ occasion: selectedOccasion }), [selectedOccasion]);

  const handleFileUpload = (file?: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setPreviewImage(imageData);
      setGeneratedImage(null);
      setGeneratedImageError(null);
      setOverlayMessage(null);
      setIsGeneratingImage(false);
      setUploadedName(file.name);
      setStep("result");
    };
    reader.readAsDataURL(file);
  };

  const openSelfiePicker = () => {
    setActiveInput("selfie");
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  useEffect(() => {
    if (step !== "result" || !previewImage) {
      return;
    }

    let cancelled = false;

    const generateTryOn = async () => {
      setIsGeneratingImage(true);
      setGeneratedImageError(null);
      setOverlayMessage(null);

      try {
        const placementHints = await detectNecklacePlacementForImage(previewImage, recommendation.jewel.category);

        const response = await fetch("/api/lumimirror-generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            imageDataUrl: previewImage,
            jewelryDescription: `${recommendation.jewel.name} — ${recommendation.jewel.category}. ${recommendation.jewel.description ?? ""}`.trim(),
            placementHints,
          }),
        });

        const payload = (await response.json().catch(() => ({ error: "Unable to create the try-on preview." }))) as {
          image?: string;
          error?: string;
          details?: string;
        };

        if (!response.ok || !payload.image) {
          throw new Error(payload.error || payload.details || "Unable to create the try-on preview.");
        }

        if (!cancelled) {
          setGeneratedImage(payload.image);
          setOverlayMessage(null);
        }
      } catch (error) {
        if (!cancelled) {
          const fallbackMessage =
            error instanceof Error ? error.message : "Unable to create the demo try-on preview.";
          setGeneratedImageError(fallbackMessage);
          setOverlayMessage(fallbackMessage);
          setGeneratedImage(null);
        }
      } finally {
        if (!cancelled) {
          setIsGeneratingImage(false);
        }
      }
    };

    void generateTryOn();

    return () => {
      cancelled = true;
    };
  }, [previewImage, recommendation.jewel.category, recommendation.jewel.image, step]);

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary px-4 pb-6 pt-5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Link to="/" className="press rounded-full bg-white/10 p-2">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-primary-foreground/70">
              LumiMirror
            </p>
            <h1 className="text-xl font-semibold">Try on jewellery</h1>
          </div>
        </div>
      </div>

      <div className="-mt-4 rounded-t-[1.75rem] bg-background px-4 pb-10 pt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFileUpload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {step === "capture" ? (
          <div className="space-y-4">
            <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <p className="text-sm font-semibold">Start with a photo</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a selfie to preview your jewellery with a fresh look.
              </p>
              <div className="mt-4">
                <Button onClick={openSelfiePicker} className="rounded-full">
                  <Upload size={16} className="mr-2" />
                  Upload Selfie
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-5">
            <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Preview
                  </p>
                  <h2 className="text-lg font-semibold">{uploadedName}</h2>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("capture");
                    setPreviewImage(null);
                    setGeneratedImage(null);
                    setGeneratedImageError(null);
                    setOverlayMessage(null);
                    setIsGeneratingImage(false);
                  }}
                  className="rounded-full"
                >
                  Change photo
                </Button>
              </div>

              <div className="mt-4">
                {isGeneratingImage ? (
                  <div className="flex h-[420px] flex-col items-center justify-center rounded-[1.5rem] bg-muted text-center text-sm text-muted-foreground">
                    <LoaderCircle size={28} className="mb-3 animate-spin text-primary" />
                    <p className="font-medium text-foreground">Preparing your demo try-on preview…</p>
                    <p className="mt-1">This uses a simple local overlay to place the jewellery on your selfie.</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated try-on preview"
                    className="h-[420px] w-full rounded-[1.5rem] object-contain"
                  />
                ) : previewImage ? (
                  <div className="space-y-3">
                    <img
                      src={previewImage}
                      alt="Try-on preview"
                      className="h-[420px] w-full rounded-[1.5rem] object-cover"
                    />
                    {(overlayMessage || generatedImageError) ? (
                      <div className="rounded-[1.25rem] border border-dashed border-border bg-muted/70 p-3 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Try-on preview unavailable</p>
                        <p className="mt-1">{overlayMessage ?? generatedImageError}</p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex h-[420px] items-center justify-center rounded-[1.5rem] bg-muted text-sm text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-soft">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  Recommended for you
                </p>
                <h3 className="text-lg font-semibold">Style picks for your moment</h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {occasionOptions.map((occasion) => (
                  <button
                    key={occasion}
                    type="button"
                    onClick={() => setSelectedOccasion(occasion)}
                    className={`rounded-full border px-3 py-2 text-sm transition-all ${
                      selectedOccasion === occasion
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {occasion}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[1.25rem] border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={recommendation.jewel.image}
                    alt={recommendation.jewel.name}
                    className="h-20 w-20 rounded-[1rem] object-cover"
                  />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Best match
                    </p>
                    <h4 className="text-base font-semibold">{recommendation.jewel.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.jewel.category} · {recommendation.jewel.metal}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">{recommendation.whyThis}</p>
                  <div className="rounded-[1rem] bg-muted p-3 text-sm text-foreground">
                    <p className="font-semibold">Style note</p>
                    <p className="mt-1">{recommendation.outfitSuggestion}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
