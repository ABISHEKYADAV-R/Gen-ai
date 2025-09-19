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
      <div className="flex items-center space-x-2 mb-3">
        <span>📝</span>
        <h2 className="text-lg font-semibold">Description Builder</h2>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Write your product description..."
        className={`w-full h-20 p-3 border rounded-lg resize-y focus:outline-none focus:ring-2 ${
          errors.description 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-orange-500'
        }`}
      />
      {errors.description && (
        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
      )}
      
      {/* AI Generation Status */}
      {hasImage && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg text-blue-800 text-sm flex items-center">
          <span className="mr-2">🖼️</span>
          <span>Image detected - AI will analyze your image for enhanced descriptions</span>
        </div>
      )}
      
      {hasExistingContent && !isGenerating && (
        <div className="mt-2 p-2 bg-green-50 rounded-lg text-green-800 text-sm flex items-center">
          <span className="mr-2">✨</span>
          <span>Existing content found - AI will enhance your current description</span>
        </div>
      )}

      <Button
        onClick={onGenerateAI}
        disabled={isGenerating}
        className={`mt-3 ${isGenerating ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {isGenerating ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {hasImage ? 'Analyzing image & generating...' : 'Generating description...'}
          </div>
        ) : (
          <span className="flex items-center">
            <span className="mr-2">✨</span>
            {hasExistingContent 
              ? 'Enhance with AI' 
              : hasImage 
                ? 'Generate from Image Analysis' 
                : 'Generate AI Description'
            }
          </span>
        )}
      </Button>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Tags & Keywords</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={onAddTag}
            className="border border-dashed border-gray-400 px-3 py-1 rounded-full text-sm hover:border-gray-600"
          >
            + Add Tag
          </button>
        </div>
        {errors.tags && (
          <p className="text-red-500 text-sm">{errors.tags}</p>
        )}
      </div>
    </div>
  )
}