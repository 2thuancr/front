'use client';

import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import ClientOnly from '@/components/ui/ClientOnly';
import { PRODUCT_CATEGORIES, PAGINATION } from '@/lib/constants';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  date: Date;
}

const PrimeDemoContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setProducts([
      { id: 1, name: 'Áo Thun HCMUTE', category: 'Áo thun', price: 299000, rating: 4.8, date: new Date() },
      { id: 2, name: 'Balo HCMUTE', category: 'Balo', price: 599000, rating: 4.9, date: new Date() },
      { id: 3, name: 'Nón HCMUTE', category: 'Nón', price: 199000, rating: 4.7, date: new Date() },
      { id: 4, name: 'Sổ tay HCMUTE', category: 'Sổ tay', price: 399000, rating: 4.6, date: new Date() },
    ]);
  }, []);

  const priceBodyTemplate = (rowData: Product) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData: Product) => {
    return <Rating value={rowData.rating} readOnly stars={5} cancel={false} />;
  };

  const categoryBodyTemplate = (rowData: Product) => {
    return <Tag value={rowData.category} severity="info" />;
  };

  const dateBodyTemplate = (rowData: Product) => {
    return formatDate(rowData.date);
  };

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <div className="flex gap-2">
        <Button icon="pi pi-eye" size="small" severity="info" />
        <Button icon="pi pi-shopping-cart" size="small" severity="success" />
        <Button icon="pi pi-heart" size="small" severity="danger" />
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            PrimeReact Demo
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Xem sự khác biệt khi sử dụng PrimeReact - Components đẹp sẵn, responsive và dễ tùy chỉnh
          </p>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <InputText
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <Dropdown
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.value)}
                options={PRODUCT_CATEGORIES}
                placeholder="Chọn danh mục"
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Ngày</label>
              <Calendar
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value as Date)}
                placeholder="Chọn ngày"
                className="w-full"
              />
            </div>
            
            <div className="flex flex-col justify-end">
              <Button 
                label="Làm mới" 
                icon="pi pi-refresh" 
                severity="secondary"
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* DataTable */}
        <Card>
          <DataTable
            value={products}
            paginator
            rows={PAGINATION.DEFAULT_PAGE_SIZE}
            rowsPerPageOptions={PAGINATION.PAGE_SIZE_OPTIONS}
            tableStyle={{ minWidth: '50rem' }}
            className="shadow-lg"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            globalFilter={searchText}
            emptyMessage="Không tìm thấy sản phẩm nào"
          >
            <Column field="id" header="ID" sortable style={{ width: '5%' }} />
            <Column field="name" header="Tên sản phẩm" sortable style={{ width: '25%' }} />
            <Column field="category" header="Danh mục" body={categoryBodyTemplate} sortable style={{ width: '15%' }} />
            <Column field="price" header="Giá" body={priceBodyTemplate} sortable style={{ width: '15%' }} />
            <Column field="rating" header="Đánh giá" body={ratingBodyTemplate} sortable style={{ width: '20%' }} />
            <Column field="date" header="Ngày" body={dateBodyTemplate} sortable style={{ width: '15%' }} />
            <Column header="Thao tác" body={actionBodyTemplate} style={{ width: '15%' }} />
          </DataTable>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <Card className="text-center">
            <i className="pi pi-table text-4xl text-blue-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">DataTable</h3>
            <p className="text-gray-600">Bảng dữ liệu đẹp với sorting, filtering, pagination</p>
          </Card>
          
          <Card className="text-center">
            <i className="pi pi-calendar text-4xl text-green-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Calendar</h3>
            <p className="text-gray-600">Date picker chuyên nghiệp với nhiều tùy chọn</p>
          </Card>
          
          <Card className="text-center">
            <i className="pi pi-star text-4xl text-yellow-500 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Rating</h3>
            <p className="text-gray-600">Hệ thống đánh giá sao đẹp mắt</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

const PrimeDemo: React.FC = () => {
  return (
    <ClientOnly 
      fallback={
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải PrimeReact Demo...</p>
            </div>
          </div>
        </section>
      }
    >
      <PrimeDemoContent />
    </ClientOnly>
  );
};

export default PrimeDemo;
