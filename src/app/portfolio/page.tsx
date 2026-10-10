import { db } from "@/lib/db";
import PortfolioShowcase, { PortfolioItem } from "@/components/PortfolioShowcase";

export const revalidate = 0; // Pure synchronized fetching with XAMPP MySQL

interface DbPortfolioRecord {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  imageUrlBefore?: string | null;
  imageUrlAfter?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export default async function PortfolioShowroomPage() {
  const rawItems = await db.portfolioItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formattedItems: PortfolioItem[] = (rawItems as DbPortfolioRecord[]).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? null,
    category:
      item.category === "flyers" || item.category === "branding"
        ? "graphics"
        : item.category === "videos"
        ? "video"
        : item.category === "skins"
        ? "stickers"
        : item.category || "graphics",
    imageUrlBefore: item.imageUrlBefore ?? null,
    imageUrlAfter: item.imageUrlAfter || item.imageUrl || "/bg-evening.jpeg",
    videoUrl: item.videoUrl ?? null,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#001124] via-[#001a35] to-[#000d1a] py-20 px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-[#002147]/60 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 text-center">
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full w-fit mx-auto border border-[#D4AF37]/20 backdrop-blur-md">
            Creative Portfolio Showroom
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none mt-2">
            Design, Video &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3CD59] to-[#FFF4D0]">
              Decal Works
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-5" />
          <p className="text-slate-400 text-xs font-medium leading-relaxed pt-2">
            Explore live media designs, branding layouts, premium video sequences, and precision matte vinyl laptop skin wrappers crafted fresh at our design terminals.
          </p>
        </div>

        <PortfolioShowcase initialItems={formattedItems} />
      </div>
    </main>
  );
}