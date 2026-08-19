"use client";
import { useState } from "react";
import { getToken } from "@/lib/api";

interface FileUploadProps {
  folder: string;
  accept?: string;
  multiple?: boolean;
  onUpload?: (url: string) => void;
  onUploadMultiple?: (urls: string[]) => void;
  label?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function FileUpload({ folder, accept = "*", multiple = false, onUpload, onUploadMultiple, label = "Fayl yuklash" }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Avtorizatsiya talab qilinadi");
      }

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (files.length > 1) {
          setProgressText(`${i + 1} / ${files.length} fayl yuklanmoqda...`);
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              const path = window.location.pathname;
              if (path.includes('/admin') && !path.endsWith('/admin') && !path.endsWith('/admin/')) {
                const localeMatch = path.match(/^\/([a-z]{2})\//);
                const locale = localeMatch ? localeMatch[1] : 'uz';
                window.location.href = `/${locale}/admin?sessionExpired=true`;
              }
            }
          }
          const errData = await res.json().catch(() => ({ error: "Fayl yuklanmadi" }));
          throw new Error(errData.error || "Fayl yuklanmadi");
        }

        const data = await res.json();
        uploadedUrls.push(data.url);
        if (!multiple && onUpload) {
          onUpload(data.url);
        }
      }

      if (multiple && onUploadMultiple) {
        onUploadMultiple(uploadedUrls);
      } else if (multiple && uploadedUrls.length > 0 && onUpload) {
        uploadedUrls.forEach(url => onUpload(url));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fayl yuklanmadi");
    } finally {
      setLoading(false);
      setProgressText("");
      e.target.value = "";
    }
  };

  return (
      <div>
        <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleUpload}
            disabled={loading}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
        />
        {loading && <p style={{ color: 'var(--gold)', fontSize: '13px', marginTop: '4px' }}>{progressText || "Yuklanmoqda..."}</p>}
        {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>{error}</p>}
      </div>
  );
}
