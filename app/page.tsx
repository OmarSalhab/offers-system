"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Offer {
  _id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  validFrom: string
  validUntil: string
  imageUrl?: string
}

export default function HomePage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOffers() {
      try {
        const response = await fetch("/api/offers")
        if (!response.ok) {
          throw new Error("Failed to fetch offers")
        }
        const data = await response.json()
        setOffers(data.offers)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading offers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-destructive">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">عروض خاصة</h1>
          <p className="text-muted-foreground">اكتشف أفضل العروض والخصومات</p>
        </header>

        {offers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">لا توجد عروض حالياً.</p>
            <p className="text-muted-foreground">الرجاء العودة لاحقاً لمزيد من العروض!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {offers.map((offer) => (
              <Card key={offer._id} className="overflow-hidden h-full">
                <div className="bg-muted">
                  <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                    <img
                      src={offer.imageUrl || "/placeholder.svg"}
                      alt={offer.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl line-clamp-2">{offer.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{offer.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-primary">${offer.discountedPrice.toFixed(2)}</span>
                    <span className="text-base sm:text-lg text-muted-foreground line-through">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    صالح حتى {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
