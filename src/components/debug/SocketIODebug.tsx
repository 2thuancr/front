'use client';

import { useState } from 'react';
import { useSocketIO } from '@/hooks/useSocketIO';

export const SocketIODebug = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const {
    socket,
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage
  } = useSocketIO({
    autoConnect: false, // Manual control
    onOrderStatusUpdate: (data) => {
      addMessage(`📦 Order status update: ${JSON.stringify(data)}`);
    },
    onNewOrder: (data) => {
      addMessage(`🆕 New order: ${JSON.stringify(data)}`);
    },
    onOrderCancelled: (data) => {
      addMessage(`❌ Order cancelled: ${JSON.stringify(data)}`);
    }
  });

  const handleConnect = () => {
    addMessage('🔌 Attempting to connect...');
    connect();
  };

  const handleDisconnect = () => {
    addMessage('🔌 Disconnecting...');
    disconnect();
  };

  const handleSendTestMessage = () => {
    if (testMessage.trim()) {
      const success = sendMessage('test_message', { message: testMessage });
      if (success) {
        addMessage(`📤 Sent test message: ${testMessage}`);
        setTestMessage('');
      } else {
        addMessage('❌ Failed to send message - not connected');
      }
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Socket.IO Debug Panel</h2>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
          
          {connectionError && (
            <div className="text-red-600 text-sm">
              Error: {connectionError}
            </div>
          )}
        </div>
        
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleConnect}
            disabled={isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Connect
          </button>
          
          <button
            onClick={handleDisconnect}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Test Message */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Test Message</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSendTestMessage()}
          />
          <button
            onClick={handleSendTestMessage}
            disabled={!isConnected || !testMessage.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {/* Messages Log */}
      <div className="p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Messages Log</h3>
          <button
            onClick={clearMessages}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        
        <div className="bg-gray-50 p-3 rounded max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet...</p>
          ) : (
            <div className="space-y-1">
              {messages.map((message, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Socket Info */}
      <div className="mt-4 p-4 rounded-lg border bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Socket Info</h3>
        <div className="text-sm space-y-1">
          <div>Socket ID: {socket?.id || 'N/A'}</div>
          <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
          <div>Transport: {socket?.io?.engine?.transport?.name || 'N/A'}</div>
          <div>URL: {process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'}</div>
        </div>
      </div>
    </div>
  );
};
