export const weeklyMission = {
  id: "minimal-monday",
  theme: "Minimal Monday",
  title: "This Week's Style Mission",
  description:
    "Style a clean, understated look where one delicate piece does all the talking. Less metal, more moment.",
  xp: 200,
  badge: "Minimal Muse",
  endsInDays: 5,
  completedCount: 0,
  totalCount: 1,
};

export const outfitOptions = [
  "Kurti",
  "Saree",
  "Blazer",
  "White Shirt",
  "Casual",
  "Black Dress",
];

export const occasionOptions = ["Office", "Wedding", "College", "Party", "Festival"];

export type StyleReport = {
  elegance: number;
  balance: number;
  colorHarmony: number;
  trendMatch: number;
  overall: number;
  identity: string;
  summary: string;
};

const identities = [
  "Modern Minimalist",
  "Regal Romantic",
  "Quiet Luxe",
  "Festive Maximalist",
  "Everyday Icon",
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100000;
  return h;
}

const clamp = (n: number) => Math.max(62, Math.min(99, n));

export function generateStyleReport(input: {
  outfit: string;
  occasion: string;
  jewelleryIds: string[];
  note?: string;
}): StyleReport {
  const seed = hash(`${input.outfit}|${input.occasion}|${input.jewelleryIds.join(",")}`);
  const count = input.jewelleryIds.length;
  const minimalBonus = count <= 2 ? 8 : count >= 5 ? -6 : 0;

  const elegance = clamp(74 + (seed % 17) + minimalBonus);
  const balance = clamp(72 + ((seed >> 3) % 19) + minimalBonus);
  const colorHarmony = clamp(70 + ((seed >> 5) % 24));
  const trendMatch = clamp(71 + ((seed >> 7) % 22) + (input.note ? 3 : 0));
  const overall = Math.round((elegance + balance + colorHarmony + trendMatch) / 4);

  return {
    elegance,
    balance,
    colorHarmony,
    trendMatch,
    overall,
    identity: identities[seed % identities.length],
    summary: `Your ${input.outfit.toLowerCase()} styled for ${input.occasion.toLowerCase()} reads polished and intentional — the ${
      count <= 2 ? "restraint" : "layering"
    } is what makes it memorable.`,
  };
}

export type Inspiration = {
  id: string;
  title: string;
  occasion: string;
  jewellery: string;
  score: number;
  stylist: string;
  hearts: number;
};

export const inspirations: Inspiration[] = [
  {
    id: "i1",
    title: "Ivory Linen & Solitaire",
    occasion: "Office",
    jewellery: "Solitaire studs · Fine chain",
    score: 94,
    stylist: "Ananya R.",
    hearts: 248,
  },
  {
    id: "i2",
    title: "Midnight Silk Drape",
    occasion: "Party",
    jewellery: "Drop earrings · Tennis bracelet",
    score: 91,
    stylist: "Meher K.",
    hearts: 203,
  },
  {
    id: "i3",
    title: "Handloom Kurti Story",
    occasion: "College",
    jewellery: "Gold hoops",
    score: 89,
    stylist: "Ira S.",
    hearts: 176,
  },
  {
    id: "i4",
    title: "Banarasi Heirloom",
    occasion: "Wedding",
    jewellery: "Polki necklace · Jhumkas",
    score: 96,
    stylist: "Ridhi M.",
    hearts: 311,
  },
  {
    id: "i5",
    title: "Marigold Festive Glow",
    occasion: "Festival",
    jewellery: "Layered chains · Pendant",
    score: 88,
    stylist: "Saanvi P.",
    hearts: 142,
  },
  {
    id: "i6",
    title: "Crisp Shirt, Quiet Gold",
    occasion: "Office",
    jewellery: "Huggie hoops",
    score: 92,
    stylist: "Naina D.",
    hearts: 198,
  },
];

export const leaderboard = [
  { rank: 1, name: "Ridhi M.", title: "Top Stylist", score: 96, votes: 311 },
  { rank: 2, name: "Ananya R.", title: "Community Favourite", score: 94, votes: 288 },
  { rank: 3, name: "Naina D.", title: "Rising Muse", score: 92, votes: 214 },
  { rank: 4, name: "Meher K.", title: "Trend Setter", score: 91, votes: 203 },
  { rank: 5, name: "Ira S.", title: "Minimal Muse", score: 89, votes: 176 },
];
