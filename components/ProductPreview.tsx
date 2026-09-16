import React, { useState } from 'react'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'
import { ProductData, ViewMode } from '@/types/product'

interface ProductPreviewProps {
  productData: ProductData
  activeView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ProductPreview({ productData, activeView, onViewChange }: ProductPreviewProps) {
  const [showStoryInPreview, setShowStoryInPreview] = useState(false)

  return (
    <div className="h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-craft text-xl font-bold text-[#1C1410]">Buyer Preview</h2>
        <div className="flex bg-[#F5F0EB] rounded-xl p-1 border border-[rgba(28,20,16,0.04)] shadow-inner">
          <button
            onClick={() => onViewChange('desktop')}
            className={`px-4 py-1.5 rounded-lg text-[13px] transition-all font-bold ${
              activeView === 'desktop' 
                ? 'bg-white text-[#3D2E26] shadow-sm' 
                : 'text-[#7A6A5A] hover:bg-white/50'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => onViewChange('mobile')}
            className={`px-4 py-1.5 rounded-lg text-[13px] transition-all font-bold ${
              activeView === 'mobile' 
                ? 'bg-white text-[#3D2E26] shadow-sm' 
                : 'text-[#7A6A5A] hover:bg-white/50'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>

      <div className={`border border-[#E8E1D7] rounded-[24px] overflow-hidden bg-white shadow-lg shadow-[#1C1410]/5 transition-all duration-300 ${
        activeView === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
      }`}>
        {/* Product Preview */}
        <div className="relative">
          {productData.imageUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
              <NextImage
                src={productData.imageUrl}
                alt={productData.title}
                fill
                className="absolute inset-0 w-full h-full object-cover bg-white"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <div className="w-full h-64 bg-[#F5F0EB] flex items-center justify-center border-b border-[#E8E1D7]">
              <div className="text-center text-[#7A6A5A]">
                <div className="text-4xl mb-3">🏺</div>
                <div className="text-[13px] font-bold">Image awaiting upload</div>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
            {productData.isEcoFriendly && (
              <span className="bg-[#166534] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transform hover:scale-105 transition-transform">
                🌱 Artisan
              </span>
            )}
            <span className="bg-[#C2600A] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transform hover:scale-105 transition-transform">
              🛡️ {productData.authenticityBadge || 'Authentic'}
            </span>
            {productData.hasGlobalShipping && (
              <span className="bg-[#3D2E26] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm transform hover:scale-105 transition-transform">
                🌍 Global
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <div className="text-[11px] font-bold text-[#C2600A] uppercase tracking-wider mb-2">
                {productData.category || 'CATEGORY'}
              </div>
              <h3 className="font-craft text-xl font-bold text-[#1C1410] leading-tight">
                {productData.title || (
                  <span className="text-[#3D2E26]/40">
                    Product Title
                  </span>
                )}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#1C1410] tracking-tight">
                ${productData.price || (
                  <span className="text-[#3D2E26]/40">0.00</span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-[15px] font-body text-[#3D2E26] mb-5 leading-relaxed">
            {productData.description ? (
              <span className="line-clamp-3">{productData.description}</span>
            ) : (
              <span className="italic text-[#7A6A5A]">
                The story of your masterpiece will emerge here...
              </span>
            )}
          </p>

          {/* Story Section in Preview */}
          {productData.story && (
            <div className="mb-4">
              <div 
                className="flex items-center justify-between p-3 bg-[#F5F0EB] rounded-xl cursor-pointer hover:bg-[#E8E1D7] transition-colors border border-[rgba(28,20,16,0.04)]"
                onClick={() => setShowStoryInPreview(!showStoryInPreview)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base text-[#1C1410] bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">📖</span>
                  <span className="text-[13px] font-bold text-[#1C1410]">Artisan's Narrative</span>
                </div>
                <svg 
                  className={`w-4 h-4 text-[#C2600A] transition-transform ${showStoryInPreview ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {showStoryInPreview && (
                <div className="mt-2 p-4 bg-white/50 border border-[#E8E1D7] rounded-xl">
                  <p className="text-[13px] font-body text-[#3D2E26] leading-relaxed italic">
                    "{productData.story}"
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1.5 mb-5">
            {productData.tags.length > 0 ? (
              productData.tags.slice(0, 6).map((tag, index) => (
                <span key={index} className="bg-white border border-[#E8E1D7] text-[#7A6A5A] px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold shadow-sm">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[#3D2E26]/40 text-[11px] font-bold uppercase tracking-wider italic">
                Tags will populate here...
              </span>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-[#E8E1D7]">
            <div className="flex items-center space-x-4 text-[11px] font-bold text-[#7A6A5A] uppercase tracking-wider">
              {productData.hasGlobalShipping && (
                <div className="flex items-center">
                  <span className="text-[#1C1410] mr-1.5 text-sm">🚚</span>
                  <span>Free ship</span>
                </div>
              )}
              {productData.story && (
                <div className="flex items-center">
                  <span className="text-[#1C1410] mr-1.5 text-sm">📖</span>
                  <span>Story</span>
                </div>
              )}
            </div>
            <button className="bg-[#1C1410] hover:bg-[#3D2E26] text-white font-bold px-6 py-2.5 rounded-xl text-[13px] transition-colors shadow-md hover:shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Compact completion status */}
      <div className={`mt-4 px-4 py-3 rounded-xl text-[13px] font-bold text-center transition-colors border ${
        productData.imageUrl && productData.description && productData.price && productData.tags.length > 0
          ? 'bg-[#166534]/5 text-[#166534] border-[#166534]/20'
          : 'bg-[#FDE8D5]/50 text-[#C2600A] border-[#C2600A]/10'
      }`}>
        {productData.imageUrl && productData.description && productData.price && productData.tags.length > 0 ? (
          <div className="flex items-center justify-center">
            <span className="mr-2 text-lg">✅</span>
            <span>Masterpiece ready for showcase!</span>
            {productData.story && (
              <span className="ml-3 text-[9px] bg-[#166534] text-white px-2 py-1 rounded-md uppercase tracking-wider">
                + Story
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2 text-lg">⏳</span>
            <span>Awaiting properties for full listing</span>
          </div>
        )}
      </div>
    </div>
  )
}