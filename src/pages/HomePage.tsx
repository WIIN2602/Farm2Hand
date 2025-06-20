import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShoppingBag, Users, TrendingUp, Star, ArrowRight, Leaf, Shield, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: ShoppingBag,
      title: 'ซื้อขายตรงจากเกษตรกร',
      description: 'เชื่อมต่อผู้บริโภคกับเกษตรกรโดยตรง ได้สินค้าสดใหม่ ราคาดี',
      color: 'bg-nature-green'
    },
    {
      icon: MessageSquare,
      title: 'AI Assistant ช่วยเหลือ',
      description: 'ผู้ช่วยอัจฉริยะคอยให้คำแนะนำและช่วยเหลือตลอด 24 ชั่วโมง',
      color: 'bg-fresh-orange'
    },
    {
      icon: Shield,
      title: 'รับประกันคุณภาพ',
      description: 'สินค้าผ่านการตรวจสอบคุณภาพ มีการรับรองมาตรฐาน',
      color: 'bg-nature-brown'
    },
    {
      icon: Truck,
      title: 'จัดส่งรวดเร็ว',
      description: 'ระบบจัดส่งที่เชื่อถือได้ สินค้าถึงมือคุณอย่างปลอดภัย',
      color: 'bg-sun-yellow text-nature-dark-green'
    }
  ];

  const stats = [
    { number: '1,000+', label: 'เกษตรกร', icon: Users },
    { number: '5,000+', label: 'ลูกค้า', icon: ShoppingBag },
    { number: '10,000+', label: 'สินค้า', icon: Leaf },
    { number: '4.8', label: 'คะแนนเฉลี่ย', icon: Star }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-nature-green/10 to-fresh-orange/10" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden p-4">
              <img 
                src="/ChatGPT Image 17 มิ.ย. 2568 10_27_08.png" 
                alt="Farm2Hand Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-nature-dark-green mb-6">
              Farm2Hand
            </h1>
            <p className="text-xl md:text-2xl text-nature-green font-medium mb-4">
              เชื่อมต่อเกษตรกรกับผู้บริโภค
            </p>
            <p className="text-lg text-cool-gray max-w-2xl mx-auto mb-8">
              แพลตฟอร์มซื้อขายสินค้าเกษตรออนไลน์ที่เชื่อมต่อเกษตรกรกับผู้บริโภคโดยตรง 
              พร้อมผู้ช่วย AI ที่คอยให้คำแนะนำและช่วยเหลือ
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/chatbot"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-nature-green hover:bg-nature-dark-green text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <MessageSquare className="w-5 h-5" />
                  ลองใช้ AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="inline-flex items-center gap-2 px-8 py-4 border-2 border-nature-green text-nature-green hover:bg-nature-green hover:text-white rounded-lg font-medium transition-colors duration-200">
                  <Users className="w-5 h-5" />
                  เริ่มต้นใช้งาน
                </button>
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <p className="text-nature-dark-green mb-4">
                  ยินดีต้อนรับกลับมา, <span className="font-semibold">{user?.name}</span>!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-nature-green hover:bg-nature-dark-green text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <Users className="w-4 h-4" />
                    ดูโปรไฟล์
                  </Link>
                  <Link
                    to="/chatbot"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-nature-green text-nature-green hover:bg-nature-green hover:text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    <MessageSquare className="w-4 h-4" />
                    AI Assistant
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <IconComponent className="w-8 h-8 text-nature-green mx-auto mb-3" />
                  <div className="text-2xl font-bold text-nature-dark-green mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-cool-gray">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-nature-dark-green mb-4">
              ทำไมต้องเลือก Farm2Hand?
            </h2>
            <p className="text-lg text-cool-gray max-w-2xl mx-auto">
              เราให้บริการที่ครบครันและน่าเชื่อถือ เพื่อประสบการณ์การซื้อขายที่ดีที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-nature-dark-green mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-cool-gray text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-nature-green to-nature-dark-green">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            เข้าร่วมกับเกษตรกรและผู้บริโภคหลายพันคนที่เชื่อใจ Farm2Hand
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-nature-green hover:bg-soft-beige rounded-lg font-medium transition-colors duration-200 shadow-lg">
                <Users className="w-5 h-5" />
                สมัครสมาชิก
              </button>
              <Link
                to="/chatbot"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-nature-green rounded-lg font-medium transition-colors duration-200"
              >
                <MessageSquare className="w-5 h-5" />
                ทดลองใช้ AI Assistant
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};