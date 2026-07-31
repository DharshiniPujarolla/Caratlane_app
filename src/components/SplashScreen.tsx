import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import ring from "@/assets/splash-ring.png";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: "/brands" });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const sparkles = [
    { left: "8%", top: "12%", delay: "0s", size: "18px" },
    { left: "22%", top: "25%", delay: "1s", size: "14px" },
    { left: "82%", top: "18%", delay: "2s", size: "20px" },
    { left: "70%", top: "70%", delay: "1.5s", size: "16px" },
    { left: "15%", top: "78%", delay: "0.7s", size: "22px" },
    { left: "90%", top: "40%", delay: "2.5s", size: "16px" },
    { left: "45%", top: "15%", delay: "3s", size: "18px" },
    { left: "60%", top: "30%", delay: "0.4s", size: "14px" },
    { left: "35%", top: "65%", delay: "2.2s", size: "20px" },
    { left: "80%", top: "55%", delay: "1.8s", size: "18px" },
    { left: "12%", top: "48%", delay: "2.8s", size: "16px" },
    { left: "52%", top: "82%", delay: "1.1s", size: "18px" },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF8F6] via-[#FDECEC] to-[#F9E5EA]">

      {/* Background Glow */}
      <div className="absolute h-[420px] w-[420px] rounded-full bg-pink-200/40 blur-[120px]" />

      <div className="absolute h-[250px] w-[250px] rounded-full bg-yellow-100/70 blur-[90px]" />

      {/* Sparkles */}
      {sparkles.map((star, index) => (
        <div
          key={index}
          className="absolute text-[#E7B83F] font-bold select-none"
          style={{
            left: star.left,
            top: star.top,
            fontSize: star.size,
            animation: `twinkle 2.8s infinite`,
            animationDelay: star.delay,
          }}
        >
          ✦
        </div>
      ))}

      {/* Ring Glow */}
      <div className="absolute h-60 w-60 rounded-full bg-white/60 blur-[60px]" />

      {/* Ring */}
      <img
        src={ring}
        alt="Luxury Ring"
        className="relative z-10 w-60 drop-shadow-[0_0_45px_rgba(255,215,0,0.45)]"
        style={{
          animation: "floatRing 4s ease-in-out infinite",
        }}
      />

      {/* Logo */}
      <h1 className="text-5xl font-bold tracking-widest">
  LumiAura
</h1>

      {/* Subtitle */}
      <p className="relative z-10 mt-4 text-center text-sm uppercase tracking-[0.45em] text-[#7C6168]">
        Your Next Premium Jewellery Experience
      </p>

      {/* Bottom Glow */}
      <div className="absolute bottom-[-120px] h-[260px] w-[600px] rounded-full bg-pink-100 blur-[120px]" />
    </div>
  );
}