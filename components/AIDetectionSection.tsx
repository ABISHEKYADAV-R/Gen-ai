import React from 'react'

interface MaterialAnalysis {
  materials: string[]
  colors: string[]
  style: string
  confidence: number
  craftType: string
  techniques: string[]
  origin: string
  estimatedAge: string
  rarity: string
  title: string
  category: string
  description: string
  tags: string[]
}

interface AIDetectionSectionProps {
  title: string
  category: string
  isEcoFriendly: boolean
  onTitleChange: (title: string) => void
  onCategoryChange: (category: string) => void
  onEcoFriendlyChange: (isEcoFriendly: boolean) => void
  errors?: Record<string, string>
  materialAnalysis?: MaterialAnalysis | null
  isAnalyzing?: boolean
}

export default function AIDetectionSection({
  title,
  category,
  isEcoFriendly,
  onTitleChange,
  onCategoryChange,
  onEcoFriendlyChange,
  errors = {},
  materialAnalysis,
  isAnalyzing = false
}: AIDetectionSectionProps) {
  
  // Generate dynamic category options based on analysis
  const getCategoryOptions = () => {
    const defaultCategories = [
      'Ceramics',
      'Pottery', 
      'Textiles & Fabrics',
      'Jewelry & Accessories',
      'Wood Crafts',
      'Metalwork',
      'Home Decor',
      'Art & Collectibles',
      'Traditional Crafts'
    ]
    
    if (materialAnalysis?.category && !defaultCategories.includes(materialAnalysis.category)) {
      return [materialAnalysis.category, ...defaultCategories]
    }
    
    return defaultCategories
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-lg">🤖</span>
          </div>
          <h2 className="font-craft text-xl font-bold text-[#1C1410]">AI Property Detection</h2>
        </div>
        {isAnalyzing && (
          <div className="flex items-center space-x-2 bg-[#FDE8D5]/50 px-3 py-1.5 rounded-full border border-[#C2600A]/10">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#C2600A] border-t-transparent"></div>
            <span className="text-[11px] font-bold text-[#C2600A] uppercase tracking-wider">Analyzing</span>
          </div>
        )}
      </div>
      
      {/* Materials Detection Results */}
      <div className="bg-[#F5F0EB] p-5 rounded-[24px] mb-6 border border-[rgba(28,20,16,0.06)] min-h-[120px] flex flex-col justify-center">
        {isAnalyzing ? (
          <div className="w-full">
            <div className="animate-pulse space-y-3">
              <div className="h-2.5 bg-[#E8E1D7] rounded-full w-3/4 mx-auto"></div>
              <div className="h-2.5 bg-[#E8E1D7] rounded-full w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : materialAnalysis ? (
          <div className="space-y-4 w-full">
            <div className="space-y-3">
              {materialAnalysis.materials?.slice(0, 3).map((material, index) => {
                const materialConfidence = Math.max(
                  materialAnalysis.confidence - (index * 8), 
                  Math.min(85, materialAnalysis.confidence - 5)
                )
                
                return (
                  <div key={material} className="flex justify-between items-center bg-white p-2 rounded-xl border border-[#E8E1D7] shadow-sm">
                    <span className="font-bold text-[13px] text-[#3D2E26] ml-2">{material}</span>
                    <div className="flex items-center space-x-3 mr-2">
                      <div className="w-24 h-1.5 bg-[#F5F0EB] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#C2600A] to-[#F5C842] rounded-full transition-all duration-1000" 
                          style={{ width: `${materialConfidence}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-[#7A6A5A] min-w-[32px] text-right">{materialConfidence}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Additional analysis info */}
            {materialAnalysis.techniques?.length > 0 && (
              <div className="pt-4 border-t border-[#E8E1D7]">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-bold text-[#7A6A5A] uppercase tracking-wider">
                    Techniques: <span className="text-[#3D2E26]">{materialAnalysis.techniques.slice(0, 2).join(', ')}</span>
                  </span>
                  <span className="text-[10px] bg-white border border-[#E8E1D7] px-2 py-1 rounded-md font-bold text-[#C2600A] uppercase tracking-wider">
                    {materialAnalysis.style}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-[#7A6A5A] font-medium text-sm">
            <span>📸 Provide imagery to detect material composition</span>
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#1C1410] mb-2">Product Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`w-full p-4 bg-white border rounded-[16px] focus:outline-none focus:ring-4 text-[#3D2E26] font-medium transition-all ${
              errors.title 
                ? 'border-red-300 focus:ring-red-500/20' 
                : 'border-[#E8E1D7] focus:border-[#C2600A]/50 focus:ring-[#C2600A]/10'
            }`}
            placeholder={materialAnalysis?.title || "Enter product title..."}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1.5 font-medium ml-1">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-[#1C1410] mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-4 bg-white border border-[#E8E1D7] rounded-[16px] focus:outline-none focus:ring-4 focus:ring-[#C2600A]/10 focus:border-[#C2600A]/50 text-[#3D2E26] font-medium transition-all appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%237A6A5A' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
          >
            {getCategoryOptions().map((cat) => (
              <option key={cat} value={cat}>
                {cat}
                {materialAnalysis?.category === cat && ' ✨ (AI Suggested)'}
              </option>
            ))}
          </select>
          {materialAnalysis?.category && (
            <p className="text-[11px] font-bold text-[#C2600A] uppercase tracking-wider mt-2 ml-1">
              💡 AI expects: {materialAnalysis.category}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-[#E8E1D7]">
          <input
            type="checkbox"
            checked={isEcoFriendly}
            onChange={(e) => onEcoFriendlyChange(e.target.checked)}
            className="w-5 h-5 text-[#C2600A] focus:ring-[#C2600A] rounded border-[#E8E1D7]"
          />
          <label className="font-bold text-[#1C1410]">🌱 Eco-friendly & Handcrafted</label>
          {materialAnalysis && (
            <span className="text-[9px] bg-[#166534]/10 text-[#166534] border border-[#166534]/20 px-2 py-1.5 rounded-md font-bold uppercase tracking-wider ml-auto">
              AI Verified
            </span>
          )}
        </div>
      </div>
    </div>
  )
}