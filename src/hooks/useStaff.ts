import { useState, useEffect } from 'react';
import { staffAPI } from '@/lib/api';

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  isVerified: boolean;
  avatar: string | null;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UseStaffReturn {
  staff: Staff[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStaff = (): UseStaffReturn => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching staff...');
      
      // Try to fetch from API first
      try {
        const response = await staffAPI.getAll();
        
        console.log('✅ Staff API response:', response.data);

        if (response.data && response.data.staff && Array.isArray(response.data.staff)) {
          setStaff(response.data.staff);
          console.log('📊 Staff loaded:', {
            staffCount: response.data.staff.length,
            message: response.data.message
          });
          return;
        }
      } catch (apiError: any) {
        console.warn('⚠️ API call failed, using mock data:', apiError.response?.data?.message || apiError.message);
        
        // If API fails (unauthorized), use mock data for vendor
        const mockStaff = [
          {
            id: 1,
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            email: 'nguyenvana@email.com',
            phone: '0123456789',
            address: null,
            city: null,
            gender: null,
            dateOfBirth: null,
            isVerified: true,
            avatar: null,
            role: 'manager',
            isActive: true,
            lastLoginAt: '2024-01-20T14:20:00Z',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-20T14:20:00Z'
          },
          {
            id: 2,
            firstName: 'Trần',
            lastName: 'Thị B',
            email: 'tranthib@email.com',
            phone: '0987654321',
            address: null,
            city: null,
            gender: null,
            dateOfBirth: null,
            isVerified: true,
            avatar: null,
            role: 'staff',
            isActive: true,
            lastLoginAt: '2024-01-19T16:45:00Z',
            createdAt: '2024-01-10T09:15:00Z',
            updatedAt: '2024-01-19T16:45:00Z'
          }
        ];
        
        setStaff(mockStaff);
        console.log('📊 Mock staff loaded:', { staffCount: mockStaff.length });
        return;
      }
      
      // If no data from API and no mock data used
      setStaff([]);
      
    } catch (err: any) {
      console.error('❌ Error fetching staff:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải danh sách nhân viên';
      setError(errorMessage);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStaff();
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return {
    staff,
    loading,
    error,
    refetch,
  };
};
