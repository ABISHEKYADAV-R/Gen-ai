"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../lib/ToastContext";
import { productService, ProductData } from "../../../backend/firebase/productService";
import { ArrowLeft, Heart, Share2, ShoppingCart, Truck, Shield, Star, MapPin, Clock, Tag, Palette, Hammer, Leaf, Sparkles, Globe, User, MessageCircle, X, Send } from "lucide-react";
import Image from "next/image";

const MOCK_PRODUCTS: Record<string, Partial<ProductData>> = {
  "mock-1": {
    id: "mock-1",
    title: "Traditional Ikat Textile",
    category: "Textiles",
    price: 145,
    imageUrl: "/api/placeholder/800/800",
    description: "A genuine, handwoven piece of cultural heritage. Each thread was carefully resist-dyed before weaving to create the intricate edge-blur patterns characteristic of authentic Ikat. Perfect as a wall hanging or a statement throw.",
    story: "Woven by Sari in her family compound in Bali. 'This motif tells the story of our village\\'s relationship with the river,' she says. 'My grandmother taught me how to count the threads so the water ripples appear just right.' It takes almost three weeks to dye and weave a single piece like this.",
    materials: ["Cotton", "Natural Indigo", "Handspun Yarn"],
    techniques: ["Ikat Weaving", "Resist Dyeing"],
    tags: ["heritage", "sustainable", "wall-art", "bali"],
    colors: ["Indigo", "Earth Brown", "Cream"],
    shipping: { estimatedDays: "5-10 days", cost: 15, regions: ["Global"] },
    hasGlobalShipping: true,
    isEcoFriendly: true,
    authenticityBadge: "verified",
    views: 1243,
  },
  "mock-2": {
    id: "mock-2",
    title: "Hand-Carved Deity Sculpture",
    category: "Sculpture",
    price: 289,
    imageUrl: "/api/placeholder/800/800",
    description: "A meticulously hand-carved wooden deity sculpture, crafted using centuries-old techniques. The smooth finish and intricate details make it an extraordinary centerpiece.",
    story: "Carlos learned woodworking from his father in Oaxaca. 'Every piece of wood has a spirit waiting to be revealed,' he explains. This sculpture was created from sustainably sourced local wood over the course of two months.",
    materials: ["Copaline Wood", "Natural Pigments"],
    techniques: ["Hand Carving", "Polishing", "Painting"],
    tags: ["woodwork", "sculpture", "oaxaca", "spiritual"],
    colors: ["Natural Wood", "Red", "Gold"],
    shipping: { estimatedDays: "7-14 days", cost: 25, regions: ["Global"] },
    hasGlobalShipping: true,
    isEcoFriendly: true,
    authenticityBadge: "verified",
    views: 846,
  },
  "mock-3": {
    id: "mock-3",
    title: "Silver Filigree Necklace",
    category: "Jewelry",
    price: 67,
    imageUrl: "/api/placeholder/800/800",
    description: "Delicate silver filigree necklace showcasing incredible precision. Each silver thread is twisted and soldered by hand to form this lightweight lace-like pattern.",
    story: "Amara brings the ancient Moorish art of filigree from Fes, Morocco to life. 'My hands memorize the patterns, and my heart guides the wire,' she says. This piece honors her ancestors' legacy.",
    materials: ["925 Sterling Silver"],
    techniques: ["Filigree", "Soldering", "Twisting"],
    tags: ["jewelry", "silver", "morocco", "elegant"],
    colors: ["Silver"],
    shipping: { estimatedDays: "3-7 days", cost: 8, regions: ["Global"] },
    hasGlobalShipping: true,
    isEcoFriendly: false,
    authenticityBadge: "verified",
    views: 2043,
  },
  "mock-4": {
    id: "mock-4",
    title: "Woven Storage Basket",
    category: "Weaving",
    price: 34,
    imageUrl: "/api/placeholder/800/800",
    description: "Durable, tightly woven storage basket perfect for organizing your home organically. Made from natural elephant grass, it is both beautiful and purely functional.",
    story: "Kemi and a collective of women in Accra weave these baskets under the shade of a Baobab tree. 'We sing while we weave, our baskets carry our joy,' Kemi notes.",
    materials: ["Elephant Grass", "Leather"],
    techniques: ["Basketry", "Dyeing"],
    tags: ["storage", "home", "accra", "woven"],
    colors: ["Natural", "Earth Red"],
    shipping: { estimatedDays: "10-20 days", cost: 12, regions: ["Global"] },
    hasGlobalShipping: true,
    isEcoFriendly: true,
    authenticityBadge: "verified",
    views: 3180,
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Partial<ProductData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // Contact Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  const productId = params?.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;

      setIsLoading(true);
      
      // Check if it's a mock product from the landing page
      if (productId.startsWith("mock-") && MOCK_PRODUCTS[productId]) {
        setProduct(MOCK_PRODUCTS[productId]);
        setIsLoading(false);
        return;
      }

      try {
        const result = await productService.getProduct(productId);
        if (result.success && result.product) {
          setProduct(result.product);
          productService.incrementViews(productId);
        } else {
          showToast({
            type: "error",
            title: "Product Not Found",
            message: "The requested product could not be found.",
          });
          router.push("/products");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        showToast({
          type: "error",
          title: "Error Loading Product",
          message: "Failed to load product details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, router, showToast]);

  const handleBack = () => router.back();

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast({
      type: "success",
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      message: isLiked ? "Product removed from your favorites" : "Product added to your favorites",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product?.title, text: product?.description, url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: "success", title: "Link Copied", message: "Product link copied to clipboard" });
    }
  };

  const handleContact = (presetMessage = "") => {
    setContactForm({
      name: user?.displayName || "",
      email: user?.email || "",
      message: presetMessage || `Hi, I am interested in ${product?.title}. Could you provide more details?`
    });
    setIsContactModalOpen(true);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast({ type: "error", title: "Missing Fields", message: "Please fill out all fields." });
      return;
    }

    setIsSubmitting(true);
    const result = await productService.submitInquiry({
      productId: product?.id as string,
      productName: product?.title as string,
      customerName: contactForm.name,
      customerEmail: contactForm.email,
      message: contactForm.message,
      artisanId: product?.createdBy
    });

    setIsSubmitting(false);

    if (result.success) {
      showToast({ type: "success", title: "Message Sent", message: "The artisan will get back to you soon!" });
      setIsContactModalOpen(false);
    } else {
      showToast({ type: "error", title: "Failed to Send", message: result.error || "An error occurred." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex flex-col pt-12 items-center">
        <div className="animate-pulse flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-[#C2600A] opacity-50 mb-4" />
          <div className="h-6 w-48 bg-[#E8E1D7] rounded-full mb-8"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#F5F0EB] font-inter text-[#1C1410] selection:bg-[#C2600A] selection:text-white pb-20">
      
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-[rgba(28,20,16,0.06)]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-[#7A6A5A] hover:text-[#C2600A] font-medium text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Marketplace
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className={`p-2 rounded-full border transition-all ${isLiked ? 'bg-[#FDE8D5] border-[#C2600A]/30 text-[#C2600A]' : 'bg-white border-transparent shadow-sm text-[#7A6A5A] hover:text-[#C2600A]'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full bg-white shadow-sm text-[#7A6A5A] hover:text-[#C2600A] transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Image Card (Glassmorphism inspired) */}
            <div className="relative w-full aspect-square rounded-[32px] overflow-hidden shadow-2xl shadow-[#1C1410]/5 border border-white/50 bg-[#E8E1D7] group">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title as string}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🏺</div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none"></div>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isEcoFriendly && (
                  <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#166534] shadow flex items-center gap-1.5 uppercase tracking-wider">
                    <Leaf className="w-3.5 h-3.5" /> Eco-Crafted
                  </div>
                )}
                {product.authenticityBadge && (
                  <div className="bg-[#1A1A2E]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#F5C842] shadow flex items-center gap-1.5 uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" /> Artisan Verified
                  </div>
                )}
              </div>
            </div>

            {/* Artisan Story Section Highlighted */}
            {product.story && (
              <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 text-[120px] opacity-[0.03] pointer-events-none font-craft leading-none">“</div>
                <h3 className="font-craft text-2xl font-bold text-[#1C1410] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FDE8D5] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#C2600A]" />
                  </span>
                  The Artisan's Story
                </h3>
                <p className="text-lg text-[#3D2E26] leading-relaxed font-craft italic">
                  {product.story}
                </p>
                <div className="mt-8 pt-6 border-t border-[rgba(28,20,16,0.06)] flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-[#1A1A2E] flex items-center justify-center">
                       <User className="w-5 h-5 text-[#FBF7F0]" />
                     </div>
                     <div>
                       <div className="font-bold text-sm text-[#1C1410]">Verified Artisan</div>
                       <div className="text-xs text-[#7A6A5A]">CraftAI Community Member</div>
                     </div>
                   </div>
                   <button onClick={() => handleContact()} className="text-sm font-semibold text-[#C2600A] flex items-center gap-2 hover:opacity-80 transition-opacity">
                     <MessageCircle className="w-4 h-4" /> Message
                   </button>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="bg-white/60 backdrop-blur-sm rounded-[24px] p-8 border border-[rgba(28,20,16,0.04)]">
              <h3 className="font-craft text-xl font-bold text-[#1C1410] mb-4">Description</h3>
              <p className="text-[15px] text-[#7A6A5A] leading-loose">
                {product.description}
              </p>
            </div>
            
          </div>

          {/* Right Column: Checkout & Meta Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Main Info Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-[#1C1410]/5 border border-[rgba(28,20,16,0.06)] flex flex-col">
              <span className="text-[#C2600A] font-bold text-xs uppercase tracking-[0.2em] mb-3">{product.category}</span>
              <h1 className="font-craft text-4xl leading-tight font-bold text-[#1C1410] mb-4">
                {product.title}
              </h1>
              
              <div className="flex items-center justify-between border-b border-[rgba(28,20,16,0.06)] pb-6 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl text-[#7A6A5A] font-craft">$</span>
                  <span className="text-4xl font-craft font-bold text-[#1C1410]">
                    {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(String(product.price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="flex items-center gap-1">
                     <Star className="w-4 h-4 fill-[#F5C842] text-[#F5C842]" />
                     <span className="font-bold text-[#1C1410] text-sm">4.9</span>
                     <span className="text-xs text-[#7A6A5A]">(128)</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-[#7A6A5A]">
                     <Clock className="w-3 h-3" /> {product.views || 0} views today
                   </div>
                </div>
              </div>

              {/* Shipping info inline */}
              <div className="bg-[#F9F7F5] rounded-2xl p-4 mb-6 border border-[#E8E1D7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#C2600A]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1C1410]">Standard Global Shipping</div>
                    <div className="text-xs text-[#7A6A5A]">{product.shipping?.estimatedDays || "5-10 days"}</div>
                  </div>
                </div>
                <div className="font-bold text-[#1C1410] text-sm">
                  {product.shipping?.cost ? `$${product.shipping.cost}` : "Free"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleContact(`I would like to reserve the ${product.title}. Is it available?`)}
                  className="w-full bg-gradient-to-r from-[#C2600A] to-[#E07B39] text-white py-4 rounded-2xl font-bold shadow-[0_8px_20px_rgba(194,96,10,0.3)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(194,96,10,0.4)] transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" /> Reserve Item
                </button>
                {(!user || user.uid !== product.createdBy) && !MOCK_PRODUCTS[product.id as string] && (
                  <button
                    onClick={() => handleContact(`I am interested in a custom order similar to ${product.title}.`)}
                    className="w-full bg-white border-2 border-[rgba(28,20,16,0.1)] text-[#1C1410] py-4 rounded-2xl font-bold hover:border-[#1C1410] transition-colors flex items-center justify-center gap-3"
                  >
                    Discuss Custom Order
                  </button>
                )}
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white/50">
                   <Shield className="w-5 h-5 text-[#1C1410] mb-2" />
                   <span className="text-[10px] uppercase font-bold text-[#7A6A5A] tracking-wider">Secure</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white/50">
                   <Globe className="w-5 h-5 text-[#1C1410] mb-2" />
                   <span className="text-[10px] uppercase font-bold text-[#7A6A5A] tracking-wider">Worldwide</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-white/50">
                   <Heart className="w-5 h-5 text-[#1C1410] mb-2" />
                   <span className="text-[10px] uppercase font-bold text-[#7A6A5A] tracking-wider">Fair Trade</span>
                </div>
              </div>

            </div>

            {/* Spec Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.materials && product.materials.length > 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-5 border border-[rgba(28,20,16,0.04)]">
                  <h4 className="font-bold text-[#1C1410] mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Palette className="w-4 h-4 text-[#C2600A]" /> Materials
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((m, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#FDE8D5] text-[#C2600A] text-xs font-bold rounded-lg">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.techniques && product.techniques.length > 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-[20px] p-5 border border-[rgba(28,20,16,0.04)]">
                  <h4 className="font-bold text-[#1C1410] mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Hammer className="w-4 h-4 text-[#C2600A]" /> Techniques
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.techniques.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#E8F0FE] text-[#0F3460] text-xs font-bold rounded-lg">{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="bg-white/40 backdrop-blur-md rounded-[20px] p-5 border border-[rgba(28,20,16,0.04)]">
              <div className="flex flex-wrap gap-6 text-sm justify-center">
                 <div className="flex flex-col items-center gap-1">
                   <div className="font-bold text-[#1C1410]">Item ID</div>
                   <div className="text-xs text-[#7A6A5A] uppercase">{product.id?.substring(0,8)}</div>
                 </div>
                 {product.colors && product.colors.length > 0 && (
                   <div className="flex flex-col items-center gap-1">
                     <div className="font-bold text-[#1C1410]">Hues</div>
                     <div className="text-xs text-[#7A6A5A] truncate w-24 text-center">{product.colors.join(", ")}</div>
                   </div>
                 )}
                 {product.tags && product.tags.length > 0 && (
                   <div className="flex flex-col items-center gap-1">
                     <div className="font-bold text-[#1C1410]">Tags</div>
                     <div className="flex items-center gap-1 text-xs text-[#7A6A5A]">
                       <Tag className="w-3 h-3" /> {product.tags.length} labels
                     </div>
                   </div>
                 )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Modal Overlay */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1C1410]/60 backdrop-blur-sm" onClick={() => setIsContactModalOpen(false)}></div>
          
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 relative z-10 shadow-2xl border border-[rgba(28,20,16,0.06)] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F5F0EB] text-[#7A6A5A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FDE8D5] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#C2600A]" />
              </div>
              <div>
                <h3 className="font-craft text-2xl font-bold text-[#1C1410]">Contact Artisan</h3>
                <p className="text-sm text-[#7A6A5A]">Send an inquiry about {product.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmitInquiry} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1C1410] mb-1.5">Your Name</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="w-full bg-[#F5F0EB] border border-transparent focus:border-[#C2600A]/30 rounded-xl px-4 py-3 text-[15px] outline-none transition-colors"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1C1410] mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full bg-[#F5F0EB] border border-transparent focus:border-[#C2600A]/30 rounded-xl px-4 py-3 text-[15px] outline-none transition-colors"
                  placeholder="jane@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1C1410] mb-1.5">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-[#F5F0EB] border border-transparent focus:border-[#C2600A]/30 rounded-xl px-4 py-3 text-[15px] outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-[#C2600A] to-[#E07B39] text-white py-4 rounded-xl font-bold shadow-[0_4px_16px_rgba(194,96,10,0.25)] hover:shadow-[0_8px_24px_rgba(194,96,10,0.35)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <><Send className="w-5 h-5" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
