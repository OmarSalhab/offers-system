"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, Package, Home } from "lucide-react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !admin) {
      router.push("/login")
    }
  }, [admin, loading, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <nav className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
                >
                  <Package className="h-4 w-4" />
                  Offers
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium"
                >
                  <Home className="h-4 w-4" />
                  View Site
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Welcome, {admin.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
