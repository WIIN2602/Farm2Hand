import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, ShoppingCart, Heart, Package, Grid, List, ChevronDown, X, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../services/customerService';

interface Product {
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
}

interface FilterOptions {
  category: string;
  priceRange: [number, number];
  location: string;
  organic: boolean;
  inStock: boolean;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'มะม่วงน้ำดอกไม้',
    price: 120,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายสมชาย ใจดี',
    farmerId: 1,
    location: 'จ.เชียงใหม่',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    category: 'ผลไม้',
    description: 'มะม่วงน้ำดอกไม้สดใหม่ หวานฉ่ำ เก็บจากต้นในวันเดียวกัน',
    organic: true,
    discount: 10,
    tags: ['หวาน', 'สดใหม่', 'ออร์แกนิค']
  },
  {
    id: 2,
    name: 'ผักกาดหอมออร์แกนิค',
    price: 45,
    unit: 'ถุง',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายวิชัย ผักสด',
    farmerId: 2,
    location: 'จ.เลย',
    rating: 4.9,
    reviews: 203,
    inStock: true,
    category: 'ผักใบเขียว',
    description: 'ผักกาดหอมปลอดสารพิษ ปลูกด้วยวิธีธรรมชาติ',
    organic: true,
    tags: ['ปลอดสารพิษ', 'สดใหม่', 'ออร์แกนิค']
  },
  {
    id: 3,
    name: 'มะเขือเทศราชินี',
    price: 80,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายประสิทธิ์ เกษตรกร',
    farmerId: 3,
    location: 'จ.นครปฐม',
    rating: 4.7,
    reviews: 89,
    inStock: true,
    category: 'ผัก',
    description: 'มะเขือเทศราชินีสีแดงสด รสชาติหวานอมเปรี้ยว',
    organic: false,
    tags: ['หวาน', 'สดใหม่', 'คุณภาพดี']
  },
  {
    id: 4,
    name: 'กล้วยหอมทอง',
    price: 60,
    unit: 'หวี',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายสมชาย ใจดี',
    farmerId: 1,
    location: 'จ.เชียงใหม่',
    rating: 4.6,
    reviews: 124,
    inStock: true,
    category: 'ผลไม้',
    description: 'กล้วยหอมทองหวานหอม เนื้อนุ่ม สุกพอดี',
    organic: false,
    discount: 5,
    tags: ['หวาน', 'สุกพอดี', 'หอม']
  },
  {
    id: 5,
    name: 'แครอทเบบี้',
    price: 95,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายวิชัย ผักสด',
    farmerId: 2,
    location: 'จ.เลย',
    rating: 4.8,
    reviews: 167,
    inStock: true,
    category: 'ผัก',
    description: 'แครอทเบบี้หวานกรอบ ขนาดเล็กน่ารัก เหมาะสำหรับเด็ก',
    organic: true,
    tags: ['หวาน', 'กรอบ', 'ออร์แกนิค']
  },
  {
    id: 6,
    name: 'ข้าวหอมมะลิ',
    price: 45,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายประสิทธิ์ เกษตรกร',
    farmerId: 3,
    location: 'จ.นครปฐม',
    rating: 4.9,
    reviews: 245,
    inStock: true,
    category: 'ข้าว',
    description: 'ข้าวหอมมะลิแท้ 100% หอมหวาน เก็บใหม่',
    organic: false,
    tags: ['หอม', 'หวาน', 'เก็บใหม่']
  },
  {
    id: 7,
    name: 'ไข่ไก่สด',
    price: 120,
    unit: 'แผง',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายสมชาย ใจดี',
    farmerId: 1,
    location: 'จ.เชียงใหม่',
    rating: 4.7,
    reviews: 98,
    inStock: true,
    category: 'ไข่',
    description: 'ไข่ไก่สดใหม่ เก็บในวันเดียวกัน ไก่เลี้ยงแบบปล่อย',
    organic: true,
    tags: ['สดใหม่', 'ไก่ปล่อย', 'ออร์แกนิค']
  },
  {
    id: 8,
    name: 'ส้มโอขาวน้ำหวาน',
    price: 150,
    unit: 'ลูก',
    image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายวิชัย ผักสด',
    farmerId: 2,
    location: 'จ.เลย',
    rating: 4.9,
    reviews: 134,
    inStock: false,
    category: 'ผลไม้',
    description: 'ส้มโอขาวน้ำหวาน เนื้อฉ่ำ หวานเข้มข้น',
    organic: false,
    tags: ['หวาน', 'ฉ่ำ', 'คุณภาพดี']
  },
  {
    id: 9,
    name: 'ผักบุ้งจีน',
    price: 25,
    unit: 'ถุง',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายวิชัย ผักสด',
    farmerId: 2,
    location: 'จ.เลย',
    rating: 4.6,
    reviews: 76,
    inStock: true,
    category: 'ผักใบเขียว',
    description: 'ผักบุ้งจีนสดใหม่ เก็บในตอนเช้า กรอบหวาน',
    organic: true,
    tags: ['สดใหม่', 'กรอบ', 'ออร์แกนิค']
  },
  {
    id: 10,
    name: 'มันฝรั่งญี่ปุ่น',
    price: 85,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=400',
    farmer: 'นายประสิทธิ์ เกษตรกร',
    farmerId: 3,
    location: 'จ.นครปฐม',
    rating: 4.8,
    reviews: 112,
    inStock: true,
    category: 'ผัก',
    description: 'มันฝรั่งญี่ปุ่นหวานนุ่ม เหมาะทำอาหารทุกประเภท',
    organic: false,
    discount: 15,
    tags: ['หวาน', 'นุ่ม', 'คุณภาพดี']
  }
];

const categories = ['ทั้งหมด', 'ผลไม้', 'ผัก', 'ผักใบเขียว', 'ข้าว', 'ไข่'];
const locations = ['ทั้งหมด', 'จ.เชียงใหม่', 'จ.เลย', 'จ.นครปฐม', 'จ.ขอนแก่น', 'จ.ระยอง'];

export const ProductsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'ทั้งหมด',
    priceRange: [0, 1000],
    location: 'ทั้งหมด',
    organic: false,
    inStock: true,
    sortBy: 'name'
  });

  // Load user favorites
  useEffect(() => {
    if (isAuthenticated && user?.role === 'customer') {
      loadUserFavorites();
    }
  }, [isAuthenticated, user]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filters.category !== 'ทั้งหมด') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Location filter
    if (filters.location !== 'ทั้งหมด') {
      filtered = filtered.filter(product => product.location === filters.location);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Organic filter
    if (filters.organic) {
      filtered = filtered.filter(product => product.organic);
    }

    // In stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, filters]);

  const loadUserFavorites = async () => {
    if (!user) return;
    
    try {
      const customerData = await customerService.getCustomerData(user.id);
      if (customerData) {
        setFavorites(customerData.favorites);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const handleAddToFavorites = async (productName: string) => {
    if (!user || user.role !== 'customer') return;
    
    setLoading(true);
    try {
      await customerService.addFavorite(user.id, productName);
      setFavorites(prev => [...prev, productName]);
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productName: string) => {
    if (!user || user.role !== 'customer') return;
    
    setLoading(true);
    try {
      await customerService.removeFavorite(user.id, productName);
      setFavorites(prev => prev.filter(fav => fav !== productName));
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      category: 'ทั้งหมด',
      priceRange: [0, 1000],
      location: 'ทั้งหมด',
      organic: false,
      inStock: true,
      sortBy: 'name'
    });
    setSearchTerm('');
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const isFavorite = favorites.includes(product.name);
    const discountedPrice = product.discount 
      ? product.price * (1 - product.discount / 100)
      : product.price;

    return (
      <div className={`bg-white rounded-xl shadow-sm border border-border-beige overflow-hidden hover:shadow-lg transition-all duration-300 ${
        !product.inStock ? 'opacity-75' : ''
      }`}>
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.organic && (
              <span className="px-2 py-1 bg-nature-green text-white text-xs font-medium rounded-full">
                ออร์แกนิค
              </span>
            )}
            {product.discount && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium bg-red-500 px-3 py-1 rounded-full">
                สินค้าหมด
              </span>
            </div>
          )}

          {/* Favorite Button */}
          {isAuthenticated && user?.role === 'customer' && (
            <button
              onClick={() => isFavorite ? handleRemoveFromFavorites(product.name) : handleAddToFavorites(product.name)}
              disabled={loading}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-cool-gray" />
              ) : (
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-cool-gray'}`} />
              )}
            </button>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-nature-dark-green mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            {product.discount ? (
              <>
                <span className="text-lg font-bold text-fresh-orange">
                  ฿{discountedPrice.toFixed(0)}
                </span>
                <span className="text-sm text-cool-gray line-through">
                  ฿{product.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-fresh-orange">
                ฿{product.price}
              </span>
            )}
            <span className="text-sm text-cool-gray">/{product.unit}</span>
          </div>

          {/* Farmer & Location */}
          <div className="text-sm text-cool-gray mb-2">
            <p className="truncate">{product.farmer}</p>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{product.location}</span>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-sun-yellow text-sun-yellow" />
              <span className="text-sm font-medium text-cool-gray">
                {product.rating} ({product.reviews})
              </span>
            </div>
            <span className="text-xs px-2 py-1 bg-nature-green/10 text-nature-dark-green rounded-full">
              {product.category}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-soft-beige text-nature-brown rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Button */}
          <button
            disabled={!product.inStock}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              product.inStock
                ? 'bg-nature-green hover:bg-nature-dark-green text-white'
                : 'bg-cool-gray/20 text-cool-gray cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'เพิ่มในตะกร้า' : 'สินค้าหมด'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige to-light-beige">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-nature-dark-green mb-2">
            สินค้าเกษตร
          </h1>
          <p className="text-cool-gray">
            ค้นพบสินค้าเกษตรคุณภาพดีจากเกษตรกรทั่วประเทศ
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cool-gray" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาสินค้า เกษตรกร หรือหมวดหมู่..."
                className="w-full pl-10 pr-4 py-3 border border-border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 border border-border-beige rounded-lg hover:bg-soft-beige/30 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">ตัวกรอง</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-border-beige rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-nature-green text-white'
                      : 'bg-white text-cool-gray hover:bg-soft-beige/30'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-nature-green text-white'
                      : 'bg-white text-cool-gray hover:bg-soft-beige/30'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-border-beige">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-nature-dark-green mb-2">
                    หมวดหมู่
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-nature-dark-green mb-2">
                    จังหวัด
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-nature-dark-green mb-2">
                    เรียงตาม
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                    className="w-full px-3 py-2 border border-border-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-nature-green"
                  >
                    <option value="name">ชื่อสินค้า</option>
                    <option value="price">ราคา</option>
                    <option value="rating">คะแนน</option>
                    <option value="newest">ใหม่ล่าสุด</option>
                  </select>
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-nature-dark-green mb-2">
                    ตัวเลือก
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.organic}
                        onChange={(e) => setFilters(prev => ({ ...prev, organic: e.target.checked }))}
                        className="mr-2 text-nature-green focus:ring-nature-green"
                      />
                      <span className="text-sm">ออร์แกนิคเท่านั้น</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="mr-2 text-nature-green focus:ring-nature-green"
                      />
                      <span className="text-sm">มีสินค้าเท่านั้น</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-cool-gray hover:text-nature-dark-green transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  ล้างตัวกรอง
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-cool-gray">
            พบสินค้า {filteredProducts.length} รายการ
            {searchTerm && ` สำหรับ "${searchTerm}"`}
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm text-cool-gray">
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{filteredProducts.filter(p => p.inStock).length} มีสินค้า</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{filteredProducts.filter(p => p.organic).length} ออร์แกนิค</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-cool-gray/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-cool-gray/50" />
            </div>
            <h3 className="text-lg font-semibold text-nature-dark-green mb-2">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-cool-gray mb-4">
              ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูสินค้าเพิ่มเติม
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-nature-green hover:bg-nature-dark-green text-white rounded-lg font-medium transition-colors duration-200"
            >
              ดูสินค้าทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
};