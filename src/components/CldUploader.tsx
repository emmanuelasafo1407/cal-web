"use client";

import { CldUploadWidget } from "next-cloudinary";

// Define the missing UploaderProps interface
interface UploaderProps {
  onUploadSuccess: (url: string) => void;
  label: string;
}

interface CloudinaryUploadResult {
  event?: string;
  info?: {
    secure_url?: string;
  };
}

export default function CldUploader({ onUploadSuccess, label }: UploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default" // Make sure this matches an unsigned upload preset in your Cloudinary Settings
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
          className="w-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition text-left flex items-center justify-between"
        >
          <span>{label}</span>
          <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded font-black">UPLOAD</span>
        </button>
      )}
    </CldUploadWidget>
  );
}