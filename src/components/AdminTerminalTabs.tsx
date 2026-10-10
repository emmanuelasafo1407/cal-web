"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Search, 
  MessageCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Download,
  BarChart3, 
  Users, 
  Settings, 
  CheckCircle2, 
  CreditCard, 
  Grid, 
  Image as ImageIcon,
  LogOut,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import CldUploader from "@/components/CldUploader";

interface CustomItemData {
  title?: string;
  category?: string;
  teamName?: string;
  season?: string;
  kitType?: string;
  size?: string;
  customized?: string;
  printedName?: string;
  printedNumber?: string;
  [key: string]: unknown;
}

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customData?: CustomItemData;
}

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryAddress: string;
  items: OrderItem[];
}

interface Product {
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

interface AdminTerminalTabsProps {
  orders: Order[];
  products?: Product[];
  portfolio?: PortfolioItem[];
}

export default function AdminTerminalTabs({ 
  orders = [], 
  products = [], 
  portfolio = [] 
}: AdminTerminalTabsProps) {
  const router = useRouter();

  // Navigation & Filtering
  const [activeMainTab, setActiveMainTab] = useState<
    "ORDERS" | "CATALOG" | "SHOWROOM" | "ANALYTICS" | "PAYSTACK" | "CRM" | "SETTINGS"
  >("ORDERS");
  
  const [feedCategory, setFeedCategory] = useState<"MASTER" | "MOMO" | "BANKING" | "CHECKER" | "PRODUCT">("MASTER");
  const [searchQuery, setSearchQuery] = useState("");

  // Local State for Instant UI Sync
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [localPortfolio, setLocalPortfolio] = useState<PortfolioItem[]>(portfolio);

  // Modals & Action States
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Showroom View / Edit / Add States
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [viewingPortfolio, setViewingPortfolio] = useState<PortfolioItem | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Upload State
  const [newProductImgUrl, setNewProductImgUrl] = useState("");
  const [editProductImgUrl, setEditProductImgUrl] = useState("");
  
  // New Showroom State
  const [selectedShowroomCategory, setSelectedShowroomCategory] = useState("graphics");
  const [pfImgBefore, setPfImgBefore] = useState("");
  const [pfImgAfter, setPfImgAfter] = useState("");
  const [pfVideoUrl, setPfVideoUrl] = useState("");

  // Edit Showroom State
  const [editPfImgBefore, setEditPfImgBefore] = useState("");
  const [editPfImgAfter, setEditPfImgAfter] = useState("");
  const [editPfVideoUrl, setEditPfVideoUrl] = useState("");

  // Orders Filter Logic
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (feedCategory === "MASTER") return true;

    if (feedCategory === "MOMO") {
      return order.items.some((it) => {
        const title = it.title.toLowerCase();
        const cat = String(it.customData?.category || "").toLowerCase();
        return title.includes("momo") || cat === "momo" || title.includes("agency banking");
      });
    }

    if (feedCategory === "BANKING") {
      return order.items.some((it) => {
        const title = it.title.toLowerCase();
        const cat = String(it.customData?.category || "").toLowerCase();
        return title.includes("bank") || cat === "banking" || title.includes("deposit");
      });
    }

    if (feedCategory === "CHECKER") {
      return order.items.some((it) => {
        const title = it.title.toLowerCase();
        const cat = String(it.customData?.category || "").toUpperCase();
        return title.includes("checker") || title.includes("waec") || cat === "CHECKER";
      });
    }

    if (feedCategory === "PRODUCT") {
      return order.items.some((it) => {
        const title = it.title.toLowerCase();
        const cat = String(it.customData?.category || "").toLowerCase();
        const isService = cat === "momo" || cat === "banking" || cat === "checker";
        return !isService || title.includes("charger") || title.includes("jersey") || Boolean(it.customData?.teamName);
      });
    }

    return true;
  });

  // Client Analytics Math
  const totalGrossRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalPaidOrders = orders.length;
  const avgOrderValue = totalPaidOrders > 0 ? totalGrossRevenue / totalPaidOrders : 0;
  const uniqueCustomersCount = new Set(orders.map((o) => o.phone)).size;

  // CSV Export Handler
  const exportToCSV = () => {
    const headers = ["Order Ref,Customer Name,Phone,Email,Payment Method,Total Charged (GHS),Address"];
    const rows = orders.map((o) => 
      `"${o.id.slice(0, 8)}","${o.customerName}","${o.phone}","${o.email}","${o.paymentMethod}",${o.totalAmount},"${o.deliveryAddress.replace(/"/g, '""')}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CAL_VENTURES_ORDERS_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Terminate Session Handler
  const handleLogout = () => {
    document.cookie = "admin_session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.reload();
  };

  // CREATE PRODUCT HANDLER
  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      price: Number(formData.get("price")),
      stockQuantity: Number(formData.get("stockQuantity")),
      category: String(formData.get("category")),
      imageUrl: newProductImgUrl || "/bg-evening.jpeg",
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create Product Error:", errorText);
        alert("Failed to save product to database.");
        return;
      }

      const data = await res.json();
      setLocalProducts((prev) => [data.product || { ...payload, id: `prod-${Date.now()}` }, ...prev]);
      setIsAddProductOpen(false);
      setNewProductImgUrl("");
      router.refresh();
    } catch (err) {
      console.error("CREATE_PRODUCT_ERROR:", err);
      alert("Error submitting product data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT PRODUCT HANDLER
  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      price: Number(formData.get("price")),
      stockQuantity: Number(formData.get("stockQuantity")),
      category: String(formData.get("category")),
      imageUrl: editProductImgUrl || editingProduct.imageUrl,
    };

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to update product.");
        return;
      }

      setLocalProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
      );
      setEditingProduct(null);
      setEditProductImgUrl("");
      router.refresh();
    } catch (err) {
      console.error("UPDATE_PRODUCT_ERROR:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CREATE SHOWROOM ITEM HANDLER
  const handleCreatePortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      category: selectedShowroomCategory,
      description: String(formData.get("description") || "").trim(),
      imageUrlBefore: pfImgBefore || undefined,
      imageUrlAfter: pfImgAfter || undefined,
      videoUrl: pfVideoUrl || undefined,
    };

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Create Portfolio Error:", errorText);
        alert("Failed to add showroom item.");
        return;
      }

      const data = await res.json();
      setLocalPortfolio((prev) => [data.item || { ...payload, id: `pf-${Date.now()}` }, ...prev]);
      setIsAddPortfolioOpen(false);
      setPfImgBefore("");
      setPfImgAfter("");
      setPfVideoUrl("");
      router.refresh();
    } catch (err) {
      console.error("CREATE_PORTFOLIO_ERROR:", err);
      alert("Error adding showroom item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // EDIT SHOWROOM ITEM HANDLER
  const handleUpdatePortfolio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPortfolio) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || editingPortfolio.category),
      description: String(formData.get("description") || "").trim(),
      imageUrlBefore: editPfImgBefore || editingPortfolio.imageUrlBefore || undefined,
      imageUrlAfter: editPfImgAfter || editingPortfolio.imageUrlAfter || undefined,
      videoUrl: editPfVideoUrl || editingPortfolio.videoUrl || undefined,
    };

    try {
      const res = await fetch(`/api/portfolio/${editingPortfolio.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Failed to update showroom entry.");
        return;
      }

      setLocalPortfolio((prev) =>
        prev.map((item) => (item.id === editingPortfolio.id ? { ...item, ...payload } : item))
      );
      setEditingPortfolio(null);
      router.refresh();
    } catch (err) {
      console.error("UPDATE_PORTFOLIO_ERROR:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE SHOWROOM ITEM HANDLER
  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showroom post permanently?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalPortfolio((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete showroom entry.");
      }
    } catch (err) {
      console.error("DELETE_PORTFOLIO_ERROR:", err);
      alert("Error deleting item.");
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="lg:col-span-3 space-y-6">
        <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 space-y-6 shadow-2xl flex flex-col justify-between min-h-[80vh]">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Core Operations</p>
              <nav className="mt-3 space-y-2">
                <button
                  onClick={() => setActiveMainTab("ORDERS")}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "ORDERS"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4" />
                    <span>Orders Feed</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10">
                    {orders.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMainTab("CATALOG")}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "CATALOG"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4" />
                    <span>Store Catalog</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10">
                    {localProducts.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMainTab("SHOWROOM")}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "SHOWROOM"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Showroom</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10">
                    {localPortfolio.length}
                  </span>
                </button>
              </nav>
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Management Suite</p>
              <nav className="mt-3 space-y-2">
                <button
                  onClick={() => setActiveMainTab("ANALYTICS")}
                  className={`w-full flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "ANALYTICS"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics & Ledger</span>
                </button>

                <button
                  onClick={() => setActiveMainTab("PAYSTACK")}
                  className={`w-full flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "PAYSTACK"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paystack Gateway</span>
                </button>

                <button
                  onClick={() => setActiveMainTab("CRM")}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "CRM"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>CRM Directory</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10">
                    {uniqueCustomersCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMainTab("SETTINGS")}
                  className={`w-full flex items-center gap-2.5 p-3.5 rounded-2xl text-xs font-black uppercase transition ${
                    activeMainTab === "SETTINGS"
                      ? "bg-white text-[#002147] shadow-xl"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Terminal Settings</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black text-xs uppercase p-3.5 rounded-2xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN TERMINAL VIEW */}
      <main className="lg:col-span-9 space-y-6">
        {/* TAB 1: ORDERS FEED */}
        {activeMainTab === "ORDERS" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
                {(["MASTER", "MOMO", "BANKING", "CHECKER", "PRODUCT"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFeedCategory(tab)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition ${
                      feedCategory === tab
                        ? "bg-[#D4AF37] text-[#002147] shadow-lg"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab === "MASTER" ? "MASTER FEED" : tab}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search orders, phone, ref..."
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl space-y-3">
                <Package className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  No orders match the [{feedCategory}] category {searchQuery ? `with query "${searchQuery}"` : ""}.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-5 hover:border-white/20 transition shadow-xl"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            REF: #{ord.id.slice(0, 8)}
                          </span>
                          <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            {ord.paymentMethod}
                          </span>
                        </div>
                        <h3 className="text-base font-black uppercase text-white mt-1.5">{ord.customerName}</h3>
                        <p className="text-xs font-mono text-[#D4AF37] mt-0.5">
                          {ord.phone} • {ord.email}
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1">{ord.deliveryAddress}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Total Charged
                        </span>
                        <span className="text-xl font-mono font-black text-[#D4AF37]">
                          GH₵ {Number(ord.totalAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-2.5">
                      <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                        Order Items Payload
                      </p>
                      {ord.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded-xl bg-black border border-white/10"
                              />
                            )}
                            <div>
                              <p className="font-bold text-white uppercase">{item.title}</p>
                              {item.customData && (
                                <div className="text-[10px] text-slate-400 font-mono mt-1 space-x-2">
                                  {Object.entries(item.customData).map(([k, v]) => (
                                    <span key={k} className="bg-black/30 px-2 py-0.5 rounded border border-white/5">
                                      <strong className="text-slate-300 uppercase">{k}:</strong> {String(v)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-[#D4AF37]">
                            GH₵ {Number(item.price).toFixed(2)} x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://wa.me/233${ord.phone.replace(/^0/, "")}?text=Hello%20${encodeURIComponent(
                          ord.customerName
                        )},%20your%20Constant%20A.%20Liberty%20order%20%23${ord.id.slice(0, 8)}%20is%20being%20processed!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-[#D4AF37] text-[#002147] font-black text-[10px] uppercase px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STORE CATALOG */}
        {activeMainTab === "CATALOG" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
              <div>
                <h2 className="text-lg font-black uppercase text-white">Product Catalog Inventory</h2>
                <p className="text-xs text-slate-400">Manage active store inventory and pricing.</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-[#D4AF37] text-[#002147] font-black text-xs uppercase px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {localProducts.map((p) => (
                <div key={p.id} className="bg-black/60 border border-white/10 rounded-2xl p-4 flex gap-4 items-center">
                  <img src={p.imageUrl} alt={p.title} className="w-20 h-20 object-cover rounded-xl bg-black" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 bg-white/5 text-[#D4AF37] rounded-full border border-white/10">
                      {p.category}
                    </span>
                    <h4 className="text-xs font-black uppercase text-white truncate mt-1">{p.title}</h4>
                    {p.description && (
                      <p className="text-[10px] text-slate-400 truncate">{p.description}</p>
                    )}
                    <p className="text-xs font-mono font-bold text-[#D4AF37] mt-1">GH₵ {p.price.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400">Stock: {p.stockQuantity} units</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setEditProductImgUrl(p.imageUrl);
                    }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SHOWROOM WITH VIEW, EDIT, AND DELETE */}
        {activeMainTab === "SHOWROOM" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
              <div>
                <h2 className="text-lg font-black uppercase text-white">Showroom & Portfolio Display</h2>
                <p className="text-xs text-slate-400">Manage promotional banners, flyers, videos, and laptop skins.</p>
              </div>
              <button
                onClick={() => setIsAddPortfolioOpen(true)}
                className="bg-[#D4AF37] text-[#002147] font-black text-xs uppercase px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Showroom Item
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {localPortfolio.map((pf) => (
                <div key={pf.id} className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-3 relative group">
                  {pf.imageUrlAfter && (
                    <img src={pf.imageUrlAfter} alt={pf.title} className="w-full aspect-video object-cover rounded-xl" />
                  )}
                  {pf.videoUrl && (
                    <video src={pf.videoUrl} className="w-full aspect-video rounded-xl bg-black object-cover" />
                  )}

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 bg-white/5 text-[#D4AF37] rounded-full border border-white/10">
                      {pf.category === "stickers" ? "Laptop Skin" : pf.category === "video" ? "Video Post" : "Graphic Design"}
                    </span>
                    
                    {/* ACTION BUTTONS (VIEW, EDIT, DELETE) */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setViewingPortfolio(pf)}
                        className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-300 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingPortfolio(pf);
                          setEditPfImgBefore(pf.imageUrlBefore || "");
                          setEditPfImgAfter(pf.imageUrlAfter || "");
                          setEditPfVideoUrl(pf.videoUrl || "");
                        }}
                        className="p-1.5 bg-white/5 hover:bg-white/15 text-[#D4AF37] rounded-lg transition"
                        title="Edit Post"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePortfolio(pf.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg transition"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-xs font-black uppercase text-white truncate">{pf.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{pf.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & LEDGER */}
        {activeMainTab === "ANALYTICS" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/[0.06] pb-6">
              <div>
                <h2 className="text-lg font-black uppercase text-white">Financial Ledger & Revenue</h2>
                <p className="text-xs text-slate-400">Real-time breakdown of store sales performance.</p>
              </div>
              <button
                onClick={exportToCSV}
                className="bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 transition border border-white/10"
              >
                <Download className="w-4 h-4" /> Export CSV Ledger
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Total Gross Volume</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <p className="text-2xl font-mono font-black text-[#D4AF37]">GH₵ {totalGrossRevenue.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">Cumulative sales across all modes</p>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Total Paid Orders</span>
                  <ShoppingBag className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-2xl font-mono font-black text-white">{totalPaidOrders}</p>
                <p className="text-[10px] text-slate-400">Cleared transactions processed</p>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-wider">Average Order Value</span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-2xl font-mono font-black text-white">GH₵ {avgOrderValue.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">Average spent per basket</p>
              </div>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase text-white tracking-wider">Revenue Breakdown Chart</h3>
              <div className="space-y-3 pt-2">
                {orders.map((o) => {
                  const percentage = totalGrossRevenue > 0 ? (o.totalAmount / totalGrossRevenue) * 100 : 0;
                  return (
                    <div key={o.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold uppercase">{o.customerName} (#{o.id.slice(0, 6)})</span>
                        <span className="text-[#D4AF37] font-black">GH₵ {o.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PAYSTACK GATEWAY */}
        {activeMainTab === "PAYSTACK" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <h2 className="text-lg font-black uppercase text-white border-b border-white/[0.06] pb-4">Paystack Gateway Status</h2>
            <div className="bg-black/60 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-green-400 text-xs font-bold uppercase">
                <CheckCircle2 className="w-5 h-5" /> Online Payment Terminal Live
              </div>
              <p className="text-xs text-slate-300">
                All card and MoMo settlements are routed through automated Paystack gateway protection.
              </p>
            </div>
          </div>
        )}

        {/* CRM DIRECTORY */}
        {activeMainTab === "CRM" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <h2 className="text-lg font-black uppercase text-white border-b border-white/[0.06] pb-4">Customer CRM Directory</h2>
            <div className="space-y-3">
              {Array.from(new Set(orders.map((o) => o.phone))).map((phone) => {
                const customerOrder = orders.find((o) => o.phone === phone);
                return (
                  <div key={phone} className="bg-black/60 border border-white/10 rounded-2xl p-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-white uppercase">{customerOrder?.customerName}</h4>
                      <p className="text-slate-400 font-mono">{phone} • {customerOrder?.email}</p>
                    </div>
                    <a
                      href={`https://wa.me/233${phone.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeMainTab === "SETTINGS" && (
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <h2 className="text-lg font-black uppercase text-white border-b border-white/[0.06] pb-4">Terminal Settings</h2>
            <p className="text-xs text-slate-400">Database Engine: XAMPP MySQL (Port 3306)</p>
          </div>
        )}
      </main>

      {/* MODAL: ADD NEW PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Add New Product</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Product Title</label>
                <input name="title" required type="text" placeholder="e.g. POWER BANK / Type C Fast Charger" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea name="description" rows={2} placeholder="Item specifications and details..." className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Price (GH₵)</label>
                  <input name="price" required type="number" step="0.01" placeholder="70.00" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Stock Units</label>
                  <input name="stockQuantity" required type="number" placeholder="2" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select name="category" className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white">
                  <option value="electronics">Electronics & Chargers</option>
                  <option value="apparel">Custom Jerseys</option>
                  <option value="hardware">Phones & Gear</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Product Media</label>
                <CldUploader
                  acceptType="image"
                  label="Upload Product Image"
                  onUploadSuccess={(url) => setNewProductImgUrl(url)}
                />
                {newProductImgUrl && (
                  <img src={newProductImgUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-xl border border-white/10" />
                )}
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "CREATING..." : "CREATE CATALOG ENTRY"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Edit Product Item</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Product Title</label>
                <input name="title" required type="text" defaultValue={editingProduct.title} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea name="description" rows={2} defaultValue={editingProduct.description || ""} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Price (GH₵)</label>
                  <input name="price" required type="number" step="0.01" defaultValue={editingProduct.price} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Stock Quantity</label>
                  <input name="stockQuantity" required type="number" defaultValue={editingProduct.stockQuantity} className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select name="category" defaultValue={editingProduct.category} className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white">
                  <option value="electronics">Electronics & Chargers</option>
                  <option value="apparel">Custom Jerseys</option>
                  <option value="hardware">Phones & Gear</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Update Image</label>
                <CldUploader
                  acceptType="image"
                  label="Change Image"
                  onUploadSuccess={(url) => setEditProductImgUrl(url)}
                />
                {(editProductImgUrl || editingProduct.imageUrl) && (
                  <img src={editProductImgUrl || editingProduct.imageUrl} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-xl border border-white/10" />
                )}
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "SAVING..." : "SAVE PRODUCT CHANGES"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SHOWROOM ITEM */}
      {isAddPortfolioOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Add Showroom Showcase Item</h3>
              <button onClick={() => setIsAddPortfolioOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePortfolio} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Showcase Title</label>
                <input name="title" required type="text" placeholder="e.g. Flyer for church / Custom Laptop Skin" className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select 
                  name="category" 
                  value={selectedShowroomCategory}
                  onChange={(e) => setSelectedShowroomCategory(e.target.value)}
                  className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white"
                >
                  <option value="graphics">Graphic Design & Flyers</option>
                  <option value="stickers">Laptop Skins & Decals</option>
                  <option value="video">Video Editing & Motion</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea name="description" rows={2} placeholder="Provide details about the showcase project..." className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white" />
              </div>

              <div className="space-y-3 pt-1 border-t border-white/10">
                {selectedShowroomCategory === "graphics" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Artwork / Flyer Image</label>
                    <CldUploader
                      acceptType="image"
                      label="Upload Showcase Image"
                      onUploadSuccess={(url) => setPfImgAfter(url)}
                    />
                    {pfImgAfter && <img src={pfImgAfter} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-xl" />}
                  </div>
                )}

                {selectedShowroomCategory === "stickers" && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Finished Product Image (After)</label>
                      <CldUploader
                        acceptType="image"
                        label="Upload After Image"
                        onUploadSuccess={(url) => setPfImgAfter(url)}
                      />
                      {pfImgAfter && <img src={pfImgAfter} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-xl" />}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Original Device Image (Before)</label>
                      <CldUploader
                        acceptType="image"
                        label="Upload Before Image"
                        onUploadSuccess={(url) => setPfImgBefore(url)}
                      />
                      {pfImgBefore && <img src={pfImgBefore} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-xl" />}
                    </div>
                  </>
                )}

                {selectedShowroomCategory === "video" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Showcase Video Clip</label>
                    <CldUploader
                      acceptType="video"
                      label="Upload Video Clip"
                      onUploadSuccess={(url) => setPfVideoUrl(url)}
                    />
                    {pfVideoUrl && <p className="text-[10px] font-mono text-green-400 mt-1">✓ Video Clip Uploaded</p>}
                  </div>
                )}
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "PUBLISHING..." : "PUBLISH TO SHOWROOM"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SHOWROOM ITEM */}
      {viewingPortfolio && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20">
                {viewingPortfolio.category}
              </span>
              <button onClick={() => setViewingPortfolio(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-base font-black uppercase text-white">{viewingPortfolio.title}</h3>

            {viewingPortfolio.imageUrlAfter && (
              <img src={viewingPortfolio.imageUrlAfter} alt={viewingPortfolio.title} className="w-full max-h-64 object-contain rounded-xl bg-black/40" />
            )}

            {viewingPortfolio.imageUrlBefore && (
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Before Wrap / Original Device</p>
                <img src={viewingPortfolio.imageUrlBefore} alt="Before" className="w-full max-h-40 object-contain rounded-xl bg-black/40" />
              </div>
            )}

            {viewingPortfolio.videoUrl && (
              <video src={viewingPortfolio.videoUrl} controls className="w-full rounded-xl bg-black max-h-64" />
            )}

            {viewingPortfolio.description && (
              <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                {viewingPortfolio.description}
              </p>
            )}

            <div className="pt-2 flex justify-between items-center border-t border-white/10">
              {viewingPortfolio.imageUrlAfter && (
                <a
                  href={viewingPortfolio.imageUrlAfter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Media In New Tab
                </a>
              )}
              <button
                onClick={() => setViewingPortfolio(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase px-4 py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SHOWROOM ITEM */}
      {editingPortfolio && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Edit Showroom Post</h3>
              <button onClick={() => setEditingPortfolio(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePortfolio} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Showcase Title</label>
                <input
                  name="title"
                  required
                  type="text"
                  defaultValue={editingPortfolio.title}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select
                  name="category"
                  defaultValue={editingPortfolio.category}
                  className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white"
                >
                  <option value="graphics">Graphic Design & Flyers</option>
                  <option value="stickers">Laptop Skins & Decals</option>
                  <option value="video">Video Editing & Motion</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingPortfolio.description || ""}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-3 pt-1 border-t border-white/10">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Artwork / Image (After)</label>
                  <CldUploader
                    acceptType="image"
                    label="Change Image"
                    onUploadSuccess={(url) => setEditPfImgAfter(url)}
                  />
                  {(editPfImgAfter || editingPortfolio.imageUrlAfter) && (
                    <img src={editPfImgAfter || editingPortfolio.imageUrlAfter} alt="Preview" className="mt-2 h-16 w-full object-cover rounded-xl" />
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Before Image (Optional)</label>
                  <CldUploader
                    acceptType="image"
                    label="Change Before Image"
                    onUploadSuccess={(url) => setEditPfImgBefore(url)}
                  />
                  {(editPfImgBefore || editingPortfolio.imageUrlBefore) && (
                    <img src={editPfImgBefore || editingPortfolio.imageUrlBefore} alt="Preview" className="mt-2 h-16 w-full object-cover rounded-xl" />
                  )}
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "SAVING..." : "SAVE POST CHANGES"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}