import mongoose, { Schema, type Document } from "mongoose"

export interface IOffer extends Document {
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  validFrom: Date
  validUntil: Date
  imageKey?: string
  imageUrl?: string
  isHidden: boolean
  createdAt: Date
  updatedAt: Date
}

const OfferSchema = new Schema<IOffer>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    imageKey: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure discounted price is less than original price
OfferSchema.pre("save", function (next) {
  if (this.discountedPrice >= this.originalPrice) {
    next(new Error("Discounted price must be less than original price"))
  } else {
    next()
  }
})

export default mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema)
