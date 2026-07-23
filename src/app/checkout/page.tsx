"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/store/useCart";
import { usePaystackPayment } from "react-paystack";

interface PaystackSuccessResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
}

// 1. Lift Generator completely outside the component body to clear linter rules
function generatePaystackConfig(email: string, totalBalance: number) {
  return {
    reference: `CAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    email: email.trim() || "checkout@calweb.com",
    amount: Math.round(totalBalance * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_f674486e87d44b25ec300c6be4b031c690862c5f",
    currency: "GHS",
  };
}

// 2. Rename the functional UI to content block
function CheckoutFormContent() {
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

  const totalBalance = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const hasPhysicalProducts = items.some((item) => item.type === "product");
  const isLocationRequired = settlementMode === "delivery" || hasPhysicalProducts;

  const initializePayment = usePaystackPayment({
    reference: "INITIALIZING",
    email: "checkout@calweb.com",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_f674486e87d44b25ec300c6be4b031c690862c5f",
    currency: "GHS",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please fill out all required core fields.");
      return;
    }
    
    if (isLocationRequired && !deliveryLocation.trim()) {
      setErrorMessage("Delivery location details are required for distribution tracking.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    if (settlementMode === "delivery") {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            paymentMethod: "delivery",
            totalAmount: totalBalance,
            deliveryAddress: deliveryLocation.trim() || "N/A",
            items: items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity }))
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Order execution pipeline failure.");
        
        clearCart();
        window.location.href = "/";
      } catch (err: unknown) {
        const error = err as { message?: string };
        setErrorMessage(error.message || "Failed to finalize delivery log.");
        setIsSubmitting(false);
      }
    } else {
      const liveConfig = generatePaystackConfig(email, totalBalance);

      const paymentAction = initializePayment as (options: {
        config: typeof liveConfig & { metadata: { custom_fields: Array<{ display_name: string; variable_name: string; value: string }> } };
        onSuccess: (reference: unknown) => Promise<void>;
        onClose: () => void;
      }) => void;

      paymentAction({
        config: {
          ...liveConfig,
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Phone",
                variable_name: "customer_phone",
                value: phone.trim()
              }
            ]
          }
        },
        onSuccess: async (reference: unknown) => {
          const res = reference as PaystackSuccessResponse;
          try {
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                paymentMethod: `paystack-${res.status || "success"}`,
                totalAmount: totalBalance,
                deliveryAddress: deliveryLocation.trim() || "N/A",
                items: items.map(i => ({ id: i.id, price: i.price, quantity: i.quantity }))
              }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Payment cleared, database entry write mismatch encountered.");
            
            clearCart();
            window.location.href = "/";
          } catch (err: unknown) {
            const error = err as { message?: string };
            setErrorMessage(error.message || "Error logging payment record details.");
          } finally {
            setIsSubmitting(false);
          }
        },
        onClose: () => {
          setIsSubmitting(false);
          setErrorMessage("Payment interface closed by active session operator.");
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-[#002147]">
      <div className="grid lg:grid-cols-12 gap-10">
        
        {/* Left Side Form Terminal */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Execution Node</p>
            <h2 className="text-2xl font-black uppercase tracking-light">Secure Terminal Gate</h2>
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
                <label className="block text-[10px] font-black uppercase tracking-wider mb-1 text-[#D4AF37]">Delivery Location Details</label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="Specify Digital Address, landmark or Town (e.g. Off Likpe Road, Bungalow - Hohoe)"
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
                  className={`py-3 rounded-xl text-xs font-black uppercase border transition ${
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
                  className={`py-3 rounded-xl text-xs font-black uppercase border transition ${
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
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-[11px] uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 transition"
            >
              {isSubmitting
                ? "PROCESSING..."
                : settlementMode === "online"
                ? "INITIALIZE SECURE PAYSTACK PAYMENT"
                : "PLACE PAY ON DELIVERY ORDER"}
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
                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-black uppercase text-[#002147]">{item.title}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Type: {item.type}</p>
                    </div>
                    <span className="text-xs font-mono font-black text-[#002147]">
                      GH₵ {(Number(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {item.customData && (
                    <div className="bg-slate-50 rounded-lg p-2 text-[9px] font-mono text-slate-500 overflow-x-auto mt-2">
                      <pre>{JSON.stringify(item.customData, null, 2)}</pre>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs font-black text-slate-500 hover:bg-slate-200 transition"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-black text-[#002147]">{item.quantity}</span>
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

// 3. FORCE NEXT.JS TO ONLY EVALUATE AND RENDER THIS PAGE ON THE CLIENT SIDE WITH SSR DISABLED
const CheckoutPage = dynamic(() => Promise.resolve(CheckoutFormContent), {
  ssr: false,
});

export default CheckoutPage;