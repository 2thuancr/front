import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { motion } from 'framer-motion';
import { UserProfile, UpdateProfileData } from '@/types/user';
import { userAPI } from '@/lib/api';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  MapPin, 
  CalendarIcon, 
  Camera, 
  Save, 
  X 
} from 'lucide-react';

interface ProfileFormNewProps {
  profile: UserProfile | null;
  onRefresh?: () => Promise<void>;
}

const profileSchema = yup.object({
  firstName: yup.string().required('Họ là bắt buộc'),
  lastName: yup.string().required('Tên là bắt buộc'),
  phone: yup.string().matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  province: yup.string(),
  ward: yup.string(),
  gender: yup.string().oneOf(['male', 'female', 'other']),
  dateOfBirth: yup.string(),
  bio: yup.string().max(500, 'Giới thiệu không được quá 500 ký tự'),
});

const ProfileFormNew: React.FC<ProfileFormNewProps> = ({
  profile,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<UpdateProfileData>({
    resolver: yupResolver(profileSchema) as any,
  });

  // Set form values when profile changes
  useEffect(() => {
    if (profile) {
      setValue('firstName', profile.firstName || '');
      setValue('lastName', profile.lastName || '');
      setValue('phone', profile.phone || '');
      setValue('province', profile.province || '');
      setValue('ward', profile.ward || '');
      setValue('bio', profile.bio || '');
      setValue('dateOfBirth', profile.dateOfBirth || '');
      setValue('gender', profile.gender || 'other');
    }
  }, [profile, setValue]);

  const watchedValues = watch();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        alert('Dụng lượng file tối đa 1 MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Định dạng file không hợp lệ. Chỉ chấp nhận .JPEG, .PNG');
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAvatarPreview(result);
        };
        reader.onerror = (error) => {
          alert('Có lỗi xảy ra khi đọc file');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Có lỗi xảy ra khi xử lý file');
      }
    } 
  };

  const handleSave = async (data: UpdateProfileData) => {
    
    try {
      setIsLoading(true);
      
      // Create FormData for sending both text and file data
      const formData = new FormData();
      
      // Add text fields to FormData
      formData.append('firstName', data.firstName || '');
      formData.append('lastName', data.lastName || '');
      formData.append('phone', data.phone || '');
      formData.append('province', data.province || '');
      formData.append('ward', data.ward || '');
      formData.append('gender', data.gender || '');
      formData.append('dateOfBirth', data.dateOfBirth || '');
      formData.append('bio', data.bio || '');
      
      // Add avatar file if there's a preview
      if (avatarPreview) {
        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (file) {
          formData.append('avatar', file);
        }
      } 
      
      const response = await userAPI.updateProfile(formData, data);
 
      // Simple refresh - just call API to get updated data
      if (onRefresh) {
        await onRefresh();
      }
      
      setIsEditing(false);
      setAvatarPreview(null);
      
      alert('Hồ sơ đã được cập nhật thành công!');
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    reset();
  };

  const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' },
  ];

  // Vietnamese provinces and wards data (simplified list)
  const provincesData = {
    // Thành phố (6)
    'Hà Nội': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Tây Hồ', 'Quận Long Biên', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Hoàng Mai', 'Quận Thanh Xuân', 'Huyện Sóc Sơn', 'Huyện Đông Anh', 'Huyện Gia Lâm', 'Quận Nam Từ Liêm', 'Huyện Thanh Trì', 'Quận Bắc Từ Liêm', 'Huyện Mê Linh', 'Huyện Hà Đông', 'Quận Hà Đông', 'Thị xã Sơn Tây', 'Huyện Ba Vì', 'Huyện Phúc Thọ', 'Huyện Đan Phượng', 'Huyện Hoài Đức', 'Huyện Quốc Oai', 'Huyện Thạch Thất', 'Huyện Chương Mỹ', 'Huyện Thanh Oai', 'Huyện Thường Tín', 'Huyện Phú Xuyên', 'Huyện Ứng Hòa', 'Huyện Mỹ Đức'],
    'Huế': ['Phường Phú Hội', 'Phường Phú Nhuận', 'Phường Phú Thuận', 'Phường Phú Hiệp', 'Phường Phú Hậu', 'Phường Phú Bình', 'Phường Phú Cát', 'Phường Phú Mỹ', 'Phường Phú Thượng', 'Phường Phú Hòa', 'Phường Phú Lộc', 'Phường Phú Thọ', 'Phường Phú Diễn', 'Phường Phú Lương', 'Phường Phú Mậu', 'Phường Phú Vinh', 'Phường Phú Lộc', 'Phường Phú Thượng', 'Phường Phú Hòa', 'Phường Phú Cát', 'Phường Phú Bình', 'Phường Phú Hậu', 'Phường Phú Hiệp', 'Phường Phú Thuận', 'Phường Phú Nhuận', 'Phường Phú Hội'],
    'Hải Phòng': ['Quận Đồ Sơn', 'Quận Dương Kinh', 'Quận Hải An', 'Quận Hồng Bàng', 'Quận Kiến An', 'Quận Lê Chân', 'Quận Ngô Quyền', 'Quận Thủ Đức', 'Huyện An Dương', 'Huyện An Lão', 'Huyện Bạch Long Vĩ', 'Huyện Cát Hải', 'Huyện Kiến Thụy', 'Huyện Thủy Nguyên', 'Huyện Tiên Lãng', 'Huyện Vĩnh Bảo'],
    'Cần Thơ': ['Quận Ninh Kiều', 'Quận Ô Môn', 'Quận Bình Thủy', 'Quận Cái Răng', 'Quận Thốt Nốt', 'Huyện Vĩnh Thạnh', 'Huyện Cờ Đỏ', 'Huyện Phong Điền', 'Huyện Thới Lai'],
    'Đà Nẵng': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang', 'Huyện Hoàng Sa'],
    'Đắk Lắk': ['Thành phố Buôn Ma Thuột', 'Huyện Buôn Đôn', 'Huyện Cư Kuin', 'Huyện Cư M\'gar', 'Huyện Ea H\'leo', 'Huyện Ea Kar', 'Huyện Ea Súp', 'Huyện Krông Ana', 'Huyện Krông Bông', 'Huyện Krông Búk', 'Huyện Krông Năng', 'Huyện Krông Pắc', 'Huyện Lắk', 'Huyện M\'Đrắk'],
    
    // Các tỉnh (28)
    'Bắc Ninh': ['Thành phố Bắc Ninh', 'Huyện Gia Bình', 'Huyện Lương Tài', 'Huyện Quế Võ', 'Huyện Tiên Du', 'Huyện Yên Phong'],
    'Lâm Đồng': ['Thành phố Đà Lạt', 'Thành phố Bảo Lộc', 'Huyện Bảo Lâm', 'Huyện Cát Tiên', 'Huyện Đạ Huoai', 'Huyện Đạ Tẻh', 'Huyện Đam Rông', 'Huyện Di Linh', 'Huyện Đơn Dương', 'Huyện Đức Trọng', 'Huyện Lạc Dương', 'Huyện Lâm Hà'],
    'Cà Mau': ['Thành phố Cà Mau', 'Huyện Cái Nước', 'Huyện Đầm Dơi', 'Huyện Ngọc Hiển', 'Huyện Năm Căn', 'Huyện Phú Tân', 'Huyện Thới Bình', 'Huyện Trần Văn Thời', 'Huyện U Minh'],
    'Tuyên Quang': ['Thành phố Tuyên Quang', 'Huyện Chiêm Hóa', 'Huyện Hàm Yên', 'Huyện Lâm Bình', 'Huyện Na Hang', 'Huyện Sơn Dương', 'Huyện Yên Sơn'],
    'Lào Cai': ['Thành phố Lào Cai', 'Huyện Bắc Hà', 'Huyện Bảo Thắng', 'Huyện Bảo Yên', 'Huyện Bát Xát', 'Huyện Mường Khương', 'Huyện Sa Pa', 'Huyện Si Ma Cai', 'Huyện Văn Bàn'],
    'Thái Nguyên': ['Thành phố Thái Nguyên', 'Thị xã Sông Công', 'Huyện Đại Từ', 'Huyện Định Hóa', 'Huyện Đồng Hỷ', 'Huyện Phú Bình', 'Huyện Phú Lương', 'Huyện Võ Nhai', 'Huyện Phổ Yên'],
    'Phú Thọ': ['Thành phố Việt Trì', 'Thị xã Phú Thọ', 'Huyện Cẩm Khê', 'Huyện Đoan Hùng', 'Huyện Hạ Hòa', 'Huyện Lâm Thao', 'Huyện Phù Ninh', 'Huyện Tam Nông', 'Huyện Tân Sơn', 'Huyện Thanh Ba', 'Huyện Thanh Sơn', 'Huyện Thanh Thủy', 'Huyện Yên Lập'],
    'Hưng Yên': ['Thành phố Hưng Yên', 'Huyện Ân Thi', 'Huyện Khoái Châu', 'Huyện Kim Động', 'Huyện Mỹ Hào', 'Huyện Phù Cừ', 'Huyện Tiên Lữ', 'Huyện Văn Giang', 'Huyện Văn Lâm', 'Huyện Yên Mỹ'],
    'Ninh Bình': ['Thành phố Ninh Bình', 'Huyện Gia Viễn', 'Huyện Hoa Lư', 'Huyện Kim Sơn', 'Huyện Nho Quan', 'Huyện Yên Khánh', 'Huyện Yên Mô'],
    'Quảng Trị': ['Thành phố Đông Hà', 'Thị xã Quảng Trị', 'Huyện Cam Lộ', 'Huyện Cồn Cỏ', 'Huyện Đa Krông', 'Huyện Gio Linh', 'Huyện Hải Lăng', 'Huyện Hướng Hóa', 'Huyện Triệu Phong', 'Huyện Vĩnh Linh'],
    'Lai Châu': ['Thành phố Lai Châu', 'Huyện Mường Tè', 'Huyện Nậm Nhùn', 'Huyện Phong Thổ', 'Huyện Sìn Hồ', 'Huyện Tam Đường', 'Huyện Tân Uyên', 'Huyện Than Uyên'],
    'Điện Biên': ['Thành phố Điện Biên Phủ', 'Huyện Điện Biên', 'Huyện Điện Biên Đông', 'Huyện Mường Ảng', 'Huyện Mường Chà', 'Huyện Mường Lay', 'Huyện Mường Nhé', 'Huyện Nậm Pồ', 'Huyện Tủa Chùa', 'Huyện Tuần Giáo'],
    'Sơn La': ['Thành phố Sơn La', 'Huyện Bắc Yên', 'Huyện Mai Sơn', 'Huyện Mộc Châu', 'Huyện Mường La', 'Huyện Phù Yên', 'Huyện Quỳnh Nhai', 'Huyện Sông Mã', 'Huyện Sốp Cộp', 'Huyện Thuận Châu', 'Huyện Vân Hồ', 'Huyện Yên Châu'],
    'Lạng Sơn': ['Thành phố Lạng Sơn', 'Huyện Bắc Sơn', 'Huyện Bình Gia', 'Huyện Cao Lộc', 'Huyện Chi Lăng', 'Huyện Đình Lập', 'Huyện Hữu Lũng', 'Huyện Lộc Bình', 'Huyện Tràng Định', 'Huyện Văn Lãng', 'Huyện Văn Quan'],
    'Quảng Ninh': ['Thành phố Hạ Long', 'Thành phố Móng Cái', 'Thành phố Uông Bí', 'Thị xã Cẩm Phả', 'Thị xã Quảng Yên', 'Huyện Ba Chẽ', 'Huyện Bình Liêu', 'Huyện Cô Tô', 'Huyện Đầm Hà', 'Huyện Đông Triều', 'Huyện Hải Hà', 'Huyện Hoành Bồ', 'Huyện Tiên Yên', 'Huyện Vân Đồn'],
    'Thanh Hóa': ['Thành phố Thanh Hóa', 'Thị xã Bỉm Sơn', 'Thị xã Sầm Sơn', 'Huyện Bá Thước', 'Huyện Cẩm Thủy', 'Huyện Đông Sơn', 'Huyện Hà Trung', 'Huyện Hậu Lộc', 'Huyện Hoằng Hóa', 'Huyện Lang Chánh', 'Huyện Mường Lát', 'Huyện Nga Sơn', 'Huyện Ngọc Lặc', 'Huyện Như Thanh', 'Huyện Như Xuân', 'Huyện Nông Cống', 'Huyện Quan Hóa', 'Huyện Quan Sơn', 'Huyện Quảng Xương', 'Huyện Thạch Thành', 'Huyện Thiệu Hóa', 'Huyện Thọ Xuân', 'Huyện Thường Xuân', 'Huyện Tĩnh Gia', 'Huyện Triệu Sơn', 'Huyện Vĩnh Lộc', 'Huyện Yên Định'],
    'Nghệ An': ['Thành phố Vinh', 'Thị xã Cửa Lò', 'Thị xã Hoàng Mai', 'Thị xã Thái Hoà', 'Huyện Anh Sơn', 'Huyện Con Cuông', 'Huyện Diễn Châu', 'Huyện Đô Lương', 'Huyện Hưng Nguyên', 'Huyện Kỳ Sơn', 'Huyện Nam Đàn', 'Huyện Nghi Lộc', 'Huyện Nghĩa Đàn', 'Huyện Quế Phong', 'Huyện Quỳ Châu', 'Huyện Quỳ Hợp', 'Huyện Quỳnh Lưu', 'Huyện Tân Kỳ', 'Huyện Thanh Chương', 'Huyện Tương Dương', 'Huyện Yên Thành'],
    'Hà Tĩnh': ['Thành phố Hà Tĩnh', 'Huyện Cẩm Xuyên', 'Huyện Can Lộc', 'Huyện Đức Thọ', 'Huyện Hương Khê', 'Huyện Hương Sơn', 'Huyện Kỳ Anh', 'Huyện Lộc Hà', 'Huyện Nghi Xuân', 'Huyện Thạch Hà', 'Huyện Vũ Quang'],
    'Cao Bằng': ['Thành phố Cao Bằng', 'Huyện Bảo Lạc', 'Huyện Bảo Lâm', 'Huyện Hạ Lang', 'Huyện Hà Quảng', 'Huyện Hoà An', 'Huyện Nguyên Bình', 'Huyện Phục Hoà', 'Huyện Quảng Uyên', 'Huyện Thạch An', 'Huyện Thông Nông', 'Huyện Trà Lĩnh', 'Huyện Trùng Khánh'],
    'Vĩnh Long': ['Thành phố Vĩnh Long', 'Huyện Bình Minh', 'Huyện Bình Tân', 'Huyện Long Hồ', 'Huyện Mang Thít', 'Huyện Tam Bình', 'Huyện Trà Ôn', 'Huyện Vũng Liêm'],
    'An Giang': ['Thành phố Long Xuyên', 'Thành phố Châu Đốc', 'Huyện An Phú', 'Huyện Châu Phú', 'Huyện Châu Thành', 'Huyện Chợ Mới', 'Huyện Phú Tân', 'Huyện Thoại Sơn', 'Huyện Tri Tôn', 'Huyện Tịnh Biên'],
    'Phú Yên': ['Thành phố Tuy Hòa', 'Huyện Đông Hòa', 'Huyện Phú Hòa', 'Huyện Sơn Hòa', 'Huyện Sông Cầu', 'Huyện Sông Hinh', 'Huyện Tây Hòa', 'Huyện Tuy An'],
    'Bình Thuận': ['Thành phố Phan Thiết', 'Huyện Bắc Bình', 'Huyện Đức Linh', 'Huyện Hàm Tân', 'Huyện Hàm Thuận Bắc', 'Huyện Hàm Thuận Nam', 'Huyện Phú Quí', 'Huyện Tánh Linh', 'Huyện Tuy Phong'],
    'Sóc Trăng': ['Thành phố Sóc Trăng', 'Huyện Châu Thành', 'Huyện Cù Lao Dung', 'Huyện Kế Sách', 'Huyện Long Phú', 'Huyện Mỹ Tú', 'Huyện Mỹ Xuyên', 'Huyện Ngã Năm', 'Huyện Thạnh Trị', 'Huyện Trần Đề', 'Huyện Vĩnh Châu'],
    'Hậu Giang': ['Thành phố Vị Thanh', 'Huyện Châu Thành', 'Huyện Châu Thành A', 'Huyện Long Mỹ', 'Huyện Ngã Bảy', 'Huyện Phụng Hiệp', 'Huyện Vị Thủy'],
    'Bạc Liêu': ['Thành phố Bạc Liêu', 'Huyện Đông Hải', 'Huyện Giá Rai', 'Huyện Hòa Bình', 'Huyện Hồng Dân', 'Huyện Phước Long', 'Huyện Vĩnh Lợi']
  };

  const provinceOptions = Object.keys(provincesData).map(province => ({
    label: province,
    value: province
  }));

  const getWardOptions = (province: string) => {
    if (!province || !provincesData[province as keyof typeof provincesData]) return [];
    return provincesData[province as keyof typeof provincesData].map((ward: string) => ({
      label: ward,
      value: ward
    }));
  };

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    const maskedUsername = username.length > 2 
      ? username.substring(0, 2) + '*'.repeat(username.length - 2)
      : username;
    
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '';
    if (phone.length < 4) return phone;
    
    const start = phone.substring(0, 3);
    const end = phone.substring(phone.length - 2);
    const middle = '*'.repeat(phone.length - 5);
    
    return `${start}${middle}${end}`;
  };

  const maskDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `**/**/${year}`;
  };

  // Debug log
  console.log('🔄 ProfileFormNew - isEditing:', isEditing);
  console.log('🔄 ProfileFormNew - isDirty:', isDirty);
  console.log('🔄 ProfileFormNew - avatarPreview:', avatarPreview ? 'Has preview' : 'No preview');
  console.log('🔄 ProfileFormNew - avatarPreview length:', avatarPreview?.length);
  console.log('🔄 ProfileFormNew - should show save button:', isEditing && (isDirty || avatarPreview));
  console.log('🔄 ProfileFormNew - Current profile.avatar:', profile?.avatar);
  console.log('🔄 ProfileFormNew - Profile exists:', !!profile);
  console.log('ProfileFormNew - Profile data:', profile);
  if (profile?.avatar) {
    const fullAvatarUrl = profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:3001${profile.avatar}`;
    console.log('ProfileFormNew - Avatar URL:', profile.avatar);
    console.log('ProfileFormNew - Full Avatar URL:', fullAvatarUrl);
  } else {
    console.log('ProfileFormNew - No avatar in profile data');
  }

  const getAvatarUrl = (avatar: string | undefined) => {
    if (!avatar) return null;
    console.log('getAvatarUrl - Input avatar:', avatar);
    // Avatar từ API đã là URL đầy đủ từ Cloudinary, không cần thêm base URL
    const fullUrl = avatar.startsWith('http') ? avatar : `http://localhost:3001${avatar}`;
    console.log('getAvatarUrl - Full URL:', fullUrl);
    return fullUrl;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Message severity="info" text="Đang tải thông tin hồ sơ..." />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <motion.form
          onSubmit={handleSubmit(handleSave)}
          className="space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Avatar Section */}
          <div className="flex items-center space-x-6 py-4 border-b border-gray-100">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {/* SUPER SIMPLE AVATAR FRAME */}
              <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                ) : profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile avatar" 
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Avatar loaded:', profile.avatar)}
                    onError={() => console.log('❌ Avatar failed:', profile.avatar)}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white text-xl font-bold">
                    {profile?.firstName && profile?.lastName ? getInitials(profile.firstName, profile.lastName) : '?'}
                  </div>
                )}
              </div>
              <motion.label
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera className="w-4 h-4 text-gray-700" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-upload" />
              </motion.label>
            </motion.div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {profile?.firstName && profile?.lastName 
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile?.username || 'Người dùng'
                }
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {profile?.email || 'Chưa có email'}
              </p>
              
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    label="Sửa Hồ Sơ"
                    className="bg-orange-500 hover:bg-orange-600 border-0 px-4 py-2 text-sm"
                    onClick={() => {
                      console.log('Edit button clicked, setting isEditing to true');
                      setIsEditing(true);
                    }}
                  />
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      label="Chọn Ảnh"
                      className="p-button-outlined px-4 py-2 text-sm"
                      type="button"
                      onClick={() => {
                        console.log('Choose image button clicked');
                        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                    />
                    <Button
                      label="Thoát chỉnh sửa"
                      className="p-button-text px-4 py-2 text-sm text-gray-600"
                      onClick={() => {
                        console.log('Cancel edit clicked, setting isEditing to false');
                        setIsEditing(false);
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                <p>Dụng lượng file tối đa 1 MB • Định dạng: .JPEG, .PNG</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-gray-100">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                Tên đăng nhập
              </label>
              <InputText
                value={profile.username || ''}
                disabled
                className="w-full"
              />
              <small className="text-gray-500 text-xs">
                Tên đăng nhập chỉ có thể thay đổi một lần
              </small>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                Email
              </label>
              <div className="p-2 bg-gray-50 rounded border text-gray-900">
                {maskEmail(profile.email || '')}
              </div>
              <small className="text-gray-500 text-xs">
                Email không thể thay đổi
              </small>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Họ
              </label>
              <InputText
                {...register('firstName')}
                placeholder="Nhập họ của bạn"
                className={`w-full ${errors.firstName ? 'p-invalid' : ''}`}
                disabled={!isEditing}
              />
              {errors.firstName && (
                <small className="p-error block text-xs">{errors.firstName.message}</small>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tên
              </label>
              <InputText
                {...register('lastName')}
                placeholder="Nhập tên của bạn"
                className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                disabled={!isEditing}
              />
              {errors.lastName && (
                <small className="p-error block text-xs">{errors.lastName.message}</small>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Số điện thoại
              </label>
              {isEditing ? (
                <InputText
                  {...register('phone')}
                  placeholder="Nhập số điện thoại của bạn"
                  className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {maskPhone(profile.phone || '')}
                </div>
              )}
              {errors.phone && (
                <small className="p-error block text-xs">{errors.phone.message}</small>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-gray-500" />
                Giới tính
              </label>
              {isEditing ? (
                <Dropdown
                  {...register('gender')}
                  value={watchedValues.gender}
                  options={genderOptions}
                  placeholder="Chọn giới tính"
                  className={`w-full ${errors.gender ? 'p-invalid' : ''}`}
                  onChange={(e) => setValue('gender', e.value)}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {profile.gender === 'male' ? 'Nam' : 
                   profile.gender === 'female' ? 'Nữ' : 'Khác'}
                </div>
              )}
              {errors.gender && (
                <small className="p-error block text-xs">{errors.gender.message}</small>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-t border-gray-100">
            {/* Ward */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Xã/Phường
              </label>
              {isEditing ? (
                <Dropdown
                  {...register('ward')}
                  value={watchedValues.ward}
                  options={getWardOptions(watchedValues.province || '')}
                  placeholder="Chọn xã/phường"
                  className={`w-full ${errors.ward ? 'p-invalid' : ''}`}
                  onChange={(e) => setValue('ward', e.value)}
                  disabled={!watchedValues.province}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {profile?.ward || 'Chưa chọn'}
                </div>
              )}
              {errors.ward && (
                <small className="p-error block text-xs">{errors.ward.message}</small>
              )}
            </div>

            {/* Province */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tỉnh/Thành phố
              </label>
              {isEditing ? (
                <Dropdown
                  {...register('province')}
                  value={watchedValues.province}
                  options={provinceOptions}
                  placeholder="Chọn tỉnh/thành phố"
                  className={`w-full ${errors.province ? 'p-invalid' : ''}`}
                  onChange={(e) => {
                    setValue('province', e.value);
                    setValue('ward', ''); // Reset ward when province changes
                  }}
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {profile?.province || 'Chưa chọn'}
                </div>
              )}
              {errors.province && (
                <small className="p-error block text-xs">{errors.province.message}</small>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                Ngày sinh
              </label>
              {isEditing ? (
                <Calendar
                  {...register('dateOfBirth')}
                  value={watchedValues.dateOfBirth ? new Date(watchedValues.dateOfBirth) : null}
                  placeholder="Chọn ngày sinh"
                  className={`w-full ${errors.dateOfBirth ? 'p-invalid' : ''}`}
                  onChange={(e) => setValue('dateOfBirth', e.value ? e.value.toISOString().split('T')[0] : '')}
                  showIcon
                  dateFormat="dd/mm/yy"
                />
              ) : (
                <div className="p-2 bg-gray-50 rounded border text-gray-900">
                  {maskDate(profile.dateOfBirth || '')}
                </div>
              )}
              {errors.dateOfBirth && (
                <small className="p-error block text-xs">{errors.dateOfBirth.message}</small>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Giới thiệu
              </label>
              <InputTextarea
                {...register('bio')}
                placeholder="Giới thiệu về bản thân..."
                className={`w-full ${errors.bio ? 'p-invalid' : ''}`}
                disabled={!isEditing}
                rows={3}
              />
              {errors.bio && (
                <small className="p-error block text-xs">{errors.bio.message}</small>
              )}
            </div>
          </div>

          {/* Save Button */}
          {(isEditing && (isDirty || avatarPreview)) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6 border-t border-gray-100"
            >
              <div className="flex space-x-3 justify-end">
                <Button
                  onClick={handleSubmit(handleSave)}
                  disabled={isLoading}
                  loading={isLoading}
                  label="Lưu thay đổi"
                  className="bg-orange-500 hover:bg-orange-600 border-0 px-6 py-2"
                  icon={<Save className="w-4 h-4" />}
                />
                <Button
                  onClick={handleCancel}
                  label="Hủy"
                  className="p-button-outlined px-6 py-2"
                  icon={<X className="w-4 h-4" />}
                />
              </div>
            </motion.div>
          )}
        </motion.form>
      </Card>
    </div>
  );
};

export default ProfileFormNew;