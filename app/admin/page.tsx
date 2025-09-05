"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package } from "lucide-react" // Import Package component
import { useToast } from "@/hooks/use-toast"

interface Offer {
  _id: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  validFrom: string
  validUntil: string
  imageUrl?: string
  isHidden: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingOffers, setTogglingOffers] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const fetchOffers = async () => {
    try {
      const response = await fetch("/api/admin/offers")
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

  useEffect(() => {
    fetchOffers()
  }, [])

  const handleToggleVisibility = async (offerId: string, currentHidden: boolean) => {
    // Add to toggling set to show loading state
    setTogglingOffers(prev => new Set(prev).add(offerId))
    
    try {
      const response = await fetch(`/api/admin/offers/${offerId}/toggle`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to toggle offer visibility")
      }

      const data = await response.json()
      
      // Update local state with the response from server
      setOffers(offers.map((offer) => 
        offer._id === offerId ? { ...offer, isHidden: data.offer.isHidden } : offer
      ))
      
      // Show success toast
      toast({
        title: "Visibility Updated",
        description: data.offer.isHidden 
          ? "Offer is now hidden from users" 
          : "Offer is now visible to users",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle visibility"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      // Remove from toggling set
      setTogglingOffers(prev => {
        const newSet = new Set(prev)
        newSet.delete(offerId)
        return newSet
      })
    }
  }

  const handleDelete = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/offers/${offerId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete offer")
      }

      // Remove from local state
      setOffers(offers.filter((offer) => offer._id !== offerId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete offer")
    }
  }

  const isOfferActive = (offer: Offer) => {
    const now = new Date()
    const validFrom = new Date(offer.validFrom)
    const validUntil = new Date(offer.validUntil)
    return now >= validFrom && now <= validUntil && !offer.isHidden
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading offers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Offers Management</h2>
          <p className="text-muted-foreground">Create and manage your special offers</p>
        </div>
        <Link href="/admin/offers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {offers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first offer</p>
            <Link href="/admin/offers/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Offer
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer._id} className="overflow-hidden">
              {offer.imageUrl && (
                <div className="aspect-video bg-muted">
                  <img
                    src={offer.imageUrl || "/placeholder.svg"}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{offer.title}</CardTitle>
                  <div className="flex gap-1 ml-2">
                    {isOfferActive(offer) && (
                      <Badge variant="default" className="text-xs">
                        Active
                      </Badge>
                    )}
                    {offer.isHidden ? (
                      <Badge variant="destructive" className="text-xs">
                        Hidden
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Visible
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">${offer.discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through">${offer.originalPrice.toFixed(2)}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div>
                    Valid: {new Date(offer.validFrom).toLocaleDateString()} -{" "}
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                  <div>Created: {new Date(offer.createdAt).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/offers/${offer._id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleToggleVisibility(offer._id, offer.isHidden)}
                    disabled={togglingOffers.has(offer._id)}
                    title={offer.isHidden ? "Show offer to users" : "Hide offer from users"}
                    className="flex items-center gap-1"
                  >
                    {togglingOffers.has(offer._id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : offer.isHidden ? (
                      <>
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">Show</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span className="text-xs">Hide</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(offer._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
