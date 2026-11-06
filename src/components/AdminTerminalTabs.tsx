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
  ExternalLink,
  Clock,
  AlertCircle
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
  paymentReference?: string | null;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
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

type MainTab = "ORDERS" | "CATALOG" | "SHOWROOM" | "ANALYTICS" | "PAYSTACK" | "CRM" | "SETTINGS";

export default function AdminTerminalTabs({ 
  orders = [], 
  products = [], 
  portfolio = [] 
}: AdminTerminalTabsProps) {
  const router = useRouter();

  // Navigation & Filtering
  const [activeMainTab, setActiveMainTab] = useState<MainTab>("ORDERS");
  const [orderFilter, setOrderFilter] = useState<"ALL" | "PAID" | "DELIVERY" | "PENDING" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Local State for Instant UI Sync
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
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

  // Filter Orders
  const filteredOrders = localOrders.filter((order) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.customerName.toLowerCase().includes(query) ||
      order.phone.includes(query) ||
      order.email.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      (order.paymentReference && order.paymentReference.toLowerCase().includes(query));

    if (!matchesSearch) return false;

    if (orderFilter === "ALL") return true;
    if (orderFilter === "PAID") return order.paymentStatus === "PAID";
    if (orderFilter === "DELIVERY") return order.paymentMethod === "PAY_ON_DELIVERY";
    if (orderFilter === "PENDING") return order.status === "PENDING";
    if (orderFilter === "COMPLETED") return order.status === "COMPLETED";

    return true;
  });

  // Analytics Math
  const totalGrossRevenue = localOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const paidOnlineOrders = localOrders.filter((o) => o.paymentStatus === "PAID");
  const paidOnlineRevenue = paidOnlineOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const deliveryOrders = localOrders.filter((o) => o.paymentMethod === "PAY_ON_DELIVERY");
  const deliveryPendingRevenue = deliveryOrders
    .filter((o) => o.paymentStatus !== "PAID")
    .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const completedOrdersCount = localOrders.filter((o) => o.status === "COMPLETED").length;
  const avgOrderValue = localOrders.length > 0 ? totalGrossRevenue / localOrders.length : 0;
  const uniqueCustomersCount = new Set(localOrders.map((o) => o.phone)).size;

  // CSV Export Handler
  const exportToCSV = () => {
    const headers = ["Order ID,Customer Name,Phone,Email,Payment Method,Paystack Reference,Payment Status,Order Status,Total (GHS),Delivery Address,Created Date"];
    const rows = localOrders.map((o) => 
      `"${o.id.slice(0, 8)}","${o.customerName}","${o.phone}","${o.email}","${o.paymentMethod}","${o.paymentReference || "N/A"}","${o.paymentStatus}","${o.status}",${o.totalAmount},"${o.deliveryAddress.replace(/"/g, '""')}","${new Date(o.createdAt).toLocaleDateString()}"`
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

  // UPDATE ORDER STATUS (PENDING, PROCESSING, COMPLETED, CANCELLED)
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setLocalOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Could not update order status. Please try again.");
      }
    } catch {
      alert("Error updating order status.");
    }
  };

  // UPDATE ORDER PAYMENT STATUS (PENDING, PAID)
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (res.ok) {
        setLocalOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
        );
      } else {
        alert("Could not update payment status.");
      }
    } catch {
      alert("Error updating payment status.");
    }
  };

  // DELETE ORDER
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order record?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setLocalOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        alert("Failed to delete order.");
      }
    } catch {
      alert("Error deleting order.");
    }
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
      imageUrl: newProductImgUrl || "/shop-day.jpeg",
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || "Failed to save product.");
        return;
      }

      const data = await res.json();
      const created = data.product || { ...payload, id: `prod-${Date.now()}` };
      setLocalProducts((prev) => [
        {
          id: created.id,
          title: created.title,
          description: created.description || "",
          price: Number(created.price),
          category: created.category,
          stockQuantity: created.stockQuantity,
          imageUrl: newProductImgUrl || "/shop-day.jpeg",
        },
        ...prev,
      ]);
      setIsAddProductOpen(false);
      setNewProductImgUrl("");
      router.refresh();
    } catch (err) {
      console.error("CREATE_PRODUCT_ERROR:", err);
      alert("Error saving product.");
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
      alert("Error updating product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product from your catalog?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalProducts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete product.");
      }
    } catch {
      alert("Error deleting product.");
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
      alert("Error updating showroom entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE SHOWROOM ITEM HANDLER
  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showroom item permanently?")) return;

    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalPortfolio((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      } else {
        alert("Failed to delete showroom item.");
      }
    } catch (err) {
      console.error("DELETE_PORTFOLIO_ERROR:", err);
      alert("Error deleting item.");
    }
  };

  const navTabs = [
    { id: "ORDERS" as const, label: "Orders", icon: Package, count: localOrders.length },
    { id: "CATALOG" as const, label: "Products", icon: Grid, count: localProducts.length },
    { id: "SHOWROOM" as const, label: "Showroom", icon: ImageIcon, count: localPortfolio.length },
    { id: "ANALYTICS" as const, label: "Analytics & Sales", icon: BarChart3 },
    { id: "PAYSTACK" as const, label: "Paystack Payments", icon: CreditCard, count: paidOnlineOrders.length },
    { id: "CRM" as const, label: "Customers", icon: Users, count: uniqueCustomersCount },
    { id: "SETTINGS" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* MOBILE SCROLLABLE TAB NAVIGATION */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase whitespace-nowrap transition shrink-0 ${
                isActive
                  ? "bg-[#D4AF37] text-[#002147] shadow-lg"
                  : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-black/20 text-[#002147]" : "bg-white/10 text-slate-300"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 whitespace-nowrap shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP LEFT SIDEBAR NAVIGATION */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-6">
          <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-6 space-y-6 shadow-2xl flex flex-col justify-between min-h-[75vh]">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                  Store Controls
                </p>
                <nav className="mt-3 space-y-1.5">
                  {navTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeMainTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveMainTab(tab.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black uppercase transition ${
                          isActive
                            ? "bg-white text-[#002147] shadow-xl"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{tab.label}</span>
                        </div>
                        {tab.count !== undefined && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? "bg-black/10 text-[#002147]" : "bg-white/10 text-slate-300"}`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black text-xs uppercase p-3 rounded-2xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="lg:col-span-9 space-y-6 min-w-0">

          {/* TAB 1: ORDERS */}
          {activeMainTab === "ORDERS" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                {/* Status Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {[
                    { id: "ALL" as const, label: `All (${localOrders.length})` },
                    { id: "PAID" as const, label: `Paid Online (${paidOnlineOrders.length})` },
                    { id: "DELIVERY" as const, label: `Pay on Delivery (${deliveryOrders.length})` },
                    { id: "PENDING" as const, label: "Pending" },
                    { id: "COMPLETED" as const, label: "Completed" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderFilter(filter.id)}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition ${
                        orderFilter === filter.id
                          ? "bg-[#D4AF37] text-[#002147] shadow-md"
                          : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, ref..."
                    className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl space-y-2">
                  <Package className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    No orders match your filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const isPaid = ord.paymentStatus === "PAID";
                    const isDelivery = ord.paymentMethod === "PAY_ON_DELIVERY";

                    return (
                      <div
                        key={ord.id}
                        className="bg-black/60 border border-white/10 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-white/20 transition shadow-xl"
                      >
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">
                                ORDER #{ord.id.slice(0, 8)}
                              </span>

                              {/* Payment Status Badge */}
                              <span
                                className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                                  isPaid
                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {isPaid ? "✓ Paid Online (Paystack)" : isDelivery ? "🚚 Pay on Delivery (Unpaid)" : "⏳ Payment Pending"}
                              </span>

                              {/* Order Fulfillment Status Badge */}
                              <span
                                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  ord.status === "COMPLETED"
                                    ? "bg-blue-500/20 text-blue-300"
                                    : ord.status === "CANCELLED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-white/10 text-slate-300"
                                }`}
                              >
                                Status: {ord.status}
                              </span>
                            </div>

                            <h3 className="text-base font-black uppercase text-white">
                              {ord.customerName}
                            </h3>

                            <p className="text-xs font-mono text-[#D4AF37]">
                              {ord.phone} • {ord.email}
                            </p>

                            <p className="text-[11px] text-slate-300">
                              <span className="text-slate-400 font-bold">Delivery:</span> {ord.deliveryAddress}
                            </p>

                            {ord.paymentReference && (
                              <p className="text-[10px] font-mono text-green-400">
                                Paystack Ref: {ord.paymentReference}
                              </p>
                            )}

                            <p className="text-[9px] text-slate-500 font-mono">
                              Date: {new Date(ord.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="text-right sm:self-start">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                              Total Amount
                            </span>
                            <span className="text-xl font-mono font-black text-[#D4AF37]">
                              GH₵ {Number(ord.totalAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items Payload */}
                        <div className="border-t border-white/5 pt-3 space-y-2">
                          <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                            Products in this order ({ord.items.length})
                          </p>
                          {ord.items.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white/5 border border-white/5 rounded-2xl p-3 flex flex-wrap justify-between items-center gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {item.imageUrl && (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-10 h-10 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                                  />
                                )}
                                <div>
                                  <p className="font-bold text-white uppercase">{item.title}</p>
                                  {item.customData && (
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap gap-1">
                                      {Object.entries(item.customData).map(([k, v]) => (
                                        <span key={k} className="bg-black/30 px-1.5 py-0.5 rounded border border-white/5">
                                          <strong className="text-slate-300 capitalize">{k}:</strong> {String(v)}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono font-bold text-[#D4AF37]">
                                GH₵ {Number(item.price).toFixed(2)} × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Status Control Actions & WhatsApp Button */}
                        <div className="border-t border-white/5 pt-3 flex flex-wrap items-center justify-between gap-3">
                          {/* Status Selectors */}
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Order Status Selector */}
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Order:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-[#002147] border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </div>

                            {/* Payment Status Selector (especially useful for Pay on Delivery!) */}
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">Payment:</span>
                              <select
                                value={ord.paymentStatus}
                                onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value)}
                                className={`border rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none ${
                                  ord.paymentStatus === "PAID"
                                    ? "bg-green-950/60 text-green-300 border-green-500/30"
                                    : "bg-amber-950/60 text-amber-300 border-amber-500/30"
                                }`}
                              >
                                <option value="PENDING">UNPAID / PENDING</option>
                                <option value="PAID">PAID</option>
                              </select>
                            </div>
                          </div>

                          {/* Quick Actions: WhatsApp & Delete */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
                              title="Delete order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <a
                              href={`https://wa.me/233${ord.phone.replace(/^0/, "")}?text=Hello%20${encodeURIComponent(
                                ord.customerName
                              )},%20your%20Constant%20A.%20Liberty%20order%20%23${ord.id.slice(0, 8)}%20is%20${ord.status.toLowerCase()}!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-white hover:bg-[#D4AF37] text-[#002147] font-black text-[10px] uppercase px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeMainTab === "CATALOG" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.06] pb-5">
                <div>
                  <h2 className="text-lg font-black uppercase text-white">Products & Inventory</h2>
                  <p className="text-xs text-slate-400">Manage available products, prices, and stock counts.</p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="bg-[#D4AF37] text-[#002147] font-black text-xs uppercase px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {localProducts.map((p) => {
                  const isOutOfStock = p.stockQuantity <= 0;
                  return (
                    <div
                      key={p.id}
                      className="bg-black/60 border border-white/10 rounded-2xl p-4 flex gap-4 items-center"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="w-20 h-20 object-cover rounded-xl bg-black border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-white/5 text-[#D4AF37] rounded-full border border-white/10">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-black uppercase text-white truncate mt-1">
                          {p.title}
                        </h4>
                        <p className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5">
                          GH₵ {p.price.toFixed(2)}
                        </p>
                        <p
                          className={`text-[10px] font-bold mt-0.5 ${
                            isOutOfStock ? "text-red-400" : p.stockQuantity <= 3 ? "text-amber-400" : "text-green-400"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : `${p.stockQuantity} units available`}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setEditProductImgUrl(p.imageUrl);
                          }}
                          className="p-2 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl transition"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SHOWROOM */}
          {activeMainTab === "SHOWROOM" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.06] pb-5">
                <div>
                  <h2 className="text-lg font-black uppercase text-white">Showroom & Portfolio</h2>
                  <p className="text-xs text-slate-400">Showcase past work, graphics, laptop skins, and videos.</p>
                </div>
                <button
                  onClick={() => setIsAddPortfolioOpen(true)}
                  className="bg-[#D4AF37] text-[#002147] font-black text-xs uppercase px-5 py-3 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Showcase Item
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {localPortfolio.map((pf) => (
                  <div key={pf.id} className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-3 relative group">
                    {pf.imageUrlAfter && (
                      <img src={pf.imageUrlAfter} alt={pf.title} className="w-full aspect-video object-cover rounded-xl" />
                    )}
                    {pf.videoUrl && !pf.imageUrlAfter && (
                      <video src={pf.videoUrl} className="w-full aspect-video rounded-xl bg-black object-cover" />
                    )}

                    <div className="flex justify-between items-center pt-1">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-white/5 text-[#D4AF37] rounded-full border border-white/10">
                        {pf.category === "stickers" ? "Laptop Skin" : pf.category === "video" ? "Video" : "Graphic Design"}
                      </span>
                      
                      <div className="flex items-center gap-1">
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
                    {pf.description && (
                      <p className="text-[10px] text-slate-400 line-clamp-2">{pf.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS & LEDGER */}
          {activeMainTab === "ANALYTICS" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.06] pb-5">
                <div>
                  <h2 className="text-lg font-black uppercase text-white">Sales & Financial Overview</h2>
                  <p className="text-xs text-slate-400">Track total orders, online payments, and delivery balances.</p>
                </div>
                <button
                  onClick={exportToCSV}
                  className="bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase px-4 py-2.5 rounded-xl flex items-center gap-2 transition border border-white/10 shrink-0"
                >
                  <Download className="w-4 h-4" /> Export CSV File
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Total Sales Volume</span>
                    <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-2xl font-mono font-black text-[#D4AF37]">
                    GH₵ {totalGrossRevenue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">{localOrders.length} total orders recorded</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Paystack Online (Paid)</span>
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-mono font-black text-green-400">
                    GH₵ {paidOnlineRevenue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">{paidOnlineOrders.length} confirmed online payments</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Pay on Delivery (Pending)</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-mono font-black text-amber-400">
                    GH₵ {deliveryPendingRevenue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">{deliveryOrders.filter((o) => o.paymentStatus !== "PAID").length} orders pending payment at delivery</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Completed Deliveries</span>
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-mono font-black text-white">
                    {completedOrdersCount}
                  </p>
                  <p className="text-[10px] text-slate-400">Fulfilled orders</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Average Order Amount</span>
                    <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-2xl font-mono font-black text-white">
                    GH₵ {avgOrderValue.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400">Per customer order average</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-wider">Total Unique Customers</span>
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-mono font-black text-white">
                    {uniqueCustomersCount}
                  </p>
                  <p className="text-[10px] text-slate-400">Registered phone numbers</p>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-black uppercase text-white tracking-wider">Recent Orders Breakdown</h3>
                <div className="space-y-2.5 pt-1">
                  {localOrders.slice(0, 10).map((o) => {
                    const percentage = totalGrossRevenue > 0 ? (o.totalAmount / totalGrossRevenue) * 100 : 0;
                    return (
                      <div key={o.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-300 font-bold uppercase truncate max-w-[200px]">
                            {o.customerName} (#{o.id.slice(0, 6)})
                          </span>
                          <span className="text-[#D4AF37] font-black">GH₵ {o.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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

          {/* TAB 5: PAYSTACK */}
          {activeMainTab === "PAYSTACK" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="border-b border-white/[0.06] pb-4">
                <h2 className="text-lg font-black uppercase text-white">Paystack Online Payment Records</h2>
                <p className="text-xs text-slate-400">All payments processed through Paystack Mobile Money and Cards.</p>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3 text-green-400 text-xs font-bold uppercase">
                  <CheckCircle2 className="w-5 h-5" /> Paystack Gateway Active
                </div>
                <p className="text-xs text-slate-300">
                  Payments are automatically verified and recorded with their unique Paystack Reference.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                  Confirmed Online Transactions ({paidOnlineOrders.length})
                </h3>

                {paidOnlineOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center border border-dashed border-white/10 rounded-2xl">
                    No online payments recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {paidOnlineOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-black/60 border border-green-500/20 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white uppercase">{ord.customerName}</span>
                            <span className="text-[9px] font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded">PAID</span>
                          </div>
                          <p className="text-xs text-[#D4AF37] font-mono mt-0.5">{ord.phone} • {ord.email}</p>
                          {ord.paymentReference && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              Reference: <strong className="text-white">{ord.paymentReference}</strong>
                            </p>
                          )}
                          <p className="text-[9px] text-slate-500 font-mono">
                            {new Date(ord.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-mono font-black text-green-400">
                            GH₵ {ord.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: CRM DIRECTORY */}
          {activeMainTab === "CRM" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="border-b border-white/[0.06] pb-4">
                <h2 className="text-lg font-black uppercase text-white">Customer Directory</h2>
                <p className="text-xs text-slate-400">Contact information of customers who ordered from your store.</p>
              </div>

              <div className="space-y-3">
                {Array.from(new Set(localOrders.map((o) => o.phone))).map((phone) => {
                  const customerOrders = localOrders.filter((o) => o.phone === phone);
                  const latestOrder = customerOrders[0];
                  const totalSpent = customerOrders.reduce((s, o) => s + o.totalAmount, 0);

                  return (
                    <div
                      key={phone}
                      className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-white uppercase">{latestOrder?.customerName}</h4>
                        <p className="text-slate-400 font-mono mt-0.5">{phone} • {latestOrder?.email}</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Orders: <strong className="text-[#D4AF37]">{customerOrders.length}</strong> | Total Spent: <strong className="text-[#D4AF37]">GH₵ {totalSpent.toFixed(2)}</strong>
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/233${phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Message on WhatsApp
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeMainTab === "SETTINGS" && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
              <div className="border-b border-white/[0.06] pb-4">
                <h2 className="text-lg font-black uppercase text-white">Dashboard Settings</h2>
                <p className="text-xs text-slate-400">System configuration and connection statuses.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase text-[#D4AF37]">Database</h4>
                  <p className="text-xs text-slate-300 mt-1">MySQL via XAMPP / Cloud Database</p>
                  <p className="text-[10px] text-green-400 mt-0.5">✓ Connected & synchronized</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase text-[#D4AF37]">Payment Gateway</h4>
                  <p className="text-xs text-slate-300 mt-1">Paystack Online Checkout (MoMo & Card)</p>
                  <p className="text-[10px] text-green-400 mt-0.5">✓ Active and ready</p>
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase text-[#D4AF37]">Cloudinary Media Storage</h4>
                  <p className="text-xs text-slate-300 mt-1">Preset: cal_web_preset</p>
                  <p className="text-[10px] text-green-400 mt-0.5">✓ Ready for direct uploads</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-black text-xs uppercase px-5 py-3 rounded-xl transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD PRODUCT */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Add New Product</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Product Title</label>
                <input
                  name="title"
                  required
                  type="text"
                  placeholder="Enter product title"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Enter product description and specifications..."
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Price (GH₵)</label>
                  <input
                    name="price"
                    required
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Stock Quantity</label>
                  <input
                    name="stockQuantity"
                    required
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select
                  name="category"
                  className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="electronics">Electronics & Chargers</option>
                  <option value="apparel">Custom Jerseys</option>
                  <option value="hardware">Phones & Gear</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Product Image</label>
                <CldUploader
                  acceptType="image"
                  label="Upload Product Image"
                  onUploadSuccess={(url) => setNewProductImgUrl(url)}
                />
                {newProductImgUrl && (
                  <img
                    src={newProductImgUrl}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded-xl border border-white/10"
                  />
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Add to Store"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Edit Product</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Product Title</label>
                <input
                  name="title"
                  required
                  type="text"
                  defaultValue={editingProduct.title}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingProduct.description || ""}
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Price (GH₵)</label>
                  <input
                    name="price"
                    required
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct.price}
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Stock Quantity</label>
                  <input
                    name="stockQuantity"
                    required
                    type="number"
                    min="0"
                    defaultValue={editingProduct.stockQuantity}
                    className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select
                  name="category"
                  defaultValue={editingProduct.category}
                  className="w-full mt-1 bg-[#002147] border border-white/10 rounded-xl p-3 text-xs text-white"
                >
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
                  <img
                    src={editProductImgUrl || editingProduct.imageUrl}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded-xl border border-white/10"
                  />
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Product Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SHOWROOM ITEM */}
      {isAddPortfolioOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Add Showroom Item</h3>
              <button onClick={() => setIsAddPortfolioOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePortfolio} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Title</label>
                <input
                  name="title"
                  required
                  type="text"
                  placeholder="Enter title"
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
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
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Enter description of this project..."
                  className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-3 pt-1 border-t border-white/10">
                {selectedShowroomCategory === "graphics" && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Artwork Image</label>
                    <CldUploader
                      acceptType="image"
                      label="Upload Image"
                      onUploadSuccess={(url) => setPfImgAfter(url)}
                    />
                    {pfImgAfter && <img src={pfImgAfter} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-xl" />}
                  </div>
                )}

                {selectedShowroomCategory === "stickers" && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Finished Skin (After)</label>
                      <CldUploader
                        acceptType="image"
                        label="Upload After Image"
                        onUploadSuccess={(url) => setPfImgAfter(url)}
                      />
                      {pfImgAfter && <img src={pfImgAfter} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-xl" />}
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Original Device (Before)</label>
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
                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Video Clip</label>
                    <CldUploader
                      acceptType="video"
                      label="Upload Video Clip"
                      onUploadSuccess={(url) => setPfVideoUrl(url)}
                    />
                    {pfVideoUrl && <p className="text-[10px] font-mono text-green-400 mt-1">✓ Video uploaded successfully</p>}
                  </div>
                )}
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-[#D4AF37] text-[#002147] font-black text-xs uppercase py-3.5 rounded-xl hover:opacity-90 transition disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Add to Showroom"}
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
                  <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
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
          <div className="bg-[#001124] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl my-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase text-white">Edit Showroom Item</h3>
              <button onClick={() => setEditingPortfolio(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePortfolio} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Title</label>
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
