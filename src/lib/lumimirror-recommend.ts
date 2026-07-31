import { products, type Product } from "@/lib/data";

export type RecommendationOutcome = {
  jewel: Product;
  outfitSuggestion: string;
  whyThis: string;
};

const occasionMap: Record<string, string[]> = {
  Office: ["Office Wear", "Daily Wear"],
  Casual: ["Daily Wear", "Gifting"],
  Traditional: ["Festive", "Wedding"],
  Wedding: ["Wedding", "Festive"],
};

const outfitSuggestions: Record<string, string> = {
  Office: "Pair with a fitted black blazer and minimal makeup.",
  Casual: "Pair with a relaxed tee, straight jeans, and soft curls.",
  Traditional: "Pair with a silk saree or lehenga with classic earrings and a neat bun.",
  Wedding: "Pair with a statement lehenga or gown and a polished bridal glow.",
};

export function getRecommendation(input: { occasion: string }): RecommendationOutcome {
  const normalizedOccasion = input.occasion.trim();
  const matchedTags = occasionMap[normalizedOccasion] ?? [normalizedOccasion, "Daily Wear"];

  const bestProduct = products
    .map((product) => {
      const occasionMatch = matchedTags.some((tag) =>
        product.occasion.some((occasion) => occasion.toLowerCase() === tag.toLowerCase()),
      );
      const tagMatch = product.tags.some((tag) =>
        matchedTags.some((match) => tag.toLowerCase().includes(match.toLowerCase())),
      );
      const score = (occasionMatch ? 60 : 0) + (tagMatch ? 20 : 0) + (product.rating > 4.5 ? 10 : 0);
      return { product, score };
    })
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .at(0)?.product ?? products[0];

  const outfitSuggestion = outfitSuggestions[normalizedOccasion] ?? outfitSuggestions.Casual;
  const reasons = [bestProduct.occasion[0], bestProduct.metal, bestProduct.category].join(" · ");

  return {
    jewel: bestProduct,
    outfitSuggestion,
    whyThis: `Why this? It aligns with ${reasons} and fits your selected ${normalizedOccasion.toLowerCase()} look.`,
  };
}
