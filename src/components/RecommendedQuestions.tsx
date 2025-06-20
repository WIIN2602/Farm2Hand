import React, { useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, HelpCircle, Package, ArrowLeft, Star, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';

interface RecommendedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const questions = [
  {
    text: 'ดูสินค้า',
    icon: ShoppingBag,
    color: 'bg-nature-green hover:bg-nature-dark-green'
  },
  {
    text: 'ค้นหาสินค้า',
    icon: Search,
    color: 'bg-fresh-orange hover:bg-fresh-orange-hover'
  },
  {
    text: 'สั่งซื้อ',
    icon: ShoppingCart,
    color: 'bg-nature-brown hover:bg-nature-brown/90'
  },
  {
    text: 'ถามวิธีซื้อ',
    icon: HelpCircle,
    color: 'bg-sun-yellow hover:bg-sun-yellow/90 text-nature-dark-green'
  },
  {
    text: 'ติดตามออเดอร์',
    icon: Package,
    color: 'bg-cool-gray hover:bg-cool-gray/90'
  }
];

const productCategories = [
  {
    emoji: '🥬',
    name: 'Fresh vegetables',
    description: 'ผักสดใหม่จากเกษตรกร'
  },
  {
    emoji: '🍌',
    name: 'Fruits',
    description: 'ผลไม้หวานฉ่ำ'
  },
  {
    emoji: '🌾',
    name: 'Rice',
    description: 'ข้าวคุณภาพดี'
  },
  {
    emoji: '🥚',
    name: 'Chicken eggs',
    description: 'ไข่ไก่สดใหม่'
  },
  {
    emoji: '❄️',
    name: 'Out-of-season products',
    description: 'สินค้านอกฤดูกาล'
  }
];

// Category-specific product recommendations
const categoryProducts = {
  'Fresh vegetables': [
    { name: 'Kale', thai: 'คะน้า', price: 35, unit: 'ถุง', image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Morning glory', thai: 'ผักบุ้ง', price: 25, unit: 'ถุง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Chinese water spinach', thai: 'ผักกาดขาว', price: 30, unit: 'ถุง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Coriander', thai: 'ผักชี', price: 20, unit: 'ถุง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Spring Onion', thai: 'ต้นหอม', price: 15, unit: 'ถุง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Sweet basil', thai: 'โหระพา', price: 18, unit: 'ถุง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ],
  'Fruits': [
    { name: 'Mango', thai: 'มะม่วง', price: 120, unit: 'กก.', image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Banana', thai: 'กล้วย', price: 60, unit: 'หวี', image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Papaya', thai: 'มะละกอ', price: 40, unit: 'ลูก', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Dragon fruit', thai: 'แก้วมังกร', price: 80, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Pineapple', thai: 'สับปะรด', price: 50, unit: 'ลูก', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Coconut', thai: 'มะพร้าว', price: 25, unit: 'ลูก', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ],
  'Rice': [
    { name: 'Jasmine rice', thai: 'ข้าวหอมมะลิ', price: 45, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Brown rice', thai: 'ข้าวกล้อง', price: 55, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Sticky rice', thai: 'ข้าวเหนียว', price: 50, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Red rice', thai: 'ข้าวแดง', price: 65, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Black rice', thai: 'ข้าวดำ', price: 75, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Organic rice', thai: 'ข้าวออร์แกนิค', price: 85, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ],
  'Chicken eggs': [
    { name: 'Free-range eggs', thai: 'ไข่ไก่เลี้ยงแบบปล่อย', price: 120, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Organic eggs', thai: 'ไข่ไก่ออร์แกนิค', price: 150, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Farm fresh eggs', thai: 'ไข่ไก่สดจากฟาร์ม', price: 100, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Brown eggs', thai: 'ไข่ไก่สีน้ำตาล', price: 110, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Duck eggs', thai: 'ไข่เป็ด', price: 80, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Quail eggs', thai: 'ไข่นกกระทา', price: 60, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ],
  'Out-of-season products': [
    { name: 'Winter strawberries', thai: 'สตรอเบอร์รี่นอกฤดู', price: 200, unit: 'กล่อง', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Summer durian', thai: 'ทุเรียนนอกฤดู', price: 300, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Winter longan', thai: 'ลำไยนอกฤดู', price: 180, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Summer lychee', thai: 'ลิ้นจี่นอกฤดู', price: 220, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Winter rambutan', thai: 'เงาะนอกฤดู', price: 160, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Summer mangosteen', thai: 'มังคุดนอกฤดู', price: 250, unit: 'กก.', image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ]
};

const mockProducts = [
  {
    id: 1,
    name: 'มะม่วงน้ำดอกไม้',
    price: 120,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'สวนป้าสมใจ',
    location: 'จ.เชียงใหม่',
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: 'ผักกาดหอมออร์แกนิค',
    price: 45,
    unit: 'ถุง',
    image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'ฟาร์มสีเขียว',
    location: 'จ.นครปฐม',
    rating: 4.9,
    inStock: true
  },
  {
    id: 3,
    name: 'มะเขือเทศราชินี',
    price: 80,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'เกษตรกรรุ่นใหม่',
    location: 'จ.เพชรบุรี',
    rating: 4.7,
    inStock: false
  },
  {
    id: 4,
    name: 'กล้วยหอมทอง',
    price: 60,
    unit: 'หวี',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'สวนลุงประสิทธิ์',
    location: 'จ.ระยอง',
    rating: 4.6,
    inStock: true
  },
  {
    id: 5,
    name: 'แครอทเบบี้',
    price: 95,
    unit: 'กก.',
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'ฟาร์มคุณแม่',
    location: 'จ.เลย',
    rating: 4.8,
    inStock: true
  },
  {
    id: 6,
    name: 'ส้มโอขาวน้ำหวาน',
    price: 150,
    unit: 'ลูก',
    image: 'https://images.pexels.com/photos/1414130/pexels-photo-1414130.jpeg?auto=compress&cs=tinysrgb&w=300',
    farmer: 'สวนส้มโอนครปฐม',
    location: 'จ.นครปฐม',
    rating: 4.9,
    inStock: false
  }
];

// Available products for adding to cart
const availableProducts = [
  { id: 7, name: 'ข้าวหอมมะลิ', price: 45, unit: 'กก.', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 8, name: 'ไข่ไก่สด', price: 120, unit: 'แผง', image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 9, name: 'มะเขือเทศ', price: 80, unit: 'กก.', image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 10, name: 'แครอท', price: 95, unit: 'กก.', image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300' }
];

// Payment methods
const paymentMethods = [
  {
    id: 'credit_card',
    name: 'บัตรเครดิต/เดบิต',
    description: 'Visa, Mastercard, JCB',
    icon: CreditCard
  },
  {
    id: 'bank_transfer',
    name: 'โอนผ่านธนาคาร',
    description: 'ธนาคารไทยพาณิชย์, กสิกรไทย, กรุงเทพ',
    icon: () => (
      <div className="w-5 h-5 bg-nature-green rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">฿</span>
      </div>
    )
  },
  {
    id: 'cod',
    name: 'เก็บเงินปลายทาง',
    description: 'ชำระเมื่อได้รับสินค้า',
    icon: () => (
      <div className="w-5 h-5 bg-fresh-orange rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">$</span>
      </div>
    )
  }
];

// Mock order tracking data
const mockOrders = [
  {
    id: 'ORD-2024-001',
    status: 'delivered',
    items: [
      { name: 'มะม่วงน้ำดอกไม้', quantity: 2, price: 120 },
      { name: 'ผักกาดหอมออร์แกนิค', quantity: 3, price: 45 }
    ],
    total: 375,
    orderDate: '2024-01-15',
    deliveryDate: '2024-01-17',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-2024-002',
    status: 'shipping',
    items: [
      { name: 'กล้วยหอมทอง', quantity: 1, price: 60 },
      { name: 'แครอทเบบี้', quantity: 2, price: 95 }
    ],
    total: 250,
    orderDate: '2024-01-18',
    estimatedDelivery: '2024-01-20',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-2024-003',
    status: 'pending_payment',
    items: [
      { name: 'ข้าวหอมมะลิ', quantity: 5, price: 45 }
    ],
    total: 225,
    orderDate: '2024-01-19',
    paymentStatus: 'pending'
  }
];

export const RecommendedQuestions: React.FC<RecommendedQuestionsProps> = ({ onQuestionClick }) => {
  const [showProducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showCategoryProducts, setShowCategoryProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  // Cart state management
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'มะม่วงน้ำดอกไม้', price: 120, unit: 'กก.', quantity: 2, image: 'https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 2, name: 'ผักกาดหอมออร์แกนิค', price: 45, unit: 'ถุง', quantity: 3, image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: 4, name: 'กล้วยหอมทอง', price: 60, unit: 'หวี', quantity: 1, image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300' }
  ]);

  const handleQuestionClick = (questionText: string) => {
    if (questionText === 'ดูสินค้า') {
      setShowProducts(true);
      setShowCategories(false);
      setShowCategoryProducts(false);
      setShowOrderSummary(false);
      setShowOrderTracking(false);
    } else if (questionText === 'ค้นหาสินค้า') {
      setShowCategories(true);
      setShowProducts(false);
      setShowCategoryProducts(false);
      setShowOrderSummary(false);
      setShowOrderTracking(false);
    } else if (questionText === 'สั่งซื้อ') {
      setShowOrderSummary(true);
      setShowProducts(false);
      setShowCategories(false);
      setShowCategoryProducts(false);
      setShowOrderTracking(false);
    } else if (questionText === 'ติดตามออเดอร์') {
      setShowOrderTracking(true);
      setShowProducts(false);
      setShowCategories(false);
      setShowCategoryProducts(false);
      setShowOrderSummary(false);
    } else {
      onQuestionClick(questionText);
    }
  };

  const handleBackToQuestions = () => {
    setShowProducts(false);
    setShowCategories(false);
    setShowCategoryProducts(false);
    setShowOrderSummary(false);
    setShowOrderTracking(false);
    setSelectedCategory('');
    setSelectedPaymentMethod('');
  };

  const handleBackToCategories = () => {
    setShowCategoryProducts(false);
    setShowCategories(true);
    setSelectedCategory('');
  };

  const handleProductClick = (product: typeof mockProducts[0]) => {
    if (!product.inStock) {
      return; // Don't allow clicking on sold-out products
    }
    onQuestionClick(`ขอดูรายละเอียด${product.name}`);
    setShowProducts(false);
  };

  const handleCategoryClick = (category: typeof productCategories[0]) => {
    setSelectedCategory(category.name);
    setShowCategoryProducts(true);
    setShowCategories(false);
  };

  const handleCategoryProductClick = (product: any) => {
    onQuestionClick(`ขอดูรายละเอียด${product.thai} (${product.name})`);
    setShowCategoryProducts(false);
  };

  const handleConfirmOrder = () => {
    if (!selectedPaymentMethod) {
      alert('กรุณาเลือกวิธีการชำระเงิน');
      return;
    }
    onQuestionClick(`ยืนยันการสั่งซื้อด้วยการ${paymentMethods.find(p => p.id === selectedPaymentMethod)?.name}`);
    setShowOrderSummary(false);
  };

  const handleOrderTracking = (orderId: string) => {
    onQuestionClick(`ติดตามออเดอร์ ${orderId}`);
  };

  // Cart management functions
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (product: typeof availableProducts[0]) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 50;
  const total = subtotal + shippingFee;

  // Show order tracking
  if (showOrderTracking) {
    return (
      <div className="px-2 py-3">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleBackToQuestions}
              className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">กลับ</span>
            </button>
            <h3 className="text-sm font-semibold text-nature-dark-green">
              ติดตามออเดอร์
            </h3>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {mockOrders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-border-beige p-3"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-nature-dark-green text-xs">
                      #{order.id.split('-')[2]}
                    </h4>
                    <p className="text-xs text-cool-gray">
                      {new Date(order.orderDate).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-fresh-orange">
                      ฿{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="mb-2">
                  {order.status === 'delivered' && (
                    <div className="flex items-center gap-1 text-nature-green">
                      <CheckCircle className="w-3 h-3" />
                      <span className="font-medium text-xs">จัดส่งแล้ว</span>
                    </div>
                  )}
                  {order.status === 'shipping' && (
                    <div className="flex items-center gap-1 text-fresh-orange">
                      <Truck className="w-3 h-3" />
                      <span className="font-medium text-xs">กำลังจัดส่ง</span>
                    </div>
                  )}
                  {order.status === 'pending_payment' && (
                    <div className="flex items-center gap-1 text-sun-yellow">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium text-nature-dark-green text-xs">รอชำระเงิน</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleOrderTracking(order.id)}
                  className={`w-full px-3 py-2 rounded-md transition-colors duration-200 font-medium text-xs ${
                    order.paymentStatus === 'pending'
                      ? 'bg-fresh-orange hover:bg-fresh-orange-hover text-white'
                      : 'bg-nature-green hover:bg-nature-dark-green text-white'
                  }`}
                >
                  {order.paymentStatus === 'pending' ? 'ชำระเงิน' : 'ดูรายละเอียด'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show order summary
  if (showOrderSummary) {
    // Check if cart is empty
    if (cartItems.length === 0) {
      return (
        <div className="px-2 py-3">
          <div className="max-w-sm mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleBackToQuestions}
                className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="font-medium">กลับ</span>
              </button>
              <h3 className="text-sm font-semibold text-nature-dark-green">
                ตะกร้าสินค้า
              </h3>
            </div>

            {/* Empty Cart Message */}
            <div className="bg-white rounded-lg shadow-sm border border-border-beige p-4 text-center">
              <ShoppingCart className="w-8 h-8 text-cool-gray/50 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-nature-dark-green mb-1">
                ตะกร้าว่างเปล่า
              </h4>
              <p className="text-xs text-cool-gray mb-3">
                ยังไม่มีสินค้าในตะกร้า
              </p>
              <button
                onClick={() => handleQuestionClick('ดูสินค้า')}
                className="px-4 py-2 bg-nature-green hover:bg-nature-dark-green text-white rounded-md transition-colors duration-200 font-medium text-xs"
              >
                เลือกซื้อสินค้า
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="px-2 py-3">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleBackToQuestions}
              className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">กลับ</span>
            </button>
            <h3 className="text-sm font-semibold text-nature-dark-green">
              สรุปการสั่งซื้อ
            </h3>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-border-beige overflow-hidden">
            {/* Cart Items */}
            <div className="p-3">
              <h4 className="font-semibold text-nature-dark-green mb-2 text-xs">รายการสินค้า</h4>
              <div className="space-y-2">
                {cartItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-nature-dark-green text-xs truncate">{item.name}</h5>
                      <p className="text-xs text-cool-gray">
                        ฿{item.price} x{item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-fresh-orange text-xs">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t border-border-beige p-3 bg-soft-beige/30">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>ราคาสินค้า</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>ค่าจัดส่ง</span>
                  <span>฿{shippingFee}</span>
                </div>
                <div className="border-t border-border-beige pt-1 mt-1">
                  <div className="flex justify-between font-semibold text-sm">
                    <span>รวมทั้งหมด</span>
                    <span className="text-fresh-orange">฿{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-border-beige p-3">
              <h4 className="font-semibold text-nature-dark-green mb-2 text-xs">วิธีการชำระเงิน</h4>
              <div className="space-y-2">
                {paymentMethods.slice(0, 2).map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-all duration-200 ${
                        selectedPaymentMethod === method.id
                          ? 'border-nature-green bg-nature-green/10'
                          : 'border-border-beige hover:bg-soft-beige/30'
                      }`}
                    >
                      <IconComponent />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-nature-dark-green text-xs truncate">{method.name}</p>
                        <p className="text-xs text-cool-gray truncate">{method.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Button */}
            <div className="border-t border-border-beige p-3">
              <button
                onClick={handleConfirmOrder}
                disabled={!selectedPaymentMethod}
                className={`w-full px-4 py-2 rounded-md transition-colors duration-200 font-medium text-xs ${
                  selectedPaymentMethod
                    ? 'bg-nature-green hover:bg-nature-dark-green text-white'
                    : 'bg-cool-gray/30 text-cool-gray cursor-not-allowed'
                }`}
              >
                ยืนยันการสั่งซื้อ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show category-specific products
  if (showCategoryProducts && selectedCategory) {
    const products = categoryProducts[selectedCategory as keyof typeof categoryProducts] || [];
    const categoryInfo = productCategories.find(cat => cat.name === selectedCategory);

    return (
      <div className="px-2 py-3">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleBackToCategories}
              className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">กลับ</span>
            </button>
            <div className="flex items-center gap-1">
              <span className="text-lg">{categoryInfo?.emoji}</span>
              <h3 className="text-sm font-semibold text-nature-dark-green">
                {categoryInfo?.description}
              </h3>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={index}
                onClick={() => handleCategoryProductClick(product)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-border-beige overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative h-20 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.thai}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-2">
                  <h4 className="font-semibold text-nature-dark-green mb-1 text-xs truncate">
                    {product.thai}
                  </h4>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-fresh-orange">
                      ฿{product.price}
                    </span>
                    <span className="text-xs text-cool-gray">
                      /{product.unit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show product categories
  if (showCategories) {
    return (
      <div className="px-2 py-3">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleBackToQuestions}
              className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">กลับ</span>
            </button>
            <h3 className="text-sm font-semibold text-nature-dark-green">
              หมวดหมู่สินค้า
            </h3>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-2">
            {productCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-border-beige overflow-hidden p-3"
              >
                {/* Category Icon */}
                <div className="text-center">
                  <div className="text-2xl mb-1">{category.emoji}</div>
                  <h4 className="font-semibold text-nature-dark-green text-xs mb-1">
                    {category.name}
                  </h4>
                  <p className="text-xs text-cool-gray">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show products
  if (showProducts) {
    return (
      <div className="px-2 py-3">
        <div className="max-w-sm mx-auto">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={handleBackToQuestions}
              className="flex items-center gap-1 px-2 py-1 text-nature-green hover:bg-nature-green/10 rounded text-xs transition-colors duration-200"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="font-medium">กลับ</span>
            </button>
            <h3 className="text-sm font-semibold text-nature-dark-green">
              สินค้าแนะนำ
            </h3>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-2">
            {mockProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`bg-white rounded-lg shadow-sm border border-border-beige overflow-hidden transition-all duration-200 ${
                  product.inStock 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'cursor-not-allowed opacity-75'
                }`}
              >
                {/* Product Image */}
                <div className="relative h-20 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover ${!product.inStock ? 'grayscale' : ''}`}
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium bg-red-500 px-2 py-1 rounded-full">
                        หมด
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-2">
                  <h4 className={`font-semibold mb-1 text-xs truncate ${
                    product.inStock ? 'text-nature-dark-green' : 'text-cool-gray'
                  }`}>
                    {product.name}
                  </h4>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-bold ${
                      product.inStock ? 'text-fresh-orange' : 'text-cool-gray'
                    }`}>
                      ฿{product.price}
                    </span>
                    <span className="text-xs text-cool-gray">
                      /{product.unit}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className={`w-3 h-3 ${
                      product.inStock 
                        ? 'fill-sun-yellow text-sun-yellow' 
                        : 'fill-cool-gray text-cool-gray'
                    }`} />
                    <span className="text-xs font-medium text-cool-gray">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show recommended questions (default view)
  return (
    <div className="px-2 py-3">
      <div className="max-w-sm mx-auto">
        <h3 className="text-xs font-medium text-cool-gray mb-2 text-center">
          คำถามยอดนิยม
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {questions.slice(0, 4).map((question, index) => {
            const IconComponent = question.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuestionClick(question.text)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-xs ${question.color} ${
                  question.color.includes('sun-yellow') ? 'text-nature-dark-green' : 'text-white'
                }`}
              >
                <IconComponent className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium truncate">{question.text}</span>
              </button>
            );
          })}
        </div>
        
        {/* Show more button */}
        <div className="text-center mt-2">
          <button
            onClick={() => onQuestionClick('ดูตัวเลือกเพิ่มเติม')}
            className="text-xs text-nature-green hover:text-nature-dark-green font-medium"
          >
            ดูเพิ่มเติม...
          </button>
        </div>
      </div>
    </div>
  );
};