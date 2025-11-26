import HomeHero from "@/components/sections/HomeHero";
import PathwayCards from "@/components/sections/PathwayCards";

export default function HomePage() {
  return (
    <main className="min-h-screen"> {/* NO pt-[96px] here! */}
      <HomeHero />
      <PathwayCards />
    </main>
  );
}