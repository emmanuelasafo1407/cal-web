import { db } from "@/lib/db";
import { createProduct } from "./actions";

export const revalidate = 0;

interface OrderCustomData {
  [key: string]: string | number | boolean;
}

interface OrderItemPayload {
  id: string;
  title: string;
  price: number;
  quantity: number;
  type: string;
  customData?: OrderCustomData;
}

export default async function AdminDashboardPage() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
  const services = await db.service.findMany({ orderBy: { id: "asc" } });
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Upper Analytics Ribbon */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Management Node</span>
            <h1 className="text-3xl font-black text-[#002147] uppercase tracking-tight mt-1">
              Operations Control Tower
            </h1>
          </div>
          <div className="text-sm bg-[#002147] text-white px-4 py-2 rounded-xl flex items-center gap-2 w-fit h-fit font-bold border border-white/10 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            XAMPP MySQL Stream Active
          </div>
        </div>

        {/* Dynamic Multi-Inventory Provisions Entry Form Block */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-3xl">
          <h3 className="text-sm font-black text-[#002147] uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
            Provision New Inventory Asset
          </h3>
          <form action={createProduct} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Product Title / Name</label>
                <input type="text" name="title" placeholder="e.g. Studio Audio Over-Ear Headphones" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Business Inventory Category</label>
                <select name="category" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]">
                  <option value="hardware">Mobile Phones & Devices</option>
                  <option value="electronics">Accessories & Chargers</option>
                  <option value="acoustics">Sound Systems & Headphones</option>
                  <option value="lighting">LED Bulbs & Smart Lighting</option>
                  <option value="apparel">Custom Team Jerseys</option>
                  <option value="fabrics">School & Corporate Wear Fabrics</option>
                  <option value="banking">Agency Banking Tokens</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Description Details</label>
                <textarea name="description" rows={3} placeholder="Item performance specifications, available configuration options, custom apparel sizes..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-medium text-[#002147] focus:outline-none focus:border-[#D4AF37] resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Image Asset Path Reference</label>
                <input type="text" name="imageUrl" placeholder="e.g. /shop-day.jpeg (or leave empty for fallback)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]" />
                <span className="text-[9px] text-slate-400 font-medium block mt-1.5 leading-normal">
                  Drop your file directly into the <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[#002147]">public/</code> directory folder and link it here with a leading slash character parameter.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Price (GH₵)</label>
                <input type="number" step="0.01" name="price" placeholder="120.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Stock Volume</label>
                <input type="number" name="stockQuantity" placeholder="50" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#002147] mb-1.5">Print Customization</label>
                <select name="isCustomizable" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#002147] focus:outline-none focus:border-[#D4AF37]">
                  <option value="false">No / Fixed Stock Unit</option>
                  <option value="true">Yes (Enable Custom Print Name/No)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#002147] text-white font-black text-[10px] uppercase tracking-widest py-4 rounded-xl hover:bg-[#D4AF37] hover:text-[#002147] transition duration-200 shadow-md transform active:scale-[0.99]">
              Push Item to Live Database
            </button>
          </form>
        </div>

        {/* Quantities Matrix Overview Cards */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbound Orders processed</p>
            <p className="text-3xl font-black text-[#002147] mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Stock Profiles</p>
            <p className="text-3xl font-black text-[#002147] mt-1">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configured Services</p>
            <p className="text-3xl font-black text-[#002147] mt-1">{services.length}</p>
          </div>
        </div>

        {/* LIVE INBOUND CUSTOMER REQUESTS TRACKING TABLE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-[#002147] uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
            Live Inbound Order Streams & Customizations
          </h3>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-xs font-bold text-slate-400 uppercase tracking-wider">
              No transactions processed through terminal gates yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Client Details</th>
                    <th className="pb-3">Settlement</th>
                    <th className="pb-3">Items Mapped & Custom Choices</th>
                    <th className="pb-3 text-right">Total Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-[#002147]">
                  {orders.map((order) => {
                    const mappedItems = JSON.parse(order.itemsPayload) as OrderItemPayload[];
                    return (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 font-medium">
                          <p className="font-black text-sm">{order.customerName}</p>
                          <p className="text-slate-400 font-mono text-[11px] mt-0.5">{order.phone}</p>
                          <p className="text-slate-400 text-[10px]">{order.email}</p>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider uppercase ${order.paymentMethod === 'online' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 space-y-2 max-w-md">
                          {mappedItems.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                              <p className="font-black uppercase text-[#002147]">{item.title} <span className="text-slate-400 font-mono">(x{item.quantity})</span></p>
                              {item.customData && (
                                <div className="mt-1 pl-2 border-l border-[#D4AF37] space-y-0.5 text-slate-500">
                                  {Object.entries(item.customData).map(([key, value]) => (
                                    <div key={key}>
                                      <span className="font-bold text-[9px] uppercase text-slate-400">{key}:</span> {String(value)}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 text-right font-mono font-black text-sm">
                          GH₵ {order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Existing Inventory Profiles Breakdown Display */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-[#002147] uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
              Hardware Stock Layout
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3 text-right">Unit Price</th>
                    <th className="pb-3 text-right">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-[#002147]">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3.5 font-bold max-w-[180px] truncate">{p.title}</td>
                      <td className="py-3.5 uppercase text-[10px] font-black text-slate-400">{p.category}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-slate-600">GH₵ {Number(p.price).toFixed(2)}</td>
                      <td className="py-3.5 text-right font-mono font-bold">{p.stockQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-[#002147] uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">
              Service Nodes
            </h3>
            <div className="space-y-4">
              {services.map((s) => (
                <div key={s.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-[#002147] uppercase">{s.serviceName}</p>
                    <span className="inline-block text-[9px] font-black uppercase tracking-wider text-[#D4AF37] mt-0.5">{s.category}</span>
                  </div>
                  <p className="text-xs font-mono font-black text-[#002147]">
                    {Number(s.basePrice) === 0 ? "FREE" : `GH₵ ${Number(s.basePrice).toFixed(2)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}