"use client"

import React, { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { AppSidebar } from "@/components/kanban/app-sidebar" 
import './globals.css'

const geistSans = Geist({ subsets: ['latin', 'cyrillic'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuth, setIsAuth] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
   
    const token = localStorage.getItem("token")
    setIsAuth(!!token)
  }, [pathname]) 

  
  if (!mounted) return <html lang="ru"><body></body></html>

  
  const showSidebar = !["/login"].includes(pathname) && isAuth

  return (
    <html lang="ru" suppressHydrationWarning> 
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          
          
          {!showSidebar ? (
            <main className="w-full">
              {children}
            </main>
          ) : (
            <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
              <AppSidebar />
              <main className="flex-1 h-full overflow-y-auto">
                {children}
              </main>
            </div>
          )}
          
        </ThemeProvider>
      </body>
    </html>
  )
}