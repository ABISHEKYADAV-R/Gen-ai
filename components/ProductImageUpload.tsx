import React, { useState, useRef } from 'react'
import NextImage from 'next/image'
import { Button } from '@/components/ui/button'

interface ProductImageUploadProps {
  imageUrl: string
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onImageDrop?: (file: File) => void
  analysisResult?: {
    materials: string[]
    colors: string[]
    style: string
    confidence: number
  } | null
  isAnalyzing?: boolean
}

export default function ProductImageUpload({ 
  imageUrl, 
  onImageUpload, 
  onImageDrop, 
  analysisResult = null,
  isAnalyzing = false 
}: ProductImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setUploadError('')

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      if (imageFile.size > 10 * 1024 * 1024) { // 10MB limit
        setUploadError('File size must be less than 10MB')
        return
      }
      
      // Trigger both handlers
      onImageDrop?.(imageFile)
      const fakeEvent = {
        target: { files: [imageFile] }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      onImageUpload(fakeEvent)
    } else {
      setUploadError('Please upload an image file')
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('')
    const file = e.target.files?.[0]
    if (file && file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB')
      return
    }
    onImageUpload(e)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <span>📷</span>
        <h2 className="text-lg font-semibold">Product Image</h2>
      </div>
      <div 
        className={`border-2 border-dashed rounded-lg p-16 text-center bg-gray-50 mb-4 transition-colors ${
          isDragging 
            ? 'border-orange-500 bg-orange-50' 
            : imageUrl 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          <div className="relative group">
            <NextImage
              src={imageUrl}
              alt="Product"
              width={200}
              height={200}
              className="mx-auto rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white hover:bg-gray-100"
              >
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white mx-auto mb-4 ${
              isDragging ? 'bg-orange-600' : 'bg-orange-500'
            }`}>
              {isDragging ? '📤' : '☁️'}
            </div>
            <p className="text-gray-600 mb-4">
              {isDragging ? 'Drop your image here' : 'Drag & drop your craft image here'}
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload"
        />
        <Button 
          onClick={handleButtonClick}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {imageUrl ? '+ Change File' : '+ Choose File'}
        </Button>
      </div>
      
      {uploadError && (
        <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm mb-4 flex items-center">
          <span className="mr-2">⚠️</span>
          {uploadError}
        </div>
      )}
      
      {/* AI Analysis Results */}
      {isAnalyzing ? (
        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg text-sm mb-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
          <span>Analyzing image with AI... Detecting materials, colors, and style...</span>
        </div>
      ) : imageUrl && analysisResult ? (
        <div className="space-y-3 mb-4">
          <div className="bg-green-100 text-green-800 p-4 rounded-lg">
            <div className="flex items-center mb-3">
              <span className="mr-2">✨</span>
              <span className="font-semibold">AI Analysis Complete ({Math.round(analysisResult.confidence)}% confident)</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Materials Detected */}
              <div>
                <span className="font-medium text-green-900">🔍 Materials Detected:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.materials.map((material, index) => (
                    <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Colors Detected */}
              <div>
                <span className="font-medium text-green-900">🎨 Colors:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.colors.map((color, index) => (
                    <span key={index} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Style Detected */}
              <div>
                <span className="font-medium text-green-900">🎭 Style:</span>
                <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs ml-2">
                  {analysisResult.style}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : imageUrl ? (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg text-sm mb-4 flex items-center">
          <span className="mr-2">⏳</span>
          <span>Image uploaded successfully! Click "Generate AI Description" to analyze materials.</span>
        </div>
      ) : (
        <div className="bg-gray-100 text-gray-600 p-3 rounded-lg text-sm mb-4 flex items-center">
          <span className="mr-2">📋</span>
          <span>Upload an image to get AI material analysis and automatic description generation.</span>
        </div>
      )}
    </div>
  )
}