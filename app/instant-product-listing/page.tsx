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
import { useAuth } from '../../contexts/AuthContext'
import { productService } from '../../backend/firebase/productService'
import { useToast } from '../../lib/ToastContext'

export default function InstantProductListing() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { showToast } = useToast()
  
  const [productData, setProductData] = useState<ProductData>({
    title: 'Handcrafted Ceramic Vase',
    price: '45.00',
    description: '',
    story: '',
    category: 'Ceramics',
    tags: ['handmade', 'ceramic', 'vase'],
    isEcoFriendly: true,
    hasGlobalShipping: true,
    authenticityBadge: 'Traditional Pottery',
    imageUrl: ''
  })

  const [activeView, setActiveView] = useState<ViewMode>('desktop')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showStoryImportedNotification, setShowStoryImportedNotification] = useState(false)
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingStory, setIsGeneratingStory] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStep, setPublishStep] = useState('')
  const [showLoadDraftOption, setShowLoadDraftOption] = useState(false)
  const [materialAnalysis, setMaterialAnalysis] = useState<any>(null)
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false)
  const [storyExpanded, setStoryExpanded] = useState(false)
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

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
            story: storyContent
          }))
          // Show notification
          setShowStoryImportedNotification(true)
          // Expand story section to show the imported content
          setStoryExpanded(true)
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
        setImagePreview(result)
        // Don't set imageUrl to base64 data - only set it when we have a proper upload URL
        // setProductData(prev => ({ ...prev, imageUrl: result })) // REMOVED
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
      setImagePreview(result)
      // Don't set imageUrl to base64 data - only set it when we have a proper upload URL
      // setProductData(prev => ({ ...prev, imageUrl: result })) // REMOVED
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

  const generateAIStory = async () => {
    setIsGeneratingStory(true)
    
    try {
      // Enhanced artisan story templates with realistic challenges and processes
      const authenticStoryPrompts = [
        `The journey of creating this ${productData.title.toLowerCase()} began on a crisp morning in my workshop. I had been experimenting with ${materialAnalysis?.materials?.join(' and ') || 'local materials'} for weeks, but nothing felt quite right. The breakthrough came when I discovered how the ${materialAnalysis?.colors?.join(' and ') || 'natural'} tones could be enhanced through a traditional ${materialAnalysis?.techniques?.join(' ') || 'handcrafting'} technique my grandmother taught me. The biggest challenge was controlling the temperature - three pieces cracked before I mastered the timing. But when I finally held this finished piece, feeling its perfect weight and seeing how the light played across its surface, I knew every failed attempt was worth it. This isn't just a product; it's a piece of my heart and heritage.`,
        
        `I'll never forget the frustration of my first attempts at this ${productData.title.toLowerCase()}. Working with ${materialAnalysis?.materials?.join(' combined with ') || 'these materials'} seemed impossible at first - they would either be too brittle or too soft. I spent countless nights researching ancient ${materialAnalysis?.techniques?.join(' and ') || 'traditional'} methods, calling my mentor, and even traveling to a remote village to learn from master artisans. The turning point came during my fifth attempt when I realized I was rushing the process. This piece required patience - each layer of ${materialAnalysis?.colors?.join(' and ') || 'color'} needed time to settle and bond. The imperfections you see aren't flaws; they're the marks of an authentic, hand-made creation. When customers hold this, they're touching weeks of learning, failing, and ultimately succeeding.`,
        
        `Creating this ${productData.title.toLowerCase()} pushed me to my limits as an artisan. The ${materialAnalysis?.style || 'unique'} design you see came from a sketch I made during a difficult period in my life. Working with ${materialAnalysis?.materials?.join(', ') || 'raw materials'} became my meditation, but it wasn't easy. I had to source the materials from three different suppliers before finding ones that met my standards. The ${materialAnalysis?.techniques?.join(' technique combined with ') || 'crafting process'} required tools I had to specially modify. My workshop became a testing ground - covered in samples, failed prototypes, and notes scribbled at 2 AM. But gradually, through trial and error, I developed my own variation of the traditional method. Each ${materialAnalysis?.colors?.join(' and ') || 'color'} was mixed by hand, each curve shaped with tools passed down through generations. This piece represents not just skill, but resilience.`,
        
        `The story of this ${productData.title.toLowerCase()} starts with a problem that kept me awake for weeks. A customer had commissioned something similar, but every approach I tried failed. The ${materialAnalysis?.materials?.join(' wouldn\'t bond properly with the ') || 'materials'} using conventional methods. I was ready to give up when I remembered my grandfather's workshop - he had jars of mysterious substances labeled in his handwriting. After translating his old notes, I discovered a technique that had been forgotten for decades. Recreating his method with modern ${materialAnalysis?.techniques?.join(' and ') || 'tools'} took months of experimentation. I ruined countless pieces learning to balance tradition with innovation. The breakthrough came when I stopped fighting the material's natural properties and started working with them. This piece embodies that journey - you can see the subtle variations that come from hand-mixed ${materialAnalysis?.colors?.join(' and ') || 'pigments'} and time-honored techniques. It's proof that sometimes the old ways, adapted with love and persistence, create something truly extraordinary.`
      ]
      
      // Simulate realistic crafting time
      await new Promise(resolve => setTimeout(resolve, 2500))
      
      const selectedStory = authenticStoryPrompts[Math.floor(Math.random() * authenticStoryPrompts.length)]
      
      setProductData(prev => ({
        ...prev,
        story: selectedStory
      }))
      
      // Auto-expand story section to show the generated content
      setStoryExpanded(true)
      
    } catch (error) {
      console.error('Error generating story:', error)
      const fallbackStory = `When I first envisioned this ${productData.title.toLowerCase()}, I knew it would be challenging. Working in my small workshop, I carefully selected each material, knowing that the quality would show in the final piece. The process wasn't easy - there were moments when I questioned my technique, especially when the first attempts didn't meet my standards. After several late nights and many adjustments, I finally achieved the balance I was seeking. The ${materialAnalysis?.colors?.join(' and ') || 'colors'} you see are the result of careful experimentation, and the ${materialAnalysis?.techniques?.join(' ') || 'craftsmanship'} reflects years of practice. Each piece I create carries a part of my story, and this one is no exception. It represents not just skill, but the persistence to keep trying until it's right.`
      
      setProductData(prev => ({
        ...prev,
        story: fallbackStory
      }))
      
      setStoryExpanded(true)
      
    } finally {
      setIsGeneratingStory(false)
    }
  }

  const navigateToStoryBuilder = () => {
    router.push('/story-builder')
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
        story: '',
        category: 'Ceramics',
        tags: ['handmade', 'ceramic', 'vase'],
        isEcoFriendly: true,
        hasGlobalShipping: true,
        authenticityBadge: 'Traditional Pottery',
        imageUrl: ''
      })
      setImageFile(null)
      setValidationErrors({})
      setStoryExpanded(false)
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

  // Optimized image compression for faster processing
  const compressImage = (file: File, maxWidth = 800, quality = 0.85): Promise<File> => {
    return new Promise((resolve) => {
      // Skip compression for small files (< 300KB)
      if (file.size < 300000) {
        resolve(file)
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions - better balance of quality and size
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Use better compression settings
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // Fallback to original
          }
        }, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handlePublish = async () => {
    if (!user) {
      showToast({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to publish products'
      })
      return
    }
    
    if (!validateForm()) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fix the validation errors before publishing'
      })
      return
    }
    
    setIsPublishing(true)
    setPublishStep('Publishing product...')
    
    try {
      // Create product first without waiting for image upload
      setPublishStep('Creating product...')
      
      // Prepare base product data
      const productDataToSave = {
        title: productData.title,
        price: parseFloat(productData.price), // Convert string to number for Firebase rules
        description: productData.description,
        story: productData.story || '',
        category: productData.category,
        tags: productData.tags,
        isEcoFriendly: productData.isEcoFriendly,
        hasGlobalShipping: productData.hasGlobalShipping,
        authenticityBadge: productData.authenticityBadge || '',
        imageUrl: imagePreview || '', // Use preview initially if available
        materials: materialAnalysis?.materials || [],
        techniques: materialAnalysis?.techniques || [],
        colors: materialAnalysis?.colors || [],
        style: materialAnalysis?.style || '',
        createdBy: user.uid,
        status: 'published' as const,
        shipping: {
          estimatedDays: '3-7 days',
          cost: 0,
          regions: ['Global']
        }
      }

      // Create product immediately for fast response
      let result
      if (currentProductId) {
        result = await productService.updateProduct(currentProductId, productDataToSave)
      } else {
        result = await productService.createProduct(productDataToSave)
        if (result.success) {
          setCurrentProductId(result.productId!)
        }
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      setPublishStep('Product created! Uploading image...')
      
      // Upload image after product creation (non-blocking)
      if (imageFile && result.success && 'productId' in result && result.productId) {
        const productId = result.productId as string;
        compressImage(imageFile)
          .then(compressedImage => 
            productService.uploadProductImage(compressedImage, user.uid, productId)
          )
          .then(imageResult => {
            if (imageResult.success && imageResult.imageUrl) {
              // Update product with image URL asynchronously
              productService.updateProduct(productId, { imageUrl: imageResult.imageUrl });
            }
          })
          .catch(error => {
            console.error('Image processing/upload error:', error);
            // Image upload failed but product is already created
          });
      }

      // Product is already created, proceed immediately
      setPublishStep('Success!')
      
      // Clear cache to ensure products page shows latest data
      if (typeof window !== 'undefined') {
        // Force a cache invalidation by setting a flag
        localStorage.setItem('productsCacheInvalid', Date.now().toString());
      }
      
      showToast({
        type: 'success',
        title: 'Product Published!',
        message: 'Your craft is now live on the marketplace.'
      })
      
      // Navigate immediately for better UX
      router.push('/products')
      
    } catch (error: any) {
      console.error('Publishing error:', error)
      showToast({
        type: 'error',
        title: 'Publishing Failed',
        message: error.message || 'An unexpected error occurred while publishing your product'
      })
    } finally {
      setIsPublishing(false)
      setPublishStep('')
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
      
      showToast({
        type: 'success',
        title: 'Draft Saved',
        message: 'Your product draft has been saved successfully!'
      })
    } catch (error) {
      console.error('Save draft error:', error)
      showToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save draft. Please try again.'
      })
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
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="ghost" 
                size="sm"
                className="text-sm"
              >
                🏠 Dashboard
              </Button>
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

            {/* Story Section */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg cursor-pointer hover:from-purple-100 hover:to-blue-100 transition-colors"
                onClick={() => setStoryExpanded(!storyExpanded)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📖</span>
                  <h3 className="font-semibold text-gray-800">Craft Story</h3>
                  {productData.story && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Story Added
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {storyExpanded ? 'Click to collapse' : 'Click to expand'}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${storyExpanded ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {storyExpanded && (
                <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white">
                  {/* Image Preview in Story Section */}
                  {imagePreview && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Your Craft Image</h4>
                      <img 
                        src={imagePreview} 
                        alt="Your craft" 
                        className="w-full max-w-xs mx-auto h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artisan Story
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Tell the story behind your craft - your journey, inspiration, and the tradition behind this piece.
                    </p>
                    <textarea
                      value={productData.story || ''}
                      onChange={(e) => setProductData(prev => ({ ...prev, story: e.target.value }))}
                      placeholder="Share the story behind this beautiful piece... your inspiration, the techniques used, or the cultural significance..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={generateAIStory}
                      disabled={isGeneratingStory}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {isGeneratingStory ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Generate AI Story</span>
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={navigateToStoryBuilder}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <span>🛠️</span>
                      <span>Story Builder</span>
                    </Button>

                    {productData.story && (
                      <Button
                        onClick={() => setProductData(prev => ({ ...prev, story: '' }))}
                        variant="outline"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                      >
                        <span>🗑️</span>
                        <span>Clear Story</span>
                      </Button>
                    )}
                  </div>

                  {productData.story && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {productData.story}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                  disabled={isSaving || isPublishing}
                >
                  {isPublishing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {publishStep || 'Publishing...'}
                    </div>
                  ) : (
                    '� Publish Product'
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