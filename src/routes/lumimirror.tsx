import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import pNecklace from "@/assets/p-necklace.jpg";
import { JewelleryOverlay } from "@/components/lumimirror/JewelleryOverlay";
import { Button } from "@/components/ui/button";
import { deriveFacePlacement, getFacePlacementFromImage } from "@/lib/lumimirror-overlay";
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
  const [uploadedName, setUploadedName] = useState("Your selfie");
  const [activeInput, setActiveInput] = useState<"selfie" | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionOption>("Office");
  const [overlayPlacement, setOverlayPlacement] = useState<{
    neckWidth: number;
    anchorX: number;
    anchorY: number;
    faceHeight: number;
    chinY: number;
    neckLength: number;
    visibleNeck: boolean;
    message?: string;
  } | null>(null);

  const necklaceOverlay = useMemo(() => pNecklace, []);
  const recommendation = useMemo(() => getRecommendation({ occasion: selectedOccasion }), [selectedOccasion]);

  const handleFileUpload = (file?: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result as string;
      setPreviewImage(imageData);
      setUploadedName(file.name);
      setStep("result");

      const placement = await getFacePlacementFromImage(imageData);
      if (placement) {
        setOverlayPlacement(placement);
      }
    };
    reader.readAsDataURL(file);
  };

  const openSelfiePicker = () => {
    setActiveInput("selfie");
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  useEffect(() => {
    if (!previewImage) {
      return;
    }

    let cancelled = false;
    getFacePlacementFromImage(previewImage).then((placement) => {
      if (!cancelled && placement) {
        setOverlayPlacement(placement);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [previewImage]);

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
                <Button variant="outline" onClick={() => setStep("capture")} className="rounded-full">
                  Change photo
                </Button>
              </div>

              <div className="mt-4">
                {previewImage ? (
                  <JewelleryOverlay
                    src={previewImage}
                    alt="Try-on preview"
                    overlaySrc={necklaceOverlay}
                    className="h-[420px] w-full"
                    overlayStyle={{
                      objectFit: "contain",
                    }}
                    placement={overlayPlacement}
                  />
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
