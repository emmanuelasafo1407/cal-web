"use client";

import { useState } from "react";
import { uploadProduct, uploadPortfolioItem, clearProcessedOrder } from "@/app/admin/actions";
import CldUploader from "./CldUploader";
import Link from "next/link";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  customData?: Record<string, unknown>;
}

interface OrderMapped {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryAddress: string;
  items: OrderItem[];
}

interface ComponentProps {
  orders: OrderMapped[];
}

export default function AdminTerminalTabs({ orders }: ComponentProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [orderCategory, setOrderCategory] = useState("all");

  const [productImgUrl, setProductImgUrl] = useState("");
  const [showroomBeforeUrl, setShowroomBeforeUrl] = useState("");
  const [showroomAfterUrl, setShowroomAfterUrl] = useState("");

  // 1. Strict evaluation typecasting ensures .toLowerCase() compiles safely
  const filteredOrders = orders.filter((order) => {
    if (orderCategory === "all") return true;
    return order.items.some((item) => {
      const originType = item.customData?.originType;
      const parsedType = typeof originType === "string" ? originType : (item.price > 0 && !item.customData ? "product" : "");
      return parsedType.toLowerCase() === orderCategory.toLowerCase();
    });
  });

  const sendReceiptNotification = (order: OrderMapped) => {
    const itemSummary = order.items.map(i => `${i.title} (x${i.quantity})`).join(", ");
    const isPhysical = order.items.some(i => !i.customData?.originType);
    
    const operationalMessage = isPhysical
      ? `Hello ${order.customerName}, Constant A. Liberty Ventures has confirmed your order for [${itemSummary}]. Your payment selection: ${order.paymentMethod.toUpperCase()}. Delivery destination: ${order.deliveryAddress}. Estimated distribution dispatch duration: 24 to 48 hours depending on terminal distance. Thank you.`
      : `Hello ${order.customerName}, your service request for [${itemSummary}] has been received successfully at our agent terminal point. Processing queue initialized. Expect clearance completion shortly. Thank you.`;

    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(operationalMessage)}`, "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 text-white min-h-[75vh]">
      
      {/* PROFESSIONAL DASHBOARD SIDEBAR PANEL */}
      <aside className="w-full lg:w-64 bg-black/40 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-5 flex flex-col gap-2 shrink-0">
        <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.2em] px-3 mb-2">Navigation Nodes</p>
        <button onClick={() => setActiveTab("orders")} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "orders" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}>
          📋 Incoming Orders ({orders.length})
        </button>
        <button onClick={() => setActiveTab("upload-product")} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "upload-product" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}>
          📦 Add Store Inventory
        </button>
        <button onClick={() => setActiveTab("upload-showroom")} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition ${activeTab === "upload-showroom" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}>
          🖼️ Showroom Uploader
        </button>
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          <Link href="/" className="w-full text-center block px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition">
            Terminate Session
          </Link>
        </div>
      </aside>

      {/* DYNAMIC WORKSPACE SECTION */}
      <main className="flex-1 bg-black/20 border border-white/[0.04] rounded-3xl p-6 min-h-[60vh]">
        
        {/* VIEW A: ORDERS FEED */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-1.5 bg-white/[0.02] p-1.5 rounded-xl border border-white/[0.05] w-fit">
              {["all", "momo", "banking", "checker", "product"].map(sub => (
                <button key={sub} onClick={() => setOrderCategory(sub)} className={`px-3.5 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition ${orderCategory === sub ? "bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147]" : "text-slate-400 hover:text-white"}`}>
                  {sub === "all" ? "Master Feed" : sub}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-xs font-black uppercase text-slate-500 tracking-wider py-10">No records found matching this console index filter.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>REF: #{order.id.slice(0,8)}</span>
                        <button onClick={async () => { if(confirm("Archive order?")) await clearProcessedOrder(order.id); }} className="text-red-400 hover:text-red-500 font-bold uppercase">[ Archive ]</button>
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase text-white tracking-tight">{order.customerName}</h4>
                        <p className="text-[#D4AF37] text-xs font-mono font-bold">{order.phone}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{order.deliveryAddress}</p>
                      </div>
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.05]">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="bg-black/30 p-2 rounded-xl text-xs font-semibold border border-white/[0.02]">
                            <div className="flex justify-between font-black uppercase text-slate-200">
                              <span>{it.title}</span>
                              <span>x{it.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
                      <span className="font-mono font-black text-xs text-white">GH₵ {order.totalAmount.toFixed(2)}</span>
                      <button onClick={() => sendReceiptNotification(order)} className="bg-white text-[#002147] font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-[#D4AF37] transition">
                        ✓ Dispatched / Alert Client
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW B: PRODUCT INVENTORY FORM (Explicit inline typing string clears 'url' warnings) */}
        {activeTab === "upload-product" && (
          <div className="max-w-xl space-y-4">
            <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Product Asset</h3>
            <form action={async (fd) => {
              if(productImgUrl) fd.append("imageUrls", productImgUrl);
              const res = await uploadProduct(fd);
              if (res.success) { alert("Asset published successfully!"); setProductImgUrl(""); setActiveTab("orders"); } else { alert(res.error); }
            }} className="space-y-4">
              <input type="text" name="title" placeholder="Product Title" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-[#D4AF37]" required />
              <textarea name="description" placeholder="Specifications details..." rows={3} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" step="0.01" name="price" placeholder="Price (GH₵)" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none" required />
                <select name="category" className="w-full bg-[#001a35] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none">
                  <option value="hardware">Phones & Devices</option>
                  <option value="electronics">Accessories & Chargers</option>
                  <option value="acoustics">Sound Systems</option>
                  <option value="fabrics">Wear Fabrics</option>
                </select>
              </div>
              
              <CldUploader label={productImgUrl ? "✓ Product Image Uploaded" : "Upload Product Image"} onUploadSuccess={(url: string) => setProductImgUrl(url)} />
              
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl">
                Save Asset Live To Store Catalog
              </button>
            </form>
          </div>
        )}

        {/* VIEW C: SHOWROOM UPLOADER (Explicit inline typing string clears 'url' warnings) */}
        {activeTab === "upload-showroom" && (
          <div className="max-w-xl space-y-4">
            <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Portfolio Project</h3>
            <form action={async (fd) => {
              if(!showroomAfterUrl) { alert("Main image asset is mandatory."); return; }
              fd.append("imageUrlBefore", showroomBeforeUrl);
              fd.append("imageUrlAfter", showroomAfterUrl);
              const res = await uploadPortfolioItem(fd);
              if (res.success) { alert("Project uploaded live to Showroom!"); setShowroomBeforeUrl(""); setShowroomAfterUrl(""); setActiveTab("orders"); } else { alert(res.error); }
            }} className="space-y-4">
              <input type="text" name="title" placeholder="Project Title" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-[#D4AF37]" required />
              <textarea name="description" placeholder="Project concept summary..." rows={2} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]" required />
              <select name="category" className="w-full bg-[#001a35] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none">
                <option value="graphics">Graphic Design</option>
                <option value="video">Video Editing</option>
                <option value="stickers">Laptop Skins Wrap</option>
              </select>
              
              <div className="space-y-3">
                <CldUploader label={showroomBeforeUrl ? "✓ Before Image Staged" : "Upload 'Before' Image (Laptop Skin Optional)"} onUploadSuccess={(url: string) => setShowroomBeforeUrl(url)} />
                <CldUploader label={showroomAfterUrl ? "✓ Main/After Design Asset Staged" : "Upload Showcase Image / After Image"} onUploadSuccess={(url: string) => setShowroomAfterUrl(url)} />
              </div>

              <input type="text" name="videoUrl" placeholder="Video streaming URL (Optional for editing works)" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none" />
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl">
                Save Staged Design Asset To Showroom
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}