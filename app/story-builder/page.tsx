"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, UploadCloud, Edit3, RotateCcw, Image as ImageIcon, BookOpen, Wand2, Lightbulb, Trash2, ShoppingCart } from "lucide-react";

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
    <div className="min-h-screen pt-24 pb-16 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow font-delay-2000 -z-10"></div>

      <div className="max-w-6xl w-full mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline" 
              className="glass-card hover:bg-white/40 border-white/40 shadow-sm transition-all"
            >
              ← Back to Dashboard
            </Button>
            <div className="w-[120px]"></div> {/* Spacer for centering */}
          </div>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-3 mb-6 rounded-3xl glass-card border-white/40 shadow-xl"
          >
            <div className="bg-gradient-to-tr from-primary to-accent p-3 rounded-2xl mr-4 shadow-inner">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight pr-4">
              Story <span className="text-gradient">Forge</span>
            </h1>
          </motion.div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Merge your creative process with AI logic. Generate authentic, high-converting lore for your next masterpiece.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 w-full glass rounded-[2.5rem] p-8 shadow-2xl border-white/30 relative overflow-hidden"
          >
            {/* Subtle inner noise */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

            <div className="mb-8 p-5 bg-primary/5 rounded-2xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 pointer-events-none"></div>
              <h3 className="font-bold text-primary flex items-center mb-3 text-lg">
                <Lightbulb className="w-5 h-5 mr-2" />
                Context Framework
              </h3>
              <ul className="text-sm text-foreground/80 space-y-2 font-medium">
                <li className="flex items-start"><span className="text-primary mr-2">•</span> Origin of materials</li>
                <li className="flex items-start"><span className="text-primary mr-2">•</span> Historical techniques used</li>
                <li className="flex items-start"><span className="text-primary mr-2">•</span> Emotional state during creation</li>
              </ul>
            </div>

            <h2 className="text-2xl font-black mb-6 flex items-center text-foreground">
              <Edit3 className="w-6 h-6 mr-3 text-accent" />
              Input Variables
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block mb-2 font-semibold text-foreground/90 text-sm tracking-wide uppercase">Raw Concept</label>
                <textarea
                  className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-2xl p-5 resize-none h-32 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium placeholder:text-muted-foreground/50 shadow-inner block"
                  placeholder="e.g. Forged this blade using reclaimed suspension springs. Took 14 hours over 3 days. Wanted an aggressive but elegant profile."
                  value={storyIdea}
                  onChange={e => setStoryIdea(e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-foreground/90 text-sm tracking-wide uppercase flex items-center justify-between">
                  <span>Visual Reference</span>
                  <span className="text-xs text-muted-foreground font-medium normal-case">Optional but recommended</span>
                </label>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-2xl p-8 cursor-pointer text-muted-foreground bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 relative overflow-hidden w-full">
                    {/* Hover reveal */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <UploadCloud className="w-10 h-10 mb-3 text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    <span className="text-center relative z-10">
                      <span className="font-bold text-foreground">Click to upload</span> or drag and drop
                    </span>
                    <span className="text-xs mt-2 text-center text-muted-foreground relative z-10 font-medium">
                      High-res images yield better AI context
                    </span>
                    <input 
                      type="file" 
                      accept="image/*,.jpg,.jpeg,.png,.webp" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                </div>
              </div>
              <AnimatePresence>
                {image && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="overflow-hidden"
                  >
                    {/* Image Preview */}
                    <div className="p-2 bg-white/40 dark:bg-black/30 border border-white/20 rounded-2xl mt-4 relative group">
                      <div className="relative w-full h-48 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Uploaded craft" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-muted-foreground/30 animate-pulse" />
                        )}
                        <button
                          onClick={() => {
                            setImage(null); 
                            setImagePreview(null);
                            setImageDesc("");
                          }}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-red-500 backdrop-blur-md text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Attached File Meta */}
                      <div className="mt-3 px-2 flex justify-between items-center bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-white/20">
                        <div className="flex items-center space-x-2 truncate">
                          <ImageIcon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-xs font-bold text-foreground truncate">{image.name}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md ml-2 flex-shrink-0">
                          {(image.size / 1024 / 1024).toFixed(1)}MB
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {image && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative"
                >
                  <label className="block mb-2 font-semibold text-foreground/90 text-sm tracking-wide uppercase flex items-center justify-between">
                    <span>Parsed Vision Data</span>
                    {imageDescLoading && (
                      <span className="flex items-center text-xs text-accent font-bold">
                        <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Structure
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-3 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed shadow-inner"
                    placeholder="Vision API override description..."
                    value={imageDesc}
                    onChange={e => setImageDesc(e.target.value)}
                    disabled={imageDescLoading}
                  />
                </motion.div>
              )}

              <div>
                <label className="block mb-2 font-semibold text-foreground/90 text-sm tracking-wide uppercase">Narrative Vector</label>
                <div className="relative">
                  <select
                    className="w-full bg-white/50 dark:bg-black/20 border border-white/30 rounded-xl p-4 appearance-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold text-foreground cursor-pointer shadow-inner"
                    value={storyTone}
                    onChange={e => setStoryTone(e.target.value)}
                  >
                    <option value="Inspirational" className="font-semibold text-black">✨ Inspirational & Uplifting</option>
                    <option value="Ancestral" className="font-semibold text-black">🏛️ Ancestral & Heritage</option>
                    <option value="Minimalist" className="font-semibold text-black">📐 Minimalist & Modern</option>
                    <option value="Mystical" className="font-semibold text-black">🌙 Mystical & Esoteric</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground">
                    ▼
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-xl hover:shadow-primary/30 rounded-2xl font-black text-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group" 
                  onClick={handleGenerateStory}
                  disabled={loading}
                >
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></div>
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Synthesizing Narrative...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Wand2 className="mr-2 w-5 h-5" /> Execute Generation
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right: Output */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-7 w-full flex flex-col"
          >
            <div className="glass rounded-[2.5rem] p-8 shadow-2xl border-white/30 relative overflow-hidden flex-1 flex flex-col">
              <div className="flex justify-between items-center border-b border-border pb-6 mb-6">
                <h2 className="text-2xl font-black flex items-center text-foreground">
                  <BookOpen className="w-6 h-6 mr-3 text-primary" />
                  Rendered Output
                </h2>
                {image && imagePreview && (
                  <span className="inline-flex items-center text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <ImageIcon className="w-3 h-3 mr-1" /> Bound to Image
                  </span>
                )}
              </div>
              
              <div className={`rounded-2xl flex-1 flex flex-col relative overflow-hidden transition-all duration-500 ${generatedStory ? 'bg-white/40 dark:bg-black/20 border border-white/20' : 'bg-transparent border-2 border-dashed border-border flex items-center justify-center min-h-[400px]'}`}>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-12 w-full h-full min-h-[400px]">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <span className="font-black text-xl text-foreground mb-2">Compiling Lore...</span>
                    <span className="text-sm font-medium text-muted-foreground text-center max-w-xs animate-pulse">Running advanced linguistic models across cultural datasets</span>
                  </div>
                ) : generatedStory ? (
                  <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
                    {/* Inline Image Thumbnail alongside text */}
                    {image && imagePreview && (
                      <div className="mb-6 float-left mr-6 hidden sm:block">
                        <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg border-2 border-white/50 bg-muted">
                          <img src={imagePreview} alt="Output attached" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    
                    {isEditing ? (
                      <textarea
                        className="w-full h-full min-h-[300px] flex-1 border border-primary/30 rounded-xl p-5 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none bg-white font-medium text-foreground leading-relaxed shadow-inner"
                        value={generatedStory}
                        onChange={e => setGeneratedStory(e.target.value)}
                      />
                    ) : (
                      <div className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar pb-6 relative z-10">
                        <p className="text-foreground/90 font-medium leading-loose whitespace-pre-wrap text-lg first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-1 first-letter:float-left first-line:tracking-widest first-line:uppercase">
                          {generatedStory}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center p-8 max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
                      <BookOpen className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <span className="font-bold text-xl mb-3 text-foreground">Waiting for Input</span>
                    <span className="text-sm font-medium text-muted-foreground leading-relaxed">
                      Provider your baseline context and run the generator to craft a rich, market-ready narrative here.
                    </span>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <AnimatePresence>
                {generatedStory && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-6 border-t border-border"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-xl font-bold border-2 hover:bg-white/50" 
                        onClick={handleEdit} 
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        {isEditing ? 'Save Edits' : 'Manual Tweak'}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-xl font-bold border-2 hover:bg-white/50" 
                        onClick={handleRegenerate} 
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reroll Variant
                      </Button>
                    </div>

                    <Button 
                      className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black text-lg py-7 shadow-xl hover:-translate-y-1 transition-transform" 
                      onClick={handleUpdateStory} 
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Deploy to Storefront Layout →
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
