import { getQueuedServices } from "./actions";
import AdminTerminalTabs from "@/components/AdminTerminalTabs";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const rawOrders = await getQueuedServices();

  // Safely map incoming DB elements into readable layout payloads
  // Safely map incoming DB elements into readable layout payloads using type casting
  const orders = rawOrders.map((rawOrder) => {
    const o = rawOrder as any;
    let orderItemsArray: any[] = [];
    try {
      if (typeof o.items === "string") {
        orderItemsArray = JSON.parse(o.items);
      } else if (Array.isArray(o.items)) {
        orderItemsArray = o.items;
      }
    } catch {
      orderItemsArray = [];
    }

    return {
      id: String(o.id),
      customerName: String(o.customerName),
      email: String(o.email),
      phone: String(o.phone),
      paymentMethod: String(o.paymentMethod),
      totalAmount: Number(o.totalAmount),
      deliveryAddress: String(o.deliveryAddress || "N/A"),
      items: orderItemsArray
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001124] via-[#001a35] to-[#000d1a] py-16 px-6 text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-15%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Top Operational Status Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#D4AF37]">Internal Node Entry</p>
            <h1 className="text-3xl font-black uppercase tracking-tight mt-1">Management Terminal Console</h1>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.1] backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
              Database Sync: Live (XAMPP 3306)
            </span>
          </div>
        </div>

        {/* Dynamic Multi-Functional Management Engine */}
        <AdminTerminalTabs orders={orders} />

      </div>
    </div>
  );
}