import ring from "@/assets/p-ring.jpg";
import earrings from "@/assets/p-earrings.jpg";
import pendant from "@/assets/p-pendant.jpg";
import bracelet from "@/assets/p-bracelet.jpg";
import necklace from "@/assets/p-necklace.jpg";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

export const images = { ring, earrings, pendant, bracelet, necklace, hero1, hero2, hero3 };

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  metal: "Yellow Gold" | "Rose Gold" | "White Gold" | "Platinum";
  purity: "14 KT" | "18 KT" | "22 KT";
  material: "Gold" | "Diamond" | "Gemstone" | "Platinum";
  diamondType: "Natural" | "Lab Grown" | "None";
  gender: "Women" | "Men" | "Unisex";
  occasion: string[];
  tags: string[];
  weight: string;
  description: string;
};

export const categories = [
  { slug: "rings", name: "Rings", image: ring },
  { slug: "earrings", name: "Earrings", image: earrings },
  { slug: "pendants", name: "Pendants", image: pendant },
  { slug: "necklaces", name: "Necklaces", image: necklace },
  { slug: "bracelets", name: "Bracelets", image: bracelet },
  { slug: "bangles", name: "Bangles", image: hero2 },
  { slug: "chains", name: "Chains", image: necklace },
  { slug: "gold", name: "Gold Jewellery", image: hero2 },
  { slug: "diamond", name: "Diamond Jewellery", image: hero1 },
];

const catImage: Record<string, string> = {
  Rings: ring,
  Earrings: earrings,
  Pendants: pendant,
  Necklaces: necklace,
  Bracelets: bracelet,
  Bangles: hero2,
  Chains: necklace,
};

const names: Record<string, string[]> = {
  Rings: [
    "Aurelia Solitaire Ring",
    "Meher Twist Diamond Ring",
    "Isabel Halo Ring",
    "Vaani Everyday Band",
    "Noor Pear Cluster Ring",
    "Elara Eternity Band",
  ],
  Earrings: [
    "Saanvi Drop Earrings",
    "Luna Stud Earrings",
    "Amara Hoop Earrings",
    "Riya Chandbali Earrings",
    "Selene Diamond Studs",
  ],
  Pendants: [
    "Aria Solitaire Pendant",
    "Kiara Heart Pendant",
    "Zoya Initial Pendant",
    "Mira Halo Pendant",
  ],
  Necklaces: [
    "Anaya Layered Necklace",
    "Rhea Tennis Necklace",
    "Devi Temple Necklace",
    "Ivy Choker Necklace",
  ],
  Bracelets: ["Nyla Tennis Bracelet", "Sana Charm Bracelet", "Ophelia Chain Bracelet"],
  Bangles: ["Rani Diamond Bangle", "Kanika Gold Bangle", "Tara Pave Bangle"],
  Chains: ["Aurum Rope Chain", "Kai Cuban Chain", "Nova Box Chain"],
};

const metals: Product["metal"][] = ["Yellow Gold", "Rose Gold", "White Gold", "Platinum"];
const occasions = ["Daily Wear", "Wedding", "Gifting", "Office Wear", "Festive"];

function seeded(n: number) {
  const x = Math.sin(n * 9973) * 10000;
  return x - Math.floor(x);
}

export const products: Product[] = Object.entries(names).flatMap(([category, list]) =>
  list.map((name, i) => {
    const seed = category.length * 13 + i * 7;
    const r = seeded(seed);
    const price = Math.round((12000 + r * 180000) / 100) * 100;
    const mrp = Math.round((price * (1.1 + seeded(seed + 1) * 0.35)) / 100) * 100;
    const isDiamond = seeded(seed + 2) > 0.35;
    const img = catImage[category];
    return {
      id: `${category.toLowerCase()}-${i + 1}`,
      name,
      category,
      price,
      mrp,
      rating: Math.round((4 + seeded(seed + 3)) * 10) / 10,
      reviews: 20 + Math.floor(seeded(seed + 4) * 480),
      image: img,
      gallery: [img, hero1, hero3, hero2],
      metal: metals[Math.floor(seeded(seed + 5) * metals.length)],
      purity: (["14 KT", "18 KT", "22 KT"] as const)[Math.floor(seeded(seed + 6) * 3)],
      material: isDiamond ? "Diamond" : "Gold",
      diamondType: isDiamond ? (seeded(seed + 7) > 0.5 ? "Natural" : "Lab Grown") : "None",
      gender: seeded(seed + 8) > 0.85 ? "Men" : "Women",
      occasion: [
        occasions[Math.floor(seeded(seed + 9) * occasions.length)],
        occasions[Math.floor(seeded(seed + 10) * occasions.length)],
      ],
      tags: [
        seeded(seed + 11) > 0.5 ? "New Arrival" : "Best Seller",
        seeded(seed + 12) > 0.6 ? "Trending" : "Daily Wear",
      ],
      weight: `${(1.4 + seeded(seed + 13) * 6).toFixed(2)} g`,
      description:
        "Hand-finished in responsibly sourced metal and set with brilliantly cut stones, this piece is designed for everyday luxury — light on the skin, unmistakable in presence.",
    } satisfies Product;
  }),
);

export const discount = (p: Product) => Math.round(((p.mrp - p.price) / p.mrp) * 100);

export const inr = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const banners = [
  {
    id: "b1",
    image: hero1,
    title: "The Everyday Diamond Edit",
    subtitle: "Flat 25% off on making charges",
    cta: "Explore Now",
    to: "/category/diamond",
  },
  {
    id: "b2",
    image: hero2,
    title: "Golden Hour Bangles",
    subtitle: "Zero making charges this week",
    cta: "Shop Gold",
    to: "/category/gold",
  },
  {
    id: "b3",
    image: hero3,
    title: "The Wedding Vault",
    subtitle: "Bridal sets crafted to be inherited",
    cta: "View Collection",
    to: "/category/rings",
  },
];

export const collections = [
  { id: "c1", name: "Trending Now", image: hero1, count: 128 },
  { id: "c2", name: "Office Elegance", image: earrings, count: 64 },
  { id: "c3", name: "Bridal Vault", image: hero3, count: 92 },
  { id: "c4", name: "Minimal Everyday", image: pendant, count: 210 },
];

export const priceBuckets = [
  { label: "Under ₹25K", max: 25000 },
  { label: "₹25K – ₹50K", max: 50000 },
  { label: "₹50K – ₹1L", max: 100000 },
  { label: "Above ₹1L", max: 9999999 },
];

export const occasionsList = [
  { name: "Daily Wear", image: pendant },
  { name: "Wedding", image: hero3 },
  { name: "Gifting", image: hero1 },
  { name: "Office Wear", image: earrings },
  { name: "Festive", image: hero2 },
];

export const offers = [
  { code: "LUXE25", title: "25% off making charges", desc: "On all diamond jewellery" },
  { code: "FIRST500", title: "Flat ₹500 off", desc: "On your first order above ₹9,999" },
  { code: "GOLDZERO", title: "Zero making charges", desc: "On 22KT gold coins & bangles" },
];

export const reviewsData = [
  {
    id: "r1",
    name: "Ananya Sharma",
    rating: 5,
    date: "12 Jun 2026",
    title: "Better than the photos",
    body: "The finish is flawless and it arrived in beautiful packaging. Wearing it daily to work.",
  },
  {
    id: "r2",
    name: "Meera Iyer",
    rating: 4,
    date: "02 Jun 2026",
    title: "Elegant and light",
    body: "Very comfortable for everyday wear. Sizing was accurate, delivery was quick.",
  },
  {
    id: "r3",
    name: "Ritika Bose",
    rating: 5,
    date: "24 May 2026",
    title: "Gifted to my sister",
    body: "She loved it. The certificate and hallmark details gave a lot of confidence.",
  },
];

export const stores = [
  {
    id: "s1",
    name: "Luméa — Indiranagar",
    address: "100 Ft Road, Indiranagar, Bengaluru 560038",
    distance: "1.4 km",
    timing: "11:00 AM – 9:00 PM",
    phone: "+91 80 4567 1200",
  },
  {
    id: "s2",
    name: "Luméa — Koramangala",
    address: "80 Ft Road, 4th Block, Koramangala, Bengaluru 560034",
    distance: "4.8 km",
    timing: "11:00 AM – 9:30 PM",
    phone: "+91 80 4567 1300",
  },
  {
    id: "s3",
    name: "Luméa — Phoenix Mall",
    address: "Whitefield Road, Mahadevapura, Bengaluru 560048",
    distance: "9.2 km",
    timing: "10:30 AM – 10:00 PM",
    phone: "+91 80 4567 1400",
  },
];

export const ordersData = [
  {
    id: "LM-90241",
    status: "Active" as const,
    stage: 2,
    placed: "26 Jul 2026",
    eta: "02 Aug 2026",
    items: [products[0], products[6]],
  },
  {
    id: "LM-88117",
    status: "Completed" as const,
    stage: 4,
    placed: "18 Jun 2026",
    eta: "Delivered 23 Jun 2026",
    items: [products[10]],
  },
  {
    id: "LM-86002",
    status: "Cancelled" as const,
    stage: 0,
    placed: "04 May 2026",
    eta: "Refunded",
    items: [products[14]],
  },
];

export const trendingSearches = [
  "Diamond studs",
  "Gold chain for men",
  "Solitaire ring",
  "Bridal necklace set",
  "Rose gold bracelet",
  "Mangalsutra",
];

export const byCategory = (slug: string) => {
  if (slug === "gold") return products.filter((p) => p.material === "Gold");
  if (slug === "diamond") return products.filter((p) => p.material === "Diamond");
  const name = categories.find((c) => c.slug === slug)?.name ?? "";
  return products.filter((p) => p.category === name);
};

export const findProduct = (id: string) => products.find((p) => p.id === id);
