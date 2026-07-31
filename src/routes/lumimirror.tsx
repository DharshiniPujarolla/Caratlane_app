import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Sparkles, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import pNecklace from "@/assets/p-necklace.jpg";
import { JewelleryOverlay } from "@/components/lumimirror/JewelleryOverlay";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import officeOutfit from "@/assets/lumimirror/outfits/office.svg";
import casualOutfit from "@/assets/lumimirror/outfits/casual.svg";
import traditionalOutfit from "@/assets/lumimirror/outfits/traditional.svg";
import weddingOutfit from "@/assets/lumimirror/outfits/wedding.svg";
import partyOutfit from "@/assets/lumimirror/outfits/party.svg";

const outfitPresets = [
  { id: "office", label: "Office", src: officeOutfit },
  { id: "casual", label: "Casual", src: casualOutfit },
  { id: "traditional", label: "Traditional", src: traditionalOutfit },
  { id: "wedding", label: "Wedding", src: weddingOutfit },
  { id: "party", label: "Party", src: partyOutfit },
] as const;

type OutfitOption = {
  id: string;
  label: string;
  src: string;
};

export const Route = createFileRoute("/lumimirror")({
  head: () => ({
    meta: [
      { title: "LumiMirror — Try on jewellery" },
      {
        name: "description",
        content: "Try on jewellery with camera, upload, and outfit presets in LumiMirror.",
      },
    ],
  }),
  component: LumiMirrorPage,
});

function LumiMirrorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"capture" | "result">("capture");
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitOption>(outfitPresets[0]);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState("Your selfie");
  const [activeInput, setActiveInput] = useState<"selfie" | "outfit" | null>(null);
  const [captureMode, setCaptureMode] = useState<"environment" | "user" | undefined>("environment");

  const necklaceOverlay = useMemo(() => pNecklace, []);

  const handleFileUpload = (file?: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      if (activeInput === "outfit") {
        setSelectedOutfit({ id: "custom", label: "Custom outfit", src: imageData });
        return;
      }

      setSourceImage(imageData);
      setPreviewImage(imageData);
      setUploadedName(file.name);
      setStep("result");
    };
    reader.readAsDataURL(file);
  };

  const openSelfiePicker = () => {
    setActiveInput("selfie");
    setCaptureMode("user");
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const openCameraFlow = () => {
    setActiveInput("selfie");
    setCaptureMode("environment");
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const openOutfitPicker = () => {
    setActiveInput("outfit");
    setCaptureMode(undefined);
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleTryOn = () => {
    setPreviewImage(selectedOutfit.src);
    setSourceImage(selectedOutfit.src);
    setStep("result");
  };

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
          capture={captureMode}
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
                Use your camera or upload a selfie to preview your jewellery with a fresh look.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button onClick={openCameraFlow} className="rounded-full">
                  <Camera size={16} className="mr-2" />
                  Open Camera
                </Button>
                <Button variant="outline" onClick={openSelfiePicker} className="rounded-full">
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
                      transform: "translateY(6px) scale(0.84)",
                    }}
                  />
                ) : (
                  <div className="flex h-[420px] items-center justify-center rounded-[1.5rem] bg-muted text-sm text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Outfit styling
                  </p>
                  <h3 className="text-lg font-semibold">View with Different Outfits</h3>
                </div>
                <Button variant="outline" onClick={openOutfitPicker} className="rounded-full">
                  <Upload size={16} className="mr-2" />
                  Upload Outfit
                </Button>
              </div>

              <div className="mt-4">
                <Carousel opts={{ align: "start", containScroll: "trimSnaps" }} className="w-full">
                  <CarouselContent className="-ml-3">
                    {outfitPresets.map((outfit) => (
                      <CarouselItem key={outfit.id} className="pl-3 basis-[48%] sm:basis-[31%]">
                        <button
                          type="button"
                          onClick={() => setSelectedOutfit(outfit)}
                          className={`w-full rounded-[1.25rem] border p-2 text-left transition-all ${
                            selectedOutfit.id === outfit.id
                              ? "border-primary bg-primary/8"
                              : "border-border bg-background"
                          }`}
                        >
                          <img
                            src={outfit.src}
                            alt={outfit.label}
                            className="h-24 w-full rounded-[1rem] object-cover"
                          />
                          <p className="mt-2 text-sm font-semibold">{outfit.label}</p>
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="right-0 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>

              <div className="mt-4">
                <JewelleryOverlay
                  src={selectedOutfit.src}
                  alt={`${selectedOutfit.label} outfit preview`}
                  overlaySrc={necklaceOverlay}
                  className="h-[320px] w-full"
                  overlayStyle={{
                    objectFit: "contain",
                    transform: "translateY(4px) scale(0.8)",
                  }}
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
