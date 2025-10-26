'use client';

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  User,
  Building,
  FileText,
} from 'lucide-react';

const contactMethods = [
  {
    icon: MapPin,
    title: 'Địa chỉ',
    description: '1 Võ Văn Ngân, Thủ Đức, TP.HCM',
    color: 'from-blue-500 to-blue-600',
    action: 'Xem bản đồ',
    actionIcon: Globe,
  },
  {
    icon: Phone,
    title: 'Điện thoại',
    description: '0364 886 745',
    color: 'from-green-500 to-green-600',
    action: 'Gọi ngay',
    actionIcon: Phone,
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'giftshop@hcmute.edu.vn',
    color: 'from-purple-500 to-purple-600',
    action: 'Gửi email',
    actionIcon: Mail,
  },
  {
    icon: Clock,
    title: 'Giờ làm việc',
    description: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
    color: 'from-orange-500 to-orange-600',
    action: 'Đặt lịch hẹn',
    actionIcon: Clock,
  },
];

const socialMedia = [
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', url: '#' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-600', url: '#' },
  { name: 'Twitter', icon: Twitter, color: 'bg-sky-600', url: '#' },
  { name: 'Youtube', icon: Youtube, color: 'bg-red-600', url: '#' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', url: '#' },
];

const inquiryTypes = [
  { label: 'Thông tin sản phẩm', value: 'product' },
  { label: 'Đặt hàng', value: 'order' },
  { label: 'Hỗ trợ kỹ thuật', value: 'support' },
  { label: 'Hợp tác kinh doanh', value: 'business' },
  { label: 'Phản hồi/Góp ý', value: 'feedback' },
  { label: 'Khác', value: 'other' },
];

const faqs = [
  {
    question: 'Làm thế nào để đặt hàng?',
    answer:
      'Bạn có thể đặt hàng trực tuyến qua website, gọi điện thoại hoặc đến trực tiếp cửa hàng của chúng tôi.',
  },
  {
    question: 'Thời gian giao hàng là bao lâu?',
    answer:
      'Thời gian giao hàng trong TP.HCM là 1-2 ngày, các tỉnh khác từ 3-7 ngày tùy thuộc vào địa điểm.',
  },
  {
    question: 'Có thể đổi trả sản phẩm không?',
    answer:
      'Chúng tôi chấp nhận đổi trả trong vòng 7 ngày nếu sản phẩm còn nguyên vẹn và có hóa đơn mua hàng.',
  },
  {
    question: 'Có ship hàng quốc tế không?',
    answer:
      'Hiện tại chúng tôi chỉ ship hàng trong nước. Chúng tôi đang phát triển dịch vụ ship quốc tế trong tương lai.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert(
      'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
    );
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      company: '',
      inquiryType: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='relative py-20' style={{
        backgroundImage: 'url(/images/banner-hcmute.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 80%',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className='absolute inset-0 bg-black/40'></div>
        <div className='relative container mx-auto px-4 text-center text-white'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>
              Liên hệ với chúng tôi
            </h1>
            <p className='text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed'>
              Hãy để lại tin nhắn, chúng tôi sẽ liên hệ lại trong thời gian sớm
              nhất
            </p>
          </motion.div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-16'>
        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20'
        >
          {contactMethods.map((method, index) => (
            <Card
              key={index}
              className='text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300'
            >
              <div className='p-6'>
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <method.icon className='w-8 h-8 text-white' />
                </div>
                <h3 className='text-lg font-bold text-gray-800 mb-2'>
                  {method.title}
                </h3>
                <p className='text-gray-600 mb-4'>{method.description}</p>
                <Button
                  label={method.action}
                  icon={<method.actionIcon className='w-4 h-4 mr-2' />}
                  className='bg-gray-100 text-gray-700 hover:bg-gray-200 border-0'
                  size='small'
                />
              </div>
            </Card>
          ))}
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className='border-0 shadow-xl'>
              <div className='p-8'>
                <div className='text-center mb-8'>
                  <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <MessageCircle className='w-8 h-8 text-white' />
                  </div>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                    Gửi tin nhắn
                  </h2>
                  <p className='text-gray-600'>
                    Hãy điền thông tin bên dưới, chúng tôi sẽ phản hồi sớm nhất
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Họ và tên <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <InputText
                          value={formData.fullName}
                          onChange={e =>
                            handleInputChange('fullName', e.target.value)
                          }
                          placeholder='Nhập họ và tên'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Email <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <InputText
                          type='email'
                          value={formData.email}
                          onChange={e =>
                            handleInputChange('email', e.target.value)
                          }
                          placeholder='Nhập email'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Số điện thoại
                      </label>
                      <div className='relative'>
                        <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <InputText
                          value={formData.phone}
                          onChange={e =>
                            handleInputChange('phone', e.target.value)
                          }
                          placeholder='Nhập số điện thoại'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Công ty
                      </label>
                      <div className='relative'>
                        <Building className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <InputText
                          value={formData.company}
                          onChange={e =>
                            handleInputChange('company', e.target.value)
                          }
                          placeholder='Nhập tên công ty'
                          className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Loại yêu cầu
                    </label>
                    <Dropdown
                      value={formData.inquiryType}
                      onChange={e => handleInputChange('inquiryType', e.value)}
                      options={inquiryTypes}
                      placeholder='Chọn loại yêu cầu'
                      className='w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Tiêu đề <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                      <FileText className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                      <InputText
                        value={formData.subject}
                        onChange={e =>
                          handleInputChange('subject', e.target.value)
                        }
                        placeholder='Nhập tiêu đề tin nhắn'
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-gray-700'>
                      Nội dung <span className='text-red-500'>*</span>
                    </label>
                    <InputTextarea
                      value={formData.message}
                      onChange={e =>
                        handleInputChange('message', e.target.value)
                      }
                      placeholder='Nhập nội dung tin nhắn...'
                      rows={5}
                      className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                      required
                    />
                  </div>

                  <Button
                    type='submit'
                    label={isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    icon={<Send className='w-4 h-4 mr-2' />}
                    className='w-full bg-blue-600 hover:bg-blue-700 border-0 py-3 text-lg'
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  />
                </form>
              </div>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='space-y-8'
          >
            {/* Map */}
            <Card className='border-0 shadow-xl overflow-hidden'>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-800 mb-4 flex items-center'>
                  <MapPin className='w-5 h-5 mr-2 text-blue-600' />
                  Vị trí của chúng tôi
                </h3>
                <div className='w-full h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center'>
                  <div className='text-center text-white'>
                    <Globe className='w-16 h-16 mx-auto mb-4 opacity-80' />
                    <p className='text-lg font-medium'>Bản đồ Google Maps</p>
                    <p className='text-sm opacity-80'>
                      1 Võ Văn Ngân, Thủ Đức, TP.HCM
                    </p>

                    <iframe
                      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4853986110534!2d106.76933817326511!3d10.850637657824162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1759939681763!5m2!1svi!2s'
                      width='800'
                      height='600'
                      style={{ border: 0 }}
                      allowFullScreen
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                    ></iframe>
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className='border-0 shadow-xl'>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>
                  Theo dõi chúng tôi
                </h3>
                <p className='text-gray-600 mb-6'>
                  Cập nhật tin tức mới nhất và khuyến mãi đặc biệt
                </p>
                <div className='flex flex-wrap gap-3'>
                  {socialMedia.map((social, index) => (
                    <Button
                      key={index}
                      icon={<social.icon className='w-5 h-5' />}
                      className={`p-button-rounded p-button-text ${social.color} text-white hover:opacity-80`}
                      tooltip={social.name}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* FAQ */}
            <Card className='border-0 shadow-xl'>
              <div className='p-6'>
                <h3 className='text-xl font-bold text-gray-800 mb-4'>
                  Câu hỏi thường gặp
                </h3>
                <div className='space-y-4'>
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className='border-b border-gray-200 pb-4 last:border-b-0'
                    >
                      <h4 className='font-semibold text-gray-800 mb-2'>
                        {faq.question}
                      </h4>
                      <p className='text-gray-600 text-sm'>{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='mt-20'
        >
          <Card className='border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white'>
            <div className='p-12 text-center'>
              <h2 className='text-4xl font-bold mb-6'>
                Bạn cần hỗ trợ gì khác?
              </h2>
              <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
                Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ
                bạn 24/7
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Button
                  label='Gọi hotline'
                  icon={<Phone className='w-5 h-5 mr-2' />}
                  className='bg-white text-blue-600 hover:bg-gray-100 border-0 px-8 py-3 text-lg'
                />
                <Button
                  label='Chat trực tuyến'
                  icon={<MessageCircle className='w-5 h-5 mr-2' />}
                  className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg'
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
