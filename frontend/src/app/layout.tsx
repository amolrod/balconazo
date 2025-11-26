import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Header } from '@/components/layout/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BalconazoApp - Alquiler de espacios por horas',
  description: 'Marketplace de alquiler de terrazas, balcones, jardines y salones entre particulares.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="bg-secondary-900 text-white py-8">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2025 BalconazoApp. Todos los derechos reservados.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
