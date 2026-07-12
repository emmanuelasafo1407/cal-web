"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Upload } from "lucide-react";

interface UploaderProps {
  onUploadSuccess: (url: string) => void;
  label: string;
  acceptType?: "image" | "video"; // Restricts the native browser picker target files
}

interface CloudinaryUploadResult {
  event?: string;
  info?: {
    secure_url?: string;
  };
}

export default function CldUploader({ onUploadSuccess, label, acceptType = "image" }: UploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset="cal_web_preset" // Updated to match your new unsigned preset
      options={{
        sources: ["local"],
        multiple: false,// Drops alternative tabs, immediately pops system File Explorer / Gallery
        clientAllowedFormats: acceptType === "image" ? ["png", "jpg", "jpeg", "webp"] : ["mp4", "mov", "avi"],
        resourceType: acceptType, // Enforces Cloudinary engine validation filters
      }}
      onSuccess={(result) => {
        const info = result?.info as CloudinaryUploadResult["info"];
        if (info?.secure_url) {
          onUploadSuccess(info.secure_url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition text-left flex items-center justify-between group"
        >
          <span>{label}</span>
          <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-[#002147] px-2 py-1 rounded font-black flex items-center gap-1.5 transition">
            <Upload className="w-3 h-3" />
            UPLOAD
          </span>
        </button>
      )}
    </CldUploadWidget>
  );
}