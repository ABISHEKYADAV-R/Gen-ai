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
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#F5F0EB] rounded-full flex items-center justify-center shadow-sm">
          <span className="text-lg">📷</span>
        </div>
        <h2 className="font-craft text-xl font-bold text-[#1C1410]">Craft Imagery</h2>
      </div>
      <div 
        className={`border-2 border-dashed rounded-[24px] p-16 text-center mb-6 transition-all duration-300 relative overflow-hidden ${
          isDragging 
            ? 'border-[#C2600A] bg-[#FDE8D5]/30' 
            : imageUrl 
              ? 'border-[#166534]/30 bg-[#166534]/5' 
              : 'border-[#E8E1D7] bg-[#F5F0EB] hover:border-[#C2600A]/50'
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
                className="bg-white/90 hover:bg-white text-[#1C1410] font-bold shadow-lg backdrop-blur-sm"
              >
                Change Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg transition-transform ${
              isDragging ? 'bg-gradient-to-br from-[#C2600A] to-[#F5C842] scale-110' : 'bg-gradient-to-br from-[#C2600A] to-[#F5C842]'
            }`}>
              <span className="text-2xl">{isDragging ? '📥' : '✨'}</span>
            </div>
            <p className="text-[#3D2E26] font-bold mb-2">
              {isDragging ? 'Drop your masterpiece here' : 'Drag & Drop Artwork'}
            </p>
            <p className="text-[#7A6A5A] text-sm mb-6 max-w-[250px] mx-auto">
              High resolution images lead to better AI property detection.
            </p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          id="file-upload"
        />
        <button 
          onClick={handleButtonClick}
          className="px-6 py-3 bg-white border border-[#E8E1D7] text-[#3D2E26] font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all w-fit mx-auto relative z-10"
        >
          {imageUrl ? 'Swap Artwork File' : 'Browse Local Files'}
        </button>
      </div>
      
      {uploadError && (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl text-[13px] font-bold mb-4 flex items-center border border-red-100">
          <span className="mr-3 text-lg">⚠️</span>
          {uploadError}
        </div>
      )}
      
      {/* AI Analysis Results */}
      {isAnalyzing ? (
        <div className="bg-[#FDE8D5]/50 text-[#C2600A] p-4 rounded-xl text-sm font-bold mb-4 flex items-center border border-[#C2600A]/10">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#C2600A] border-t-transparent mr-4"></div>
          <span>Analyzing artwork with AI... Extracting materials & palette...</span>
        </div>
      ) : imageUrl && analysisResult ? (
        <div className="space-y-4 mb-4">
          <div className="bg-[#F5F0EB] p-5 rounded-[24px] border border-[rgba(28,20,16,0.06)]">
            <div className="flex items-center mb-4">
              <span className="mr-3 text-xl">✨</span>
              <span className="font-bold text-[#1C1410]">AI Analysis Complete <span className="text-[#7A6A5A] text-xs uppercase tracking-wider ml-2">({Math.round(analysisResult.confidence)}% match)</span></span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <span className="font-bold text-[11px] text-[#7A6A5A] uppercase tracking-wider mb-2 block">🔍 Discovered Materials</span>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.materials.map((material, index) => (
                    <span key={index} className="bg-white border border-[#E8E1D7] text-[#3D2E26] font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm">
                      {material}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-bold text-[11px] text-[#7A6A5A] uppercase tracking-wider mb-2 block">🎨 Color Palette</span>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.colors.map((color, index) => (
                    <span key={index} className="bg-white border border-[#E8E1D7] text-[#3D2E26] font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor: color.split(' ')[0]}}></span>
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-bold text-[11px] text-[#7A6A5A] uppercase tracking-wider mb-2 block">🎭 Aesthetic Style</span>
                <span className="bg-white border border-[#E8E1D7] text-[#3D2E26] font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm">
                  {analysisResult.style}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : imageUrl ? (
        <div className="bg-[#166534]/5 text-[#166534] p-4 rounded-xl text-sm font-bold mb-4 flex items-center border border-[#166534]/20">
          <span className="mr-3 text-lg">⏳</span>
          <span>Upload secured! Engage AI Analysis below to extract properties.</span>
        </div>
      ) : (
        <div className="bg-[#F5F0EB] text-[#7A6A5A] p-4 rounded-xl text-sm font-bold flex items-center border border-[#E8E1D7]">
          <span className="mr-3 text-lg">📋</span>
          <span>Upload imagery to unlock AI material and origin analysis.</span>
        </div>
      )}
    </div>
  )
}