import mongoose, { Schema, Document } from 'mongoose'

export interface BrandInterface extends Document {
  name: string
  slug: string
  description?: string
  logo?: string
  website?: string
  isActive: boolean
  order: number
  country?: string
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}

const BrandSchema = new Schema<BrandInterface>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
    country: { type: String },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
)

// Indexes
BrandSchema.index({ name: 1 })
BrandSchema.index({ order: 1 })

// Auto-generate slug
BrandSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
})

export const Brand = mongoose.models.Brand || mongoose.model<BrandInterface>('Brand', BrandSchema)
