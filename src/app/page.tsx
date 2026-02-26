import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/HeroSection";
import HowItsWorks from "@/components/HowItsWorks";
import Navbar from "@/components/Navbar";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features/>
      <HowItsWorks/>
      <Footer />
    </div>
  );
}
