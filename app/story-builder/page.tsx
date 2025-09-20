"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StoryBuilder() {
  const router = useRouter();
  const [storyIdea, setStoryIdea] = useState("");
  const [storyTone, setStoryTone] = useState("Inspirational");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDesc, setImageDesc] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageDescLoading, setImageDescLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Get image description from backend
      setImageDescLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/image-description", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.imageDescription) {
          setImageDesc(data.imageDescription);
        }
      } catch (err) {
        console.error("Error getting image description:", err);
        setImageDesc("");
      } finally {
        setImageDescLoading(false);
      }
    }
  };

  const handleGenerateStory = async () => {
    setGeneratedStory("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("storyIdea", storyIdea);
      formData.append("storyTone", storyTone);
      if (image) {
        formData.append("image", image);
      }
      const res = await fetch("/api/generateStory", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setGeneratedStory(`Error: ${data.error} ${data.details ? JSON.stringify(data.details) : ""}`);
      } else {
        setGeneratedStory(data.story);
        if (data.imageDescription) {
          setImageDesc(data.imageDescription);
        }
      }
    } catch (err) {
      setGeneratedStory("Failed to generate story.");
    }
    setLoading(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleRegenerate = () => {
    handleGenerateStory();
  };

  const handleUpdateStory = () => {
    // Navigate to product listing page with the story content
    if (generatedStory) {
      // Store the story in localStorage so it can be accessed in the product listing page
      localStorage.setItem('storyContent', generatedStory);
      // Add a brief success indication
      setLoading(true);
      setTimeout(() => {
        router.push('/instant-product-listing?from=story-builder');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              ✨ Artisan Story Builder
            </h1>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="ghost" 
              className="text-sm"
            >
              🏠 Dashboard
            </Button>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your authentic crafting journey - the inspiration, challenges, and passion behind your unique creations
          </p>
        </div>

        <div className="flex gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex-1 max-w-md">
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">💡 Story Tips</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Share what inspired this piece</li>
                <li>• Describe your crafting process</li>
                <li>• Mention challenges you overcame</li>
                <li>• Explain what makes it special</li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🎨</span>
              Your Craft Story
            </h2>
            
            <label className="block mb-2 font-medium">Share Your Journey</label>
            <p className="text-sm text-gray-600 mb-3">
              Tell us about your inspiration, the materials you chose, and the process of creating this piece...
            </p>
            <textarea
              className="w-full border rounded-lg p-4 mb-4 resize-none h-32 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Example: I was inspired by the morning light filtering through my studio window. I chose clay from the local riverbank because of its unique texture. The biggest challenge was achieving the perfect glaze - it took three attempts before I got the color just right..."
              value={storyIdea}
              onChange={e => setStoryIdea(e.target.value)}
            />

            <label className="block mb-2 font-medium">Upload Craft Image</label>
            <div className="mb-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m8 4a4 4 0 10-8 0 4 4 0 008 0z" />
                </svg>
                <span className="text-center">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </span>
                <span className="text-xs mt-1 text-center">
                  All image formats supported: JPG, PNG, JPEG, GIF, BMP, WEBP, SVG, TIFF
                </span>
                <span className="text-xs text-gray-400">Max size: 10MB</span>
                <input 
                  type="file" 
                  accept="image/*,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.tiff,.tif" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
              {image && (
                <div className="mt-3">
                  {/* Image Preview */}
                  <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="relative">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="Uploaded craft" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">No image uploaded</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setImage(null); 
                          setImagePreview(null);
                          setImageDesc("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">📷</span>
                        <span className="text-sm font-medium text-green-800">{image.name}</span>
                        <span className="text-xs text-green-600">
                          ({(image.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {imageDescLoading && (
                          <div className="flex items-center space-x-1 text-xs text-blue-600">
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Analyzing image...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <label className="block mb-2 font-medium">Image Description</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded-lg p-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder={imageDescLoading ? "Analyzing image..." : "Describe your craft (e.g. 'hand-carved wooden sculpture')"}
                value={imageDesc}
                onChange={e => setImageDesc(e.target.value)}
                disabled={imageDescLoading}
              />
              {imageDescLoading && (
                <div className="absolute right-3 top-3">
                  <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>

            <label className="block mb-2 font-medium">Story Tone</label>
            <select
              className="w-full border rounded-lg p-3 mb-6 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={storyTone}
              onChange={e => setStoryTone(e.target.value)}
            >
              <option>Inspirational</option>
              <option>Humorous</option>
              <option>Emotional</option>
              <option>Educational</option>
            </select>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
              onClick={handleGenerateStory}
              disabled={loading}
            >
              {loading ? "Crafting Your Story..." : "Generate Artisan Story"}
            </Button>
          </div>

          {/* Right: Generated Story */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📖</span>
              Your Generated Story
              {image && imagePreview && (
                <span className="ml-auto text-sm text-gray-500">with image</span>
              )}
            </h2>
            
            {/* Image Preview in Story Section */}
            {image && imagePreview && !loading && (
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <img 
                  src={imagePreview} 
                  alt="Your craft" 
                  className="w-full max-w-sm mx-auto h-40 object-cover rounded-lg"
                />
                <p className="text-center text-sm text-gray-600 mt-2">
                  {imageDesc || "Your craft image"}
                </p>
              </div>
            )}
            
            <div className="bg-gray-100 rounded-lg p-6 min-h-[200px] flex items-center justify-center text-gray-500">
              {loading ? (
                <div className="flex flex-col items-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-purple-600 animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  <span className="font-medium">Crafting your authentic artisan story...</span>
                  <span className="text-xs mt-1">Including challenges and creation process</span>
                </div>
              ) : generatedStory ? (
                isEditing ? (
                  <textarea
                    className="w-full border rounded-lg p-4 h-40 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    value={generatedStory}
                    onChange={e => setGeneratedStory(e.target.value)}
                  />
                ) : (
                  <div className="w-full text-left">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{generatedStory}</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-6-8h6" />
                  </svg>
                  <span className="font-medium mb-2">Your artisan story will appear here</span>
                  <span className="text-sm text-gray-400 max-w-xs">
                    Share your journey, upload an image, and let AI craft an authentic story about your creation process
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleEdit} 
                disabled={!generatedStory || loading}
              >
                ✏️ Edit Story
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleRegenerate} 
                disabled={!generatedStory || loading}
              >
                🔄 Regenerate
              </Button>
            </div>

            <Button 
              className="w-full mt-4 bg-green-600 hover:bg-green-700 font-semibold" 
              onClick={handleUpdateStory} 
              disabled={!generatedStory || loading}
            >
              <span className="mr-2">✨</span>
              Update Story in Product Listing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
