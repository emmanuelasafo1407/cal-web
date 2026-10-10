"use client";

import dynamic from "next/dynamic";

const CheckoutForm = dynamic(() => import("./CheckoutForm"), {
  ssr: false,
});

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#001124] text-white py-6">
      <CheckoutForm />
    </div>
  );
}