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
  const [candidateName, setCandidateName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [examYear, setExamYear] = useState("2026");

  // Expanded Banking Form States (Flyer Green Section)
  const [bankingService, setBankingService] = useState("Deposit & Withdrawal");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [targetBank, setTargetBank] = useState("");
  const [billType, setBillType] = useState("ECG");
  const [ghanaCard, setGhanaCard] = useState("");

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
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
        if (!candidateName || !indexNumber || !examYear) return;
        payloadData.candidateName = candidateName.trim();
        payloadData.indexNumber = indexNumber.trim();
        payloadData.examYear = examYear.trim();
      }
    } 
    
    else if (serviceType === "banking") {
      if (!clientName || !clientPhone) return;
      calculatedPrice = amount ? parseFloat(amount) : 1.00; 
      payloadData.bankingOperation = bankingService;
      payloadData.clientName = clientName.trim();
      payloadData.clientPhone = clientPhone.trim();

      // Gather contextual inputs dynamically based on active service parameters
      if (bankingService === "Account Opening (SMART)") {
        if (!ghanaCard) return;
        payloadData.ghanaCard = ghanaCard.trim().toUpperCase();
        calculatedPrice = 1.00; // Registration code processing threshold
      } else if (["Deposit & Withdrawal", "Mini Statement Request", "Balance Inquiry", "Fidelity Money Transfer"].includes(bankingService)) {
        if (!accountNum) return;
        payloadData.accountNumber = accountNum.trim();
      } else if (["Funds Transfer / Interbank", "Cash / Wallet Logistics"].includes(bankingService)) {
        if (!accountNum || !targetBank) return;
        payloadData.accountNumber = accountNum.trim();
        payloadData.destinationTarget = targetBank.trim();
      } else if (bankingService === "Bill Payment") {
        if (!accountNum) return;
        payloadData.billCategory = billType;
        payloadData.meterOrAccountReference = accountNum.trim();
      }
    }

    addItem({
      id: `${serviceType}-${new Date().getTime()}`,
      title: serviceType === "momo" ? `${network} ${momoType}` : serviceType === "checker" ? `${checkerType} (${checkerAction})` : `Banking: ${bankingService}`,
      price: calculatedPrice <= 0 ? 1.00 : calculatedPrice, 
      quantity: 1,
      type: "service",
      customData: payloadData
    });

    setIsOpen(false);
    triggerToast("SERVICE QUEUED IN CART SUCCESSFULLY");
    
    // Clear inputs smoothly
    setPhone(""); setAmount(""); setBundlePlan(""); setCandidateName(""); setIndexNumber(""); 
    setClientName(""); setClientPhone(""); setAccountNum(""); setTargetBank(""); setGhanaCard("");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="w-full bg-[#002147] text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#002147] transition shadow-sm"
      >
        {title}
      </button>

      {successMsg && (
        <div className="fixed bottom-5 right-5 bg-[#002147] text-white border border-[#D4AF37] p-4 rounded-xl shadow-2xl z-50 text-xs font-bold uppercase tracking-wider">
          ✓ {successMsg}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto text-[#002147]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-black text-sm uppercase tracking-tight">{title} Terminal</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-black font-bold text-sm">✕</button>
            </div>

            <form onSubmit={handleFormSubmission} className="space-y-4">
              
              {/* --- 1. MOMO INTERFACE BRANCH --- */}
              {serviceType === "momo" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setMomoType("Airtime")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${momoType === "Airtime" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Airtime</button>
                    <button type="button" onClick={() => setMomoType("Bundle")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${momoType === "Bundle" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Bundle</button>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider mb-1">Network</label>
                    <select value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]">
                      <option value="MTN">MTN Ghana</option>
                      <option value="Telecel">Telecel Cash</option>
                      <option value="AT">AT Ghana</option>
                    </select>
                  </div>
                  <input type="tel" placeholder="Mobile Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                  {momoType === "Airtime" ? (
                    <input type="number" placeholder="Amount (GH₵)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold font-mono focus:outline-none focus:border-[#D4AF37]" required />
                  ) : (
                    <input type="text" placeholder="Specify Plan (e.g. 3GB for 10GHS)" value={bundlePlan} onChange={(e) => setBundlePlan(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                  )}
                </div>
              )}

              {/* --- 2. CHECKER INTERFACE BRANCH --- */}
              {serviceType === "checker" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setCheckerAction("Voucher Only")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${checkerAction === "Voucher Only" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Voucher Only</button>
                    <button type="button" onClick={() => setCheckerAction("Check Online")} className={`py-2 text-xs font-black uppercase rounded-xl transition ${checkerAction === "Check Online" ? "bg-[#002147] text-white" : "bg-slate-100 text-[#002147]"}`}>Check For Me</button>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider mb-1">Exam Type</label>
                    <select value={checkerType} onChange={(e) => setCheckerType(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]">
                      <option value="WAEC BECE">WAEC BECE</option>
                      <option value="WAEC WASSCE">WAEC WASSCE</option>
                      <option value="NOVDEC">NOV/DEC Private</option>
                    </select>
                  </div>
                  {checkerAction === "Voucher Only" ? (
                    <input type="number" min="1" placeholder="Quantity" value={voucherQty} onChange={(e) => setVoucherQty(parseInt(e.target.value) || 1)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold font-mono focus:outline-none focus:border-[#D4AF37]" required />
                  ) : (
                    <div className="space-y-3 animate-fadeIn">
                      <input type="text" placeholder="Candidate Full Name" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                      <input type="text" placeholder="Index Number" value={indexNumber} onChange={(e) => setIndexNumber(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]" required />
                      <input type="number" placeholder="Exam Year" value={examYear} onChange={(e) => setExamYear(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]" required />
                    </div>
                  )}
                </div>
              )}

              {/* --- 3. BANKING INTERFACE BRANCH (flyer matching precision) --- */}
              {serviceType === "banking" && (
                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-wider mb-1">Service Option</label>
                    <select value={bankingService} onChange={(e) => setBankingService(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]">
                      <option value="Deposit & Withdrawal">Deposit & Withdrawal</option>
                      <option value="Funds Transfer / Interbank">Funds Transfer / Interbank</option>
                      <option value="Account Opening (SMART)">Account Opening (SMART)</option>
                      <option value="Airtime Top Up">Airtime Top Up</option>
                      <option value="Mini Statement Request">Mini Statement Request</option>
                      <option value="Balance Inquiry">Balance Inquiry</option>
                      <option value="Cash / Wallet Logistics">Cash to Wallet / Wallet to Cash</option>
                      <option value="Fidelity Money Transfer">Fidelity Money Transfer</option>
                      <option value="Bill Payment">Bill Payment</option>
                    </select>
                  </div>

                  {/* Base Core Parameters common to all actions */}
                  <input type="text" placeholder="Customer Full Name" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                  <input type="tel" placeholder="Customer Phone Number" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                  
                  {/* Option A: Pure Account Opening (SMART) - Only needs Ghana Card */}
                  {bankingService === "Account Opening (SMART)" && (
                    <input type="text" placeholder="Ghana Card ID Number (GHA-XXXXXXXXX-X)" value={ghanaCard} onChange={(e) => setGhanaCard(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#D4AF37] animate-fadeIn" required />
                  )}

                  {/* Option B: Account/Card Bound Services */}
                  {["Deposit & Withdrawal", "Mini Statement Request", "Balance Inquiry", "Fidelity Money Transfer"].includes(bankingService) && (
                    <input type="text" placeholder="Bank Account / Card Number" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37] animate-fadeIn" required />
                  )}

                  {/* Option C: Wire Transfers or External Network Handshakes */}
                  {["Funds Transfer / Interbank", "Cash / Wallet Logistics"].includes(bankingService) && (
                    <div className="space-y-3 animate-fadeIn">
                      <input type="text" placeholder="Source Account Number" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]" required />
                      <input type="text" placeholder="Target Destination (e.g. GCB Bank, MTN Mobile Wallet)" value={targetBank} onChange={(e) => setTargetBank(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]" required />
                    </div>
                  )}

                  {/* Option D: Institutional Bill Payment Routing */}
                  {bankingService === "Bill Payment" && (
                    <div className="space-y-3 animate-fadeIn">
                      <select value={billType} onChange={(e) => setBillType(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-[#D4AF37]">
                        <option value="ECG">ECG Prepaid / Postpaid</option>
                        <option value="Ghana Water">Ghana Water Company</option>
                        <option value="DSTv/GOtv">DSTv / GOtv Subscriptions</option>
                      </select>
                      <input type="text" placeholder="Meter ID / SmartCard Card Number Reference" value={accountNum} onChange={(e) => setAccountNum(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]" required />
                    </div>
                  )}

                  {/* Option E: Pricing volume parameters for monetary streams (Hides completely for free check queries) */}
                  {!["Account Opening (SMART)", "Mini Statement Request", "Balance Inquiry"].includes(bankingService) && (
                    <input type="number" placeholder="Transaction Volume Amount (GH₵)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37] animate-fadeIn" required />
                  )}
                </div>
              )}

              <button type="submit" className="w-full bg-[#002147] text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#D4AF37] hover:text-[#002147] transition shadow-md">
                Confirm Service Queue Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}