"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Square, Edit, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { productService, ProductData as FirebaseProductData } from '../../backend/firebase/productService';
import { useToast } from '../../lib/ToastContext';
import './products.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  materials: string[];
  description: string;
  tags: string[];
  shipping: string;
  selected: boolean;
  status?: string;
  createdBy?: string;
}

// Memoized Product Card component for better performance
const ProductCard = React.memo(({ 
  product, 
  onSelect 
}: { 
  product: Product; 
  onSelect: (id: string) => void; 
}) => {
  const router = useRouter();
  
  const handleSelect = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when selecting
    onSelect(product.id);
  }, [product.id, onSelect]);

  const handleCardClick = useCallback(() => {
    router.push(`/product/${product.id}`);
  }, [product.id, router]);

  return (
    <Card 
      className="product-card relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border border-[rgba(28,20,16,0.08)] cursor-pointer rounded-2xl"
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <button
        onClick={handleSelect}
        className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:bg-white hover:scale-110 border border-[rgba(28,20,16,0.05)]"
        aria-label={`${product.selected ? 'Deselect' : 'Select'} ${product.name}`}
      >
        {product.selected ? (
          <CheckCircle className="w-5 h-5 text-[#C2600A] fill-current" />
        ) : (
          <Square className="w-5 h-5 text-[#7A6A5A]" />
        )}
      </button>

      {/* Product Image - Optimized with Next.js Image */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.image && product.image !== '/api/placeholder/300/200' ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              // Fallback to placeholder if image fails to load
              console.warn(`Failed to load image for product: ${product.name}`);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-medium p-4 text-center bg-gradient-to-br from-gray-100 to-gray-200">
            {product.name}
          </div>
        )}
        {/* Selection overlay */}
        {product.selected && (
          <div className="absolute inset-0 bg-[#C2600A]/10 border-2 border-[#C2600A]/30 transition-all duration-200"></div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-craft font-bold text-[#1C1410] text-lg sm:text-xl line-clamp-2 flex-1 mr-2 leading-tight">
            {product.name}
          </h3>
          <button 
            className="text-[#7A6A5A] hover:text-[#C2600A] transition-colors duration-200 p-1.5 -mt-1 hover:bg-[#F5F0EB] rounded-lg"
            aria-label={`Edit ${product.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs sm:text-sm text-[#7A6A5A] mb-2 truncate uppercase tracking-widest font-medium">{product.category}</p>
        <p className="text-xl sm:text-2xl font-craft font-bold text-[#C2600A] mb-4">${product.price.toFixed(2)}</p>

        {/* Materials - Optimized display */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.5rem]">
          {product.materials.slice(0, 3).map((material, index) => (
            <span
              key={`${product.id}-material-${index}`}
              className="px-2.5 py-1 bg-[#F5F0EB] text-[#1C1410] text-xs font-medium rounded-md whitespace-nowrap transition-colors duration-200 hover:bg-[#E8E1D7]"
            >
              {material}
            </span>
          ))}
          {product.materials.length > 3 && (
            <span className="px-2.5 py-1 bg-[#F5F0EB] text-[#1C1410] text-xs font-medium rounded-md">
              +{product.materials.length - 3}
            </span>
          )}
        </div>

        {/* Description - Truncated on mobile */}
        <p className="text-sm text-[#7A6A5A] mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* Tags - Optimized display */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[1.5rem]">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={`${product.id}-tag-${index}`}
              className="px-2.5 py-1 bg-[#FDE8D5] text-[#C2600A] text-xs font-medium rounded-md transition-colors duration-200 hover:bg-[#FADBBF]"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 2 && (
            <span className="px-2.5 py-1 bg-[#FDE8D5] text-[#C2600A] text-xs font-medium rounded-md">
              +{product.tags.length - 2}
            </span>
          )}
        </div>

        {/* Shipping */}
        <div className="flex items-center text-xs sm:text-sm text-[#7A6A5A] font-medium pt-3 border-t border-[rgba(28,20,16,0.06)]">
          <span className="mr-2 text-base opacity-80">📦</span>
          <span className="truncate">{product.shipping}</span>
        </div>
      </div>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [marketplaceProducts, setMarketplaceProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState<'my-products' | 'marketplace'>('my-products');

  // Sample products for fallback
  const sampleProducts: Product[] = [
    {
      id: 'sample-1',
      name: 'Handwoven Silk Scarf',
      category: 'Textiles',
      price: 89.99,
      image: '/api/placeholder/300/200',
      materials: ['Silk', 'Natural Dyes'],
      description: 'Beautiful handwoven silk scarf with traditional patterns',
      tags: ['handmade', 'silk', 'luxury'],
      shipping: 'Ships in 3-7 days',
      selected: false,
      status: 'published'
    },
    {
      id: 'sample-2',
      name: 'Ceramic Tea Set',
      category: 'Ceramics',
      price: 156.50,
      image: '/api/placeholder/300/200',
      materials: ['Clay', 'Glaze'],
      description: 'Artisan-crafted ceramic tea set with hand-painted designs',
      tags: ['ceramics', 'tea', 'handmade'],
      shipping: 'Ships in 5-10 days',
      selected: false,
      status: 'published'
    },
    {
      id: 'sample-3',
      name: 'Wooden Jewelry Box',
      category: 'Woodwork',
      price: 124.99,
      image: '/api/placeholder/300/200',
      materials: ['Oak Wood', 'Brass Hardware'],
      description: 'Hand-carved wooden jewelry box with velvet lining',
      tags: ['woodwork', 'jewelry', 'storage'],
      shipping: 'Ships in 7-14 days',
      selected: false,
      status: 'draft'
    }
  ];

  // Load marketplace products (all published products)
  const loadMarketplaceProducts = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous calls
    if (isRefreshing && !forceRefresh) return;
    
    setIsRefreshing(true);
    try {
      const result = await productService.getPublishedProducts(50);
      if (result.success) {
        const formattedProducts: Product[] = result.products.map((product: FirebaseProductData) => ({
          id: product.id!,
          name: product.title,
          category: product.category,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          image: product.imageUrl || '/api/placeholder/300/200',
          materials: product.materials || [],
          description: product.description,
          tags: product.tags,
          shipping: product.shipping?.estimatedDays || 'Ships in 3-7 days',
          selected: false,
          status: product.status,
          createdBy: product.createdBy
        }));
        setMarketplaceProducts(formattedProducts);
      } else {
        console.error('Failed to load marketplace products:', result.error);
        // Only show error if it's not a duplicate or cached error
        showToast({
          type: 'error',
          title: 'Failed to Load Marketplace',
          message: result.error || 'Could not load marketplace products'
        });
      }
    } catch (error) {
      console.error('Error loading marketplace products:', error);
      showToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to load marketplace products. Please try again.'
      });
    } finally {
      setIsRefreshing(false);
      setIsInitialLoad(false);
    }
  }, [showToast, isRefreshing]);

  // Load user's products from Firebase
  const loadProducts = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    // Prevent multiple simultaneous calls
    if (isRefreshing && !forceRefresh) return;
    
    setIsRefreshing(true);
    try {
      const result = await productService.getUserProducts(user.uid, undefined, forceRefresh);
      if (result.success) {
        const formattedProducts: Product[] = result.products.map((product: FirebaseProductData) => ({
          id: product.id!,
          name: product.title,
          category: product.category,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          image: product.imageUrl || '/api/placeholder/300/200',
          materials: product.materials || [],
          description: product.description,
          tags: product.tags,
          shipping: product.shipping?.estimatedDays || 'Ships in 3-7 days',
          selected: false,
          status: product.status,
          createdBy: product.createdBy
        }));
        setProducts(formattedProducts);
      } else {
        console.error('Failed to load products:', result.error);
        
        // Show specific error message to user
        const errorMessage = result.error || 'Unknown error occurred';
        if (errorMessage.includes('internet connection')) {
          showToast({
            type: 'error',
            title: 'Connection Error',
            message: 'Please check your internet connection and try refreshing.'
          });
        } else {
          showToast({
            type: 'error',
            title: 'Failed to Load Products',
            message: errorMessage
          });
        }
        
        // Fallback to sample data if Firebase fails
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to sample data
      setProducts(sampleProducts);
    } finally {
      setIsRefreshing(false);
      setIsInitialLoad(false);
    }
  }, [user, showToast, isRefreshing]);

  // Force refresh products
  const handleRefresh = useCallback(async () => {
    if (activeTab === 'my-products') {
      await loadProducts(true);
    } else {
      await loadMarketplaceProducts(true);
    }
  }, [activeTab]); // Removed problematic dependencies

  // Load products on component mount and when user changes
  useEffect(() => {
    if (!user) return;
    
    const loadInitialData = async () => {
      setIsInitialLoad(true);
      
      // Check if cache was invalidated (e.g., after publishing)
      const cacheInvalid = localStorage.getItem('productsCacheInvalid');
      const forceRefresh = !!cacheInvalid;
      
      if (cacheInvalid) {
        localStorage.removeItem('productsCacheInvalid');
      }
      
      try {
        // Load both user products and marketplace products
        await Promise.all([
          loadProducts(forceRefresh),
          loadMarketplaceProducts(forceRefresh)
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    loadInitialData();
  }, [user]); // Removed circular dependencies

  // Refresh products when page becomes visible (user returns from publishing)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Small delay to ensure any Firebase operations have completed
        setTimeout(async () => {
          await Promise.all([
            loadProducts(true),
            loadMarketplaceProducts(true)
          ]);
        }, 500);
      }
    };

    const handlePageFocus = () => {
      if (user) {
        setTimeout(async () => {
          await Promise.all([
            loadProducts(true),
            loadMarketplaceProducts(true)
          ]);
        }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handlePageFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handlePageFocus);
    };
  }, [user]); // Removed circular dependencies

  // Get current products based on active tab
  const currentProducts = activeTab === 'my-products' ? products : marketplaceProducts;
  
  // Memoized calculations for better performance
  const selectedProducts = useMemo(() => 
    currentProducts.filter(product => product.selected), 
    [currentProducts]
  );
  
  const selectedCount = selectedProducts.length;
  const totalProducts = currentProducts.length;
  const totalValue = useMemo(() => 
    selectedProducts.reduce((sum, product) => sum + product.price, 0),
    [selectedProducts]
  );

  // Optimized selection handler with useCallback
  const handleProductSelect = useCallback((productId: string) => {
    if (activeTab === 'my-products') {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, selected: !product.selected }
            : product
        )
      );
    } else {
      setMarketplaceProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId 
            ? { ...product, selected: !product.selected }
            : product
        )
      );
    }
  }, [activeTab]);

  const handleBuySelected = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Buying selected products:', selectedProducts);
      // Handle buy selected logic
    } finally {
      setIsLoading(false);
    }
  }, [selectedProducts]);

  const handleSaveAsDraft = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Saving as draft:', selectedProducts);
      // Handle save as draft logic
    } finally {
      setIsLoading(false);
    }
  }, [selectedProducts]);

  const handleDiscardSelected = useCallback(() => {
    if (activeTab === 'my-products') {
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.selected ? { ...product, selected: false } : product
        )
      );
    } else {
      setMarketplaceProducts(prevProducts => 
        prevProducts.map(product => 
          product.selected ? { ...product, selected: false } : product
        )
      );
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#F5F0EB] font-inter">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:padding-8">
        {/* Header - Responsive */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-[rgba(28,20,16,0.04)] shadow-sm">
            <div className="mb-5 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-craft font-bold text-[#1C1410] mb-2 leading-tight">
                Products Dashboard
              </h1>
              <p className="text-sm sm:text-base text-[#7A6A5A]">
                Manage your artisan products and explore the premium marketplace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="ghost"
                className="flex items-center gap-2 text-[#7A6A5A] hover:text-[#1C1410] hover:bg-white/80 rounded-xl"
              >
                🏠 Dashboard
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="flex items-center gap-2 w-fit border-[#C2600A]/30 text-[#C2600A] hover:bg-[#FDE8D5] hover:text-[#A04E08] rounded-xl transition-all"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 border-b border-[rgba(28,20,16,0.1)]">
          <nav className="-mb-px flex space-x-8 px-2">
            <button
              onClick={() => setActiveTab('my-products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'my-products'
                  ? 'border-[#C2600A] text-[#C2600A]'
                  : 'border-transparent text-[#7A6A5A] hover:text-[#1C1410] hover:border-[#1C1410]/30'
              }`}
            >
              My Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'marketplace'
                  ? 'border-[#C2600A] text-[#C2600A]'
                  : 'border-transparent text-[#7A6A5A] hover:text-[#1C1410] hover:border-[#1C1410]/30'
              }`}
            >
              Marketplace ({marketplaceProducts.length})
            </button>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Products Grid - Responsive */}
          <div className="flex-1">
            {isInitialLoad ? (
              <div className="flex items-center justify-center py-20 bg-white/40 rounded-3xl border border-white/50 backdrop-blur-sm">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto mb-5 text-[#C2600A]" />
                  <p className="text-[#7A6A5A] font-medium tracking-wide">Retrieving collection...</p>
                </div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white/40 rounded-3xl border border-[rgba(28,20,16,0.04)] backdrop-blur-sm shadow-sm">
                <div className="w-20 h-20 mb-6 bg-[#F5F0EB] rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-4xl opacity-50">🏺</span>
                </div>
                <p className="text-xl font-craft font-bold text-[#1C1410] mb-3">
                  {activeTab === 'my-products' ? 'Your workshop is empty.' : 'No artisan items available.'}
                </p>
                <p className="text-[15px] text-[#7A6A5A] max-w-md text-center">
                  {activeTab === 'my-products' 
                    ? 'Start crafting your story by listing your first artisanal piece today.' 
                    : 'Check back later as our creatives are busy making new wares.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleProductSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Responsive */}
          <div className="w-full lg:w-[340px] order-first lg:order-last">
            <Card className="lg:sticky lg:top-6 bg-white border border-[rgba(28,20,16,0.08)] shadow-lg rounded-2xl overflow-hidden">
              <div className="p-5 sm:p-6">
                <h2 className="text-xl font-craft font-bold text-[#1C1410] mb-5">Bulk Actions</h2>
                
                {/* Selected Products Count */}
                <div className="mb-6 bg-[#F5F0EB] p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#7A6A5A]">Selected Items</span>
                    <span className="font-bold text-[#1C1410]">{selectedCount} <span className="text-[#9B8B7A] font-normal">/ {totalProducts}</span></span>
                  </div>
                  <div className="w-full bg-[#E8E1D7] rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-[#F5C842] via-[#E07B39] to-[#C2600A] h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${totalProducts > 0 ? (selectedCount / totalProducts) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons - Context Aware */}
                <div className="space-y-3 mb-6">
                  {activeTab === 'my-products' ? (
                    <>
                      <Button 
                        onClick={handleBuySelected}
                        disabled={selectedCount === 0 || isLoading}
                        className="w-full border-none craft-gradient-bg text-white hover:opacity-90 shadow-[0_4px_14px_rgba(194,96,10,0.3)] transition-all duration-300 rounded-xl py-6 hover:shadow-[0_6px_20px_rgba(194,96,10,0.4)] hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <span className="font-bold text-[15px]">✨ Publish Selected</span>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleSaveAsDraft}
                        disabled={selectedCount === 0 || isLoading}
                        variant="outline"
                        className="w-full border-[#C2600A]/20 text-[#1C1410] hover:bg-[#FDE8D5] hover:text-[#A04E08] transition-colors duration-200 rounded-xl py-6"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <span className="font-medium">📄 Save as Draft</span>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handleBuySelected}
                        disabled={selectedCount === 0 || isLoading}
                        className="w-full border-none bg-[#0F3460] text-white hover:bg-[#0A2647] shadow-[0_4px_14px_rgba(15,52,96,0.3)] transition-all duration-300 rounded-xl py-6 hover:shadow-[0_6px_20px_rgba(15,52,96,0.4)] hover:-translate-y-0.5"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <span className="font-bold text-[15px]">🛒 Buy Selected</span>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleSaveAsDraft}
                        disabled={selectedCount === 0 || isLoading}
                        variant="outline"
                        className="w-full border-[rgba(28,20,16,0.1)] text-[#1C1410] hover:bg-[#F5F0EB] transition-colors duration-200 rounded-xl py-6"
                      >
                        <span className="font-medium">❤️ Add to Wishlist</span>
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    onClick={handleDiscardSelected}
                    disabled={selectedCount === 0 || isLoading}
                    variant="outline"
                    className="w-full text-[#991B1B] border-[#FCA5A5]/50 hover:bg-[#FEF2F2] hover:text-[#7F1D1D] hover:border-[#F87171] transition-colors duration-200 rounded-xl mt-4"
                  >
                    🗑️ Clear Selection
                  </Button>
                </div>

                {/* Selected Items List - Responsive */}
                {selectedCount > 0 && (
                  <div className="border-t border-[rgba(28,20,16,0.06)] pt-5">
                    <h3 className="text-sm font-bold text-[#1C1410] uppercase tracking-wider mb-4">Selected Items</h3>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#D4C3B3] scrollbar-track-transparent">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="flex justify-between items-center text-[13px] py-1">
                          <span className="text-[#7A6A5A] truncate mr-3 flex-1 font-medium">{product.name}</span>
                          <span className="font-bold text-[#1C1410] whitespace-nowrap">${product.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-[rgba(28,20,16,0.06)]">
                      <div className="flex justify-between items-center font-craft">
                        <span className="font-bold text-[#7A6A5A]">Total Value</span>
                        <span className="text-2xl font-bold text-[#C2600A]">${totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {selectedCount === 0 && (
                  <div className="text-center py-10 text-[#7A6A5A]">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0EB] rounded-2xl flex items-center justify-center shadow-inner border border-[rgba(28,20,16,0.04)]">
                      <span className="text-2xl opacity-60">📦</span>
                    </div>
                    <p className="font-medium text-[#1C1410] mb-1">No products selected</p>
                    <p className="text-[13px]">Select products to perform bulk actions</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}