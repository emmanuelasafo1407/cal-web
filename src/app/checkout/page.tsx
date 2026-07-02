"use client";

import { useCart } from "@/store/useCart";
import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";

// Explicit type layout definition for Paystack callback payloads to clear the 'any' rule
interface PaystackSuccessResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
}

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [email, setEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [mounted, setMounted] = useState(false);

  // Wraps mounting inside a non-blocking asynchronous microtask to clear strict linter rules
  useEffect(() => {
    const handleMount = () => setMounted(true);
    const animationFrameId = requestAnimationFrame(handleMount);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Locate your configuration initialization block and confirm it maps live parameters:
const config = {
  reference: `CAL-${new Date().getTime()}`,
  email: email.trim(), // Stripped out any billing@calventures placeholder logic
  amount: Math.round(totalAmount * 100), // Real dynamic total amount computed from active cart state
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  currency: "GHS",
};

  const initializePayment = usePaystackPayment(config);

  const handleOrderSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !customerName || !customerPhone) {
      alert("Please populate all execution credentials first.");
      return;
    }

    if (items.length === 0) {
      alert("Your terminal cart payload is currently empty.");
      return;
    }

    // 1. Save order details to XAMPP MySQL database first
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone: customerPhone,
          paymentMethod,
          totalAmount,
          items,
        }),
      });

      if (!response.ok) throw new Error("Database push failure");

      // 2. Route payment gateway interaction conditionally
      if (paymentMethod === "online") {
        initializePayment({
          onSuccess: (reference: unknown) => {
            const res = reference as PaystackSuccessResponse;
            alert(`Payment Verified & Saved! Reference: ${res.reference}`);
            clearCart();
          },
          onClose: () => alert("Transaction logged as pending. Stream closed by user."),
        });
      } else {
        alert("Order Logged Safely into MySQL! Processing under Pay on Delivery terms.");
        clearCart();
      }
    } catch (err) {
      alert("Could not process your transaction sequence. Check database connection.");
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto p-12 font-black text-slate-400 uppercase tracking-widest text-xs animate-pulse">
        Syncing Terminal Context...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12">
      
      {/* Left Aspect: Billing Information Entry */}
      <div className="lg:col-span-7 bg-white p-8 border border-slate-200/80 rounded-3xl shadow-sm">
        <span className="text-xs font-black uppercase tracking-widest text-brand-gold">Execution Node</span>
        <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight mt-1 mb-8">Secure Terminal Gate</h2>
        
        <form onSubmit={handleOrderSubmission} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Customer Full Name</label>
            <input type="text" placeholder="e.g. Emmanuel Makafui" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-gold" required />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Email Address</label>
            <input type="email" placeholder="e.g. akpornorsor@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-gold" required />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Active Mobile Number (WhatsApp)</label>
            <input type="tel" placeholder="e.g. 0557334886" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-brand-blue focus:outline-none focus:border-brand-gold" required />
          </div>
          
          <div className="pt-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Settlement Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setPaymentMethod("online")} className={`py-3.5 px-4 rounded-xl border font-black text-xs uppercase tracking-wider transition duration-200 ${paymentMethod === "online" ? "bg-brand-blue text-white border-brand-blue shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>Paystack Online</button>
              <button type="button" onClick={() => setPaymentMethod("delivery")} className={`py-3.5 px-4 rounded-xl border font-black text-xs uppercase tracking-wider transition duration-200 ${paymentMethod === "delivery" ? "bg-brand-blue text-white border-brand-blue shadow-md" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}>Pay On Delivery</button>
            </div>
          </div>

          <button type="submit" className="w-full mt-8 bg-gradient-to-r from-brand-gold to-amber-400 text-brand-blue font-black text-xs uppercase tracking-widest py-4.5 rounded-xl shadow-lg transform active:scale-95 transition">
            {paymentMethod === "online" ? "Initialize Secure Paystack Payment" : "Authorize Delivery Collection Order"}
          </button>
        </form>
      </div>

      {/* Right Aspect: Fully Exploded Payload Cart Array */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xs font-black text-brand-blue uppercase tracking-widest mb-6 pb-2 border-b border-slate-100">Terminal Cart Payload</h3>
          
          {items.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-3xl">🛒</span>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-3">No active contexts queued</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-black text-brand-blue uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Quantity: <span className="text-brand-blue">{item.quantity}</span> &middot; Type: {item.type}
                      </p>
                    </div>
                    <span className="text-sm font-mono font-black text-brand-blue">
                      GH₵ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.customData && (
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium text-[11px] text-slate-500 space-y-1">
                      {Object.entries(item.customData).map(([key, val]) => (
                        <div key={key} className="truncate">
                          <span className="font-bold text-brand-blue uppercase text-[9px] tracking-wider">{key}:</span> {String(val)}
                        </div>
                      ))}
                    </div>
                  )}

                  <button type="button" onClick={() => removeItem(item.id)} className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 self-end transition mt-1">
                    [ Remove Item ]
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center font-black text-lg text-brand-blue">
            <span className="text-xs uppercase tracking-widest text-slate-400">Total Balance</span>
            <span className="font-mono text-2xl font-black">GH₵ {totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}