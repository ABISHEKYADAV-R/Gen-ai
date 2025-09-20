export interface ProductData {
  title: string
  price: string
  description: string
  story?: string
  category: string
  tags: string[]
  isEcoFriendly: boolean
  hasGlobalShipping: boolean
  authenticityBadge: string
  imageUrl: string
}

export interface MaterialDetection {
  material: string
  confidence: number
}

export interface PriceRecommendation {
  min: number
  max: number
  reason: string
}

export type ViewMode = 'desktop' | 'mobile'