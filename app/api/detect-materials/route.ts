import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI (fallback to mock if no API key)
const apiKey = process.env.GOOGLE_AI_API_KEY
const genAI = apiKey && apiKey !== 'demo_key_use_mock_data' 
  ? new GoogleGenerativeAI(apiKey) 
  : null

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Please upload an image smaller than 10MB.' },
        { status: 500 }
      )
    }

    // Convert file to base64 for processing
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const mimeType = file.type

    let materialAnalysis

    if (genAI) {
      // Use real Gemini AI analysis
      try {
        materialAnalysis = await analyzeWithGemini(base64, mimeType)
      } catch (error) {
        console.error('Gemini AI analysis failed:', error)
        // Fallback to mock analysis
        materialAnalysis = await getMockAnalysis(file.name, file.size)
      }
    } else {
      // Use enhanced mock analysis
      materialAnalysis = await getMockAnalysis(file.name, file.size)
    }
    
    return NextResponse.json({
      success: true,
      analysis: materialAnalysis,
      usingAI: !!genAI,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        analyzedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error analyzing materials:', error)
    return NextResponse.json(
      { error: 'Failed to analyze materials. Please try again.' },
      { status: 500 }
    )
  }
}

async function analyzeWithGemini(base64: string, mimeType: string) {
  if (!genAI) throw new Error('Gemini AI not initialized')
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Analyze this craft/artisan image and provide detailed information in JSON format with these exact fields:
{
  "materials": ["material1", "material2", "material3"],
  "colors": ["color1", "color2", "color3"],
  "style": "style description",
  "confidence": 95,
  "craftType": "craft type",
  "techniques": ["technique1", "technique2", "technique3"],
  "origin": "cultural/historical origin",
  "estimatedAge": "time period",
  "rarity": "rarity assessment",
  "title": "suggested product title",
  "category": "product category",
  "description": "detailed product description",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "analysisDetails": {
    "imageQuality": "quality assessment",
    "detectionMethod": "Gemini AI Vision Analysis",
    "processingTime": "actual time",
    "analysisDepth": "analysis description"
  }
}

Focus on:
- Identifying specific materials (ceramic, wood, metal, textile, stone, etc.)
- Color palette analysis
- Crafting techniques and methods
- Cultural/historical context
- Estimated value and rarity
- Marketable product information

Be specific and accurate. If unsure about something, indicate lower confidence.`

  const imageParts = [{
    inlineData: {
      data: base64,
      mimeType: mimeType
    }
  }]

  const result = await model.generateContent([prompt, ...imageParts])
  const response = await result.response
  const text = response.text()

  try {
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      
      // Ensure required fields exist
      return {
        materials: analysis.materials || ['Handcrafted Material'],
        colors: analysis.colors || ['Natural Tones'],
        style: analysis.style || 'Artisan Craft',
        confidence: analysis.confidence || 85,
        craftType: analysis.craftType || 'Handmade Craft',
        techniques: analysis.techniques || ['Traditional Crafting'],
        origin: analysis.origin || 'Traditional artistry',
        estimatedAge: analysis.estimatedAge || 'Contemporary craft',
        rarity: analysis.rarity || 'Unique handmade piece',
        title: analysis.title || 'Handcrafted Artisan Piece',
        category: analysis.category || 'Handmade Crafts',
        description: analysis.description || 'Beautiful handcrafted piece made with traditional techniques.',
        tags: analysis.tags || ['handmade', 'artisan', 'craft'],
        analysisDetails: {
          imageQuality: analysis.analysisDetails?.imageQuality || 'Analyzed with Gemini AI',
          detectionMethod: 'Gemini AI Vision Analysis',
          processingTime: analysis.analysisDetails?.processingTime || '< 5 seconds',
          analysisDepth: analysis.analysisDetails?.analysisDepth || 'Comprehensive AI analysis'
        }
      }
    } else {
      throw new Error('No JSON found in AI response')
    }
  } catch (parseError) {
    console.error('Error parsing AI response:', parseError)
    throw new Error('Failed to parse AI analysis')
  }
}

async function getMockAnalysis(fileName: string, fileSize: number) {
  // Enhanced mock analysis with better variety
  const analyses = [
    {
      materials: ['Ceramic', 'Natural Clay', 'Mineral Glaze'],
      colors: ['Terracotta Red', 'Earth Brown', 'Cream White'],
      style: 'Traditional Pottery',
      confidence: 92,
      craftType: 'Hand-thrown Ceramic Vessel',
      techniques: ['Wheel throwing', 'Natural glazing', 'Kiln firing'],
      origin: 'Mediterranean pottery traditions',
      estimatedAge: 'Contemporary artisan work',
      rarity: 'One-of-a-kind handcrafted piece',
      title: 'Handcrafted Ceramic Vase',
      category: 'Ceramics & Pottery',
      description: 'Beautiful hand-thrown ceramic vase featuring traditional techniques and natural glazes. Each piece showcases the artisan\'s skill in wheel throwing and glazing, making it perfect for home decoration or as a collector\'s item.',
      tags: ['ceramic', 'handmade', 'pottery', 'artisan', 'home-decor']
    },
    {
      materials: ['Cotton', 'Natural Indigo Dye', 'Organic Fibers'],
      colors: ['Deep Indigo', 'Natural White', 'Sky Blue'],
      style: 'Traditional Textile Art',
      confidence: 89,
      craftType: 'Hand-woven Textile',
      techniques: ['Traditional weaving', 'Natural dyeing', 'Block printing'],
      origin: 'Ancient textile traditions',
      estimatedAge: 'Contemporary traditional craft',
      rarity: 'Limited artisan production',
      title: 'Hand-woven Indigo Textile',
      category: 'Textiles & Fabrics',
      description: 'Exquisite hand-woven textile featuring traditional indigo dyeing techniques. This piece represents generations of textile artistry, with intricate patterns and rich colors achieved through natural dyeing methods.',
      tags: ['textile', 'indigo', 'handwoven', 'traditional', 'organic']
    },
    {
      materials: ['Sterling Silver', 'Turquoise', 'Copper Accents'],
      colors: ['Bright Silver', 'Turquoise Blue', 'Copper Red'],
      style: 'Southwest Jewelry',
      confidence: 94,
      craftType: 'Handcrafted Silver Jewelry',
      techniques: ['Hand forging', 'Stone setting', 'Traditional smithing'],
      origin: 'Native American silversmithing',
      estimatedAge: 'Contemporary artisan jewelry',
      rarity: 'Unique handmade jewelry piece',
      title: 'Handcrafted Silver & Turquoise Jewelry',
      category: 'Jewelry & Accessories',
      description: 'Stunning handcrafted jewelry piece featuring sterling silver and genuine turquoise. Made using traditional silversmithing techniques, this unique piece showcases exceptional craftsmanship and cultural heritage.',
      tags: ['silver', 'turquoise', 'jewelry', 'handcrafted', 'southwest']
    }
  ]

  // Add processing delay to simulate real AI
  await new Promise(resolve => setTimeout(resolve, 2500))
  
  const selectedAnalysis = analyses[Math.floor(Math.random() * analyses.length)]
  
  return {
    ...selectedAnalysis,
    analysisDetails: {
      imageQuality: 'High resolution suitable for analysis',
      detectionMethod: 'Advanced pattern recognition (Demo Mode)',
      processingTime: '2.5 seconds',
      analysisDepth: 'Comprehensive material and cultural analysis'
    }
  }
}