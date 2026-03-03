"use client";
import { useState } from "react";

interface FileUploadProps {
  folder: string;
  accept?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function FileUpload({ folder, accept = "*", onUpload, label = "Fayl yuklash" }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onUpload(data.url);
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-yellow-600 file:text-white hover:file:bg-yellow-700 cursor-pointer"
      />
      {loading && <p className="text-yellow-400 text-sm">Yuklanmoqda...</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
