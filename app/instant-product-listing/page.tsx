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
    <div className="min-h-screen bg-[#F5F0EB] font-inter text-[#1C1410] pb-20 selection:bg-[#C2600A] selection:text-white">
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
      
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pt-8">
        {/* Header */}
        <div className="mb-8 p-6 bg-white rounded-[32px] shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button (show only when coming from story builder) */}
              {searchParams?.get('from') === 'story-builder' && (
                <button 
                  onClick={() => router.push('/story-builder')}
                  className="flex items-center gap-2 text-[#7A6A5A] hover:text-[#C2600A] font-bold text-sm transition-colors group mr-4"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-[#C2600A] to-[#F5C842] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h1 className="font-craft text-2xl font-bold text-[#1C1410]">Artisan Studio</h1>
                <p className="text-[13px] text-[#7A6A5A] font-medium mt-1">Upload your masterpiece, let AI suggest pricing & descriptions.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-[#F5F0EB] text-[#3D2E26] text-sm font-bold rounded-xl hover:bg-[#E8E1D7] transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDE8D5] rounded-full blur-3xl opacity-30 -mr-10 -mt-10 pointer-events-none"></div>
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
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)]">
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
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)]">
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
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)]">
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
            </div>

            {/* Story Section */}
            <div className="mb-8">
              <div 
                className="flex items-center justify-between p-4 bg-[#F5F0EB] rounded-2xl cursor-pointer hover:bg-[#E8E1D7] transition-colors border border-[rgba(28,20,16,0.04)]"
                onClick={() => setStoryExpanded(!storyExpanded)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-lg">📖</span>
                  </div>
                  <h3 className="font-craft text-xl font-bold text-[#1C1410]">Craft Story</h3>
                  {productData.story && (
                    <span className="text-[10px] bg-[#166534] text-white px-2 py-1 rounded-full uppercase tracking-wider font-bold">
                      Attached
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#7A6A5A] font-bold uppercase tracking-wider">
                    {storyExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-[#C2600A] transition-transform ${storyExpanded ? 'transform rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {storyExpanded && (
                <div className="mt-4 p-6 border border-[#E8E1D7] rounded-[24px] bg-white/50 backdrop-blur-sm">
                  {/* Image Preview in Story Section */}
                  {imagePreview && (
                    <div className="mb-6 p-4 bg-white shadow-sm border border-[#E8E1D7] rounded-[16px] text-center">
                      <h4 className="text-xs font-bold text-[#7A6A5A] uppercase tracking-wider mb-3">Linked Craft</h4>
                      <img 
                        src={imagePreview} 
                        alt="Your craft" 
                        className="w-full max-w-[200px] mx-auto h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-[#1C1410] mb-1">
                      Artisan's Narrative
                    </label>
                    <p className="text-xs text-[#7A6A5A] mb-3">
                      Your buyers want to know the inspiration and cultural significance behind this piece.
                    </p>
                    <textarea
                      value={productData.story || ''}
                      onChange={(e) => setProductData(prev => ({ ...prev, story: e.target.value }))}
                      placeholder="Share the story behind this beautiful piece..."
                      className="w-full h-32 p-4 bg-white border border-[#E8E1D7] rounded-[16px] focus:outline-none focus:border-[#C2600A]/30 text-[15px] resize-none text-[#3D2E26]"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={generateAIStory}
                      disabled={isGeneratingStory}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#C2600A] to-[#F5C842] text-white font-bold text-sm rounded-xl hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {isGeneratingStory ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Penning Story...</span>
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          <span>Generate AI Story</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={navigateToStoryBuilder}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-[#7A6A5A] font-bold text-sm rounded-xl border border-[#E8E1D7] hover:bg-[#F5F0EB] transition-colors"
                    >
                      <span>🛠️</span>
                      <span>Story Builder</span>
                    </button>

                    {productData.story && (
                      <button
                        onClick={() => setProductData(prev => ({ ...prev, story: '' }))}
                        className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 font-bold text-sm rounded-xl border border-[#E8E1D7] hover:bg-red-50 hover:border-red-200 transition-colors"
                      >
                        <span>🗑️</span>
                        <span>Clear Story</span>
                      </button>
                    )}
                  </div>

                  {productData.story && (
                    <div className="mt-6 p-4 bg-[#F5F0EB] rounded-2xl border border-[rgba(28,20,16,0.04)]">
                      <p className="text-xs text-[#7A6A5A] font-bold uppercase tracking-wider mb-3">Live Preview:</p>
                      <p className="text-[15px] text-[#3D2E26] leading-relaxed font-body">
                        {productData.story}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)]">
              {/* Global Shipping & Authenticity */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <input
                      type="checkbox"
                      checked={productData.hasGlobalShipping}
                      onChange={(e) => setProductData(prev => ({ ...prev, hasGlobalShipping: e.target.checked }))}
                      className="w-5 h-5 text-[#C2600A] focus:ring-[#C2600A] rounded border-[#E8E1D7]"
                    />
                    <label className="font-bold text-[#1C1410]">🌍 Global Shipping</label>
                  </div>
                  <p className="text-sm text-[#7A6A5A] ml-8">Est. cost: $8-15 worldwide based on size & weight</p>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <input type="checkbox" className="w-5 h-5 text-[#C2600A] focus:ring-[#C2600A] rounded border-[#E8E1D7]" defaultChecked />
                    <label className="font-bold text-[#1C1410]">🛡️ Authenticity Badge</label>
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
              </div>

              {/* Bottom Actions */}
              <div className="mt-8 pt-6 border-t border-[#E8E1D7] space-y-4">
                {/* Draft Management */}
                {showLoadDraftOption && (
                  <div className="flex items-center justify-between p-4 bg-[#F5F0EB] rounded-2xl border border-[rgba(28,20,16,0.04)]">
                    <div className="flex items-center text-[#7A6A5A] font-bold">
                      <span className="mr-3 text-lg">📄</span>
                      <span className="text-sm">Drafts available</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm font-bold text-[#3D2E26] hover:bg-white rounded-xl transition-colors" onClick={loadDraft}>
                        Load
                      </button>
                      <button className="px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-white rounded-xl transition-colors" onClick={clearForm}>
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <button 
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                    className="flex-1 py-4 px-6 bg-white border-2 border-[#E8E1D7] text-[#3D2E26] font-bold rounded-[16px] hover:border-[#C2600A]/30 hover:bg-[#F5F0EB] transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : '💾 Save as Draft'}
                  </button>
                  <button 
                    onClick={handlePublish}
                    disabled={isSaving || isPublishing}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-[#C2600A] to-[#F5C842] text-white font-bold rounded-[16px] hover:shadow-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isPublishing ? publishStep || 'Publishing...' : '✨ Publish Masterpiece'}
                  </button>
                </div>
              </div>

              {/* Validation Errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <h4 className="text-red-800 font-bold mb-2">Please fix the following errors:</h4>
                  <ul className="text-red-700 text-sm space-y-1">
                    {Object.entries(validationErrors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8 bg-white rounded-[32px] p-6 shadow-xl shadow-[#1C1410]/10 border border-[rgba(28,20,16,0.06)] xl:h-[calc(100vh-100px)] xl:overflow-y-auto hidden-scrollbar">
              <ProductPreview
                productData={productData}
                activeView={activeView}
                onViewChange={setActiveView}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}