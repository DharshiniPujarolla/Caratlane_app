import { createFileRoute, Link } from "@tanstack/react-router";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { ArrowLeft, LoaderCircle, Sparkles, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { getRecommendation } from "@/lib/lumimirror-recommend";

const occasionOptions = ["Office", "Casual", "Traditional", "Wedding"] as const;
type OccasionOption = (typeof occasionOptions)[number];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = src;
  });
}

function getOverlayPlacement(category: string, width: number, height: number) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("ear")) {
    return {
      x: width * 0.16,
      y: height * 0.28,
      scale: 0.2,
    };
  }

  if (normalizedCategory.includes("ring")) {
    return {
      x: width * 0.42,
      y: height * 0.72,
      scale: 0.2,
    };
  }

  if (normalizedCategory.includes("bracelet")) {
    return {
      x: width * 0.18,
      y: height * 0.76,
      scale: 0.3,
    };
  }

  return {
    x: width * 0.16,
    y: height * 0.64,
    scale: 0.5,
  };
}

function getOverlaySupport(category: string) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("ring") || normalizedCategory.includes("bangle") || normalizedCategory.includes("bracelet")) {
    return {
      supported: false as const,
      message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
    };
  }

  if (normalizedCategory.includes("ear")) {
    return { supported: true as const, requires: "ear" as const };
  }

  if (normalizedCategory.includes("neck") || normalizedCategory.includes("pendant")) {
    return { supported: true as const, requires: "neck" as const };
  }

  return { supported: true as const, requires: "neck" as const };
}

let faceLandmarkerPromise: Promise<FaceLandmarker> | null = null;

async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (faceLandmarkerPromise) {
    return faceLandmarkerPromise;
  }

  faceLandmarkerPromise = (async () => {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
    );

    return FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
  })();

  return faceLandmarkerPromise;
}

async function detectLandmarksForOverlay(src: string, category: string) {
  const support = getOverlaySupport(category);
  if (!support.supported) {
    return {
      supported: false as const,
      message: support.message,
    };
  }

  if (typeof window === "undefined") {
    return {
      supported: false as const,
      message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
    };
  }

  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    return {
      supported: false as const,
      message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
    };
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const landmarker = await getFaceLandmarker();
  const result = await landmarker.detect(canvas);
  const landmarks = result.faceLandmarks?.[0] ?? null;

  if (!landmarks) {
    return {
      supported: false as const,
      message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
    };
  }

  const leftJaw = landmarks[172];
  const rightJaw = landmarks[397];
  const chin = landmarks[152];
  const leftEar = landmarks[454];
  const rightEar = landmarks[234];

  if (support.requires === "ear") {
    if (!leftEar || !rightEar) {
      return {
        supported: false as const,
        message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
      };
    }

    return {
      supported: true as const,
      placement: {
        x: (leftEar.x + rightEar.x) / 2,
        y: (leftEar.y + rightEar.y) / 2,
      },
    };
  }

  if (!leftJaw || !rightJaw || !chin) {
    return {
      supported: false as const,
      message: "We couldn't detect the right area for this piece — try a clearer photo, or explore this item on the product page instead.",
    };
  }

  return {
    supported: true as const,
    placement: {
      x: (leftJaw.x + rightJaw.x) / 2,
      y: chin.y,
    },
  };
}

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
        const baseImage = await loadImage(previewImage);
        const overlayImage = await loadImage(recommendation.jewel.image);

        const sourceWidth = baseImage.naturalWidth || baseImage.width || 1080;
        const sourceHeight = baseImage.naturalHeight || baseImage.height || 1350;

        const detection = await detectLandmarksForOverlay(previewImage, recommendation.jewel.category);
        if (!detection.supported) {
          if (!cancelled) {
            setGeneratedImage(null);
            setOverlayMessage(detection.message);
          }
          return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = sourceWidth;
        canvas.height = sourceHeight;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas is not supported in this browser.");
        }

        context.drawImage(baseImage, 0, 0, sourceWidth, sourceHeight);

        const placement = getOverlayPlacement(recommendation.jewel.category, sourceWidth, sourceHeight);
        const landmarkPlacement = detection.placement ?? { x: 0.5, y: 0.5 };
        const overlayWidth = sourceWidth * placement.scale;
        const overlayHeight = ((overlayImage.naturalHeight || overlayImage.height) / (overlayImage.naturalWidth || overlayImage.width || 1)) * overlayWidth;
        const x = Math.max(0, Math.min(sourceWidth - overlayWidth, landmarkPlacement.x * sourceWidth - overlayWidth / 2));
        const y = Math.max(0, Math.min(sourceHeight - overlayHeight, landmarkPlacement.y * sourceHeight - overlayHeight / 2));

        context.drawImage(overlayImage, x, y, overlayWidth, overlayHeight);

        if (!cancelled) {
          setGeneratedImage(canvas.toDataURL("image/png"));
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
