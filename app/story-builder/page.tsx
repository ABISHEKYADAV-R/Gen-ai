"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Image as ImageIcon, Wand2, RefreshCw, PenSquare, ArrowRight, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function StoryBuilderContent() {
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
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
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
      if (image) formData.append("image", image);
      
      const res = await fetch("/api/generateStory", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setGeneratedStory(`Error: ${data.error} ${data.details ? JSON.stringify(data.details) : ""}`);
      } else {
        setGeneratedStory(data.story);
        if (data.imageDescription) setImageDesc(data.imageDescription);
      }
    } catch (err) {
      setGeneratedStory("Failed to generate story.");
    }
    setLoading(false);
    setIsEditing(false);
  };

  const handleUpdateStory = () => {
    if (generatedStory) {
      localStorage.setItem('storyContent', generatedStory);
      setLoading(true);
      setTimeout(() => {
        router.push('/instant-product-listing?from=story-builder');
      }, 500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FBF7F0", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header */}
      <header style={{ background: "#1A1A2E", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(245,200,66,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #C2600A, #F5C842)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#FBF7F0" }}>Story Builder</h1>
        </div>
        <button onClick={() => router.push('/dashboard')}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.08)", color: "#FBF7F0", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
        >
          <Home size={16} /> Dashboard
        </button>
      </header>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 900, color: "#1C1410", marginBottom: 16 }}>
            Share the <span style={{ background: "linear-gradient(135deg, #C2600A, #E07B39)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Spirit of Your Craft</span>
          </h2>
          <p style={{ fontSize: 16, color: "#7A6A5A", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
            Upload a photo and a brief note about your process. Let AI weave it into an emotional narrative that resonates with buyers.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>
          
          {/* Left Area - Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 4px 20px rgba(28,20,16,0.04)" }}>
            
            <div style={{ background: "#FDE8D5", border: "1px solid rgba(194,96,10,0.2)", borderRadius: 12, padding: 20, marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#C2600A", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                💡 Writing Prompts
              </h3>
              <ul style={{ fontSize: 13, color: "#9B4608", lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                <li>What material inspired this specific piece?</li>
                <li>How long did the process take?</li>
                <li>Is there a special technique you used?</li>
              </ul>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#1C1410", marginBottom: 8 }}>Your Raw Thoughts</label>
              <textarea
                value={storyIdea}
                onChange={e => setStoryIdea(e.target.value)}
                placeholder="E.g. I used local river clay and shaped this by hand. It took 3 days to perfect the glaze..."
                style={{ width: "100%", height: 120, padding: 16, borderRadius: 12, border: "1.5px solid rgba(28,20,16,0.12)", background: "#FBF7F0", fontSize: 14, color: "#1C1410", outline: "none", resize: "none", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#C2600A"}
                onBlur={e => e.target.style.borderColor = "rgba(28,20,16,0.12)"}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1410" }}>Craft Image (Optional)</span>
              </label>
              
              {!image ? (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", border: "2px dashed rgba(28,20,16,0.15)", borderRadius: 12, cursor: "pointer", background: "#FDFCFB", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#C2600A"; e.currentTarget.style.background = "#FDE8D5"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(28,20,16,0.15)"; e.currentTarget.style.background = "#FDFCFB"; }}
                >
                  <ImageIcon size={32} color="#C2600A" style={{ marginBottom: 12 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1C1410", marginBottom: 4 }}>Click to upload photo</span>
                  <span style={{ fontSize: 12, color: "#7A6A5A" }}>JPG, PNG, WEBP (Max 10MB)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              ) : (
                <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(28,20,16,0.1)" }}>
                  <img src={imagePreview!} alt="Uploaded craft" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                  <button onClick={() => { setImage(null); setImagePreview(null); setImageDesc(""); }}
                    style={{ position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <X size={16} />
                  </button>
                  <div style={{ padding: "12px 16px", background: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <input type="text" value={imageDesc} onChange={e => setImageDesc(e.target.value)} disabled={imageDescLoading}
                        placeholder={imageDescLoading ? "Analyzing..." : "Image description..."}
                        style={{ width: "100%", fontSize: 13, padding: 8, borderRadius: 6, border: "1px solid rgba(28,20,16,0.1)", background: "#FBF7F0", outline: "none" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#1C1410", marginBottom: 8 }}>Story Tone</label>
              <select value={storyTone} onChange={e => setStoryTone(e.target.value)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid rgba(28,20,16,0.12)", background: "#FBF7F0", fontSize: 14, color: "#1C1410", outline: "none", cursor: "pointer", appearance: "none" }}>
                <option>Inspirational</option>
                <option>Ancestral & Traditional</option>
                <option>Modern & Minimalist</option>
                <option>Emotional</option>
                <option>Educational</option>
              </select>
            </div>

            <button onClick={handleGenerateStory} disabled={loading}
              style={{ width: "100%", padding: 16, borderRadius: 12, background: loading ? "#D4A87A" : "linear-gradient(135deg, #C2600A, #E07B39)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 16, fontWeight: 700, boxShadow: loading ? "none" : "0 8px 24px rgba(194,96,10,0.3)", transition: "all 0.2s" }}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(194,96,10,0.4)"; } }}
              onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 8px 24px rgba(194,96,10,0.3)"; } }}
            >
              {loading ? (
                <><div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Crafting Story...</>
              ) : (
                <><Wand2 size={20} /> Generate Artisan Story</>
              )}
            </button>
          </motion.div>

          {/* Right Area - Result */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column" }}>
            
            <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: 32, border: "1px solid rgba(28,20,16,0.08)", boxShadow: "0 4px 20px rgba(28,20,16,0.04)", display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#1C1410", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>📜</span> The Generated Story
              </h3>

              <div style={{ flex: 1, minHeight: 300, background: "#FBF7F0", borderRadius: 12, padding: 24, border: "1px solid rgba(28,20,16,0.08)", position: "relative" }}>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <Wand2 size={32} color="#C2600A" style={{ marginBottom: 16, animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }} />
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1C1410", marginBottom: 4 }}>AI is writing...</div>
                      <div style={{ fontSize: 13, color: "#7A6A5A" }}>Capturing the essence of your craft</div>
                    </motion.div>
                  ) : generatedStory ? (
                    <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "100%" }}>
                      {isEditing ? (
                        <textarea
                          value={generatedStory}
                          onChange={e => setGeneratedStory(e.target.value)}
                          style={{ width: "100%", height: "100%", padding: 0, background: "transparent", border: "none", fontSize: 15, lineHeight: 1.8, color: "#1C1410", outline: "none", resize: "none" }}
                        />
                      ) : (
                        <div style={{ fontSize: 15, lineHeight: 1.8, color: "#3D2E26", whiteSpace: "pre-wrap" }}>
                          {generatedStory}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "#FDFCFB", border: "1.5px dashed rgba(28,20,16,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 24, opacity: 0.5 }}>🖋️</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#1C1410", marginBottom: 6 }}>Your story will appear here</div>
                      <div style={{ fontSize: 13, color: "#7A6A5A", lineHeight: 1.6 }}>Fill out the details on the left and hit generate to see the magic happen.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              {generatedStory && !loading && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <button onClick={() => setIsEditing(!isEditing)}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, background: isEditing ? "#FDE8D5" : "#fff", border: isEditing ? "1px solid #C2600A" : "1px solid rgba(28,20,16,0.15)", color: isEditing ? "#C2600A" : "#1C1410", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "all 0.2s" }}
                    >
                      <PenSquare size={16} /> {isEditing ? "Done Editing" : "Edit Story"}
                    </button>
                    <button onClick={handleGenerateStory}
                      style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#fff", border: "1px solid rgba(28,20,16,0.15)", color: "#1C1410", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FBF7F0"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    >
                      <RefreshCw size={16} /> Regenerate
                    </button>
                  </div>
                  <button onClick={handleUpdateStory}
                    style={{ width: "100%", padding: 14, borderRadius: 10, background: "#16213E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", border: "none", boxShadow: "0 4px 12px rgba(22,33,62,0.3)", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#0F1A30"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#16213E"; e.currentTarget.style.transform = ""; }}
                  >
                    Use this Story in Listing <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.05); } }
      `}</style>
    </div>
  );
}

export default function StoryBuilder() {
  return (
    <ProtectedRoute>
      <StoryBuilderContent />
    </ProtectedRoute>
  );
}
