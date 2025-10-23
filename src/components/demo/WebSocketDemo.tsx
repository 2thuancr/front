'use client';

import React, { useState } from 'react';
import { useSocketIO } from '@/hooks/useSocketIO';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { useToastSuccess, useToastError } from '@/components/ui/Toast';

interface WebSocketMessage {
  type: 'ORDER_STATUS_UPDATE' | 'NEW_ORDER' | 'ORDER_CANCELLED';
  data: {
    orderId: number;
    status: 'NEW' | 'CONFIRMED' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'CANCELLATION_REQUESTED';
    userId?: number;
    vendorId?: number;
    staffId?: number;
    timestamp: string;
  };
}

export const WebSocketDemo: React.FC = () => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [testOrderId, setTestOrderId] = useState('1');
  const [testStatus, setTestStatus] = useState<'NEW' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED'>('NEW');

  const toastSuccess = useToastSuccess();
  const toastError = useToastError();

  const { isConnected, connectionError, sendMessage } = useSocketIO({
    onOrderStatusUpdate: (data) => {
      // console.log('📦 Demo received order update:', data);
      setMessages(prev => [...prev, { type: 'ORDER_STATUS_UPDATE', data }]);
      toastSuccess(`Order #${data.orderId} status updated to ${data.status}`);
    },
    onNewOrder: (data) => {
      // console.log('🆕 Demo received new order:', data);
      setMessages(prev => [...prev, { type: 'NEW_ORDER', data }]);
      toastSuccess(`New order #${data.orderId} created`);
    },
    onOrderCancelled: (data) => {
      // console.log('❌ Demo received order cancellation:', data);
      setMessages(prev => [...prev, { type: 'ORDER_CANCELLED', data }]);
      toastError(`Order #${data.orderId} was cancelled`);
    }
  });

  const sendTestMessage = () => {
    const message = {
      orderId: parseInt(testOrderId),
      status: testStatus,
      userId: 1,
      timestamp: new Date().toISOString()
    };

    const success = sendMessage('order_status_update', message);
    if (success) {
      toastSuccess('Test message sent successfully');
    } else {
      toastError('Failed to send test message');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      <Card title="Socket.IO Demo" className="w-full">
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
            {connectionError && (
              <span className="text-red-500 text-sm">({connectionError})</span>
            )}
          </div>

          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Order ID</label>
              <InputText
                value={testOrderId}
                onChange={(e) => setTestOrderId(e.target.value)}
                placeholder="Order ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="NEW">NEW</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPING">SHIPPING</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                label="Send Test Message"
                onClick={sendTestMessage}
                disabled={!isConnected}
                className="w-full"
              />
            </div>
          </div>

          {/* Messages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Received Messages</h3>
              <Button
                label="Clear"
                onClick={clearMessages}
                size="small"
                severity="secondary"
              />
            </div>
            <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages received yet</p>
              ) : (
                <div className="space-y-2">
                  {messages.map((message, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm">
                      <div className="font-medium text-blue-600">{message.type}</div>
                      <div className="text-gray-600">
                        Order #{message.data.orderId} - {message.data.status}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(message.data.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
