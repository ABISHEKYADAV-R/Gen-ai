import React from 'react'
import { Button } from '@/components/ui/button'

interface DescriptionBuilderProps {
  description: string
  tags: string[]
  onDescriptionChange: (description: string) => void
  onGenerateAI: () => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  isGenerating?: boolean
  errors?: Record<string, string>
  hasImage?: boolean
  hasExistingContent?: boolean
}

export default function DescriptionBuilder({
  description,
  tags,
  onDescriptionChange,
  onGenerateAI,
  onAddTag,
  onRemoveTag,
  isGenerating = false,
  errors = {},
  hasImage = false,
  hasExistingContent = false
}: DescriptionBuilderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center shadow-sm">
          <span className="text-lg">📝</span>
        </div>
        <h2 className="font-craft text-xl font-bold text-[#1C1410]">Narrative Architecture</h2>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Weave the tale of your masterpiece..."
        className={`w-full h-32 p-4 bg-white border rounded-[16px] resize-none focus:outline-none focus:ring-4 font-body text-[15px] font-medium text-[#3D2E26] transition-all shadow-sm ${
          errors.description 
            ? 'border-red-300 focus:ring-red-500/20' 
            : 'border-[#E8E1D7] focus:border-[#C2600A]/50 focus:ring-[#C2600A]/10'
        }`}
      />
      {errors.description && (
        <p className="text-red-500 text-[11px] font-bold mt-1.5 ml-1">{errors.description}</p>
      )}
      
      {/* AI Generation Status */}
      {hasImage && (
        <div className="mt-3 p-3 bg-[#FDE8D5]/50 rounded-xl text-[#C2600A] text-[13px] font-bold flex items-center border border-[#C2600A]/10">
          <span className="mr-3 text-lg">🖼️</span>
          <span>Imagery detected. AI will automatically extract and highlight materials.</span>
        </div>
      )}
      
      {hasExistingContent && !isGenerating && (
        <div className="mt-3 p-3 bg-[#F5F0EB] rounded-xl text-[#1C1410] text-[13px] font-bold flex items-center border border-[#E8E1D7]">
          <span className="mr-3 text-lg">✨</span>
          <span>Existing narrative found. Proceed to enchant and refine.</span>
        </div>
      )}

      <button
        onClick={onGenerateAI}
        disabled={isGenerating}
        className={`mt-4 w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
          isGenerating 
            ? 'bg-gradient-to-r from-[#C2600A]/60 to-[#F5C842]/60 text-white cursor-wait' 
            : 'bg-gradient-to-r from-[#C2600A] to-[#F5C842] text-white hover:shadow-lg hover:-translate-y-0.5'
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
            {hasImage ? 'Analyzing Imagery & Penning...' : 'Drafting Narrative...'}
          </div>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2 text-lg">✨</span>
            {hasExistingContent 
              ? 'Enchant with AI' 
              : hasImage 
                ? 'Pen Narrative from Imagery' 
                : 'Generate AI Masterpiece'
            }
          </span>
        )}
      </button>

      <div className="mt-8 pt-6 border-t border-[#E8E1D7]">
        <label className="block text-[11px] font-bold text-[#7A6A5A] uppercase tracking-wider mb-3">Tags & Attributes</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-white border border-[#E8E1D7] text-[#3D2E26] font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center group transition-colors hover:border-[#C2600A]/30"
            >
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-2 text-[#7A6A5A] hover:text-[#C2600A] opacity-50 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={onAddTag}
            className="border-2 border-dashed border-[#E8E1D7] text-[#7A6A5A] font-bold px-4 py-1.5 rounded-lg text-xs hover:border-[#C2600A]/30 hover:text-[#C2600A] transition-all bg-[#F5F0EB]"
          >
            + Annotate
          </button>
        </div>
        {errors.tags && (
          <p className="text-red-500 text-[11px] font-bold ml-1">{errors.tags}</p>
        )}
      </div>
    </div>
  )
}