'use client';

import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Heart, 
  Globe, 
  Lightbulb, 
  Shield, 
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const stats = [
  { icon: Users, value: '50,000+', label: 'Sinh viên đã sử dụng' },
  { icon: Award, value: '15+', label: 'Năm kinh nghiệm' },
  { icon: Target, value: '99%', label: 'Khách hàng hài lòng' },
  { icon: Heart, value: '1000+', label: 'Sản phẩm đã bán' },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Sáng tạo',
    description: 'Luôn đổi mới và sáng tạo trong thiết kế sản phẩm, mang đến những mẫu mã độc đáo và hiện đại.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Chất lượng',
    description: 'Cam kết chất lượng cao nhất với mọi sản phẩm, sử dụng nguyên liệu tốt và quy trình sản xuất nghiêm ngặt.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Heart,
    title: 'Tận tâm',
    description: 'Phục vụ khách hàng với sự tận tâm và nhiệt huyết, luôn lắng nghe và đáp ứng mọi nhu cầu.',
    color: 'from-pink-500 to-rose-500'
  },
  {
    icon: Star,
    title: 'Uy tín',
    description: 'Xây dựng thương hiệu dựa trên sự uy tín và tin cậy, là đối tác đáng tin cậy của mọi khách hàng.',
    color: 'from-purple-500 to-indigo-500'
  }
];

const team = [
  {
    name: 'Vi Quốc Thuận',
    position: 'Thành viên đội ngũ',
    image: '/images/Thuan.jpg',
    description: 'MSSV: 22110006 - Thành viên tích cực trong dự án phát triển HCMUTE Gift Shop.'
  },
  {
    name: 'Dương Nguyễn Hoài Bảo',
    position: 'Thành viên đội ngũ',
    image: '/images/HoaiBao.jpg',
    description: 'MSSV: 22110283 - Đóng góp quan trọng trong việc xây dựng và phát triển hệ thống.'
  },
  {
    name: 'Vương Lập Quế',
    position: 'Thành viên đội ngũ',
    image: '/images/Que.jpg',
    description: 'MSSV: Cập nhật sau - Thành viên năng động của đội ngũ phát triển.'
  }
];

const timeline = [
  {
    year: '2008',
    title: 'Thành lập',
    description: 'HCMUTE Gift Shop được thành lập với mục tiêu phục vụ cộng đồng sinh viên.'
  },
  {
    year: '2012',
    title: 'Mở rộng',
    description: 'Mở rộng danh mục sản phẩm và bắt đầu kinh doanh online.'
  },
  {
    year: '2016',
    title: 'Thương hiệu',
    description: 'Xây dựng thành công thương hiệu HCMUTE Gift Shop trong cộng đồng giáo dục.'
  },
  {
    year: '2020',
    title: 'Đổi mới',
    description: 'Ứng dụng công nghệ số và mở rộng kênh bán hàng trực tuyến.'
  },
  {
    year: '2024',
    title: 'Tương lai',
    description: 'Tiếp tục phát triển và trở thành thương hiệu hàng đầu về quà tặng giáo dục.'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Về HCMUTE Gift Shop
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi là thương hiệu hàng đầu về quà tặng và sản phẩm đặc trưng của trường Đại học Sư phạm Kỹ thuật TP.HCM
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                HCMUTE Gift Shop được thành lập vào năm 2008 với sứ mệnh mang đến những sản phẩm chất lượng cao, 
                thiết kế độc đáo và ý nghĩa cho cộng đồng sinh viên, giảng viên và những người yêu mến trường Đại học Sư phạm Kỹ thuật TP.HCM.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Trải qua hơn 15 năm phát triển, chúng tôi đã trở thành thương hiệu tin cậy, 
                được hàng nghìn khách hàng lựa chọn và tin tưởng. Mỗi sản phẩm đều được chăm chút tỉ mỉ, 
                thể hiện tình yêu và niềm tự hào về ngôi trường thân yêu.
              </p>
              <Button
                label="Tìm hiểu thêm"
                className="bg-blue-600 hover:bg-blue-700 border-0 px-8 py-3 text-lg"
                icon={<Globe className="w-5 h-5 mr-2" />}
              />
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center">
                <img
                  src="/images/hcmute-logo.png"
                  alt="HCMUTE Logo"
                  className="w-32 h-32 object-contain"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="p-6">
                    <div className={`w-20 h-20 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <value.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những cột mốc quan trọng trong quá trình xây dựng và phát triển thương hiệu
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px w-0.5 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 shadow-lg">
                      <div className="p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những con người tài năng và tâm huyết đang xây dựng tương lai của HCMUTE Gift Shop
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="p-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hãy để lại thông tin, chúng tôi sẽ liên hệ lại trong thời gian sớm nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Địa chỉ</h3>
                  <p className="text-gray-600">Số 1 Võ Văn Ngân, Phường Thủ Đức, TP.HCM</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Điện thoại</h3>
                  <p className="text-gray-600">(028) 3896 1234</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <p className="text-gray-600">info@hcmute-giftshop.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Giờ làm việc</h3>
                  <p className="text-gray-600">Thứ 2 - Thứ 7: 8:00 - 17:00</p>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Theo dõi chúng tôi</h3>
                <div className="flex space-x-4">
                  <Button
                    icon={<Facebook className="w-5 h-5" />}
                    className="p-button-rounded p-button-text bg-blue-600 text-white hover:bg-blue-700"
                  />
                  <Button
                    icon={<Instagram className="w-5 h-5" />}
                    className="p-button-rounded p-button-text bg-pink-600 text-white hover:bg-pink-700"
                  />
                  <Button
                    icon={<Twitter className="w-5 h-5" />}
                    className="p-button-rounded p-button-text bg-sky-600 text-white hover:bg-sky-700"
                  />
                  <Button
                    icon={<Youtube className="w-5 h-5" />}
                    className="p-button-rounded p-button-text bg-red-600 text-white hover:bg-red-700"
                  />
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="text"
                placeholder="Tiêu đề"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Nội dung tin nhắn"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
              <Button
                label="Gửi tin nhắn"
                className="w-full bg-blue-600 hover:bg-blue-700 border-0 py-3 text-lg"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
