import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="w-full bg-[#f8fafc]">
      {/* Hero Section */}
      <section 
        className="relative min-h-[85vh] flex items-center bg-[#002147] bg-cover bg-center bg-no-repeat py-16 sm:py-24 px-4 sm:px-6 border-b-4 border-[#D4AF37]"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(0, 33, 71, 0.96) 35%, rgba(0, 33, 71, 0.7) 100%), url('/bg-evening.jpeg')` 
        }}
      >
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Hero Core Branding */}
          <div className="lg:col-span-7 space-y-5 text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/40 px-3.5 py-1 text-xs uppercase tracking-widest text-[#D4AF37] font-black rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Open & Ready to Serve
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.1]">
              YOUR <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] bg-clip-text text-transparent">BANKING</span> & <br />
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] bg-clip-text text-transparent">DIGITAL SERVICES</span> <br />
              NEAR YOU!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl font-medium leading-relaxed">
              Mobile money, agency banking, custom jersey printing, graphic design, and quality electronic accessories. Quick, friendly, and reliable service right near you in Hohoe.
            </p>
            <div className="pt-3 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/services" className="bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] border border-[#D4AF37] hover:from-white hover:to-white text-[#002147] font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition duration-200 uppercase text-xs tracking-wider shadow-xl btn-press">
                Our Services
              </Link>
              <Link href="/products" className="border-2 border-slate-400 hover:border-white text-white font-black px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition uppercase text-xs tracking-wider btn-press">
                Shop Products
              </Link>
            </div>
          </div>

          {/* Right Hero Block: Flyer Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in">
            <div className="bg-gradient-to-b from-white/10 to-white/0 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl shadow-2xl max-w-md w-full animate-float">
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl shadow-2xl border border-white/10">
                <Image 
                  src="/flyer.jpeg" 
                  alt="Constant A. Liberty Ventures Flyer"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-white px-1">
                <div>
                  <h3 className="text-xs font-black tracking-widest uppercase text-[#D4AF37]">Official Shop Flyer</h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-medium">Off Likpe Road Bungalow – Hohoe</p>
                </div>
                <div className="text-right">
                  <a
                    href="tel:0544208963"
                    className="text-xs font-mono font-black text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded border border-[#D4AF37]/30 shadow-sm inline-block"
                  >
                    0544208963
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Operational Showcase Section */}
      <section className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Our Location</p>
          <h2 className="text-2xl sm:text-4xl font-black text-[#002147] uppercase tracking-tight mt-1">Visit Us In Person</h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto mt-4"></div>
        </div>

        {/* Core Image Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Daytime Exterior Profile */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-[#D4AF37]/50 card-hover group">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
              <Image 
                src="/shop-day.jpeg" 
                alt="Storefront Daytime Profile" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5 sm:p-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Our Storefront</span>
              <h3 className="text-base sm:text-lg font-bold text-[#002147] mt-1">Easy to Find in Hohoe</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Visit our physical shop for in-person payments, mobile money transfers, and product pick-ups.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Counter Desks */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-[#D4AF37]/50 card-hover group">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
              <Image 
                src="/shop-interior.jpeg" 
                alt="Interior Service Desks" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5 sm:p-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Inside The Shop</span>
              <h3 className="text-base sm:text-lg font-bold text-[#002147] mt-1">Fast Counter Service</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Comfortable service desks where our friendly team assists you quickly with whatever you need.
              </p>
            </div>
          </div>

          {/* Card 3: Agency Banking Service Points */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-[#D4AF37]/50 card-hover group">
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
              <Image 
                src="/shop-agent.jpeg" 
                alt="Agency Banking Counters" 
                fill 
                className="object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5 sm:p-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">Fidelity Bank Agent</span>
              <h3 className="text-base sm:text-lg font-bold text-[#002147] mt-1">Official Banking Agent</h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                Check your account balance, deposit or withdraw cash, and open a new bank account right here.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Location Identification Footer Strip */}
      <section className="bg-white border-y border-slate-200 py-10 sm:py-12 px-4 sm:px-6 text-center">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Store Address</p>
        <p className="text-[#002147] text-lg sm:text-xl font-black uppercase tracking-wide mt-1">
          Off Likpe Road Bungalow – Hohoe, Ghana
        </p>
      </section>
    </div>
  );
}
