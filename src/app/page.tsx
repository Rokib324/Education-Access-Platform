import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItsWorks from "@/components/HowItsWorks";
import Navbar from "@/components/Navbar";


export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <Hero />
      <Features />
      <HowItsWorks />
      <Footer />
    </div>
  );
}
