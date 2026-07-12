"use client";

import { useState } from "react";
import { uploadProduct, uploadPortfolioItem, clearProcessedOrder } from "@/app/admin/actions";
import CldUploader from "./CldUploader";
import Link from "next/link";
import { 
  ClipboardList, 
  Package, 
  Image as ImageIcon, 
  LogOut, 
  CheckCircle, 
  Coins, 
  Clock, 
  TrendingUp, 
  Smartphone 
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/auth-actions";

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
  const [showroomCategory, setShowroomCategory] = useState("graphics");

  const [productImgUrl, setProductImgUrl] = useState("");
  const [showroomBeforeUrl, setShowroomBeforeUrl] = useState("");
  const [showroomAfterUrl, setShowroomAfterUrl] = useState("");
  const [showroomVideoUrl, setShowroomVideoUrl] = useState("");

  // FINANCIAL ANALYTICS ENGINE CALCULATION
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrdersCount = orders.length;
  
  const totalMomoRevenue = orders
    .filter(o => o.paymentMethod.toLowerCase() === "momo")
    .reduce((sum, order) => sum + order.totalAmount, 0);
    
  const totalBankingRevenue = orders
    .filter(o => o.paymentMethod.toLowerCase() === "banking")
    .reduce((sum, order) => sum + order.totalAmount, 0);

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
      : `Hello ${order.customerName}, your service request for [${itemSummary}] has been received successfully at our agent terminal point. Processing queue initialized. Expect clearance completion shortly. Thank you Trim.`;

    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(operationalMessage)}`, "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 text-white min-h-[75vh]">
      
      {/* SIDEBAR PANEL */}
      <aside className="w-full lg:w-64 bg-black/40 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-5 flex flex-col gap-2 shrink-0">
        <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.2em] px-3 mb-2">Navigation Nodes</p>
        
        <button 
          onClick={() => setActiveTab("orders")} 
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "orders" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <ClipboardList className="w-4 h-4" />
          Incoming Orders ({orders.length})
        </button>
        
        <button 
          onClick={() => setActiveTab("upload-product")} 
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "upload-product" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <Package className="w-4 h-4" />
          Add Store Inventory
        </button>
        
        <button 
          onClick={() => setActiveTab("upload-showroom")} 
          className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "upload-showroom" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <ImageIcon className="w-4 h-4" />
          Showroom Uploader
        </button>
        
        <div className="mt-auto pt-4 border-t border-white/[0.05]">
          <button 
            onClick={async () => { if(confirm("Terminate admin session?")) await logoutAdmin(); }} 
            className="w-full text-center px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* DYNAMIC WORKSPACE SECTION */}
      <main className="flex-1 bg-black/20 border border-white/[0.04] rounded-3xl p-6 min-h-[60vh] space-y-6">
        
        {/* EXECUTIVE ANALYTICS BANNER - FIXED GRID DISPLAY */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Income</p>
                <h3 className="text-lg font-mono font-black mt-0.5 text-white">GH₵ {totalRevenue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Momo Stream</p>
                <h3 className="text-lg font-mono font-black mt-0.5 text-white">GH₵ {totalMomoRevenue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Bank Transfer</p>
                <h3 className="text-lg font-mono font-black mt-0.5 text-white">GH₵ {totalBankingRevenue.toFixed(2)}</h3>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Queue</p>
                <h3 className="text-lg font-mono font-black mt-0.5 text-white">{totalOrdersCount} Tasks</h3>
              </div>
            </div>
          </div>
        )}

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
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black uppercase text-white tracking-tight">{order.customerName}</h4>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                            order.paymentMethod.toLowerCase() === "momo" 
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </div>
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
                      <button onClick={() => sendReceiptNotification(order)} className="bg-white text-[#002147] font-black text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-[#D4AF37] transition flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" />
                        Dispatched / Alert Client
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW B: PRODUCT INVENTORY FORM */}
        {activeTab === "upload-product" && (
          <div className="max-w-xl space-y-4">
            <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Product Asset</h3>
            <form action={async (fd) => {
              if(!productImgUrl) { alert("Product image asset is required."); return; }
              fd.append("imageUrls", productImgUrl);
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
                  <option value="lighting">LED Lighting System</option>
                  <option value="apparel">Custom Jerseys</option>
                  <option value="fabrics">Wear Fabrics</option>
                </select>
              </div>
              
              <CldUploader acceptType="image" label={productImgUrl ? "✓ Product Image Uploaded" : "Upload Product Image"} onUploadSuccess={(url: string) => setProductImgUrl(url)} />
              
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl">
                Save Asset Live To Store Catalog
              </button>
            </form>
          </div>
        )}

        {/* VIEW C: SHOWROOM CREATIVE PORTFOLIO MANAGER */}
        {activeTab === "upload-showroom" && (
          <div className="max-w-xl space-y-4">
            <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Portfolio Project</h3>
            <form action={async (fd) => {
              fd.append("category", showroomCategory);
              
              if (showroomCategory === "graphics") {
                if(!showroomAfterUrl) { alert("Design layout file is required."); return; }
                fd.append("imageUrlAfter", showroomAfterUrl);
              } else if (showroomCategory === "video") {
                if(!showroomVideoUrl) { alert("Showcase production video file is required."); return; }
                fd.append("videoUrl", showroomVideoUrl);
                fd.append("imageUrlAfter", "/video-placeholder.jpg");
              } else if (showroomCategory === "stickers") {
                if(!showroomBeforeUrl || !showroomAfterUrl) { alert("Both 'Before' and 'After' skin layout images are required."); return; }
                fd.append("imageUrlBefore", showroomBeforeUrl);
                fd.append("imageUrlAfter", showroomAfterUrl);
              }

              const res = await uploadPortfolioItem(fd);
              if (res.success) { 
                alert("Project uploaded live to Showroom!"); 
                setShowroomBeforeUrl(""); 
                setShowroomAfterUrl(""); 
                setShowroomVideoUrl(""); 
                setActiveTab("orders"); 
              } else { 
                alert(res.error); 
              }
            }} className="space-y-4">
              
              <input type="text" name="title" placeholder="Project Title" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-[#D4AF37]" required />
              <textarea name="description" placeholder="Project concept summary..." rows={2} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]" required />
              
              <select 
                value={showroomCategory}
                onChange={(e) => {
                  setShowroomCategory(e.target.value);
                  setShowroomBeforeUrl("");
                  setShowroomAfterUrl("");
                  setShowroomVideoUrl("");
                }}
                className="w-full bg-[#001a35] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none"
              >
                <option value="graphics">Graphic Design</option>
                <option value="video">Video Editing</option>
                <option value="stickers">Laptop Skins Wrap</option>
              </select>
              
              <div className="space-y-3 pt-2">
                {showroomCategory === "graphics" && (
                  <CldUploader 
                    acceptType="image" 
                    label={showroomAfterUrl ? "✓ Design Showcase Image Loaded" : "Upload Design Image Asset"} 
                    onUploadSuccess={(url: string) => setShowroomAfterUrl(url)} 
                  />
                )}

                {showroomCategory === "video" && (
                  <CldUploader 
                    acceptType="video" 
                    label={showroomVideoUrl ? "✓ Production Video File Loaded" : "Upload Video Production File (.mp4/.mov)"} 
                    onUploadSuccess={(url: string) => setShowroomVideoUrl(url)} 
                  />
                )}

                {showroomCategory === "stickers" && (
                  <div className="grid gap-3">
                    <CldUploader 
                      acceptType="image" 
                      label={showroomBeforeUrl ? "✓ 'Before' Skin Image Loaded" : "Upload 'Before' Wrap Status Image"} 
                      onUploadSuccess={(url: string) => setShowroomBeforeUrl(url)} 
                    />
                    <CldUploader 
                      acceptType="image" 
                      label={showroomAfterUrl ? "✓ 'After' Skin Image Loaded" : "Upload Finished 'After' Wrap Image"} 
                      onUploadSuccess={(url: string) => setShowroomAfterUrl(url)} 
                    />
                  </div>
                )}
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl mt-4">
                Save Staged Design Asset To Showroom
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}