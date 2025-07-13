import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { WalletContextProvider } from '@/context/WalletContextProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Woofi - Support Rescued Dogs with SOL',
  description: 'A Web3 platform to showcase rescued dogs and allow users to support them using SOL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {children}
          <Toaster position="bottom-right" />
        </WalletContextProvider>
      </body>
    </html>
  )
}