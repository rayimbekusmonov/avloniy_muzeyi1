// frontend/src/app/[locale]/admin/layout.tsx
// Admin sahifalari uchun alohida layout — Navbar va Footer yo'q
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>
}