import { cookies } from "next/headers";
import { db } from "@/lib/db";
import AdminTerminalTabs from "@/components/AdminTerminalTabs";
import AdminLoginForm from "@/components/AdminLoginForm";
import { Lock } from "lucide-react";

export const revalidate = 0;

// Custom interface structures to handle runtime data mapping error-free
interface DynamicOrderItem {
  id: string;
  orderId?: string;
  price: unknown;
  quantity?: number;
  customData?: string;
  product?: {
    title?: string;
  };
}

interface DynamicOrder {
  id: string;
  customerName?: string;
  email?: string;
  phone?: string;
  paymentMethod?: string;
  totalAmount: unknown;
  deliveryAddress?: string;
  address?: string;
  items?: DynamicOrderItem[];
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session_token")?.value === "active_authenticated_state";

  // IF NOT AUTHENTICATED, RENDER THE SECURITY GATE WITH VISIBILITY TOGGLE FORM
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 text-white bg-[#001124]">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-3xl border border-white/[0.06] rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-4 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37] border border-[#D4AF37]/20">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">Terminal Gate Guard</h2>
            <p className="text-xs text-slate-400 max-w-xs">Enter system security tokens to open administrative control feeds.</p>
          </div>

          <AdminLoginForm />
        </div>
      </div>
    );
  }

  // IF AUTHENTICATED, ACCESS ACTIVE DATASETS
  const baseOrders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch from our newly created table structure safely
  const orderItemsFeed = await db.orderItem.findMany({
    include: {
      product: true,
    } as unknown as undefined,
  });

  const formattedOrders = (baseOrders as unknown as DynamicOrder[]).map((order) => {
    const matchedItems = (orderItemsFeed as unknown as DynamicOrderItem[]).filter(
      (item: DynamicOrderItem) => item.orderId === order.id
    );

    return {
      id: order.id,
      customerName: order.customerName || "Anonymous Customer",
      email: order.email || "",
      phone: order.phone || "",
      paymentMethod: order.paymentMethod || "momo",
      totalAmount: Number(order.totalAmount || 0),
      deliveryAddress: order.deliveryAddress || order.address || "N/A",
      items: matchedItems.map((it) => ({
        id: it.id,
        title: it.product?.title || "Custom Digital Service Token",
        price: Number(it.price || 0),
        quantity: it.quantity || 1,
        customData: it.customData ? JSON.parse(it.customData) : undefined,
      })),
    };
  });

  return (
    <div className="p-6 lg:p-12 bg-[#001124] min-h-screen text-white">
      <header className="mb-8 border-b border-white/[0.06] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Internal Node Entry</p>
          <h1 className="text-2xl font-black uppercase tracking-tight mt-0.5">Management Terminal Console</h1>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Database Sync: Live (XAMPP 3306)
        </div>
      </header>

      <AdminTerminalTabs orders={formattedOrders} />
    </div>
  );
}