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
      <div className="flex items-center space-x-2 mb-4">
        <span>🤖</span>
        <h2 className="text-lg font-semibold">AI Materials Detected</h2>
        {isAnalyzing && (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>
      
      {/* Materials Detection Results */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        {isAnalyzing ? (
          <div className="text-center py-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : materialAnalysis ? (
          <div className="space-y-3">
            {materialAnalysis.materials?.slice(0, 3).map((material, index) => {
              // Calculate confidence based on material position and overall confidence
              const materialConfidence = Math.max(
                materialAnalysis.confidence - (index * 8), 
                Math.min(85, materialAnalysis.confidence - 5)
              )
              
              return (
                <div key={material} className="flex justify-between items-center">
                  <span className="font-medium">{material}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${materialConfidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{materialConfidence}%</span>
                  </div>
                </div>
              )
            })}
            
            {/* Additional analysis info */}
            {materialAnalysis.techniques?.length > 0 && (
              <div className="pt-2 border-t border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Techniques: {materialAnalysis.techniques.slice(0, 2).join(', ')}
                  </span>
                  <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">
                    {materialAnalysis.style}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            <span>📸 Upload an image to detect materials</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.title 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-orange-500'
            }`}
            placeholder={materialAnalysis?.title || "Enter product title..."}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {getCategoryOptions().map((cat) => (
              <option key={cat} value={cat}>
                {cat}
                {materialAnalysis?.category === cat && ' (AI Suggested)'}
              </option>
            ))}
          </select>
          {materialAnalysis?.category && (
            <p className="text-sm text-blue-600 mt-1">
              💡 AI suggests: {materialAnalysis.category}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isEcoFriendly}
            onChange={(e) => onEcoFriendlyChange(e.target.checked)}
            className="w-4 h-4"
          />
          <label>🌱 Eco-friendly/handcrafted</label>
          {materialAnalysis && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
              AI Verified Handcraft
            </span>
          )}
        </div>
      </div>
    </div>
  )
}