import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/contexts/user-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baseai - AI-Powered Companion",
  description: "Your intelligent AI companion for chat, image generation, and web search",
  keywords: ["Baseai", "AI", "Chat", "Image Generation", "Web Search", "Next.js", "TypeScript"],
  authors: [{ name: "Baseai Team" }],
  openGraph: {
    title: "Baseai",
    description: "Your intelligent AI companion for chat, image generation, and web search",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baseai",
    description: "Your intelligent AI companion for chat, image generation, and web search",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
