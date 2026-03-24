"use client";
import { useState } from "react";
import { getToken } from "@/lib/api";

interface FileUploadProps {
  folder: string;
  accept?: string;
  onUpload: (url: string) => void;
  label?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function FileUpload({ folder, accept = "*", onUpload, label = "Fayl yuklash" }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Avtorizatsiya talab qilinadi");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      // Backend orqali yuklash — Supabase key frontend da emas!
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Fayl yuklanmadi" }));
        throw new Error(errData.error || "Fayl yuklanmadi");
      }

      const data = await res.json();
      onUpload(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fayl yuklanmadi");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
      <div>
        <input
            type="file"
            accept={accept}
            onChange={handleUpload}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid rgba(27,58,107,0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
        />
        {loading && <p style={{ color: 'var(--gold)', fontSize: '13px', marginTop: '4px' }}>Yuklanmoqda...</p>}
        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{error}</p>}
      </div>
  );
}
