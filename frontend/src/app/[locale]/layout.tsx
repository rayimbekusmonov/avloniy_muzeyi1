import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Abdulla Avloniy Muzeyi',
  description: 'Abdulla Avloniy nomidagi milliy muzey',
}

const locales = ['uz', 'ru', 'en']

export default async function LocaleLayout({
                                             children,
                                             params: { locale }
                                           }: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
      <html lang={locale}>
      <body>
      <NextIntlClientProvider messages={messages}>
        <Navbar />
        {children}
        <Footer />
      </NextIntlClientProvider>
      </body>
      </html>
  )
}