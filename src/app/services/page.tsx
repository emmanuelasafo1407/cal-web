"use client";

import ServiceOrderForm from "@/components/ServiceOrderForm";

export default function ServicesHubPage() {
  const MY_WHATSAPP = "233557334886"; // Graphic design, laptop skins, video projects

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001124] via-[#001a35] to-[#000d1a] py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-[#002147]/60 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full w-fit mx-auto border border-[#D4AF37]/20 backdrop-blur-md">
            What We Do
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            Our Services & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3CD59] to-[#FFF4D0]">Agency Banking</span>
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4"></div>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed pt-1">
            Send mobile money, buy airtime or exam result checkers, carry out banking transactions, or order custom laptop skins and graphic designs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* 1. MOMO DESK */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">
                  Mobile Money
                </span>
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">
                MoMo & Airtime
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Fast airtime and data bundles for MTN, Telecel, and AT. You can also visit our physical shop for instant cash deposits (cash-in) and cash withdrawals (cash-out).
              </p>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-3.5 text-xs text-slate-300 space-y-1">
                <p className="text-emerald-400 font-bold uppercase text-[10px]">At Our Shop Counter:</p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Cash-in and cash-out services are available daily.
                </p>
              </div>
            </div>
            <div className="pt-6">
              <ServiceOrderForm serviceType="momo" title="Buy Airtime or Bundle" />
            </div>
          </div>

          {/* 2. RESULT CHECKER */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">
                  Exam Results
                </span>
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">
                Result Checkers
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Buy genuine WAEC BECE, WASSCE, and NOV/DEC result checker pins instantly. You can buy the voucher pin or let us check and print your result slip for you.
              </p>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl font-bold">
                <span className="text-[10px] uppercase text-slate-400">Voucher Price</span>
                <span className="font-mono text-sm text-[#D4AF37] font-black">GH₵ 30.00</span>
              </div>
            </div>
            <div className="pt-6">
              <ServiceOrderForm serviceType="checker" title="Order Result Checker" />
            </div>
          </div>

          {/* 3. FIDELITY BANKING */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">
                  Fidelity Bank
                </span>
                <span className="text-2xl">🏦</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">
                Fidelity Banking Agent
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Your neighborhood banking point. Open a new bank account with your Ghana Card, deposit cash, withdraw funds, check your balance, or pay school fees and bills.
              </p>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl font-bold">
                <span className="text-[10px] uppercase text-slate-400">Account Opening</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase">FREE OF CHARGE</span>
              </div>
            </div>
            <div className="pt-6">
              <ServiceOrderForm serviceType="banking" title="Request Banking Service" />
            </div>
          </div>

          {/* 4. CUSTOM LAPTOP SKINS */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">
                  Laptop Skins
                </span>
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">
                Custom Laptop Skins
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Protect your laptop from scratches and give it a fresh look. Custom-cut matte vinyl stickers made with any picture, pattern, or logo you want.
              </p>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-[11px] font-medium text-slate-300 text-center">
                ✨ Custom fit for all laptop models and sizes.
              </div>
            </div>
            <div className="pt-6">
              <a 
                href={`https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(
                  "Hello, I would like to order a custom laptop skin/sticker. Let's discuss the size and design."
                )}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-xs uppercase tracking-wider py-4 rounded-xl text-center block shadow-lg hover:opacity-90 transition"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          {/* 5. GRAPHICS & VIDEO */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">
                  Creative Studio
                </span>
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">
                Graphics & Video Editing
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Flyers for church, parties, and businesses. Logos, banners, social media posts, and professional video editing for events and promotions.
              </p>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-[11px] font-medium text-slate-300 text-center">
                🚀 Delivered fast in high resolution.
              </div>
            </div>
            <div className="pt-6">
              <a 
                href={`https://wa.me/${MY_WHATSAPP}?text=${encodeURIComponent(
                  "Hello, I would like to inquire about your graphic design and video editing services."
                )}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-transparent text-white border border-white/20 font-black text-xs uppercase tracking-wider py-4 rounded-xl text-center block hover:bg-white hover:text-[#002147] hover:border-white transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
