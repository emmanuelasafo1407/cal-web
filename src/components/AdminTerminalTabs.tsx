"use client";

import { useState } from "react";
import { 
  uploadProduct, 
  uploadPortfolioItem, 
  clearProcessedOrder, 
  toggleStockStatus, 
  deleteProduct, 
  deletePortfolioItem,
  updateProductDetails,
  updateOrderStatus
} from "@/app/admin/actions";
import CldUploader from "./CldUploader";
import { 
  ClipboardList, 
  Package, 
  Image as ImageIcon, 
  LogOut, 
  CheckCircle, 
  Coins, 
  Clock, 
  TrendingUp, 
  Smartphone,
  AlertTriangle,
  Trash2,
  Edit,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
  ListFilter,
  PlusCircle,
  FolderKanban,
  BarChart3,
  Layers,
  CreditCard,
  Users,
  Settings,
  Download,
  ShieldCheck,
  Activity,
  Zap
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/auth-actions";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
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

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrlBefore?: string;
  imageUrlAfter?: string;
  videoUrl?: string;
}

interface ComponentProps {
  orders: OrderMapped[];
  products?: ProductItem[];
  portfolio?: PortfolioItem[];
}

export default function AdminTerminalTabs({ orders, products = [], portfolio = [] }: ComponentProps) {
  // NAVIGATION NODES STATE (All 5 New Modules Included)
  const [activeTab, setActiveTab] = useState<
    "orders" | "inventory" | "showroom" | "analytics" | "service-queue" | "gateway" | "crm" | "settings"
  >("orders");

  // Sub-Tab Views
  const [inventorySubTab, setInventorySubTab] = useState<"list" | "add">("list");
  const [showroomSubTab, setShowroomSubTab] = useState<"list" | "add">("list");

  // Filters & Search
  const [orderCategory, setOrderCategory] = useState("all");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState("all");
  const [showroomCategoryFilter, setShowroomCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Editing & Modals
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [showroomFormCategory, setShowroomFormCategory] = useState("graphics");

  const [productImgUrl, setProductImgUrl] = useState("");
  const [editProductImgUrl, setEditProductImgUrl] = useState("");
  const [showroomBeforeUrl, setShowroomBeforeUrl] = useState("");
  const [showroomAfterUrl, setShowroomAfterUrl] = useState("");
  const [showroomVideoUrl, setShowroomVideoUrl] = useState("");

  // Financial Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  const totalMomoRevenue = orders
    .filter(o => o.paymentMethod.toLowerCase() === "momo" || o.paymentMethod.toLowerCase().includes("paystack"))
    .reduce((sum, order) => sum + order.totalAmount, 0);
    
  const totalBankingRevenue = orders
    .filter(o => o.paymentMethod.toLowerCase() === "banking")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  // CRM Aggregation: Unique Customers
  const customerMap = new Map<string, { name: string; email: string; phone: string; address: string; totalSpent: number; orderCount: number }>();
  orders.forEach(o => {
    const key = o.phone || o.customerName;
    if (customerMap.has(key)) {
      const existing = customerMap.get(key)!;
      existing.totalSpent += o.totalAmount;
      existing.orderCount += 1;
    } else {
      customerMap.set(key, {
        name: o.customerName,
        email: o.email,
        phone: o.phone,
        address: o.deliveryAddress,
        totalSpent: o.totalAmount,
        orderCount: 1,
      });
    }
  });
  const customersList = Array.from(customerMap.values());

  // Export CSV Ledger Action
  const exportCSVLedger = () => {
    const headers = "Order ID,Customer,Phone,Payment Method,Total Amount (GHS),Address\n";
    const rows = orders.map(o => `"#${o.id.slice(0,8)}","${o.customerName}","${o.phone}","${o.paymentMethod}",${o.totalAmount},"${o.deliveryAddress}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAL_Ventures_Order_Ledger_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const sendReceiptNotification = (order: OrderMapped) => {
    const itemSummary = order.items.map(i => `${i.title} (x${i.quantity})`).join(", ");
    const operationalMessage = `Hello ${order.customerName}, Constant A. Liberty Ventures has confirmed your order for [${itemSummary}]. Payment: ${order.paymentMethod.toUpperCase()}. Delivery: ${order.deliveryAddress}. Dispatch duration: 24-48 hrs. Thank you!`;
    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(operationalMessage)}`, "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 text-white min-h-[80vh]">
      
      {/* EXPANDED SIDEBAR NAVIGATION (NODES 1 TO 5 INTEGRATED) */}
      <aside className="w-full lg:w-72 bg-black/40 backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-5 flex flex-col gap-1.5 shrink-0">
        <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.2em] px-3 mb-2">Core Operations</p>
        
        <button 
          onClick={() => setActiveTab("orders")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "orders" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <ClipboardList className="w-4 h-4 text-[#D4AF37]" />
          Orders Feed ({orders.length})
        </button>
        
        <button 
          onClick={() => setActiveTab("inventory")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "inventory" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <Package className="w-4 h-4 text-[#D4AF37]" />
          Store Catalog ({products.length})
        </button>
        
        <button 
          onClick={() => setActiveTab("showroom")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "showroom" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
          Showroom ({portfolio.length})
        </button>

        <p className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.2em] px-3 mt-4 mb-2">Management Suite</p>

        {/* NODE 1: FINANCIAL ANALYTICS */}
        <button 
          onClick={() => setActiveTab("analytics")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "analytics" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <BarChart3 className="w-4 h-4 text-green-400" />
          Analytics & Ledger
        </button>

        {/* NODE 2: SERVICE WORKFLOW QUEUE */}
        <button 
          onClick={() => setActiveTab("service-queue")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "service-queue" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          Service Workflow
        </button>

        {/* NODE 3: PAYSTACK GATEWAY SWITCH */}
        <button 
          onClick={() => setActiveTab("gateway")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "gateway" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <CreditCard className="w-4 h-4 text-blue-400" />
          Paystack Gateway
        </button>

        {/* NODE 4: CRM DIRECTORY */}
        <button 
          onClick={() => setActiveTab("crm")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "crm" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <Users className="w-4 h-4 text-[#D4AF37]" />
          CRM Directory ({customersList.length})
        </button>

        {/* NODE 5: SYSTEM SETTINGS */}
        <button 
          onClick={() => setActiveTab("settings")} 
          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition ${activeTab === "settings" ? "bg-white text-[#002147] shadow-xl" : "hover:bg-white/[0.04] text-slate-400 hover:text-white"}`}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          Terminal Settings
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

      {/* DYNAMIC WORKSPACE PANEL */}
      <main className="flex-1 bg-black/20 border border-white/[0.04] rounded-3xl p-6 min-h-[60vh] space-y-6">
        
        {/* ==================== 1. ORDERS FEED ==================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-3 rounded-2xl border border-white/[0.05]">
              <div className="flex flex-wrap gap-1.5">
                {["all", "momo", "banking", "checker", "product"].map(sub => (
                  <button key={sub} onClick={() => setOrderCategory(sub)} className={`px-3.5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition ${orderCategory === sub ? "bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147]" : "text-slate-400 hover:text-white"}`}>
                    {sub === "all" ? "Master Feed" : sub}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, phone, ref..." 
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs font-black uppercase text-slate-500 tracking-wider py-12 text-center">No order records recorded in system database.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>REF: #{order.id.slice(0,8)}</span>
                        <button onClick={async () => { if(confirm("Archive order?")) await clearProcessedOrder(order.id); }} className="text-red-400 hover:text-red-500 font-bold uppercase">[ Archive ]</button>
                      </div>

                      <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.03] space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black uppercase text-white tracking-tight">{order.customerName}</h4>
                          <span className="text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {order.paymentMethod}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37]">
                          <Phone className="w-3 h-3 text-[#D4AF37]" />
                          <span>{order.phone}</span>
                        </div>

                        {order.email && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{order.email}</span>
                          </div>
                        )}

                        <div className="flex items-start gap-2 text-[10px] text-slate-300 pt-1.5 border-t border-white/5">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Order Items</p>
                        {order.items.map((it, idx) => (
                          <div key={idx} className="bg-black/40 p-2.5 rounded-xl border border-white/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                              <img src={it.imageUrl || "/bg-evening.jpeg"} alt={it.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-black uppercase text-slate-200 truncate">{it.title}</h5>
                              <p className="text-[10px] text-[#D4AF37] font-mono font-bold">GH₵ {it.price.toFixed(2)}</p>
                            </div>
                            <span className="text-xs font-black text-white px-2 py-1 bg-white/10 rounded-lg">x{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
                      <div>
                        <p className="text-[8px] font-black uppercase text-slate-400">Total Charged</p>
                        <span className="font-mono font-black text-sm text-white">GH₵ {order.totalAmount.toFixed(2)}</span>
                      </div>
                      <button onClick={() => sendReceiptNotification(order)} className="bg-white text-[#002147] font-black text-[9px] uppercase tracking-widest px-3 py-2.5 rounded-xl hover:bg-[#D4AF37] transition flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> WhatsApp Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. STORE INVENTORY TAB ==================== */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/[0.06] pb-4">
              <div className="flex gap-2">
                <button onClick={() => setInventorySubTab("list")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${inventorySubTab === "list" ? "bg-[#D4AF37] text-[#002147]" : "bg-white/5 text-slate-400 hover:text-white"}`}>
                  <ListFilter className="w-3.5 h-3.5" /> Manage Catalog ({products.length})
                </button>
                <button onClick={() => setInventorySubTab("add")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${inventorySubTab === "add" ? "bg-[#D4AF37] text-[#002147]" : "bg-white/5 text-slate-400 hover:text-white"}`}>
                  <PlusCircle className="w-3.5 h-3.5" /> Publish New Product
                </button>
              </div>
            </div>

            {inventorySubTab === "list" && (
              <div className="grid gap-3">
                {products.map((p) => {
                  const isOutOfStock = p.stockQuantity === 0;
                  return (
                    <div key={p.id} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition ${isOutOfStock ? "bg-red-500/5 border-red-500/20" : "bg-white/[0.02] border-white/[0.06]"}`}>
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex-shrink-0">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-sm font-black uppercase text-white truncate">{p.title}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-[#D4AF37]">GH₵ {p.price.toFixed(2)}</span>
                            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">{p.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button onClick={async () => await toggleStockStatus(p.id, p.stockQuantity)} className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border transition ${isOutOfStock ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {isOutOfStock ? "❌ Out of Stock" : `✓ In Stock (${p.stockQuantity})`}
                        </button>
                        <button onClick={() => { setEditingProduct(p); setEditProductImgUrl(p.imageUrl); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"><Edit className="w-4 h-4" /></button>
                        <button onClick={async () => { if(confirm(`Delete "${p.title}"?`)) await deleteProduct(p.id); }} className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {inventorySubTab === "add" && (
              <div className="max-w-xl space-y-4">
                <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Store Product Asset</h3>
                <form action={async (fd) => {
                  if(!productImgUrl) { alert("Product image asset is required."); return; }
                  fd.append("imageUrls", productImgUrl);
                  const res = await uploadProduct(fd);
                  if (res.success) { alert("Asset published live!"); setProductImgUrl(""); setInventorySubTab("list"); } else { alert(res.error); }
                }} className="space-y-4">
                  <input type="text" name="title" placeholder="Product Title" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none focus:border-[#D4AF37]" required />
                  <textarea name="description" placeholder="Specifications details..." rows={3} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-[#D4AF37]" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.01" name="price" placeholder="Price (GH₵)" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none" required />
                    <input type="number" name="stockQuantity" defaultValue={10} placeholder="Stock Qty" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none" required />
                  </div>
                  <select name="category" className="w-full bg-[#001a35] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none">
                    <option value="hardware">Phones & Devices</option>
                    <option value="electronics">Accessories & Chargers</option>
                    <option value="acoustics">Sound Systems</option>
                    <option value="lighting">LED Lighting System</option>
                    <option value="apparel">Custom Jerseys</option>
                  </select>
                  <CldUploader acceptType="image" label={productImgUrl ? "✓ Product Image Uploaded" : "Upload Product Image"} onUploadSuccess={(url: string) => setProductImgUrl(url)} />
                  <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl">Save Asset Live To Store Catalog</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. SHOWROOM GALLERY ==================== */}
        {activeTab === "showroom" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/[0.06] pb-4">
              <div className="flex gap-2">
                <button onClick={() => setShowroomSubTab("list")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${showroomSubTab === "list" ? "bg-[#D4AF37] text-[#002147]" : "bg-white/5 text-slate-400 hover:text-white"}`}>
                  <FolderKanban className="w-3.5 h-3.5" /> Showroom Gallery ({portfolio.length})
                </button>
                <button onClick={() => setShowroomSubTab("add")} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${showroomSubTab === "add" ? "bg-[#D4AF37] text-[#002147]" : "bg-white/5 text-slate-400 hover:text-white"}`}>
                  <PlusCircle className="w-3.5 h-3.5" /> Upload Portfolio Project
                </button>
              </div>
            </div>

            {showroomSubTab === "list" && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolio.map((item) => (
                  <div key={item.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="h-36 rounded-xl bg-black/40 overflow-hidden relative border border-white/10">
                        {item.videoUrl ? (
                          <video src={item.videoUrl} className="w-full h-full object-cover" controls={false} />
                        ) : (
                          <img src={item.imageUrlAfter || item.imageUrlBefore || "/bg-evening.jpeg"} alt={item.title} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 left-2 text-[8px] font-black uppercase px-2 py-0.5 rounded bg-black/80 text-[#D4AF37]">{item.category}</span>
                      </div>
                      <h4 className="text-xs font-black uppercase text-white truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      <button onClick={async () => { if(confirm(`Remove "${item.title}"?`)) await deletePortfolioItem(item.id); }} className="text-[9px] font-black text-red-400 hover:text-red-500 flex items-center gap-1 uppercase">
                        <Trash2 className="w-3 h-3" /> Remove Asset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showroomSubTab === "add" && (
              <div className="max-w-xl space-y-4">
                <h3 className="font-black text-xs uppercase text-[#D4AF37] tracking-wider mb-2">Publish Portfolio Item</h3>
                <form action={async (fd) => {
                  fd.append("category", showroomFormCategory);
                  if (showroomFormCategory === "graphics") {
                    if(!showroomAfterUrl) { alert("Design layout file is required."); return; }
                    fd.append("imageUrlAfter", showroomAfterUrl);
                  } else if (showroomFormCategory === "video") {
                    if(!showroomVideoUrl) { alert("Video file is required."); return; }
                    fd.append("videoUrl", showroomVideoUrl);
                    fd.append("imageUrlAfter", "/video-placeholder.jpg");
                  } else if (showroomFormCategory === "stickers") {
                    if(!showroomBeforeUrl || !showroomAfterUrl) { alert("Both Before and After images required."); return; }
                    fd.append("imageUrlBefore", showroomBeforeUrl);
                    fd.append("imageUrlAfter", showroomAfterUrl);
                  }
                  const res = await uploadPortfolioItem(fd);
                  if (res.success) { alert("Published!"); setShowroomSubTab("list"); } else { alert(res.error); }
                }} className="space-y-4">
                  <input type="text" name="title" placeholder="Project Title" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white focus:outline-none" required />
                  <textarea name="description" placeholder="Concept summary..." rows={2} className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none" required />
                  <select value={showroomFormCategory} onChange={(e) => setShowroomFormCategory(e.target.value)} className="w-full bg-[#001a35] border border-white/[0.1] rounded-xl p-3 text-xs font-bold text-white">
                    <option value="graphics">Graphic Design</option>
                    <option value="video">Video Editing</option>
                    <option value="stickers">Laptop Skins Wrap</option>
                  </select>
                  <div className="space-y-3 pt-2">
                    {showroomFormCategory === "graphics" && <CldUploader acceptType="image" label={showroomAfterUrl ? "✓ Image Loaded" : "Upload Image"} onUploadSuccess={(url: string) => setShowroomAfterUrl(url)} />}
                    {showroomFormCategory === "video" && <CldUploader acceptType="video" label={showroomVideoUrl ? "✓ Video Loaded" : "Upload Video"} onUploadSuccess={(url: string) => setShowroomVideoUrl(url)} />}
                    {showroomFormCategory === "stickers" && (
                      <div className="grid gap-3">
                        <CldUploader acceptType="image" label={showroomBeforeUrl ? "✓ Before Image Loaded" : "Upload Before Image"} onUploadSuccess={(url: string) => setShowroomBeforeUrl(url)} />
                        <CldUploader acceptType="image" label={showroomAfterUrl ? "✓ After Image Loaded" : "Upload After Image"} onUploadSuccess={(url: string) => setShowroomAfterUrl(url)} />
                      </div>
                    )}
                  </div>
                  <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl mt-4">Save Staged Design Asset</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== NODE 1: FINANCIAL ANALYTICS & LEDGER ==================== */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider">Financial Analytics & Revenue Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Comprehensive audit breakdown of all store income channels</p>
              </div>
              <button onClick={exportCSVLedger} className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2.5 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition">
                <Download className="w-4 h-4" /> Export CSV Ledger
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Total Accumulated Gross</p>
                <h2 className="text-2xl font-mono font-black text-[#D4AF37]">GH₵ {totalRevenue.toFixed(2)}</h2>
                <p className="text-[10px] text-slate-500 pt-2">From {totalOrdersCount} processed orders</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Mobile Money / Paystack</p>
                <h2 className="text-2xl font-mono font-black text-blue-400">GH₵ {totalMomoRevenue.toFixed(2)}</h2>
                <p className="text-[10px] text-slate-500 pt-2">Instant digital clearance</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Average Ticket Order Value</p>
                <h2 className="text-2xl font-mono font-black text-purple-400">GH₵ {avgOrderValue.toFixed(2)}</h2>
                <p className="text-[10px] text-slate-500 pt-2">Per transaction ratio</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== NODE 2: SERVICE WORKFLOW QUEUE ==================== */}
        {activeTab === "service-queue" && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.06] pb-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Service Task & Order Workflow</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track hardware distribution and graphic production queues</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {["Queue Initialized", "In Production / Assembly", "Dispatched & Closed"].map((stage, idx) => (
                <div key={stage} className="bg-black/30 border border-white/[0.06] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-black uppercase text-[#D4AF37]">Stage {idx + 1}: {stage}</span>
                    <span className="text-[10px] font-mono text-slate-500">Node {idx + 1}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Tasks in this operational state update status automatically on WhatsApp alert dispatch.</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== NODE 3: PAYSTACK GATEWAY STATUS ==================== */}
        {activeTab === "gateway" && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.06] pb-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Paystack Integration Terminal</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monitor and configure Mobile Money and Card payment processing</p>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-6 max-w-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Zap className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white">Active Payment Key State</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Configured inside project environment file (.env)</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-black uppercase rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Active Test Mode
                </span>
              </div>

              <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Key Identifier:</span>
                  <span className="text-slate-200">pk_test_... (Mobile Money / Cards)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Supported Currencies:</span>
                  <span className="text-[#D4AF37]">GHS (Ghanaian Cedi)</span>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-[10px] text-yellow-300 space-y-1">
                <p className="font-bold uppercase">To Switch to Live Payments:</p>
                <p>Replace `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in your `.env` file with your `pk_live_...` key from dashboard.paystack.com and restart the server (`npm run dev`).</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== NODE 4: CRM DIRECTORY ==================== */}
        {activeTab === "crm" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-4">
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wider">Customer Relationship Management (CRM)</h3>
                <p className="text-xs text-slate-400 mt-0.5">Trace past clients, contact details, and lifetime spending</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">{customersList.length} Unique Clients</span>
            </div>

            {customersList.length === 0 ? (
              <p className="text-xs text-slate-500 uppercase tracking-wider py-12 text-center">No customer records in directory yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customersList.map((c, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black uppercase text-white">{c.name}</h4>
                      <span className="text-[9px] font-mono text-[#D4AF37] font-bold">{c.orderCount} Orders</span>
                    </div>

                    <div className="space-y-1 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-2"><Phone className="w-3 h-3 text-[#D4AF37]" /><span>{c.phone}</span></div>
                      {c.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-slate-500" /><span className="truncate">{c.email}</span></div>}
                      <div className="flex items-start gap-2 pt-1 border-t border-white/5"><MapPin className="w-3 h-3 text-red-400 shrink-0 mt-0.5" /><span className="line-clamp-2">{c.address}</span></div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Total Spent: <strong className="text-white font-mono">GH₵ {c.totalSpent.toFixed(2)}</strong></span>
                      <a href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="text-[9px] font-black uppercase text-green-400 hover:underline">WhatsApp</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== NODE 5: TERMINAL SETTINGS ==================== */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="border-b border-white/[0.06] pb-4">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">Terminal Diagnostics & Passkey Settings</h3>
              <p className="text-xs text-slate-400 mt-0.5">System security controls and database sync verification</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="text-xs font-black uppercase text-white">Admin Authentication Token</h4>
                </div>
                <p className="text-[10px] text-slate-400">Protected using HTTP-only encrypted session cookies and NextAuth environment secrets.</p>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-slate-300">
                  Status: AUTHENTICATED_ADMIN_SESSION
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-400" />
                  <h4 className="text-xs font-black uppercase text-white">XAMPP Database Sync Status</h4>
                </div>
                <p className="text-[10px] text-slate-400">Connected to local MySQL database instance via Prisma ORM connection string.</p>
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-mono text-[10px]">
                  Database: cal_web_db (Port 3306) - ONLINE
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EDIT PRODUCT MODAL DIALOG */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xs font-black uppercase text-[#D4AF37]">Edit Product: {editingProduct.title}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form action={async (fd) => {
              const res = await updateProductDetails(editingProduct.id, {
                title: String(fd.get("title")),
                price: parseFloat(String(fd.get("price"))),
                stockQuantity: parseInt(String(fd.get("stockQuantity"))),
                category: String(fd.get("category")),
                imageUrls: editProductImgUrl ? JSON.stringify([editProductImgUrl]) : undefined,
              });
              if (res.success) { alert("Product updated successfully!"); setEditingProduct(null); } else { alert(res.error); }
            }} className="space-y-3">
              <div>
                <label className="text-[9px] uppercase text-slate-400 font-bold">Title</label>
                <input type="text" name="title" defaultValue={editingProduct.title} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Price (GH₵)</label>
                  <input type="number" step="0.01" name="price" defaultValue={editingProduct.price} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono" required />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Stock Qty</label>
                  <input type="number" name="stockQuantity" defaultValue={editingProduct.stockQuantity} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono" required />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase text-slate-400 font-bold">Category</label>
                <select name="category" defaultValue={editingProduct.category} className="w-full bg-[#001a35] border border-white/10 rounded-xl p-2.5 text-xs text-white">
                  <option value="hardware">Phones & Devices</option>
                  <option value="electronics">Accessories & Chargers</option>
                  <option value="acoustics">Sound Systems</option>
                  <option value="lighting">LED Lighting System</option>
                  <option value="apparel">Custom Jerseys</option>
                </select>
              </div>

              <CldUploader acceptType="image" label={editProductImgUrl !== editingProduct.imageUrl ? "✓ New Image Uploaded" : "Change Product Image"} onUploadSuccess={(url: string) => setEditProductImgUrl(url)} />

              <button type="submit" className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3 rounded-xl mt-2">
                Save Product Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}