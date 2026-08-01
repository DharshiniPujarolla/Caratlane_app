# LumiAura — Premium Jewelry Shopping App

A premium luxury jewelry e-commerce mobile application inspired by the CaratLane experience, built with a modern design language, smooth micro-interactions, AI-powered styling, and a real-time **Virtual Try-On** experience.

**Live App:** [gem-muse-app.lovable.app](https://gem-muse-app.lovable.app)

---

## ✨ Highlights

- **LumiMirror (Virtual Try-On)** — Real-time AI-powered try-on for necklaces and earrings using face detection, letting users see jewelry on themselves live via camera before purchasing.
- **LumiSignature (Jewellery DNA)** — An AI styling experience that curates a personalized jewelry collection based on the user's signature style.
- **Style Missions** — Weekly gamified style challenges (e.g. "Minimal Monday") with XP rewards and badges to drive engagement.
- **Modern Luxury UI** — Minimalistic, elegant design with a purple accent palette, soft shadows, rounded cards, and glassmorphism accents.
- **Full Shopping Experience** — Browse, wishlist, cart, checkout, and order tracking, closely mirroring a production-ready e-commerce flow.

---

## 🛍️ Features

### Navigation
Bottom navigation across Home, Categories, Wishlist, Cart, and Profile with smooth transitions between screens.

### Home
- Delivery location, search bar, notifications, wishlist
- Promotional hero banner carousel
- **LumiSignature** — "Discover Your Jewellery DNA" AI styling banner
- **Weekly Style Missions** — themed challenges with progress tracking, XP, and badges
- **LumiMirror** — quick-access virtual try-on entry point
- Shop by Category, Trending Collections, New Arrivals, Best Sellers
- Shop by Occasion, Shop by Price
- Personalized Recommendations, Recently Viewed, Continue Shopping
- Offers & Coupons

### Product Discovery
- Category listing with filters (price, material, diamond type, metal color, gender, occasion, rating)
- Grid view with category chips and sort options

### Product Details
- Image carousel with zoom and product videos
- **LumiMirror Virtual Try-On button** (necklaces & earrings)
- Metal type, diamond details, size selection with ring size guide
- Delivery estimate, EMI options, offers
- Reviews & ratings, similar products, recently viewed

### Shopping Flow
- Wishlist with move-to-cart and share options
- Cart with quantity selector, coupons, gift wrapping, price summary
- Checkout with address, payment, and order summary
- Order tracking (active, completed, cancelled)

### Profile
Personal information, saved addresses, wishlist, orders, rewards, saved cards, notifications, settings

### Store Locator
Nearby stores with map placeholder, store details, and appointment booking

### Search
Recent searches, trending searches, voice search, image search

---

## 🎨 Design System

- **Style:** Modern, minimalistic, elegant, premium
- **Palette:** Clean white backgrounds with purple-to-magenta gradient accents
- **Typography:** Inter / Poppins
- **Details:** Soft shadows, rounded cards, smooth animations, skeleton loading states

---

## 🧠 LumiMirror — How Virtual Try-On Works

LumiMirror uses **[@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision)** (`FaceLandmarker`) to detect facial landmarks in real time via the device camera, then overlays a transparent product image (necklace or earring) positioned and scaled dynamically based on detected jaw width and ear landmarks.

**Key files:**
- `src/components/VirtualTryOn.tsx` — Core try-on component (camera + face landmark rendering)
- `src/routes/product.$id.tsx` — Wires the Try-On button to eligible products
- `src/lib/data.ts` — Product data, including `tryOnImage` field for try-on–enabled products
- `src/components/TryOnBanner.tsx` — Home page promo entry point into LumiMirror

---

## 🛠️ Tech Stack

- **Framework:** TanStack Start (React)
- **Routing:** TanStack Router
- **Styling:** Tailwind CSS
- **State:** Custom store (Zustand-style)
- **AI/Vision:** MediaPipe Tasks Vision (FaceLandmarker)
- **UI Components:** Radix UI, shadcn/ui patterns
- **Build Tool:** Vite

---

## 🚀 Development

You need [Node.js](https://nodejs.org/) and npm installed.

```bash
git clone https://github.com/DharshiniPujarolla/Caratlane_app.git
cd Caratlane_app
npm install
npm run dev
```

The app will be available at `http://localhost:8080` (or the port shown in your terminal).

---

## 📦 Build

```bash
npm run build
```

---

## 🤝 Built With Lovable

This project was built with [Lovable](https://lovable.dev). Every change made in the Lovable editor syncs directly to this repository, and changes pushed here sync back for continued development.

---

## 👥 Contributors

Built by the team as part of the **SheBuild Hackathon**, extending CaratLane with LumiMirror (AI-powered virtual try-on) and LumiSignature (AI styling) as core engagement features.
