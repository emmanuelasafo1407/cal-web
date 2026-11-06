"use client";

import { useState } from "react";
import { useCart } from "@/store/useCart";

interface FormProps {
  serviceType: "momo" | "checker" | "banking";
  title: string;
}

export default function ServiceOrderForm({ serviceType, title }: FormProps) {
  const addItem = useCart((state) => state.addItem);
  const [isOpen, setIsOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Common Fields
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [appointmentNote, setAppointmentNote] = useState("");

  // MoMo Form States
  const [momoType, setMomoType] = useState("Airtime");
  const [network, setNetwork] = useState("MTN");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [bundlePlan, setBundlePlan] = useState("");

  // Checker Form States
  const [checkerAction, setCheckerAction] = useState("Voucher Only");
  const [voucherQty, setVoucherQty] = useState(1);
  const [checkerType, setCheckerType] = useState("WAEC BECE");
  const [candidateName, setIndexNumber] = useState("");
  const [examYear, setExamYear] = useState("2025");

  // Banking Selection State
  const [bankingService, setBankingService] = useState("Deposit & Withdrawal");

  const CLIENT_WHATSAPP = "233544208963";

  const getBankingDescription = (service: string) => {
    switch (service) {
      case "Account Opening (SMART)":
        return "⚠️ Physical Presence Required: Please visit our shop with your valid Ghana Card for biometric registration.";
      case "Deposit & Withdrawal":
        return "Please bring your physical bank card or linked Ghana Card to our shop counter to process transactions.";
      case "Bill Payment":
        return "Bring along your ECG Meter Card or customer account number for instant bill payment.";
      default:
        return "Requires in-person confirmation at our shop. Submit your details below and we will follow up with you on WhatsApp.";
    }
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedPrice = 0;
    const payloadData: Record<string, string> = { originType: serviceType };

    if (serviceType === "momo") {
      if (!phone || (momoType === "Airtime" ? !amount : !bundlePlan)) return;
      calculatedPrice = momoType === "Airtime" ? parseFloat(amount) : 10.00;
      payloadData.momoOperation = momoType;
      payloadData.networkProvider = network;
      payloadData.targetPhone = phone.trim();
      payloadData.specification = momoType === "Airtime" ? `GH₵ ${amount}` : bundlePlan.trim();
    } 
    
    else if (serviceType === "checker") {
      const itemQty = checkerAction === "Voucher Only" ? voucherQty : 1;
      calculatedPrice = itemQty * 30.00;
      payloadData.checkerMode = checkerAction;
      payloadData.examType = checkerType;
      if (checkerAction === "Voucher Only") {
        payloadData.voucherQuantity = String(itemQty);
      } else {
        payloadData.candidateName = clientName.trim();
        payloadData.indexNumber = candidateName.trim();
        payloadData.examYear = examYear.trim();
      }
    } 
    
    else if (serviceType === "banking") {
      if (!clientName || !clientPhone) return;
      calculatedPrice = 1.00;
      payloadData.bankingOperation = bankingService;
      payloadData.clientName = clientName.trim();
      payloadData.clientPhone = clientPhone.trim();
      payloadData.adminInstructions = appointmentNote.trim();
    }

    addItem({
      id: `${serviceType}-${new Date().getTime()}`,
      title: serviceType === "momo" ? `${network} ${momoType}` : serviceType === "checker" ? `${checkerType} (${checkerAction})` : `Banking: ${bankingService}`,
      price: calculatedPrice,
      quantity: 1,
      type: "service",
      customData: payloadData
    });

    setIsOpen(false);
    
    if (serviceType === "banking") {
      const waText = encodeURIComponent(`Hello, I have submitted a banking request for [${bankingService}] under the name ${clientName}. Notes: ${appointmentNote}`);
      window.open(`https://wa.me/${CLIENT_WHATSAPP}?text=${waText}`, "_blank");
    } else {
      setSuccessMsg("Item added to cart successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }

    setPhone(""); setAmount(""); setBundlePlan(""); setClientName(""); setClientPhone(""); setAppointmentNote("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#002147] text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#002147] transition shadow-sm active:scale-[0.98]"
      >
        {title}
      </button>

      {successMsg && (
        <div className="fixed bottom-5 right-5 bg-[#002147] text-white border border-[#D4AF37] p-4 rounded-xl shadow-2xl z-50 text-xs font-bold uppercase tracking-wider animate-fade-in">
          ✓ {successMsg}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-[#002147] animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm uppercase tracking-tight">{title}</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-black font-bold text-sm p-1">✕</button>
            </div>

            <form onSubmit={handleFormSubmission} className="space-y-4">
              
              {/* --- BANKING INTERFACE --- */}
              {serviceType === "banking" && (
                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1">Select Service</label>
                    <select value={bankingService} onChange={(e) => setBankingService(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]">
                      <option value="Account Opening (SMART)">Account Opening (SMART)</option>
                      <option value="Deposit & Withdrawal">Deposit & Withdrawal</option>
                      <option value="Funds Transfer / Interbank">Funds Transfer / Interbank</option>
                      <option value="Mini Statement Request">Mini Statement Request</option>
                      <option value="Balance Inquiry">Balance Inquiry</option>
                      <option value="Bill Payment">Bill Payment</option>
                    </select>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs font-medium leading-relaxed">
                    {getBankingDescription(bankingService)}
                  </div>

                  <input type="text" placeholder="Your Full Name (e.g. John Mensah)" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition" required />
                  <input type="tel" placeholder="Your Phone Number (e.g. 0244123456)" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37] transition" required />
                  <textarea rows={3} placeholder="Add any extra notes or request details..." value={appointmentNote} onChange={(e) => setAppointmentNote(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#D4AF37] resize-none transition" required />
                </div>
              )}

              {/* --- MOMO INTERFACE --- */}
              {serviceType === "momo" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setMomoType("Airtime")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${momoType === "Airtime" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Airtime</button>
                    <button type="button" onClick={() => setMomoType("Bundle")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${momoType === "Bundle" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Bundle</button>
                  </div>
                  <select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold">
                    <option value="MTN">MTN Ghana</option>
                    <option value="Telecel">Telecel Cash</option>
                    <option value="AT">AT Ghana</option>
                  </select>
                  <input type="tel" placeholder="Mobile Phone Number (e.g. 0244123456)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold transition" required />
                  {momoType === "Airtime" ? (
                    <input type="number" placeholder="Amount to recharge (e.g. 20)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold transition" required />
                  ) : (
                    <input type="text" placeholder="Data Plan (e.g. 5GB Data Plan)" value={bundlePlan} onChange={(e) => setBundlePlan(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold transition" required />
                  )}
                </div>
              )}

              {/* --- CHECKER INTERFACE --- */}
              {serviceType === "checker" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setCheckerAction("Voucher Only")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${checkerAction === "Voucher Only" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Voucher Only</button>
                    <button type="button" onClick={() => setCheckerAction("Check Online")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${checkerAction === "Check Online" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Check For Me</button>
                  </div>
                  <select value={checkerType} onChange={(e) => setCheckerType(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold">
                    <option value="WAEC BECE">WAEC BECE</option>
                    <option value="WAEC WASSCE">WAEC WASSCE</option>
                    <option value="NOVDEC">NOV/DEC Private</option>
                  </select>
                  {checkerAction === "Voucher Only" ? (
                    <input type="number" min="1" placeholder="Quantity of vouchers" value={voucherQty} onChange={(e) => setVoucherQty(parseInt(e.target.value) || 1)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold transition" required />
                  ) : (
                    <div className="space-y-3">
                      <input type="text" placeholder="Candidate Full Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold transition" required />
                      <input type="text" placeholder="10-digit Index Number" value={candidateName} onChange={(e) => setIndexNumber(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold transition" required />
                      <input type="number" placeholder="Exam Year (e.g. 2024)" value={examYear} onChange={(e) => setExamYear(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold transition" required />
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="w-full bg-[#002147] text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#002147] transition active:scale-[0.98]">
                {serviceType === "banking" ? "Continue on WhatsApp" : "Add to Cart"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
