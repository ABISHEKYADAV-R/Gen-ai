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
      className="product-card relative overflow-hidden group transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <button
        onClick={handleSelect}
        className="absolute top-3 right-3 z-10 p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:bg-white hover:scale-110"
        aria-label={`${product.selected ? 'Deselect' : 'Select'} ${product.name}`}
      >
        {product.selected ? (
          <CheckCircle className="w-5 h-5 text-blue-600 fill-current" />
        ) : (
          <Square className="w-5 h-5 text-gray-400" />
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
          <div className="absolute inset-0 bg-blue-600/10 border-2 border-blue-600/20 transition-all duration-200"></div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 flex-1 mr-2">
            {product.name}
          </h3>
          <button 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 -mt-1 hover:bg-gray-100 rounded"
            aria-label={`Edit ${product.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 mb-2 truncate">{product.category}</p>
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-3">${product.price.toFixed(2)}</p>

        {/* Materials - Optimized display */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem]">
          {product.materials.slice(0, 3).map((material, index) => (
            <span
              key={`${product.id}-material-${index}`}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full whitespace-nowrap transition-colors duration-200 hover:bg-gray-200"
            >
              {material}
            </span>
          ))}
          {product.materials.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{product.materials.length - 3}
            </span>
          )}
        </div>

        {/* Description - Truncated on mobile */}
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        {/* Tags - Optimized display */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[1.5rem]">
          {product.tags.slice(0, 2).map((tag, index) => (
            <span
              key={`${product.id}-tag-${index}`}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full transition-colors duration-200 hover:bg-green-200"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 2 && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              +{product.tags.length - 2}
            </span>
          )}
        </div>

        {/* Shipping */}
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span className="mr-2 text-base">📦</span>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header - Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Products Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your products and explore the marketplace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="ghost"
                className="flex items-center gap-2"
              >
                🏠 Dashboard
              </Button>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                className="flex items-center gap-2 w-fit"
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh Products
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('my-products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'marketplace'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'my-products' ? 'No products found.' : 'No products available in marketplace.'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === 'my-products' 
                      ? 'Create your first product to see it here.' 
                      : 'Check back later for new products.'}
                  </p>
                </div>
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
          <div className="w-full lg:w-80 order-first lg:order-last">
            <Card className="lg:sticky lg:top-6">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Bulk Actions</h2>
                
                {/* Selected Products Count */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Selected Products</span>
                    <span className="font-semibold">{selectedCount} of {totalProducts}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${(selectedCount / totalProducts) * 100}%` }}
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            � Publish Selected
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleSaveAsDraft}
                        disabled={selectedCount === 0 || isLoading}
                        variant="outline"
                        className="w-full transition-colors duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            📄 Save as Draft
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={handleBuySelected}
                        disabled={selectedCount === 0 || isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            🛒 Buy Selected
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        onClick={handleSaveAsDraft}
                        disabled={selectedCount === 0 || isLoading}
                        variant="outline"
                        className="w-full transition-colors duration-200"
                      >
                        ❤️ Add to Wishlist
                      </Button>
                    </>
                  )}
                  
                  <Button 
                    onClick={handleDiscardSelected}
                    disabled={selectedCount === 0 || isLoading}
                    variant="outline"
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 transition-colors duration-200"
                  >
                    🗑️ Clear Selection
                  </Button>
                </div>

                {/* Selected Items List - Responsive */}
                {selectedCount > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Selected Items</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="flex justify-between items-center text-sm py-1">
                          <span className="text-gray-700 truncate mr-2 flex-1">{product.name}</span>
                          <span className="font-semibold whitespace-nowrap">${product.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Value</span>
                        <span className="text-lg">${totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {selectedCount === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      📦
                    </div>
                    <p className="text-sm">No products selected</p>
                    <p className="text-xs mt-1">Select products to perform bulk actions</p>
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