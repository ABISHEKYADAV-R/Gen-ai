import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage, handleFirebaseError } from '../../lib/firebase.js';

export interface ProductData {
  id?: string;
  title: string;
  price: number; // Changed from string to number to match Firebase rules
  description: string;
  story?: string;
  category: string;
  tags: string[];
  isEcoFriendly: boolean;
  hasGlobalShipping: boolean;
  authenticityBadge?: string;
  imageUrl: string;
  materials?: string[];
  techniques?: string[];
  colors?: string[];
  style?: string;
  createdBy: string; // User ID
  createdAt?: any;
  updatedAt?: any;
  status: 'draft' | 'published' | 'archived';
  views?: number;
  likes?: number;
  shipping?: {
    estimatedDays: string;
    cost: number;
    regions: string[];
  };
  selected?: boolean;
}

export const productService = {
  // Local cache for better performance
  _cache: new Map(),
  _cacheExpiry: 5 * 60 * 1000, // 5 minutes

  // Cache helper methods
  _getCacheKey(userId: string, status?: string) {
    return `${userId}_${status || 'all'}`;
  },

  _setCache(key: string, data: any) {
    this._cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  _getCache(key: string) {
    const cached = this._cache.get(key);
    if (cached && Date.now() - cached.timestamp < this._cacheExpiry) {
      return cached.data;
    }
    return null;
  },

  _clearUserCache(userId: string) {
    // Clear all cache entries for this user
    Array.from(this._cache.keys())
      .filter(key => key.startsWith(userId))
      .forEach(key => this._cache.delete(key));
  },

  _clearAllCache() {
    this._cache.clear();
  },

  // Create a new product - optimized for speed
  async createProduct(productData: Omit<ProductData, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const productWithMetadata = {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        likes: 0
      };

      // Use addDoc for immediate response
      const docRef = await addDoc(collection(db, 'products'), productWithMetadata);

      // Clear cache for this user asynchronously
      setTimeout(() => {
        this._clearUserCache(productData.createdBy);
      }, 0);

      // Store in local cache for immediate access
      const cacheKey = this._getCacheKey(productData.createdBy);
      const existingCache = this._getCache(cacheKey) || [];
      const newProduct = { ...productWithMetadata, id: docRef.id };
      this._setCache(cacheKey, [newProduct, ...existingCache]);

      return {
        success: true,
        productId: docRef.id,
        product: newProduct
      };
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      const { code, message } = handleFirebaseError(error);
      return {
        success: false,
        error: message,
        code
      };
    }
  },

  // Update a product
  async updateProduct(productId: string, updates: Partial<ProductData>) {
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'products', productId), updateData);

      // Clear relevant caches
      if (updates.createdBy) {
        this._clearUserCache(updates.createdBy);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating product:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Get a single product
  async getProduct(productId: string) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          product: { id: docSnap.id, ...docSnap.data() } as ProductData
        };
      } else {
        return {
          success: false,
          error: 'Product not found'
        };
      }
    } catch (error: any) {
      console.error('Error getting product:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Get user products with caching
  async getUserProducts(userId: string, status?: 'draft' | 'published' | 'archived', forceRefresh = false) {
    try {
      const cacheKey = this._getCacheKey(userId, status);
      
      // Return cached data if available and not forcing refresh
      if (!forceRefresh) {
        const cachedData = this._getCache(cacheKey);
        if (cachedData) {
          return { success: true, products: cachedData };
        }
      }

      let q = query(
        collection(db, 'products'),
        where('createdBy', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      // Add status filter if specified
      if (status) {
        q = query(
          collection(db, 'products'),
          where('createdBy', '==', userId),
          where('status', '==', status),
          orderBy('updatedAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const products: ProductData[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        products.push({ id: doc.id, ...doc.data() } as ProductData);
      });

      // Cache the results
      this._setCache(cacheKey, products);

      return { success: true, products };
    } catch (error: any) {
      console.error('Error getting user products:', error);
      const { code, message } = handleFirebaseError(error);
      
      // Return cached data as fallback if available
      const cacheKey = this._getCacheKey(userId, status);
      const cachedData = this._getCache(cacheKey);
      if (cachedData) {
        console.log('Returning cached data due to error');
        return { success: true, products: cachedData };
      }
      
      return { success: false, error: message, code };
    }
  },

  // Get published products for marketplace
  async getPublishedProducts(limitCount: number = 50) {
    try {
      const cacheKey = 'marketplace_products';
      const cachedData = this._getCache(cacheKey);
      if (cachedData) {
        return { success: true, products: cachedData };
      }

      const q = query(
        collection(db, 'products'),
        where('status', '==', 'published'),
        orderBy('updatedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products: ProductData[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        products.push({ id: doc.id, ...doc.data() } as ProductData);
      });

      // Cache the results
      this._setCache(cacheKey, products);

      return { success: true, products };
    } catch (error: any) {
      console.error('Error getting published products:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Upload product image - optimized for speed
  async uploadProductImage(file: File, userId: string, productId?: string) {
    try {
      // Check if storage is available
      if (!storage) {
        console.warn('Firebase Storage not initialized - using fallback');
        return {
          success: false,
          error: 'Image upload is temporarily unavailable. Your product will be saved without the image.',
          fallback: true
        };
      }

      // Check file size and reject if too large (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return {
          success: false,
          error: 'File size exceeds 10MB limit. Please choose a smaller image.'
        };
      }

      const fileName = `${userId}/${productId || Date.now()}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `products/${fileName}`);
      
      // Optimized metadata for faster upload
      const metadata = {
        contentType: file.type,
        cacheControl: 'public,max-age=86400', // 24 hours cache
        customMetadata: {
          'uploadedBy': userId,
          'productId': productId || 'new'
        }
      };
      
      // Use uploadBytes for faster upload
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        success: true,
        imageUrl: downloadURL,
        imagePath: fileName
      };
    } catch (error: any) {
      console.error('Error uploading product image:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred while uploading the image.';
      if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage = 'Upload timed out. Please check your internet connection and try again with a smaller image.';
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = 'Storage quota exceeded. Please contact support.';
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = 'Invalid file format. Please use JPG, PNG, or WEBP images.';
      } else if (error.message?.includes('Firebase Storage has not been set up') || error.message?.includes('service is not available')) {
        errorMessage = 'Image upload is temporarily unavailable. Your product will be saved without the image.';
        return {
          success: false,
          error: errorMessage,
          fallback: true
        };
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Delete product image
  async deleteProductImage(imagePath: string) {
    try {
      if (!storage) {
        console.warn('Firebase Storage not initialized');
        return { success: false, error: 'Storage not available' };
      }
      
      const imageRef = ref(storage, `products/${imagePath}`);
      await deleteObject(imageRef);
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product image:', error);
      // Don't fail the whole operation if image deletion fails
      return { success: true }; // Return success to not block other operations
    }
  },

  // Delete product
  async deleteProduct(productId: string) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      
      // Clear all caches
      this._clearAllCache();
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Publish product
  async publishProduct(productId: string) {
    try {
      await updateDoc(doc(db, 'products', productId), {
        status: 'published',
        updatedAt: serverTimestamp()
      });

      // Clear all caches to reflect the change
      this._clearAllCache();

      return { success: true };
    } catch (error: any) {
      console.error('Error publishing product:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Search products
  async searchProducts(searchTerm: string, category?: string) {
    try {
      let q;
      
      if (category) {
        q = query(
          collection(db, 'products'),
          where('status', '==', 'published'),
          where('category', '==', category),
          orderBy('updatedAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'products'),
          where('status', '==', 'published'),
          orderBy('updatedAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      const products: ProductData[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const product = { id: doc.id, ...doc.data() } as ProductData;
        
        // Client-side text search
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          (product.materials && product.materials.some(material => material.toLowerCase().includes(searchLower))) ||
          (product.category && product.category.toLowerCase().includes(searchLower));

        if (matchesSearch) {
          products.push(product);
        }
      });

      return { success: true, products };
    } catch (error: any) {
      console.error('Error searching products:', error);
      const { code, message } = handleFirebaseError(error);
      return { success: false, error: message, code };
    }
  },

  // Increment product views
  async incrementViews(productId: string) {
    try {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        const currentViews = productDoc.data().views || 0;
        await updateDoc(doc(db, 'products', productId), {
          views: currentViews + 1
        });
      }
    } catch (error: any) {
      console.error('Error updating views:', error);
    }
  }
};