import { useMemo, useState } from "react";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Product, products } from "@/lib/data";

export const Route = createFileRoute("/lumisignature/quiz")({
  component: Quiz,
});

const questions = [
  {
    label: "What does your perfect jewellery moment feel like?",
    options: [
      { label: "Soft and feminine", value: "romantic" },
      { label: "Clean and modern", value: "minimal" },
      { label: "Bold and dramatic", value: "statement" },
      { label: "Rich and timeless", value: "heritage" },
    ],
  },
  {
    label: "Which metal finish makes you stop and stare?",
    options: [
      { label: "Warm rose gold", value: "romantic" },
      { label: "Polished white gold", value: "minimal" },
      { label: "Saturated violet stones", value: "statement" },
      { label: "Antique yellow gold", value: "heritage" },
    ],
  },
  {
    label: "Pick the accessory that belongs in your dream wardrobe.",
    options: [
      { label: "Pearl drop earrings", value: "romantic" },
      { label: "Sleek signet ring", value: "minimal" },
      { label: "Layered gemstone chokers", value: "statement" },
      { label: "Emerald heirloom necklace", value: "heritage" },
    ],
  },
  {
    label: "Which event are you dressing for?",
    options: [
      { label: "A private candlelit dinner", value: "romantic" },
      { label: "A chic gallery opening", value: "minimal" },
      { label: "A red carpet reveal", value: "statement" },
      { label: "A cultural celebration", value: "heritage" },
    ],
  },
  {
    label: "How do you want your jewellery to speak?",
    options: [
      { label: "Soft confidence", value: "romantic" },
      { label: "Understated precision", value: "minimal" },
      { label: "Fearless luxury", value: "statement" },
      { label: "Timeless legacy", value: "heritage" },
    ],
  },
];

const results = {
  romantic: {
    title: "The LumiAura Romantic",
    description:
      "Your Jewellery DNA shines with delicate elegance, luminous textures, and ethereal detail.",
    categories: ["Pearl & Moonstone", "Rose Gold Classics", "Floral Statement Pieces"],
  },
  minimal: {
    title: "The LumiAura Minimalist",
    description:
      "You love precision and modern luxury — jewellery that feels effortless, refined, and forever wearable.",
    categories: ["Sleek Bands", "Architectural Hoops", "Everyday Chains"],
  },
  statement: {
    title: "The LumiAura Icon",
    description:
      "Bold, vibrant and unforgettable — your jewellery DNA is all about luxe drama and standout flair.",
    categories: ["Gemstone Showstoppers", "Stacked Rings", "Cuff & Collar Artistry"],
  },
  heritage: {
    title: "The LumiAura Timeless",
    description:
      "Classic grandeur and regal finishes define your jewellery language with a rich, premium character.",
    categories: ["Vintage-Inspired Sets", "Royal Neckpieces", "Sapphire & Diamond"],
  },
};

function Quiz() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const finished = currentIndex >= questions.length;

  const resultKey = useMemo<keyof typeof results | null>(() => {
    if (!finished) return null;

    const totals = answers.reduce<Record<string, number>>((acc, answer) => {
      acc[answer] = (acc[answer] ?? 0) + 1;
      return acc;
    }, {});

    return (Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "romantic") as keyof typeof results;
  }, [answers, finished]);

  const result = resultKey ? results[resultKey] : null;

  const themeFilters: Record<keyof typeof results, (product: Product) => boolean> = {
    romantic: (product) =>
      ["Pendants", "Necklaces", "Earrings"].includes(product.category) ||
      /Heart|Drop|Layered|Solitaire|Luna|Saanvi|Aria|Kiara|Mira|Anaya|Rhea/.test(product.name),
    minimal: (product) =>
      ["Chains", "Rings", "Bracelets", "Silver"].includes(product.category) &&
      !/Chandbali|Halo|Temple|Rani|Royal|Tennis/.test(product.name),
    statement: (product) =>
      ["Earrings", "Necklaces", "Bangles"].includes(product.category) ||
      /Halo|Chandbali|Tennis|Pave|Rani/.test(product.name),
    heritage: (product) =>
      ["Bangles", "Rings", "Necklaces"].includes(product.category) ||
      /Temple|Royal|Rani|Kanika|Tara|Devi|Noor|Meher|Elara/.test(product.name),
  };

  const resultProducts = useMemo(() => {
    if (!resultKey) return [];
    const matched = products.filter(themeFilters[resultKey]);
    return matched.length >= 4 ? matched.slice(0, 4) : products.slice(0, 4);
  }, [resultKey]);

  const handleSelect = (value: string) => {
    setAnswers((prev) => [...prev, value]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setAnswers([]);
    setCurrentIndex(0);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-100 to-purple-100 px-4 py-8">
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Go back"
        className="absolute left-4 top-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/70 text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.1)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/80"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="mx-auto w-full max-w-3xl rounded-[32px] border border-white/60 bg-white/90 p-8 shadow-2xl shadow-purple-200/30 backdrop-blur-xl">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-full bg-purple-100/80 px-4 py-2 text-sm font-semibold text-purple-800 shadow-sm shadow-purple-100">
              <span>{finished ? "Quiz complete" : `Question ${currentIndex + 1} of ${questions.length}`}</span>
              <span>{finished ? `${answers.length}/${questions.length}` : `${currentIndex + 1}/${questions.length}`}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-purple-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-500 transition-all duration-500"
                style={{ width: `${Math.min(((currentIndex + 1) / questions.length) * 100, 100)}%` }}
              />
            </div>
          </div>

          {!finished ? (
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-fuchsia-600">LumiSignature Quiz</p>
                <h1 className="mt-3 text-3xl font-bold text-purple-900 sm:text-4xl">
                  {questions[currentIndex].label}
                </h1>
                <p className="mt-3 text-purple-600">Tap the option that feels most like your Jewellery DNA.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {questions[currentIndex].options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="rounded-3xl border border-purple-200 bg-white/95 px-5 py-5 text-left text-purple-900 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-fuchsia-300 hover:bg-purple-50"
                  >
                    <span className="block text-lg font-semibold">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-purple-950 via-fuchsia-900 to-pink-700 px-10 py-12 text-white shadow-[0_40px_120px_rgba(128,90,213,0.18)]">
                <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
                  <span className="h-32 w-72 rounded-full bg-amber-300/20 blur-3xl" />
                </div>
                <div className="relative flex flex-col gap-6">
                  <div className="max-w-2xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-pink-200/80">✨ Your LumiSignature</p>
                    <div className="relative mt-4 inline-flex items-center">
                      <span className="absolute inset-0 -z-10 rounded-full bg-amber-300/10 blur-3xl" />
                      <h2 className="relative text-5xl font-black tracking-tight text-white sm:text-6xl">
                        {result?.title}
                      </h2>
                    </div>
                    <p className="mt-6 max-w-2xl text-base leading-8 text-purple-100/85 sm:text-lg">
                      Your choices reveal a timeless appreciation for refined craftsmanship and understated luxury. These handpicked pieces reflect your signature elegance.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-white/20 backdrop-blur-xl">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-base">✨</span>
                    <span>98% Style Match</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {[
                      { icon: "💎", label: "Timeless" },
                      { icon: "✨", label: "Elegant" },
                      { icon: "👑", label: "Heritage" },
                      { icon: "🌙", label: "Sophisticated" },
                    ].map((trait) => (
                      <span
                        key={trait.label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-white shadow-sm shadow-black/10"
                      >
                        <span>{trait.icon}</span>
                        {trait.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-purple-200/80 bg-white/95 p-6 shadow-lg shadow-purple-100/60">
                <div className="mb-5">
                  <h3 className="text-2xl font-semibold text-purple-900">Curated Exclusively For You</h3>
                  <p className="mt-2 text-sm text-purple-600">Jewellery selected to match your unique LumiSignature.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {resultProducts.map((product) => (
                    <div key={product.id} className="space-y-3">
                      <ProductCard product={product} />
                      <Link
                        to="/product/$id"
                        params={{ id: product.id }}
                        className="inline-flex w-full items-center justify-center rounded-full border border-purple-300 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-900 transition hover:bg-purple-100"
                      >
                        View Product
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Link
                    to="/categories"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(251,191,36,0.25)] transition hover:brightness-110"
                  >
                    Explore My Collection →
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-3xl bg-purple-100/80 p-4 text-sm text-purple-900">
                  <p className="font-semibold">Next step</p>
                  <p className="mt-1 text-purple-700/90">
                    Use these categories to explore your perfect LumiSignature picks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-700 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:scale-[1.01]"
                >
                  Restart Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
