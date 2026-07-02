"use client";

import ServiceOrderForm from "@/components/ServiceOrderForm";

export default function ServicesHubPage() {
  const CLIENT_WHATSAPP = "233544208963"; // Your client's agency line for banking, momo, and results
  const MY_WHATSAPP = "233557334886";     // Your line for custom laptop skins, graphics, and video projects

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001124] via-[#001a35] to-[#000d1a] py-20 px-6 relative overflow-hidden">
      
      {/* Decorative High-End Blur Orbs */}
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] bg-[#002147]/60 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Luxury Section Header */}
        <div className="text-center space-y-4">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1.5 rounded-full w-fit mx-auto border border-[#D4AF37]/20 backdrop-blur-md">
            Operational Hub Terminal
          </p>
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
            Agency Terminals & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3CD59] to-[#FFF4D0]">Service Points</span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6"></div>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto font-medium pt-2 leading-relaxed">
            Execute high-volume real-time financial clearances, procure immediate education result tokens, or initialize bespoke hardware and branding assets.
          </p>
        </div>

        {/* Premium Glassmorphism Grid Map */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 1. MOMO DESK (Client's Terminal) */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">Momo & Telephony</span>
                <span className="text-xl">📱</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">MoMo Vendor Desk</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Direct automated transmission module for all major mobile networks across Ghana. Run fast airtime top-ups or register instant high-speed data allocation packages directly to user wallets.
              </p>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 text-[11px] font-semibold text-slate-300 space-y-1">
                <p className="text-emerald-400 font-black uppercase tracking-wider">⚡ Physical Counter Ops:</p>
                <p className="text-slate-400 font-medium leading-normal">High-volume cash deposit (Cash-In) and safe merchant cash extraction (Cash-Out) are fully supported live at the physical counter spot.</p>
              </div>
            </div>
            <div className="pt-8">
              <ServiceOrderForm serviceType="momo" title="Configure Airtime / Bundle" />
            </div>
          </div>

          {/* 2. RESULT CHECKER HUB (Client's Terminal) */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">Education Portal</span>
                <span className="text-xl">🎓</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">Result Checker Tokens</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Direct wholesale and retail portal for institutional result tokens. Skip the scratch card search—procure raw voucher pin codes immediately or authorize our backend operators to extract and format your statement results securely.
              </p>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl font-bold">
                <span className="text-[9px] uppercase tracking-widest text-slate-400">Institutional Unit Fee</span>
                <span className="font-mono text-sm text-[#D4AF37] font-black">GH₵ 30.00</span>
              </div>
            </div>
            <div className="pt-8">
              <ServiceOrderForm serviceType="checker" title="Order Checker Options" />
            </div>
          </div>

          {/* 3. EXPANDED FIDELITY BANKING LOGISTICS (Client's Terminal) */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">Fidelity Agent</span>
                <span className="text-xl">🏦</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">Fidelity Banking Hub</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Your direct neighborhood branch gate. Queue smart biometric account registration protocols, execute direct cash clearings, check transaction details, or process regional interbank wire transfers and school fees allocations.
              </p>
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl font-bold">
                <span className="text-[9px] uppercase tracking-widest text-slate-400">Merchant Terminal Tax</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">FREE / NO CHARGE</span>
              </div>
            </div>
            <div className="pt-8">
              <ServiceOrderForm serviceType="banking" title="Launch Banking Hub" />
            </div>
          </div>

          {/* 4. CUSTOM LAPTOP SKINS & DECALS (Your Specific Order Stream) */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">Accra Graphics Node</span>
                <span className="text-xl">💻</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">Bespoke Laptop Stickers</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Bespoke high-grade matte vinyl laptop wrappers and precision-cut decals. Managed directly out of our Accra production terminal to ensure pristine printing aesthetics. Ship custom visual graphics to any location smoothly.
              </p>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">
                ✨ Fully customized with personal graphics or logo branding assets.
              </div>
            </div>
            <div className="pt-8">
              <a 
                href={`https://wa.me/${MY_WHATSAPP}?text=Hello,%20I%20want%20to%20order%20a%20Premium%20Bespoke%20Laptop%20Skin/Sticker.%20Let's%20discuss%20the%20dimensions%20and%20design.`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-4 rounded-xl text-center block shadow-lg transform active:scale-95 transition"
              >
                Order Custom Skin Via WhatsApp
              </a>
            </div>
          </div>

          {/* 5. BRAND CREATIVE & DESIGN DESK (Your Specific Order Stream) */}
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 flex flex-col justify-between hover:border-[#D4AF37]/40 transition duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.05)] group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-md border border-[#D4AF37]/20">Creative Agency</span>
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition duration-300">Graphics & Video Desk</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                Premium corporate flyer layout design layouts, high-conversion vector files, business profile setups, and commercial social media video post-production editing streams executed to highlight your core values.
              </p>
            </div>
            <div className="pt-8">
              <a 
                href={`https://wa.me/${MY_WHATSAPP}?text=Hello,%20I%20want%20to%20make%20enquiries%20about%20your%20Graphic%20Designing%20and%20Video%20Editing%20services.`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-transparent text-white border border-white/20 font-black text-[10px] uppercase tracking-widest py-4 rounded-xl text-center block hover:bg-white hover:text-[#002147] hover:border-white transition"
              >
                Connect on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}