import type { Metadata } from "next"
import { Geist_Mono, Poppins, Raleway } from "next/font/google"

import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["400", "500", "600", "700"],
})

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Motobites Admin",
  description: "Motobites admin dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        raleway.variable,
        poppins.variable,
        geistMono.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
