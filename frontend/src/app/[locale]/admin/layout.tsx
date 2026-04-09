// frontend/src/app/[locale]/admin/layout.tsx
// Admin sahifalari uchun alohida layout — Navbar va Footer yo'q

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    // Admin sahifalari asosiy sayt layoutidan butunlay ajratilgan.
    // [locale]/layout.tsx dagi Navbar va Footer bu yerda ko'rinmaydi.
    return <>{children}</>
}