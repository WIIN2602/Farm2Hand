import { supabase } from '../lib/supabase';

// Database types
export interface Farm2HandProduct {
  id: number;
  product_name: string | null;
  product_price: number | null;
  product_unit: string | null;
  product_tag: string | null;
  product_organic: boolean | null;
  product_rating: number | null;
  product_owner: number | null;
  product_category: string | null;
  product_description: string | null;
  product_image: string | null;
  product_stock: number | null;
  product_reviews: number | null;
  product_discount: number | null;
  in_stock: boolean | null;
  created_at: string;
  updated_at: string;
}

// Frontend types
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  farmer: string;
  farmerId: number;
  location: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  category: string;
  description: string;
  organic: boolean;
  discount?: number;
  tags: string[];
  stock: number;
}

// Category with count interface
export interface CategoryWithCount {
  name: string;
  count: number;
  icon: string;
  color: string;
}

// Create product data interface
export interface CreateProductData {
  name: string;
  price: number;
  unit: string;
  category: string;
  description: string;
  image: string;
  stock: number;
  organic: boolean;
  discount: number;
  tags: string[];
}

// Update product data interface
export interface UpdateProductData extends Partial<CreateProductData> {
  inStock?: boolean;
}

// User data for farmer info
interface FarmerInfo {
  id: number;
  Name: string;
  Address: string;
}

// Convert database product to frontend format
const convertToProduct = (dbProduct: Farm2HandProduct, farmerInfo: FarmerInfo): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.product_name || '',
    price: dbProduct.product_price || 0,
    unit: dbProduct.product_unit || '',
    image: dbProduct.product_image || '',
    farmer: farmerInfo.Name || 'Unknown Farmer',
    farmerId: dbProduct.product_owner || 0,
    location: farmerInfo.Address || 'Unknown Location',
    rating: dbProduct.product_rating ? dbProduct.product_rating / 10 : 0, // Convert from integer to decimal
    reviews: dbProduct.product_reviews || 0,
    inStock: dbProduct.in_stock || false,
    category: dbProduct.product_category || '',
    description: dbProduct.product_description || '',
    organic: dbProduct.product_organic || false,
    discount: dbProduct.product_discount || undefined,
    tags: dbProduct.product_tag ? dbProduct.product_tag.split(',').map(tag => tag.trim()) : [],
    stock: dbProduct.product_stock || 0
  };
};

// Convert create data to database format
const convertCreateDataToDb = (farmerId: number, data: CreateProductData): Partial<Farm2HandProduct> => {
  return {
    product_name: data.name,
    product_price: data.price,
    product_unit: data.unit,
    product_category: data.category,
    product_description: data.description,
    product_image: data.image,
    product_stock: data.stock,
    product_organic: data.organic,
    product_discount: data.discount > 0 ? data.discount : null,
    product_tag: data.tags.length > 0 ? data.tags.join(',') : null,
    product_owner: farmerId,
    product_rating: 45, // Default rating (4.5 out of 5)
    product_reviews: 0,
    in_stock: data.stock > 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const productService = {
  // Get all products with farmer information
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('Farm2Hand_product')
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }

      if (!products) {
        return [];
      }

      return products.map(product => {
        const farmerInfo = product.Farm2Hand_user as FarmerInfo;
        return convertToProduct(product as Farm2HandProduct, farmerInfo);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('Farm2Hand_product')
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .eq('product_category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }

      if (!products) {
        return [];
      }

      return products.map(product => {
        const farmerInfo = product.Farm2Hand_user as FarmerInfo;
        return convertToProduct(product as Farm2HandProduct, farmerInfo);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
  },

  // Get products by farmer
  async getProductsByFarmer(farmerId: number): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('Farm2Hand_product')
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .eq('product_owner', farmerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }

      if (!products) {
        return [];
      }

      return products.map(product => {
        const farmerInfo = product.Farm2Hand_user as FarmerInfo;
        return convertToProduct(product as Farm2HandProduct, farmerInfo);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
  },

  // Search products
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      const { data: products, error } = await supabase
        .from('Farm2Hand_product')
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .or(`product_name.ilike.%${searchTerm}%,product_description.ilike.%${searchTerm}%,product_tag.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการค้นหาสินค้า');
      }

      if (!products) {
        return [];
      }

      return products.map(product => {
        const farmerInfo = product.Farm2Hand_user as FarmerInfo;
        return convertToProduct(product as Farm2HandProduct, farmerInfo);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการค้นหาสินค้า');
    }
  },

  // Get product by ID
  async getProductById(productId: number): Promise<Product | null> {
    try {
      const { data: product, error } = await supabase
        .from('Farm2Hand_product')
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .eq('id', productId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }

      const farmerInfo = product.Farm2Hand_user as FarmerInfo;
      return convertToProduct(product as Farm2HandProduct, farmerInfo);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
    }
  },

  // Create new product
  async createProduct(farmerId: number, productData: CreateProductData): Promise<Product> {
    try {
      const dbData = convertCreateDataToDb(farmerId, productData);

      const { data: insertedProduct, error } = await supabase
        .from('Farm2Hand_product')
        .insert([dbData])
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw new Error('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
      }

      const farmerInfo = insertedProduct.Farm2Hand_user as FarmerInfo;
      return convertToProduct(insertedProduct as Farm2HandProduct, farmerInfo);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการเพิ่มสินค้า');
    }
  },

  // Update product
  async updateProduct(productId: number, farmerId: number, updates: UpdateProductData): Promise<Product> {
    try {
      // Verify ownership
      const { data: existingProduct, error: ownershipError } = await supabase
        .from('Farm2Hand_product')
        .select('product_owner')
        .eq('id', productId)
        .single();

      if (ownershipError) {
        console.error('Ownership check error:', ownershipError);
        throw new Error('ไม่พบสินค้าที่ต้องการแก้ไข');
      }

      if (existingProduct.product_owner !== farmerId) {
        throw new Error('คุณไม่มีสิทธิ์แก้ไขสินค้านี้');
      }

      // Prepare update data
      const updateData: Partial<Farm2HandProduct> = {
        updated_at: new Date().toISOString()
      };

      if (updates.name !== undefined) updateData.product_name = updates.name;
      if (updates.price !== undefined) updateData.product_price = updates.price;
      if (updates.unit !== undefined) updateData.product_unit = updates.unit;
      if (updates.category !== undefined) updateData.product_category = updates.category;
      if (updates.description !== undefined) updateData.product_description = updates.description;
      if (updates.image !== undefined) updateData.product_image = updates.image;
      if (updates.stock !== undefined) {
        updateData.product_stock = updates.stock;
        updateData.in_stock = updates.stock > 0;
      }
      if (updates.organic !== undefined) updateData.product_organic = updates.organic;
      if (updates.discount !== undefined) updateData.product_discount = updates.discount > 0 ? updates.discount : null;
      if (updates.tags !== undefined) updateData.product_tag = updates.tags.length > 0 ? updates.tags.join(',') : null;
      if (updates.inStock !== undefined) updateData.in_stock = updates.inStock;

      const { data: updatedProduct, error } = await supabase
        .from('Farm2Hand_product')
        .update(updateData)
        .eq('id', productId)
        .select(`
          *,
          Farm2Hand_user!Farm2Hand_product_product_owner_fkey (
            id,
            Name,
            Address
          )
        `)
        .single();

      if (error) {
        console.error('Update error:', error);
        throw new Error('เกิดข้อผิดพลาดในการอัปเดตสินค้า');
      }

      const farmerInfo = updatedProduct.Farm2Hand_user as FarmerInfo;
      return convertToProduct(updatedProduct as Farm2HandProduct, farmerInfo);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการอัปเดตสินค้า');
    }
  },

  // Delete product
  async deleteProduct(productId: number, farmerId: number): Promise<void> {
    try {
      // Verify ownership
      const { data: existingProduct, error: ownershipError } = await supabase
        .from('Farm2Hand_product')
        .select('product_owner')
        .eq('id', productId)
        .single();

      if (ownershipError) {
        console.error('Ownership check error:', ownershipError);
        throw new Error('ไม่พบสินค้าที่ต้องการลบ');
      }

      if (existingProduct.product_owner !== farmerId) {
        throw new Error('คุณไม่มีสิทธิ์ลบสินค้านี้');
      }

      const { error } = await supabase
        .from('Farm2Hand_product')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error('Delete error:', error);
        throw new Error('เกิดข้อผิดพลาดในการลบสินค้า');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการลบสินค้า');
    }
  },

  // Get available categories
  async getCategories(): Promise<string[]> {
    try {
      const { data: categories, error } = await supabase
        .from('Farm2Hand_product')
        .select('product_category')
        .not('product_category', 'is', null);

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่');
      }

      if (!categories) {
        return [];
      }

      // Get unique categories
      const uniqueCategories = [...new Set(categories.map(item => item.product_category).filter(Boolean))];
      return uniqueCategories;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่');
    }
  },

  // Get categories with product counts
  async getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
    try {
      const { data: categoryCounts, error } = await supabase
        .from('Farm2Hand_product')
        .select('product_category')
        .not('product_category', 'is', null);

      if (error) {
        console.error('Database error:', error);
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่');
      }

      if (!categoryCounts) {
        return [];
      }

      // Count products by category
      const categoryCountMap = categoryCounts.reduce((acc, item) => {
        const category = item.product_category;
        if (category) {
          acc[category] = (acc[category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Define category icons and colors
      const categoryConfig: Record<string, { icon: string; color: string }> = {
        'ผลไม้': { icon: '🍎', color: 'bg-red-100 text-red-700' },
        'ผัก': { icon: '🥕', color: 'bg-orange-100 text-orange-700' },
        'ผักใบเขียว': { icon: '🥬', color: 'bg-green-100 text-green-700' },
        'ข้าว': { icon: '🌾', color: 'bg-yellow-100 text-yellow-700' },
        'ไข่': { icon: '🥚', color: 'bg-blue-100 text-blue-700' },
        'ผลไม้นอกฤดู': { icon: '🍓', color: 'bg-pink-100 text-pink-700' },
        'สมุนไพร': { icon: '🌿', color: 'bg-emerald-100 text-emerald-700' },
        'อื่นๆ': { icon: '📦', color: 'bg-gray-100 text-gray-700' }
      };

      // Convert to CategoryWithCount array
      const categoriesWithCounts: CategoryWithCount[] = Object.entries(categoryCountMap).map(([name, count]) => ({
        name,
        count,
        icon: categoryConfig[name]?.icon || '📦',
        color: categoryConfig[name]?.color || 'bg-gray-100 text-gray-700'
      }));

      // Sort by count (descending) then by name
      categoriesWithCounts.sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });

      return categoriesWithCounts;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่');
    }
  }
};