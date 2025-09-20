"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../lib/ToastContext';
import { productService, ProductData } from '../../../backend/firebase/productService';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Star,
  MapPin,
  Clock,
  Tag,
  Palette,
  Hammer,
  Leaf
} from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = params?.id as string;

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const result = await productService.getProduct(productId);
        if (result.success && result.product) {
          setProduct(result.product);
          // Increment view count
          productService.incrementViews(productId);
        } else {
          showToast({
            type: 'error',
            title: 'Product Not Found',
            message: 'The requested product could not be found.'
          });
          router.push('/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        showToast({
          type: 'error',
          title: 'Error Loading Product',
          message: 'Failed to load product details.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, router, showToast]);

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showToast({
      type: 'success',
      title: isLiked ? 'Removed from Favorites' : 'Added to Favorites',
      message: isLiked ? 'Product removed from your favorites' : 'Product added to your favorites'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Link Copied',
        message: 'Product link copied to clipboard'
      });
    }
  };

  const handleContact = () => {
    showToast({
      type: 'info',
      title: 'Contact Feature',
      message: 'Contact functionality will be available soon!'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-3">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-3 w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The requested product could not be found.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="max-w-7xl mx-auto p-3 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`${isLiked ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          {/* Product Image - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={product.imageUrl || '/api/placeholder/600/600'}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
                {product.isEcoFriendly && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Eco-Friendly
                  </div>
                )}
                {product.authenticityBadge && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info - Takes 1/3 width on large screens */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">{product.title}</h1>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold text-amber-600">${product.price.toFixed(2)}</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span className="text-xs">4.8 (24)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{product.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              {product.materials && product.materials.length > 0 && (
                <Card className="p-2">
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1 text-xs">
                    <Palette className="w-3 h-3" />
                    Materials
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.materials.slice(0, 2).map((material, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full"
                      >
                        {material}
                      </span>
                    ))}
                    {product.materials.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                        +{product.materials.length - 2}
                      </span>
                    )}
                  </div>
                </Card>
              )}

              {product.techniques && product.techniques.length > 0 && (
                <Card className="p-2">
                  <h4 className="font-medium text-gray-900 mb-1 flex items-center gap-1 text-xs">
                    <Hammer className="w-3 h-3" />
                    Techniques
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.techniques.slice(0, 2).map((technique, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {technique}
                      </span>
                    ))}
                    {product.techniques.length > 2 && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        +{product.techniques.length - 2}
                      </span>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Shipping Info - Compact */}
            <Card className="p-3">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
                <Truck className="w-3 h-3" />
                Shipping
              </h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{product.shipping?.estimatedDays || '5-7 days'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-medium">{product.shipping?.cost ? `$${product.shipping.cost}` : 'Free'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium">{product.hasGlobalShipping ? 'Worldwide' : 'Local'}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2"
                onClick={handleContact}
              >
                <ShoppingCart className="w-3 h-3 mr-2" />
                Contact Artisan
              </Button>
              
              {user?.uid !== product.createdBy && (
                <Button 
                  variant="outline" 
                  className="w-full py-2 text-sm"
                  onClick={handleContact}
                >
                  <MapPin className="w-3 h-3 mr-2" />
                  Custom Order
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Full Description and Details Below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Description */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          </Card>

          {/* Story */}
          {product.story && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Artisan's Story</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{product.story}</p>
            </Card>
          )}
        </div>

        {/* Tags and Colors in a compact row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {product.colors && product.colors.length > 0 && (
            <Card className="p-3">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Colors</h4>
              <div className="flex flex-wrap gap-1">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {product.tags && product.tags.length > 0 && (
            <Card className="p-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-1 text-sm">
                <Tag className="w-3 h-3" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Additional Information - More Compact */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <Shield className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <h4 className="font-medium text-gray-900 mb-1 text-xs">Authenticity Guaranteed</h4>
            <p className="text-xs text-gray-600">
              Verified by experts
            </p>
          </Card>
          
          <Card className="p-3 text-center">
            <Truck className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <h4 className="font-medium text-gray-900 mb-1 text-xs">Safe Delivery</h4>
            <p className="text-xs text-gray-600">
              Insured shipping
            </p>
          </Card>
          
          <Card className="p-3 text-center">
            <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <h4 className="font-medium text-gray-900 mb-1 text-xs">Support Artisans</h4>
            <p className="text-xs text-gray-600">
              Direct support
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}