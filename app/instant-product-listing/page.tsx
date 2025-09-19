'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import ProductImageUpload from '@/components/ProductImageUpload'
import AIDetectionSection from '@/components/AIDetectionSection'
import PricingSection from '@/components/PricingSection'
import DescriptionBuilder from '@/components/DescriptionBuilder'
import ProductPreview from '@/components/ProductPreview'
import MaterialAnalysisSection from '@/components/MaterialAnalysisSection'
import { ProductData, ViewMode } from '@/types/product'

export default function InstantProductListing() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [productData, setProductData] = useState<ProductData>({
    title: 'Handcrafted Ceramic Vase',
    price: '45.00',
    description: '',
    category: 'Ceramics',
    tags: ['handmade', 'ceramic', 'vase'],
    isEcoFriendly: true,
    hasGlobalShipping: true,
    authenticityBadge: 'Traditional Pottery',
    imageUrl: ''
  })

  const [activeView, setActiveView] = useState<ViewMode>('desktop')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showStoryImportedNotification, setShowStoryImportedNotification] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [showLoadDraftOption, setShowLoadDraftOption] = useState(false)
  const [materialAnalysis, setMaterialAnalysis] = useState<any>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)

  // Load available drafts on component mount
  useEffect(() => {
    const drafts = localStorage.getItem('productDrafts')
    if (drafts && JSON.parse(drafts).length > 0) {
      setShowLoadDraftOption(true)
    }
  }, [])

  // Check if coming from story builder and load story content
  useEffect(() => {
    if (searchParams) {
      const fromStoryBuilder = searchParams.get('from') === 'story-builder'
      if (fromStoryBuilder) {
        const storyContent = localStorage.getItem('storyContent')
        if (storyContent) {
          setProductData(prev => ({
            ...prev,
            description: storyContent
          }))
          // Show notification
          setShowStoryImportedNotification(true)
          // Clear the story content from localStorage after using it
          localStorage.removeItem('storyContent')
          // Hide notification after 5 seconds
          setTimeout(() => {
            setShowStoryImportedNotification(false)
          }, 5000)
        }
      }
    }
  }, [searchParams])

  const analyzeImageMaterials = async (file: File) => {
    setIsAnalyzingImage(true)
    setMaterialAnalysis(null)
    
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/detect-materials', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('AI Analysis Result:', result.analysis) // Debug log
        setMaterialAnalysis(result.analysis)
        
        // Comprehensive product data update based on AI analysis
        if (result.analysis) {
          const analysis = result.analysis
          
          // Extract material-based tags
          const materialTags = analysis.materials?.map((m: string) => m.toLowerCase().replace(/[^a-z0-9]/g, '')) || []
          const colorTags = analysis.colors?.map((c: string) => c.toLowerCase().replace(/[^a-z0-9]/g, '').split(' ')[0]) || []
          const techniqueTags = analysis.techniques?.map((t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '').split(' ')[0]) || []
          
          // Merge with existing tags and remove duplicates
          const allTags = [...new Set([
            ...materialTags,
            ...colorTags.slice(0, 2), // Limit color tags
            ...techniqueTags.slice(0, 2), // Limit technique tags
            'handmade',
            'artisan'
          ])].filter(tag => tag && tag.length > 2).slice(0, 8) // Limit total tags

          setProductData(prev => ({
            ...prev,
            title: analysis.title || prev.title,
            category: analysis.category || analysis.craftType || prev.category,
            description: analysis.description || prev.description,
            tags: allTags,
            authenticityBadge: analysis.craftType || prev.authenticityBadge
          }))

          console.log('Updated product data with AI analysis') // Debug log
        }
      } else {
        console.error('Material analysis failed:', await response.text())
      }
    } catch (error) {
      console.error('Error analyzing materials:', error)
    } finally {
      setIsAnalyzingImage(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProductData(prev => ({
          ...prev,
          imageUrl: result
        }))
      }
      reader.readAsDataURL(file)
      
      // Automatically analyze materials after upload
      analyzeImageMaterials(file)
    }
  }

  const handleImageDrop = (file: File) => {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setProductData(prev => ({
        ...prev,
        imageUrl: result
      }))
    }
    reader.readAsDataURL(file)
    
    // Automatically analyze materials after upload
    analyzeImageMaterials(file)
  }

  const generateAIDescription = async () => {
    setIsGeneratingDescription(true)
    
    try {
      // If we have material analysis, use it to generate rich descriptions
      if (materialAnalysis) {
        const { materials, colors, style, craftType, techniques, confidence, origin, rarity, description } = materialAnalysis
        
        // Use the AI-generated description if available
        if (description && description.trim()) {
          setProductData(prev => ({
            ...prev,
            description: description
          }))
          return
        }
        
        // Generate enhanced description based on analysis
        const materialBasedDescriptions = [
          `This exceptional ${productData.title.toLowerCase()} is crafted from premium ${materials.join(', ')} with stunning ${colors.join(' and ')} tones. ${origin ? `Inspired by ${origin}, ` : ''}this ${style.toLowerCase()} piece showcases ${techniques.join(', ')} techniques with ${confidence}% AI-verified authenticity. ${rarity ? `${rarity} - ` : ''}perfect for collectors and enthusiasts who appreciate genuine ${craftType.toLowerCase()}.`,
          
          `Discover the beauty of this ${craftType.toLowerCase()} featuring authentic ${materials.join(', ')} materials and rich ${colors.join(', ')} coloration. The ${style.toLowerCase()} design reflects traditional artistry ${origin ? `rooted in ${origin}` : 'passed down through generations'}. Crafted using ${techniques.join(' and ')} methods, this ${productData.title.toLowerCase()} represents the finest in handmade craftsmanship.`,
          
          `Masterfully created ${productData.title.toLowerCase()} showcasing ${materials.join(', ')} in perfect harmony with ${colors.join(' and ')} hues. This ${style.toLowerCase()} piece demonstrates exceptional ${techniques.join(', ')} workmanship ${origin ? `drawing from ${origin} traditions` : 'with time-honored methods'}. Our AI analysis confirms ${confidence}% authenticity as genuine ${craftType}. ${rarity ? `${rarity} makes this ` : 'This '}an ideal addition to any collection.`,
          
          `Artisan ${craftType.toLowerCase()} that exemplifies the perfect blend of ${materials.join(', ')} and artistic vision. The beautiful ${colors.join(', ')} palette complements the ${style.toLowerCase()} aesthetic, while ${techniques.join(', ')} techniques ensure lasting quality. ${origin ? `This piece honors ${origin} ` : 'Traditional artistry '}meets contemporary appeal in this stunning ${productData.title.toLowerCase()}.`
        ]
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const randomDescription = materialBasedDescriptions[Math.floor(Math.random() * materialBasedDescriptions.length)]
        
        setProductData(prev => ({
          ...prev,
          description: randomDescription
        }))
        return
      }

      // Original API call for cases without material analysis
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        formData.append('existingDescription', productData.description)
        formData.append('productTitle', productData.title)
        formData.append('category', productData.category)

        const response = await fetch('/api/analyze-image', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          setProductData(prev => ({
            ...prev,
            description: result.enhancedDescription
          }))
          return
        }
      }

      // Final fallback for basic description generation
      const existingContent = productData.description.trim()
      
      if (existingContent) {
        const enhancedDescriptions = [
          `${existingContent}\n\nThis exquisite ${productData.title.toLowerCase()} showcases traditional craftsmanship with modern appeal. Each piece is carefully handcrafted using time-honored techniques, making it perfect for collectors and home decor enthusiasts alike.`,
          `${existingContent}\n\nCrafted with meticulous attention to detail, this ${productData.title.toLowerCase()} represents the finest in artisanal quality. The unique characteristics and natural variations make each piece truly one-of-a-kind, ideal for those who appreciate authentic handmade artistry.`,
        ]
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const randomEnhancement = enhancedDescriptions[Math.floor(Math.random() * enhancedDescriptions.length)]
        setProductData(prev => ({
          ...prev,
          description: randomEnhancement
        }))
      } else {
        const contextualDescriptions = [
          `Beautiful handcrafted ${productData.title.toLowerCase()} made with traditional techniques. This ${productData.category.toLowerCase()} piece showcases exceptional artistry and attention to detail. Perfect for home decoration and creating an elegant atmosphere.`,
          `Elegant ${productData.title.toLowerCase()} featuring unique design and organic forms. Each piece is one-of-a-kind, reflecting the ${productData.isEcoFriendly ? 'eco-friendly and sustainable ' : ''}crafting methods passed down through generations.`,
        ]
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const randomDescription = contextualDescriptions[Math.floor(Math.random() * contextualDescriptions.length)]
        setProductData(prev => ({
          ...prev,
          description: randomDescription
        }))
      }
    } catch (error) {
      console.error('Error generating description:', error)
      const fallback = productData.description.trim() ? 
        `${productData.description}\n\nThis beautiful handcrafted piece showcases traditional artistry and would make a wonderful addition to any home or collection.` :
        "Beautiful handcrafted piece made with traditional techniques. Perfect for home decoration and creating a unique aesthetic."
      
      setProductData(prev => ({
        ...prev,
        description: fallback
      }))
    } finally {
      setIsGeneratingDescription(false)
    }
  }

  const addTag = () => {
    const tag = prompt('Enter a new tag:')?.trim().toLowerCase()
    if (tag && !productData.tags.includes(tag) && tag.length > 0) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
      // Clear tags validation error if it exists
      if (validationErrors.tags) {
        setValidationErrors(prev => ({ ...prev, tags: '' }))
      }
    } else if (tag && productData.tags.includes(tag)) {
      alert('Tag already exists!')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!productData.title.trim()) {
      errors.title = 'Product title is required'
    }
    
    if (!productData.price.trim() || isNaN(parseFloat(productData.price)) || parseFloat(productData.price) <= 0) {
      errors.price = 'Valid price is required'
    }
    
    if (!productData.description.trim()) {
      errors.description = 'Product description is required'
    }
    
    if (productData.tags.length === 0) {
      errors.tags = 'At least one tag is required'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all form data?')) {
      setProductData({
        title: 'Handcrafted Ceramic Vase',
        price: '45.00',
        description: '',
        category: 'Ceramics',
        tags: ['handmade', 'ceramic', 'vase'],
        isEcoFriendly: true,
        hasGlobalShipping: true,
        authenticityBadge: 'Traditional Pottery',
        imageUrl: ''
      })
      setImageFile(null)
      setValidationErrors({})
    }
  }

  const loadDraft = () => {
    const drafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
    if (drafts.length === 0) {
      alert('No drafts available.')
      return
    }

    // For demo, load the most recent draft
    const mostRecentDraft = drafts[drafts.length - 1]
    const { imageFile, savedAt, status, id, ...draftData } = mostRecentDraft
    
    setProductData(draftData)
    if (imageFile) {
      // Note: We can't recreate the File object from stored metadata
      // In a real app, images would be stored on server with URLs
      console.log('Draft had image file:', imageFile)
    }
    
    alert(`Draft loaded: "${mostRecentDraft.title}" (saved ${new Date(savedAt).toLocaleString()})`)
  }

  const handlePublish = async () => {
    if (!validateForm()) {
      alert('Please fix the validation errors before publishing')
      return
    }
    
    setIsSaving(true)
    try {
      // Prepare product data for publishing
      const publishData = {
        ...productData,
        imageFile: imageFile ? {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type,
          lastModified: imageFile.lastModified
        } : null,
        publishedAt: new Date().toISOString(),
        status: 'published'
      }

      // Simulate API call to publish product
      console.log('Publishing product:', publishData)
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      // Save to localStorage for demo purposes
      const existingProducts = JSON.parse(localStorage.getItem('publishedProducts') || '[]')
      existingProducts.push({ ...publishData, id: Date.now() })
      localStorage.setItem('publishedProducts', JSON.stringify(existingProducts))
      
      alert('🎉 Product published successfully! Your craft is now live on the marketplace.')
      
      // Optional: Navigate to product view or marketplace
      // router.push('/marketplace')
    } catch (error) {
      console.error('Publishing error:', error)
      alert('❌ Failed to publish product. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      // Prepare draft data
      const draftData = {
        ...productData,
        imageFile: imageFile ? {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type,
          lastModified: imageFile.lastModified
        } : null,
        savedAt: new Date().toISOString(),
        status: 'draft'
      }

      // Simulate API call to save draft
      console.log('Saving draft:', draftData)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Save to localStorage for demo purposes
      const existingDrafts = JSON.parse(localStorage.getItem('productDrafts') || '[]')
      const existingDraftIndex = existingDrafts.findIndex((d: any) => d.title === draftData.title)
      
      if (existingDraftIndex >= 0) {
        existingDrafts[existingDraftIndex] = { ...draftData, id: existingDrafts[existingDraftIndex].id || Date.now() }
      } else {
        existingDrafts.push({ ...draftData, id: Date.now() })
      }
      
      localStorage.setItem('productDrafts', JSON.stringify(existingDrafts))
      
      alert('💾 Draft saved successfully! You can continue editing later.')
    } catch (error) {
      console.error('Save draft error:', error)
      alert('❌ Failed to save draft. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Story Imported Notification */}
      {showStoryImportedNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-50 flex items-center">
          <span className="mr-2">✓</span>
          <span>Story successfully imported from Story Builder!</span>
          <button 
            onClick={() => setShowStoryImportedNotification(false)}
            className="ml-3 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Back Button (show only when coming from story builder) */}
              {searchParams?.get('from') === 'story-builder' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/story-builder')}
                  className="mr-2"
                >
                  ← Back to Story Builder
                </Button>
              )}
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                📋
              </div>
              <div>
                <h1 className="text-xl font-semibold">Instant Product Listing</h1>
                <p className="text-sm text-gray-600">Upload your craft, let AI suggest pricing & descriptions.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                ?
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
                👤
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="space-y-4">
            <Card className="p-4">
            {/* Product Image Section */}
            <ProductImageUpload
              imageUrl={productData.imageUrl}
              onImageUpload={handleImageUpload}
              onImageDrop={handleImageDrop}
              analysisResult={materialAnalysis ? {
                materials: materialAnalysis.materials,
                colors: materialAnalysis.colors,
                style: materialAnalysis.style,
                confidence: materialAnalysis.confidence
              } : null}
              isAnalyzing={isAnalyzingImage}
            />

            {/* AI Material Analysis Section */}
            <MaterialAnalysisSection 
              analysis={materialAnalysis}
              isAnalyzing={isAnalyzingImage}
            />
            </Card>

            <Card className="p-4">
            {/* AI Materials Detection */}
            <AIDetectionSection
              title={productData.title}
              category={productData.category}
              isEcoFriendly={productData.isEcoFriendly}
              onTitleChange={(title) => {
                setProductData(prev => ({ ...prev, title }))
                if (validationErrors.title) {
                  setValidationErrors(prev => ({ ...prev, title: '' }))
                }
              }}
              onCategoryChange={(category) => setProductData(prev => ({ ...prev, category }))}
              onEcoFriendlyChange={(isEcoFriendly) => setProductData(prev => ({ ...prev, isEcoFriendly }))}
              errors={validationErrors}
              materialAnalysis={materialAnalysis}
              isAnalyzing={isAnalyzingImage}
            />
            </Card>

            <Card className="p-4">
            {/* AI-Powered Pricing Assistant */}
            <PricingSection
              price={productData.price}
              onPriceChange={(price) => {
                setProductData(prev => ({ ...prev, price }))
                if (validationErrors.price) {
                  setValidationErrors(prev => ({ ...prev, price: '' }))
                }
              }}
              errors={validationErrors}
              materialAnalysis={materialAnalysis}
              isAnalyzing={isAnalyzingImage}
            />
            </Card>

            <Card className="p-4">
            {/* Description Builder */}
            <DescriptionBuilder
              description={productData.description}
              tags={productData.tags}
              onDescriptionChange={(description) => {
                setProductData(prev => ({ ...prev, description }))
                if (validationErrors.description) {
                  setValidationErrors(prev => ({ ...prev, description: '' }))
                }
              }}
              onGenerateAI={generateAIDescription}
              onAddTag={addTag}
              onRemoveTag={(tag) => {
                removeTag(tag)
                if (validationErrors.tags && productData.tags.length <= 1) {
                  setValidationErrors(prev => ({ ...prev, tags: '' }))
                }
              }}
              isGenerating={isGeneratingDescription}
              errors={validationErrors}
              hasImage={!!(imageFile || productData.imageUrl)}
              hasExistingContent={!!productData.description.trim()}
            />

            {/* Global Shipping */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={productData.hasGlobalShipping}
                  onChange={(e) => setProductData(prev => ({ ...prev, hasGlobalShipping: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label>🌍 Global Shipping</label>
              </div>
              <p className="text-sm text-gray-600">Est. cost: $8-15 worldwide based on size & weight</p>
            </div>

            {/* Authenticity Badge */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <label>🛡️ Authenticity Badge</label>
                {materialAnalysis && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                    AI Verified: {materialAnalysis.confidence}% confidence
                  </span>
                )}
              </div>
              <select
                value={productData.authenticityBadge}
                onChange={(e) => setProductData(prev => ({ ...prev, authenticityBadge: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {materialAnalysis?.craftType && (
                  <option value={materialAnalysis.craftType}>
                    {materialAnalysis.craftType} (AI Suggested)
                  </option>
                )}
                <option>Traditional Pottery</option>
                <option>Modern Ceramic</option>
                <option>Artisan Crafted</option>
                <option>Hand-woven Textile</option>
                <option>Handcrafted Metalwork</option>
                <option>Traditional Woodcraft</option>
                <option>Cultural Heritage Piece</option>
                <option>Eco-friendly Craft</option>
              </select>
              {materialAnalysis?.origin && (
                <p className="text-sm text-blue-600 mt-1">
                  🌍 Origin: {materialAnalysis.origin}
                </p>
              )}
              {materialAnalysis?.rarity && (
                <p className="text-sm text-green-600 mt-1">
                  ✨ {materialAnalysis.rarity}
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t">
              {/* Draft Management */}
              {showLoadDraftOption && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <span className="mr-2">📄</span>
                    <span className="text-sm">Drafts available</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={loadDraft}>
                      Load Draft
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearForm}>
                      Clear Form
                    </Button>
                  </div>
                </div>
              )}

              {/* Main Actions */}
              <div className="flex justify-between gap-3">
                <Button 
                  variant="secondary" 
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    '💾 Save as Draft'
                  )}
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 flex-1"
                  onClick={handlePublish}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Publishing...
                    </div>
                  ) : (
                    '📤 Publish Product'
                  )}
                </Button>
              </div>
            </div>

            {/* Validation Errors */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
                <ul className="text-red-700 text-sm space-y-1">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            </Card>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <Card className="p-4 h-fit">
              <ProductPreview
                productData={productData}
                activeView={activeView}
                onViewChange={setActiveView}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}