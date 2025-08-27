'use client';

import React from 'react';
import { Shield, Truck, CreditCard, Headphones, Star, Users } from 'lucide-react';
import { Card } from 'primereact/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân và thanh toán được mã hóa và bảo vệ an toàn',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Truck,
      title: 'Giao hàng nhanh chóng',
      description: 'Giao hàng trong 24h tại TP.HCM, 2-3 ngày cho các tỉnh khác',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: CreditCard,
      title: 'Thanh toán linh hoạt',
      description: 'Hỗ trợ nhiều phương thức thanh toán: tiền mặt, chuyển khoản, ví điện tử',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Star,
      title: 'Chất lượng đảm bảo',
      description: '100% sản phẩm chính hãng, có giấy tờ bảo hành đầy đủ',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Users,
      title: 'Cộng đồng lớn mạnh',
      description: 'Hơn 10,000+ sinh viên HCMUTE đã tin tưởng và sử dụng dịch vụ',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất với những ưu đãi 
            đặc biệt dành riêng cho sinh viên HCMUTE
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Sản phẩm đa dạng</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                <div className="text-gray-600">Đơn hàng thành công</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-600">Khách hàng hài lòng</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Sẵn sàng trải nghiệm?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Khám phá ngay bộ sưu tập sản phẩm độc đáo dành riêng cho sinh viên HCMUTE
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Xem sản phẩm
              </button>
              <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

