import React from 'react'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductData, ViewMode } from '@/types/product'

interface ProductPreviewProps {
  productData: ProductData
  activeView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ProductPreview({ productData, activeView, onViewChange }: ProductPreviewProps) {
  return (
    <div className="h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Live Preview</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewChange('desktop')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeView === 'desktop' 
                ? 'bg-white font-semibold shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => onViewChange('mobile')}
            className={`px-3 py-1 rounded-md text-sm ${
              activeView === 'mobile' 
                ? 'bg-white font-semibold shadow-sm' 
                : 'text-gray-600'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      <div className={`border rounded-lg overflow-hidden bg-gray-50 shadow-md ${
        activeView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
      }`}>
        {/* Product Preview */}
        <div className="relative">
          {productData.imageUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '60%' }}>
              <NextImage
                src={productData.imageUrl}
                alt={productData.title}
                fill
                className="absolute inset-0 w-full h-full object-contain bg-white"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-b from-white via-yellow-100 via-orange-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-3xl mb-2">🏺</div>
                <div className="text-sm">Upload an image to see preview</div>
              </div>
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex flex-wrap gap-1">
            {productData.isEcoFriendly && (
              <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                🌱 Eco-friendly
              </span>
            )}
            <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
              🛡️ {productData.authenticityBadge || 'Authentic'}
            </span>
            {productData.hasGlobalShipping && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                🌍 Global Ship
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-3">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-800 flex-1 pr-2">
              {productData.title || (
                <span className="italic text-gray-400 text-base">
                  Product title will appear here...
                </span>
              )}
            </h3>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                ${productData.price || (
                  <span className="text-gray-400">0.00</span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {productData.category || 'Category'}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {productData.description ? (
              <span className="line-clamp-3">{productData.description}</span>
            ) : (
              <span className="italic text-gray-400">
                Product description will appear here. Use AI to generate compelling descriptions...
              </span>
            )}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {productData.tags.length > 0 ? (
              productData.tags.slice(0, 6).map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs italic">
                Tags will appear here when added...
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              {productData.hasGlobalShipping && (
                <div className="flex items-center">
                  <span className="text-green-600 mr-1">🚚</span>
                  <span>Free shipping</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-red-500 mr-1">❤️</span>
                <span>24 likes</span>
              </div>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 font-semibold px-4">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Compact completion status */}
      <div className={`mt-3 px-3 py-2 rounded-lg text-sm text-center transition-colors ${
        productData.imageUrl && productData.description && productData.price && productData.tags.length > 0
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      }`}>
        {productData.imageUrl && productData.description && productData.price && productData.tags.length > 0 ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">✅</span>
            <span className="font-medium text-xs">Ready to publish!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">⏳</span>
            <span className="text-xs">Complete form for full preview</span>
          </div>
        )}
      </div>
    </div>
  )
}