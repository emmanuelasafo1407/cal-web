"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";
import { usePaystackPayment } from "react-paystack";
import { CheckCircle2, ShoppingBag, ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

interface PaystackSuccessResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
}

export default function CheckoutForm() {
  const items = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const clearCart = useCart((state) => state.clearCart);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [settlementMode, setSettlementMode] = useState<"online" | "delivery">("online");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    paymentReference?: string;
    totalAmount: number;
    paymentMethod: string;
  } | null>(null);

  // 1. Base Product Cart Subtotal
  const cartSubtotal = items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

  // 2. 2% Paystack processing share added only when paying online
  const customerShare = settlementMode === "online" ? cartSubtotal * 0.02 : 0;
  const finalBillAmount = cartSubtotal + customerShare;

  // 3. Platform Fee (2.05%) in pesewas
  const developerFeePesewas = Math.round(cartSubtotal * 0.0205 * 100);

  const hasPhysicalProducts = items.some((item) => item.type === "product" || !item.type);
  const isLocationRequired = settlementMode === "delivery" || hasPhysicalProducts;

  // Base Paystack initialization hook
  const initializePayment = usePaystackPayment({
    reference: "INITIALIZING",
    email: "checkout@calweb.com",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    currency: "GHS",
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please fill in your name, email, and phone number.");
      return;
    }

    if (isLocationRequired && !deliveryLocation.trim()) {
      setErrorMessage("Please enter your delivery address or landmark.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const payloadItems = items.map((i) => ({
      id: i.id,
      productId: i.productId || i.id,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
      customOptions: i.customOptions || i.customData || undefined,
    }));

    if (settlementMode === "delivery") {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            paymentMethod: "PAY_ON_DELIVERY",
            paymentReference: null,
            totalAmount: cartSubtotal,
            deliveryAddress: deliveryLocation.trim() || "Store pickup",
            items: payloadItems,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Could not place your order. Please try again.");
        }

        clearCart();
        setCompletedOrder({
          orderId: data.orderId,
          totalAmount: cartSubtotal,
          paymentMethod: "Pay on Delivery",
        });
      } catch (err: unknown) {
        const error = err as { message?: string };
        setErrorMessage(error.message || "Failed to place order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const generatedRef = `CAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const dynamicConfig = {
        reference: generatedRef,
        email: email.trim() || "checkout@calweb.com",
        amount: Math.round(finalBillAmount * 100),
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
        currency: "GHS",
        subaccount: process.env.NEXT_PUBLIC_PAYSTACK_SUBACCOUNT_CODE || "",
        transaction_charge: developerFeePesewas,
        bearer: "subaccount" as const,
      };

      const paymentAction = initializePayment as (options: {
        config?: typeof dynamicConfig;
        onSuccess: (reference: PaystackSuccessResponse) => Promise<void>;
        onClose: () => void;
      }) => void;

      paymentAction({
        config: dynamicConfig,
        onSuccess: async (reference: PaystackSuccessResponse) => {
          try {
            const response = await fetch("/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                paymentMethod: "PAYSTACK",
                paymentReference: reference.reference,
                totalAmount: finalBillAmount,
                deliveryAddress: deliveryLocation.trim() || "Store pickup",
                items: payloadItems,
              }),
            });

            const data = await response.json();
            if (!response.ok) {
              throw new Error(
                data.error || "Payment was received, but we could not save the order. Please contact our support team."
              );
            }

            clearCart();
            setCompletedOrder({
              orderId: data.orderId,
              paymentReference: reference.reference,
              totalAmount: finalBillAmount,
              paymentMethod: "Paystack (Online)",
            });
          } catch (err: unknown) {
            const error = err as { message?: string };
            setErrorMessage(error.message || "Error saving order details after payment.");
          } finally {
            setIsSubmitting(false);
          }
        },
        onClose: () => {
          setIsSubmitting(false);
          setErrorMessage("Payment was not completed. You can try again whenever you are ready.");
        },
      });
    }
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 space-y-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#002147] uppercase">
              Thank You! Order Confirmed
            </h2>
            <p className="text-slate-600 text-sm">
              We have received your order and will begin preparing it immediately.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 text-xs sm:text-sm border border-slate-100">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-bold uppercase">Order Reference</span>
              <span className="font-mono font-black text-[#002147]">
                #{completedOrder.orderId.slice(0, 8)}
              </span>
            </div>
            {completedOrder.paymentReference && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500 font-bold uppercase">Paystack Reference</span>
                <span className="font-mono text-green-700 font-bold">
                  {completedOrder.paymentReference}
                </span>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500 font-bold uppercase">Payment Method</span>
              <span className="font-bold text-[#002147]">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-700 font-black uppercase">Total Amount</span>
              <span className="font-mono font-black text-lg text-[#D4AF37]">
                GH₵ {completedOrder.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link
              href="/"
              className="flex-1 bg-[#002147] hover:bg-[#001530] text-white font-bold text-xs uppercase py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <a
              href={`https://wa.me/233544208963?text=${encodeURIComponent(
                `Hello! I just placed order #${completedOrder.orderId.slice(0, 8)} on your website. My name is ${fullName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Message Us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-[#002147] animate-fade-in-up">
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Order Form */}
        <div className="lg:col-span-7 bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              Step 1 of 1
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#002147]">
              Checkout Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please enter your contact details and choose how you want to pay.
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs sm:text-sm font-bold animate-fade-in">
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Your Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Mensah"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-slate-700">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0244123456"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] transition"
                required
              />
            </div>

            {isLocationRequired && (
              <div className="animate-fade-in">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 text-[#002147]">
                  Delivery Address / Landmark
                </label>
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  placeholder="e.g. Near Market, Hohoe"
                  className="w-full bg-amber-50/50 border border-[#D4AF37]/40 rounded-xl p-3.5 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#D4AF37] transition"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-700">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettlementMode("online")}
                  className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase border transition flex items-center justify-center gap-2 ${
                    settlementMode === "online"
                      ? "bg-[#002147] text-white border-[#002147] shadow-md"
                      : "bg-slate-50 border-slate-200 text-[#002147] hover:border-[#002147]"
                  }`}
                >
                  <span>💳</span> Pay Online (MoMo / Card)
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementMode("delivery")}
                  className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase border transition flex items-center justify-center gap-2 ${
                    settlementMode === "delivery"
                      ? "bg-[#002147] text-white border-[#002147] shadow-md"
                      : "bg-slate-50 border-slate-200 text-[#002147] hover:border-[#002147]"
                  }`}
                >
                  <span>🚚</span> Pay on Delivery
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-xs sm:text-sm uppercase tracking-wider py-4 rounded-xl disabled:opacity-50 transition shadow-lg hover:opacity-95"
            >
              {isSubmitting
                ? "Processing your order..."
                : settlementMode === "online"
                ? `Pay GH₵ ${finalBillAmount.toFixed(2)} with Paystack`
                : "Place Order (Pay on Delivery)"}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Protected by Paystack Ghana & 256-bit SSL Security</span>
            </div>
          </form>
        </div>

        {/* Right Side: Cart Summary */}
        <div className="lg:col-span-5 bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" /> Your Order Summary
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <p className="text-sm font-bold">Your cart is currently empty.</p>
              <Link
                href="/products"
                className="inline-block text-xs font-black text-[#D4AF37] uppercase underline"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const itemOptions = item.customOptions || item.customData;
                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-sm"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-black uppercase text-[#002147] truncate">
                            {item.title}
                          </h4>
                          {item.type && (
                            <p className="text-[10px] text-slate-400 capitalize">
                              Category: {item.type}
                            </p>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-mono font-black text-[#002147] whitespace-nowrap">
                          GH₵ {(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {itemOptions && (
                        <div className="bg-slate-50 rounded-xl p-2.5 text-[10px] text-slate-600 space-y-1 border border-slate-100">
                          {Object.entries(itemOptions).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="capitalize text-slate-400">{k}:</span>
                              <span className="font-bold text-[#002147]">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)
                            }
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
                          className="text-[10px] font-bold text-red-500 uppercase hover:text-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Calculation */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600 font-semibold">
                  <span>Items Subtotal</span>
                  <span className="font-mono">GH₵ {cartSubtotal.toFixed(2)}</span>
                </div>

                {settlementMode === "online" && (
                  <div className="flex justify-between items-center text-amber-700 font-semibold">
                    <span>Paystack Processing Fee (2%)</span>
                    <span className="font-mono">+ GH₵ {customerShare.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-black uppercase text-slate-800">
                    Total to Pay
                  </span>
                  <span className="text-lg sm:text-xl font-mono font-black text-[#002147]">
                    GH₵ {finalBillAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
