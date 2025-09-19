"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StoryBuilder() {
  const router = useRouter();
  const [storyIdea, setStoryIdea] = useState("");
  const [storyTone, setStoryTone] = useState("Inspirational");
  const [image, setImage] = useState<File | null>(null);
  const [imageDesc, setImageDesc] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      // Get image description from backend
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
        setImageDesc("");
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
      <h1 className="text-3xl font-bold mb-2">My Story Builder</h1>
      <p className="mb-8 text-gray-600">Let AI help you craft compelling stories about your artisan journey.</p>
      <div className="flex gap-8">
        {/* Left: Form */}
        <div className="bg-white rounded-xl shadow-md p-8 flex-1 max-w-md">
          <h2 className="text-xl font-semibold mb-4">Tell Your Story</h2>
          <label className="block mb-2 font-medium">Your Story Idea</label>
          <textarea
            className="w-full border rounded-lg p-3 mb-4 resize-none h-28"
            placeholder="Share details about your craft, your journey, challenges you've overcome, or what makes your work unique..."
            value={storyIdea}
            onChange={e => setStoryIdea(e.target.value)}
          />
          <label className="block mb-2 font-medium">Upload Craft Image</label>
          <div className="mb-4">
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer text-gray-500 hover:border-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0V8m0 4h4m-4 0H8m8 4a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
              <span>Click to upload or drag and drop</span>
              <span className="text-xs mt-1">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
            </label>
            {image && <span className="block mt-2 text-sm text-green-600">{image.name}</span>}
          </div>
          <label className="block mb-2 font-medium">Image Description</label>
          <input
            type="text"
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Describe the craft image (e.g. 'hand-carved wooden sculpture')"
            value={imageDesc}
            onChange={e => setImageDesc(e.target.value)}
          />
          <label className="block mb-2 font-medium">Story Tone</label>
          <select
            className="w-full border rounded-lg p-3 mb-6"
            value={storyTone}
            onChange={e => setStoryTone(e.target.value)}
          >
            <option>Inspirational</option>
            <option>Humorous</option>
            <option>Emotional</option>
            <option>Educational</option>
          </select>
          <Button className="w-full" onClick={handleGenerateStory}>
            Generate Story
          </Button>
        </div>
        {/* Right: Generated Story */}
        <div className="bg-white rounded-xl shadow-md p-8 flex-1">
          <h2 className="text-xl font-semibold mb-4">Generated Story</h2>
          <div className="bg-gray-100 rounded-lg p-6 min-h-[180px] flex items-center justify-center text-gray-500">
            {loading ? (
              <div className="flex flex-col items-center animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-blue-400 animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                <span>Generating your story...</span>
              </div>
            ) : generatedStory ? (
              isEditing ? (
                <textarea
                  className="w-full border rounded-lg p-3 h-28"
                  value={generatedStory}
                  onChange={e => setGeneratedStory(e.target.value)}
                />
              ) : (
                <span>{generatedStory}</span>
              )
            ) : (
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-6-8h6" />
                </svg>
                <span>Your generated story will appear here</span>
                <span className="text-xs mt-1">Fill in the form and click "Generate Story" to get started</span>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-6">
            <Button variant="outline" className="flex-1" onClick={handleEdit} disabled={!generatedStory}>
              Edit
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleRegenerate} disabled={!generatedStory}>
              Regenerate
            </Button>
          </div>
          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700" onClick={handleUpdateStory} disabled={!generatedStory}>
            Update Story
          </Button>
        </div>
      </div>
    </div>
  );
}
