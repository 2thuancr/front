'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Clock, TrendingUp, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/types/api';

interface SearchSuggestionsProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

interface SearchResult {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  className,
  placeholder = "Tìm kiếm sản phẩm...",
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    'Áo thun HCMUTE',
    'Balo sinh viên',
    'Mũ lưỡi trai',
    'Túi đựng laptop',
    'Áo khoác hoodie'
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Search API call with debounce
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=8`
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Search API error:', response.status);
        setResults(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchProducts(query);
      }, 300);
    } else {
      setResults(null);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, searchProducts]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
  };

  // Handle search submit
  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      onSearch?.(searchQuery);
      setIsOpen(false);
      
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Format price
  const formatPrice = (price: string, discountPercent?: string) => {
    const priceNum = parseFloat(price);
    const discount = discountPercent ? parseFloat(discountPercent) : 0;
    
    if (discount > 0) {
      const discountedPrice = priceNum * (1 - discount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold">
            {discountedPrice.toLocaleString('vi-VN')}₫
          </span>
          <span className="text-gray-500 line-through text-sm">
            {priceNum.toLocaleString('vi-VN')}₫
          </span>
        </div>
      );
    }
    
    return (
      <span className="text-gray-900 font-semibold">
        {priceNum.toLocaleString('vi-VN')}₫
      </span>
    );
  };

  // Get product image
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0]?.imageUrl || '/images/placeholder.svg';
    }
    return '/images/placeholder.svg';
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {query.trim() ? (
            // Search Results
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
                </div>
              ) : results && results.data.length > 0 ? (
                <div>
                  <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                    Kết quả tìm kiếm ({results.meta.total})
                  </div>
                  <div className="space-y-1">
                    {results.data.map((product) => (
                      <Link
                        key={product.productId}
                        href={`/products/${product.productId}`}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => {
                          setIsOpen(false);
                          saveRecentSearch(query);
                        }}
                      >
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={getProductImage(product)}
                            alt={product.productName}
                            fill
                            className="object-cover rounded-md"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.productName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.category?.categoryName}
                          </p>
                          <div className="mt-1">
                            {formatPrice(product.price, product.discountPercent)}
                          </div>
                        </div>
                        {product.discountPercent && parseFloat(product.discountPercent) > 0 && (
                          <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            -{product.discountPercent}%
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  {results.meta.total > results.data.length && (
                    <div className="px-3 py-2 border-t border-gray-100">
                      <button
                        onClick={() => handleSearch()}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xem tất cả {results.meta.total} kết quả
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-3 py-8 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Không tìm thấy sản phẩm nào</p>
                  <p className="text-sm">Thử từ khóa khác</p>
                </div>
              )}
            </div>
          ) : (
            // Empty State - Show Recent & Popular Searches
            <div className="p-2">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
                    <Clock className="h-4 w-4" />
                    Tìm kiếm gần đây
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
                  <TrendingUp className="h-4 w-4" />
                  Tìm kiếm phổ biến
                </div>
                <div className="space-y-1">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
