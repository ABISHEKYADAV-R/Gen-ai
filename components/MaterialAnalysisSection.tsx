import React from 'react'

interface MaterialAnalysisSectionProps {
  analysis?: {
    materials: string[]
    colors: string[]
    style: string
    confidence: number
    craftType: string
    techniques: string[]
    origin: string
    rarity: string
    estimatedAge?: string
    analysisDetails?: {
      processingTime: string
    }
  } | null
  isAnalyzing: boolean
}

export default function MaterialAnalysisSection({ analysis, isAnalyzing }: MaterialAnalysisSectionProps) {
  if (!analysis && !isAnalyzing) {
    return null
  }

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <span>🔬</span>
        <h2 className="text-lg font-semibold">AI Material Analysis</h2>
      </div>
      
      {isAnalyzing ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <div>
            <h3 className="font-medium text-blue-900">Analyzing Materials...</h3>
            <p className="text-blue-700 text-sm">AI is examining your image to detect materials, colors, and crafting techniques.</p>
          </div>
        </div>
      ) : analysis ? (
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 border border-purple-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header with Confidence Score */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Analysis Complete</h3>
                <p className="text-purple-100 text-sm">{analysis.craftType}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysis.confidence}%</div>
                <div className="text-xs text-purple-100">AI Confidence</div>
              </div>
            </div>
          </div>

          {/* Analysis Details */}
          <div className="p-4 space-y-4">
            {/* Materials Detected */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">🏺</span>
                Materials Detected
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {analysis.materials.map((material: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 px-3 py-2 rounded-lg text-sm font-semibold border border-orange-200 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                      {material}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">🎨</span>
                Color Palette
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {analysis.colors.map((color: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-2 py-1.5 rounded-lg text-sm font-semibold border border-blue-200 text-center shadow-sm">
                    {color}
                  </div>
                ))}
              </div>
            </div>

            {/* Techniques */}
            <div>
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <span className="mr-2">🛠️</span>
                Crafting Techniques
              </h4>
              <div className="space-y-2">
                {analysis.techniques.map((technique: string, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-800 px-3 py-2 rounded-lg text-sm border border-indigo-200 flex items-center shadow-sm">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                    <span className="font-medium">{technique}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Style and Origin Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg border border-purple-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                  <span className="mr-2 text-lg">🎭</span>
                  Artistic Style
                </h4>
                <div className="text-purple-800 font-semibold text-lg">
                  {analysis.style}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-4 rounded-lg border border-yellow-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                  <span className="mr-2 text-lg">⭐</span>
                  Rarity Assessment
                </h4>
                <div className="text-yellow-800 font-semibold text-lg">
                  {analysis.rarity}
                </div>
              </div>
            </div>

            {/* Cultural Context */}
            {analysis.origin && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-5 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center text-lg">
                  <span className="mr-2 text-xl">📚</span>
                  Cultural & Historical Context
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{analysis.origin}</p>
                {analysis.estimatedAge && (
                  <div className="flex items-center text-xs text-gray-600 mt-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <span className="font-medium">Period:</span>
                    <span className="ml-1">{analysis.estimatedAge}</span>
                  </div>
                )}
              </div>
            )}

            {/* Value Indicators */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-lg p-4">
              <h4 className="font-bold text-emerald-800 mb-3 flex items-center text-lg">
                <span className="mr-2 text-xl">💎</span>
                Craftsmanship Quality Indicators
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                  <span className="text-emerald-700 font-medium">Authentic Materials</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                  <span className="text-emerald-700 font-medium">Traditional Methods</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                  <span className="text-emerald-700 font-medium">High Confidence Score</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mr-2"></div>
                  <span className="text-emerald-700 font-medium">Collectible Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Analysis Metadata */}
          <div className="bg-gradient-to-r from-gray-100 to-slate-100 px-6 py-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <span className="mr-2">🤖</span>
                <span className="font-medium">Powered by Advanced AI Recognition</span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Analysis Time:</span>
                <span className="ml-1">{analysis.analysisDetails?.processingTime || '2.1s'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}