import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Star, Package, TrendingUp, DollarSign, Users, Edit3, Save, X, Camera, Plus, Heart, UserPlus, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { customerService, type CustomerData } from '../services/customerService';

interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  farmName: string;
  farmSize: string;
  joinDate: string;
  rating: number;
  totalSales: number;
  activeProducts: number;
  followers: number;
  bio: string;
  specialties: string[];
  certifications: string[];
  avatar: string;
  coverImage: string;
}

const mockProducts = [
  {
    id: 1,
    name: 'ผักกาดหอมออร์แกนิค',
    price: 45,
    unit: 'ถุง',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300',
    stock: 25,
    sold: 150
  },
  {
    id: 2,
    name: 'มะเขือเทศราชินี',
    price: 80,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300',
    stock: 30,
    sold: 89
  },
  {
    id: 3,
    name: 'แครอทเบบี้',
    price: 95,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
    stock: 15,
    sold: 67
  }
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loadingCustomerData, setLoadingCustomerData] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmName: user?.farmName || '',
  });

  // Load customer data for customers
  useEffect(() => {
    if (user?.role === 'customer') {
      loadCustomerData();
    }
  }, [user]);

  const loadCustomerData = async () => {
    if (!user) return;
    
    setLoadingCustomerData(true);
    try {
      const data = await customerService.getCustomerData(user.id);
      setCustomerData(data);
    } catch (error) {
      console.error('Failed to load customer data:', error);
    } finally {
      setLoadingCustomerData(false);
    }
  };

  // Mock profile data based on user role
  const mockFarmerProfile: FarmerProfile = {
    id: user?.id?.toString() || '1',
    name: user?.name || 'นายสมชาย ใจดี',
    email: user?.email || 'farmer@farm2hand.com',
    phone: user?.phone || '081-234-5678',
    location: user?.location || 'จ.เชียงใหม่, อ.แม่ริม',
    farmName: user?.farmName || 'สวนออร์แกนิคสมชาย',
    farmSize: '15 ไร่',
    joinDate: user?.createdAt?.toISOString() || '2023-01-15',
    rating: 4.8,
    totalSales: 125000,
    activeProducts: 12,
    followers: 234,
    bio: 'เกษตรกรรุ่นใหม่ที่มุ่งมั่นในการปลูกผักออร์แกนิคคุณภาพสูง ด้วยประสบการณ์กว่า 10 ปี ในการทำเกษตรแบบยั่งยืน',
    specialties: ['ผักใบเขียว', 'ผลไม้ตามฤดูกาล', 'สมุนไพร'],
    certifications: ['ออร์แกนิค', 'GAP', 'เกษตรปลอดภัย'],
    avatar: user?.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    coverImage: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1200'
  };

  const profile = mockFarmerProfile;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      farmName: profile.farmName,
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditedProfile({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      farmName: profile.farmName,
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveFavorite = async (favoriteItem: string) => {
    if (!user) return;
    
    try {
      const updatedData = await customerService.removeFavorite(user.id, favoriteItem);
      setCustomerData(updatedData);
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const handleUnfollowFarmer = async (farmerName: string) => {
    if (!user) return;
    
    try {
      const updatedData = await customerService.unfollowFarmer(user.id, farmerName);
      setCustomerData(updatedData);
    } catch (error) {
      console.error('Failed to unfollow farmer:', error);
    }
  };

  const currentProfile = isEditing ? { ...profile, ...editedProfile } : profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-beige to-light-beige">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Cover Image */}
        <div className="relative h-64 bg-gradient-to-r from-nature-green to-nature-dark-green rounded-xl overflow-hidden mb-6 shadow-lg">
          <img
            src={currentProfile.coverImage}
            alt="Farm Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-nature-dark-green rounded-lg transition-colors duration-200 shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span className="font-medium">แก้ไขโปรไฟล์</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-nature-green hover:bg-nature-dark-green text-white rounded-lg transition-colors duration-200 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span className="font-medium">บันทึก</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 shadow-md"
                >
                  <X className="w-4 h-4" />
                  <span className="font-medium">ยกเลิก</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <img
                  src={currentProfile.avatar}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-nature-green hover:bg-nature-dark-green text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-4">
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold text-nature-dark-green bg-transparent border-b-2 border-nature-green focus:outline-none focus:border-nature-dark-green"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-nature-dark-green">{currentProfile.name}</h1>
                )}
                
                {user?.role === 'farmer' && (
                  <>
                    {isEditing ? (
                      <input
                        type="text"
                        value={currentProfile.farmName}
                        onChange={(e) => handleInputChange('farmName', e.target.value)}
                        className="text-lg text-nature-green bg-transparent border-b border-nature-green/50 focus:outline-none focus:border-nature-green mt-1"
                      />
                    ) : (
                      <p className="text-lg text-nature-green font-medium">{currentProfile.farmName}</p>
                    )}
                  </>
                )}
              </div>

              {/* Quick Stats - Only show for farmers */}
              {user?.role === 'farmer' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-sun-yellow text-sun-yellow" />
                      <span className="font-bold text-nature-dark-green">{currentProfile.rating}</span>
                    </div>
                    <p className="text-xs text-cool-gray">คะแนน</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-nature-dark-green">฿{(currentProfile.totalSales / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-cool-gray">ยอดขาย</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-nature-dark-green">{currentProfile.activeProducts}</p>
                    <p className="text-xs text-cool-gray">สินค้า</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-nature-dark-green">{currentProfile.followers}</p>
                    <p className="text-xs text-cool-gray">ผู้ติดตาม</p>
                  </div>
                </div>
              )}

              {/* Customer Stats */}
              {user?.role === 'customer' && customerData && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      <span className="font-bold text-nature-dark-green">{customerData.favorites.length}</span>
                    </div>
                    <p className="text-xs text-cool-gray">รายการโปรด</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <UserPlus className="w-4 h-4 text-nature-green" />
                      <span className="font-bold text-nature-dark-green">{customerData.following.length}</span>
                    </div>
                    <p className="text-xs text-cool-gray">กำลังติดตาม</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Calendar className="w-4 h-4 text-nature-brown" />
                      <span className="font-bold text-nature-dark-green text-xs">
                        {new Date(customerData.createdAt).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-cool-gray">เริ่มใช้งาน</p>
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-cool-gray">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentProfile.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{currentProfile.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{currentProfile.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>เข้าร่วมเมื่อ {new Date(currentProfile.joinDate).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio - Only show for farmers */}
            {user?.role === 'farmer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <h2 className="text-xl font-semibold text-nature-dark-green mb-4">เกี่ยวกับฟาร์ม</h2>
                <p className="text-nature-dark-green leading-relaxed">{currentProfile.bio}</p>
              </div>
            )}

            {/* Customer Favorites */}
            {user?.role === 'customer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <h2 className="text-xl font-semibold text-nature-dark-green mb-4">รายการโปรด</h2>
                
                {loadingCustomerData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-nature-green" />
                    <span className="ml-2 text-cool-gray">กำลังโหลด...</span>
                  </div>
                ) : customerData && customerData.favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {customerData.favorites.map((favorite, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-soft-beige/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          <span className="text-nature-dark-green font-medium">{favorite}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(favorite)}
                          className="text-cool-gray hover:text-red-500 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-cool-gray/30 mx-auto mb-3" />
                    <p className="text-cool-gray">ยังไม่มีรายการโปรด</p>
                    <p className="text-sm text-cool-gray/70">เริ่มเลือกสินค้าที่คุณชอบเพื่อเพิ่มในรายการโปรด</p>
                  </div>
                )}
              </div>
            )}

            {/* Customer Following */}
            {user?.role === 'customer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <h2 className="text-xl font-semibold text-nature-dark-green mb-4">เกษตรกรที่ติดตาม</h2>
                
                {loadingCustomerData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-nature-green" />
                    <span className="ml-2 text-cool-gray">กำลังโหลด...</span>
                  </div>
                ) : customerData && customerData.following.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {customerData.following.map((farmerName, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-nature-green/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-nature-green" />
                          <span className="text-nature-dark-green font-medium">{farmerName}</span>
                        </div>
                        <button
                          onClick={() => handleUnfollowFarmer(farmerName)}
                          className="text-cool-gray hover:text-red-500 transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-cool-gray/30 mx-auto mb-3" />
                    <p className="text-cool-gray">ยังไม่ได้ติดตามเกษตรกรใดๆ</p>
                    <p className="text-sm text-cool-gray/70">ค้นหาและติดตามเกษตรกรที่คุณสนใจ</p>
                  </div>
                )}
              </div>
            )}

            {/* Specialties and Certifications - Only show for farmers */}
            {user?.role === 'farmer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Specialties */}
                  <div>
                    <h3 className="text-lg font-semibold text-nature-dark-green mb-3">ความเชี่ยวชาญ</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-nature-green/10 text-nature-dark-green rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-nature-dark-green mb-3">การรับรอง</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-sun-yellow/20 text-nature-dark-green rounded-full text-sm font-medium border border-sun-yellow/30"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products - Only show for farmers */}
            {user?.role === 'farmer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-nature-dark-green">สินค้าของฉัน</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-nature-green hover:bg-nature-dark-green text-white rounded-lg transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">เพิ่มสินค้า</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProducts.map((product) => (
                    <div key={product.id} className="border border-border-beige rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-nature-dark-green mb-1">{product.name}</h4>
                        <p className="text-fresh-orange font-bold">฿{product.price}/{product.unit}</p>
                        <div className="flex justify-between text-xs text-cool-gray mt-2">
                          <span>คงเหลือ: {product.stock}</span>
                          <span>ขายแล้ว: {product.sold}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
              <h3 className="text-lg font-semibold text-nature-dark-green mb-4">
                {user?.role === 'farmer' ? 'ข้อมูลฟาร์ม' : 'ข้อมูลผู้ใช้'}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-cool-gray">ประเภทผู้ใช้</span>
                  <p className="font-medium text-nature-dark-green">
                    {user?.role === 'farmer' ? 'เกษตรกร' : 'ลูกค้า'}
                  </p>
                </div>
                
                {user?.role === 'farmer' && (
                  <div>
                    <span className="text-sm text-cool-gray">ขนาดฟาร์ม</span>
                    <p className="font-medium text-nature-dark-green">{profile.farmSize}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm text-cool-gray">สถานะการยืนยัน</span>
                  <p className={`font-medium ${user?.isVerified ? 'text-nature-green' : 'text-fresh-orange'}`}>
                    {user?.isVerified ? 'ยืนยันแล้ว' : 'รอการยืนยัน'}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Stats - Only show for farmers */}
            {user?.role === 'farmer' && (
              <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
                <h3 className="text-lg font-semibold text-nature-dark-green mb-4">สถิติรายละเอียด</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-sun-yellow text-sun-yellow" />
                      <span className="text-cool-gray">คะแนนเฉลี่ย</span>
                    </div>
                    <span className="font-bold text-nature-dark-green">{currentProfile.rating}/5.0</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-fresh-orange" />
                      <span className="text-cool-gray">ยอดขายรวม</span>
                    </div>
                    <span className="font-bold text-nature-dark-green">฿{currentProfile.totalSales.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-nature-green" />
                      <span className="text-cool-gray">สินค้าที่ขาย</span>
                    </div>
                    <span className="font-bold text-nature-dark-green">{currentProfile.activeProducts}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-nature-brown" />
                      <span className="text-cool-gray">ผู้ติดตาม</span>
                    </div>
                    <span className="font-bold text-nature-dark-green">{currentProfile.followers}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-border-beige p-6">
              <h3 className="text-lg font-semibold text-nature-dark-green mb-4">การจัดการ</h3>
              
              <div className="space-y-3">
                {user?.role === 'farmer' ? (
                  <>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <TrendingUp className="w-5 h-5 text-nature-green" />
                      <span className="text-nature-dark-green">ดูสถิติการขาย</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <Package className="w-5 h-5 text-fresh-orange" />
                      <span className="text-nature-dark-green">จัดการสินค้า</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <Users className="w-5 h-5 text-nature-brown" />
                      <span className="text-nature-dark-green">ดูผู้ติดตาม</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <ShoppingBag className="w-5 h-5 text-fresh-orange" />
                      <span className="text-nature-dark-green">ประวัติการสั่งซื้อ</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-nature-dark-green">รายการโปรด ({customerData?.favorites.length || 0})</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-soft-beige/30 rounded-lg transition-colors duration-200">
                      <UserPlus className="w-5 h-5 text-nature-green" />
                      <span className="text-nature-dark-green">เกษตรกรที่ติดตาม ({customerData?.following.length || 0})</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};