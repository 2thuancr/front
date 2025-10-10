'use client';

import React, { useState } from 'react';
import { resetCartEndpoints, isCartEndpointAvailable } from '@/lib/api';

const CartDebug: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);

  const handleResetEndpoints = () => {
    resetCartEndpoints();
    alert('Cart endpoints đã được reset. Vui lòng refresh trang để thử lại.');
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-gray-600 text-white px-3 py-2 rounded text-xs opacity-50 hover:opacity-100"
      >
        Debug Cart
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">Cart Debug</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium">Cart Endpoint:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isCartEndpointAvailable('carts/user') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isCartEndpointAvailable('carts/user') ? 'Available' : 'Failed'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Create Cart:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            isCartEndpointAvailable('carts') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isCartEndpointAvailable('carts') ? 'Available' : 'Failed'}
          </span>
        </div>
        
        <button
          onClick={handleResetEndpoints}
          className="w-full mt-3 px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        >
          Reset Cart Endpoints
        </button>
        
        <p className="text-gray-500 text-xs mt-2">
          Reset sẽ xóa trạng thái lỗi và cho phép thử lại API calls.
        </p>
      </div>
    </div>
  );
};

export default CartDebug;
