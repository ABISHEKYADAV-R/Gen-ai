import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface PricingSectionProps {
  price: string
  onPriceChange: (price: string) => void
  errors?: Record<string, string>
  materialAnalysis?: any
  isAnalyzing?: boolean
}

export default function PricingSection({ 
  price, 
  onPriceChange, 
  errors = {},
  materialAnalysis,
  isAnalyzing = false
}: PricingSectionProps) {
  const [priceRecommendations, setPriceRecommendations] = useState<{
    min: number
    max: number
    suggested: number
    reasoning: string
    confidence: string
  } | null>(null)
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false)

  // Generate price recommendations based on material analysis
  const generatePriceRecommendation = () => {
    if (!materialAnalysis) return null

    const { materials, style, craftType, confidence, techniques } = materialAnalysis
    
    let basePrice = 35 // Base price
    let multiplier = 1

    // Adjust based on materials
    materials.forEach((material: string) => {
      const materialLower = material.toLowerCase()
      if (materialLower.includes('silver') || materialLower.includes('gold')) {
        multiplier += 0.8
      } else if (materialLower.includes('ceramic') || materialLower.includes('clay')) {
        multiplier += 0.3
      } else if (materialLower.includes('wood') || materialLower.includes('hardwood')) {
        multiplier += 0.4
      } else if (materialLower.includes('textile') || materialLower.includes('cotton')) {
        multiplier += 0.2
      }
    })

    // Adjust based on craft type
    if (craftType.toLowerCase().includes('hand')) {
      multiplier += 0.3
    }
    if (craftType.toLowerCase().includes('traditional')) {
      multiplier += 0.2
    }

    // Adjust based on techniques complexity
    multiplier += techniques.length * 0.1

    // Adjust based on AI confidence
    const confidenceMultiplier = confidence / 100
    multiplier *= (0.8 + confidenceMultiplier * 0.4)

    const suggestedPrice = Math.round(basePrice * multiplier)
    const minPrice = Math.round(suggestedPrice * 0.8)
    const maxPrice = Math.round(suggestedPrice * 1.3)

    return {
      min: minPrice,
      max: maxPrice,
      suggested: suggestedPrice,
      reasoning: `Based on ${materials.join(', ')} materials and ${craftType.toLowerCase()} craftsmanship`,
      confidence: confidence > 90 ? 'High' : confidence > 80 ? 'Medium' : 'Low'
    }
  }

  const handleGeneratePrice = async () => {
    setIsGeneratingPrice(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const recommendations = generatePriceRecommendation()
    setPriceRecommendations(recommendations)
    
    setIsGeneratingPrice(false)
  }

  const applySuggestedPrice = () => {
    if (priceRecommendations) {
      onPriceChange(priceRecommendations.suggested.toString())
    }
  }

  // Auto-generate recommendations when material analysis is available
  useEffect(() => {
    if (materialAnalysis && !priceRecommendations && !isAnalyzing) {
      handleGeneratePrice()
    }
  }, [materialAnalysis, isAnalyzing])

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span>💰</span>
        <h2 className="text-lg font-semibold">AI-Powered Pricing Assistant</h2>
      </div>
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center space-x-4 mb-4">
          <span className="font-medium text-gray-700">Your Price</span>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                className={`pl-8 pr-3 py-2 border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 w-32 ${
                  errors.price 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-orange-500'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        {/* AI Price Recommendations */}
        {isGeneratingPrice ? (
          <div className="bg-blue-100 p-4 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-800">AI analyzing materials for optimal pricing...</span>
          </div>
        ) : priceRecommendations ? (
          <div className="space-y-3">
            <div className="bg-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-green-800">AI Price Recommendation</div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  priceRecommendations.confidence === 'High' ? 'bg-green-600 text-white' :
                  priceRecommendations.confidence === 'Medium' ? 'bg-yellow-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {priceRecommendations.confidence} Confidence
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Min</div>
                  <div className="font-bold text-green-700">${priceRecommendations.min}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Suggested</div>
                  <div className="font-bold text-lg text-green-800">${priceRecommendations.suggested}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Max</div>
                  <div className="font-bold text-green-700">${priceRecommendations.max}</div>
                </div>
              </div>
              
              <div className="text-sm text-green-700 mb-3">
                {priceRecommendations.reasoning}
              </div>
              
              <Button
                onClick={applySuggestedPrice}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                ✨ Apply Suggested Price (${priceRecommendations.suggested})
              </Button>
            </div>
          </div>
        ) : materialAnalysis ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">Material analysis complete - ready for price recommendations</span>
              <Button
                onClick={handleGeneratePrice}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Generate AI Pricing
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-gray-600 text-center">
              <div className="mb-2">📊 Upload an image to get AI pricing recommendations</div>
              <div className="text-sm">AI will analyze materials and suggest optimal pricing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}