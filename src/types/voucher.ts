export type DiscountType = 'percentage' | 'fixed' | 'freeship';

export interface Voucher {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string | null;
  minOrderValue: string;
  maxDiscount: string | null;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number | null;
  combinable: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherStats {
  total: number;
  active: number;
  expired: number;
  totalUsed: number;
  totalRevenue: number;
}

export interface CreateVoucherData {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue?: number;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit?: number;
  combinable: boolean;
}

export interface UpdateVoucherData extends Partial<CreateVoucherData> {
  isActive?: boolean;
}
