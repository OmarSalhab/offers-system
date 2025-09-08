"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewOfferPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    validFrom: "",
    validUntil: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate form data
      if (
        !formData.title ||
        !formData.description ||
        !formData.originalPrice ||
        !formData.discountedPrice ||
        !formData.validFrom ||
        !formData.validUntil
      ) {
        throw new Error("All fields are required")
      }

      if (Number.parseFloat(formData.discountedPrice) >= Number.parseFloat(formData.originalPrice)) {
        throw new Error("Discounted price must be less than original price")
      }

      if (new Date(formData.validFrom) >= new Date(formData.validUntil)) {
        throw new Error("Valid from date must be before valid until date")
      }

      let imageKey = ""
      let imageUrl = ""

      // Handle image upload if selected
      if (selectedImage) {
        // Get signed URL for upload
        const uploadResponse = await fetch("/api/admin/upload/signed-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: selectedImage.name,
            fileType: selectedImage.type,
          }),
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to get upload URL")
        }

        const { signedUrl, imageKey: key, imageUrl: url } = await uploadResponse.json()
        imageKey = key
        imageUrl = url

        // Upload image to R2
        const uploadResult = await fetch(signedUrl, {
          method: "PUT",
          body: selectedImage,
          headers: {
            "Content-Type": selectedImage.type,
          },
        })

        if (!uploadResult.ok) {
          throw new Error("Failed to upload image")
        }
      }

      // Create offer
      const response = await fetch("/api/admin/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageKey,
          imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create offer")
      }

      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">إنشاء عرض جديد</h2>
          <p className="text-muted-foreground">أضف عرضاً خاصاً جديداً إلى النظام</p>
        </div>
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            الرجوع إلى العروض
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل العرض</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">العنوان *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter offer title"
                required
                disabled={loading}
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter offer description"
                required
                disabled={loading}
                maxLength={1000}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">السعر الأصلي *</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">السعر بعد الخصم *</Label>
                <Input
                  id="discountedPrice"
                  name="discountedPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">ساري من *</Label>
                <Input
                  id="validFrom"
                  name="validFrom"
                  type="datetime-local"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">ساري حتى *</Label>
                <Input
                  id="validUntil"
                  name="validUntil"
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">صورة العرض</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
              <p className="text-sm text-muted-foreground">
                اختياري. الصيغ المدعومة: JPG, PNG, GIF. الحجم الأقصى: 5MB.
              </p>
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "جارٍ الإنشاء..." : "إنشاء العرض"}
              </Button>
              <Link href="/admin" className="flex-1">
                <Button type="button" variant="outline" className="w-full bg-transparent" disabled={loading}>
                  إلغاء
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
