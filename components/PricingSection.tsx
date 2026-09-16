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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-lg">💰</span>
          </div>
          <h2 className="font-craft text-xl font-bold text-[#1C1410]">Financial Valuation</h2>
        </div>
      </div>
      
      <div className="bg-[#F5F0EB] p-5 rounded-[24px] border border-[rgba(28,20,16,0.06)]">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-[#1C1410] uppercase tracking-wider text-[11px]">Set Value</span>
          <div className="flex items-center w-1/2">
            <div className="relative w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6A5A] text-lg font-bold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-[16px] text-lg font-bold focus:outline-none focus:ring-4 transition-all text-[#3D2E26] ${
                  errors.price 
                    ? 'border-red-300 focus:ring-red-500/20' 
                    : 'border-[#E8E1D7] focus:ring-[#C2600A]/10 focus:border-[#C2600A]/50'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-[11px] font-bold mt-1.5 absolute -bottom-5 left-0">{errors.price}</p>
            )}
          </div>
        </div>

        {/* AI Price Recommendations */}
        {isGeneratingPrice ? (
          <div className="bg-[#FDE8D5]/50 text-[#C2600A] p-4 rounded-xl text-sm font-bold flex items-center border border-[#C2600A]/10 mt-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#C2600A] border-t-transparent mr-4"></div>
            <span>AI calibrating market value based on materials...</span>
          </div>
        ) : priceRecommendations ? (
          <div className="mt-6 pt-6 border-t border-[#E8E1D7]">
            <div className="bg-white p-5 rounded-[20px] border border-[#E8E1D7] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-[#1C1410] flex items-center space-x-2">
                  <span>✨</span>
                  <span>AI Valuation</span>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  priceRecommendations.confidence === 'High' ? 'bg-[#166534]/10 text-[#166534] border border-[#166534]/20' :
                  priceRecommendations.confidence === 'Medium' ? 'bg-[#C2600A]/10 text-[#C2600A] border border-[#C2600A]/20' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {priceRecommendations.confidence} Match
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-[#F5F0EB] rounded-xl border border-[rgba(28,20,16,0.04)]">
                  <div className="text-[10px] text-[#7A6A5A] font-bold uppercase tracking-wider mb-1">Minimum</div>
                  <div className="font-bold text-[#3D2E26] text-lg">${priceRecommendations.min}</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-[#C2600A]/5 to-[#F5C842]/5 rounded-xl border border-[#C2600A]/20">
                  <div className="text-[10px] text-[#C2600A] font-bold uppercase tracking-wider mb-1">Suggested</div>
                  <div className="font-bold text-2xl text-[#C2600A]">${priceRecommendations.suggested}</div>
                </div>
                <div className="text-center p-3 bg-[#F5F0EB] rounded-xl border border-[rgba(28,20,16,0.04)]">
                  <div className="text-[10px] text-[#7A6A5A] font-bold uppercase tracking-wider mb-1">Maximum</div>
                  <div className="font-bold text-[#3D2E26] text-lg">${priceRecommendations.max}</div>
                </div>
              </div>
              
              <div className="text-[13px] text-[#7A6A5A] font-medium mb-5 bg-[#F5F0EB] p-3 rounded-xl">
                <span className="font-bold text-[#3D2E26]">Rationale:</span> {priceRecommendations.reasoning}
              </div>
              
              <button
                onClick={applySuggestedPrice}
                className="w-full py-3.5 bg-gradient-to-r from-[#C2600A] to-[#F5C842] text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
              >
                ✨ Apply Suggested Valuation (${priceRecommendations.suggested})
              </button>
            </div>
          </div>
        ) : materialAnalysis ? (
          <div className="bg-white p-4 rounded-xl border border-[#E8E1D7] mt-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[#3D2E26] font-bold text-[13px]">Materials assessed. Unlock pricing analysis.</span>
              <button
                onClick={handleGeneratePrice}
                className="px-6 py-2.5 bg-gradient-to-r from-[#C2600A] to-[#F5C842] text-white font-bold rounded-xl text-[13px] whitespace-nowrap hover:shadow-lg transition-all"
              >
                Generate Valuation
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-5 rounded-xl border border-[#E8E1D7] mt-4 border-dashed">
            <div className="text-[#7A6A5A] text-center">
              <div className="mb-1 text-xl">📊</div>
              <div className="font-bold text-[13px] text-[#3D2E26] mb-1">Awaiting Artwork</div>
              <div className="text-[11px] font-medium">Provide imagery to receive AI market valuation.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}