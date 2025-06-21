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
  }
};