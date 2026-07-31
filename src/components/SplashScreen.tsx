import { useEffect } from "react";
import ring from "@/assets/splash-ring.png";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth" });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
      <div className="absolute h-[420px] w-[420px] rounded-full bg-pink-200/40 blur-[120px]" />
      <div className="absolute h-[250px] w-[250px] rounded-full bg-yellow-100/70 blur-[90px]" />

      {sparkles.map((star, index) => (
        <div
          key={index}
          className="absolute text-[#E7B83F] font-bold select-none"
          style={{
            left: star.left,