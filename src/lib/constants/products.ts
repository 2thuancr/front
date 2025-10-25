import { TrendingUp, Eye as EyeIcon, Percent, Clock } from 'lucide-react';

export type ProductType = 'latest' | 'bestseller' | 'most-viewed' | 'highest-discount';

export const PRODUCT_TYPES = [
  {
    value: 'latest' as ProductType,
    label: 'Sản phẩm mới nhất',
    icon: Clock,
    description: 'Những sản phẩm mới được thêm vào'
  },
  {
    value: 'bestseller' as ProductType,
    label: 'Sản phẩm bán chạy',
    icon: TrendingUp,
    description: 'Sản phẩm được mua nhiều nhất'
  },
  {
    value: 'most-viewed' as ProductType,
    label: 'Sản phẩm xem nhiều',
    icon: EyeIcon,
    description: 'Sản phẩm được xem nhiều nhất'
  },
  {
    value: 'highest-discount' as ProductType,
    label: 'Khuyến mãi cao nhất',
    icon: Percent,
    description: 'Sản phẩm có giảm giá cao nhất'
  }
];

export const QUANTITY_OPTIONS = [
  { label: '6 sản phẩm', value: 6 },
  { label: '12 sản phẩm', value: 12 },
  { label: '18 sản phẩm', value: 18 },
  { label: '24 sản phẩm', value: 24 },
  { label: '30 sản phẩm', value: 30 }
];

export const DEFAULT_PRODUCT_LIMIT = 6;
export const DEFAULT_PRODUCT_TYPE: ProductType = 'latest';
export const DEFAULT_VIEW_MODE: 'grid' | 'list' = 'grid';
