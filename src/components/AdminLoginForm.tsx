"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "@/app/admin/auth-actions";

export default function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const res = await loginAdmin(fd);
        setLoading(false);
        if (!res.success) {
          setError(res.error || "Authentication failed.");
        }
      }}
      className="space-y-4"
    >
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-bold uppercase tracking-wider text-center">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block px-1">
          Operator ID
        </label>
        <input
          type="text"
          name="username"
          placeholder="e.g., master_ofori"
          className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl p-3.5 text-xs font-bold text-white focus:outline-none transition"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block px-1">
          Access Token Pin
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••••••"
            className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-[#D4AF37] rounded-xl p-3.5 pr-11 text-xs font-bold text-white focus:outline-none transition"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3CD59] text-[#002147] font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#D4AF37]/10 active:scale-[0.99] transition duration-150 disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Authenticate Connection"}
      </button>
    </form>
  );
}