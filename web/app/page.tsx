import HomeHero from "@/components/sections/HomeHero";
import PathwayCards from "@/components/sections/PathwayCards";

export default function HomePage() {
  return (
    <main className="min-h-screen pt-[96px]">
      <HomeHero />
      <PathwayCards />
    </main>
  );
}
