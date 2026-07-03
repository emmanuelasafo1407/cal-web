"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";

export default function CheckoutPage() {
  // Pull actions directly from Zustand state safely
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const clearCart = useCart((state) => state.clearCart);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [settlementMode, setSettlementMode] = useState("online"); 
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const totalBalance = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const hasPhysicalProducts = items.some((item) => item.type === "product");
  const isLocationRequired = settlementMode === "delivery" || hasPhysicalProducts;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      setErrorMessage("Please fill out all required core fields.");
      return;
    }
    if (isLocationRequired && !deliveryLocation.trim()) {
      setErrorMessage("Delivery location details are required for distribution tracking.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: fullName,
          email,
          phone,
          paymentMethod: settlementMode,
          totalAmount: totalBalance,
          deliveryAddress: isLocationRequired ? deliveryLocation.trim() : "N/A - Digital/Service Terminal Entry",
          items: items.map(i => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            customData: i.customData
          }))
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Transaction compilation error.");

      if (settlementMode === "online") {
        alert("Initializing secure Paystack Mobile Money/Card payment verification gateway...");
      } else {
        alert("Order successfully logged under Pay on Delivery terms!");
        clearCart();
        window.location.href = "/";
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Could not process transaction sequence.";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-[#002147]">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Side Form Terminal */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Execution Node</p>
            <h2 className="text-2xl font-black uppercase tracking-tight">Secure Terminal Gate</h2>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs font-bold uppercase">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Customer Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Emmanuel Makafui" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. akpornorsor@gmail.com" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
                required 
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-1">Active Mobile Number (WhatsApp)</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0557334886" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
                required 
              />
            </div>

            {isLocationRequired && (
              <div className="animate-fadeIn">
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-[#D4AF37]">
                  Delivery Location Details
                </label>
                <input 
                  type="text" 
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Specify Digital Address, Landmark or Town (e.g. Off Likpe Road, Bungalow - Hohoe)" 
                  className="w-full bg-amber-50/40 border border-[#D4AF37]/30 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-[#D4AF37]"
                  required 
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider mb-2">Settlement Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setSettlementMode("online")}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                    settlementMode === "online" 
                      ? "bg-[#002147] text-white border-[#002147]" 
                      : "bg-slate-50 border-slate-200 text-[#002147]"
                  }`}
                >
                  Paystack Online (MoMo/Card)
                </button>
                <button 
                  type="button"
                  onClick={() => setSettlementMode("delivery")}
                  className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition ${
                    settlementMode === "delivery" 
                      ? "bg-[#002147] text-white border-[#002147]" 
                      : "bg-slate-50 border-slate-200 text-[#002147]"
                  }`}
                >
                  Pay On Delivery
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[11px] uppercase tracking-widest py-4 rounded-xl shadow-lg disabled:opacity-50 transition"
            >
              {isSubmitting ? "PROCESSING..." : settlementMode === "online" ? "INITIALIZE SECURE PAYSTACK PAYMENT" : "PLACE PAY ON DELIVERY ORDER"}
            </button>
          </form>
        </div>

        {/* Right Side Cart Sidebar Payload View */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 border border-slate-200/60 h-fit space-y-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Terminal Cart Payload</h3>
          
          {items.length === 0 ? (
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide py-4">Payload array empty.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-black uppercase text-[#002147]">{item.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                          Type: {item.type}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-black text-[#002147]">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {item.customData && (
                      <div className="bg-slate-50 rounded-lg p-2 text-[9px] font-mono text-slate-500 overflow-x-auto mt-2">
                        {JSON.stringify(item.customData, null, 2)}
                      </div>
                    )}
                  </div>

                  {/* Operational Controls: Increment, Decrement, and Remove Item */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-black text-slate-500 hover:bg-slate-200 transition"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-black text-[#002147]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs font-black text-slate-500 hover:bg-slate-200 transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition"
                    >
                      [ Remove Item ]
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total Balance</span>
                <span className="text-lg font-mono font-black text-[#002147]">GH₵ {totalBalance.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}