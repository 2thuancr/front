'use client';

import { SocketIODebug } from '@/components/debug/SocketIODebug';

export default function SocketIODebugPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Socket.IO Debug Tool</h1>
          <p className="text-gray-600 mt-2">Test WebSocket connection and real-time features</p>
        </div>
        
        <SocketIODebug />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p>1. <strong>Connect:</strong> Click "Connect" to establish WebSocket connection</p>
            <p>2. <strong>Test Message:</strong> Send a test message to verify communication</p>
            <p>3. <strong>Monitor:</strong> Watch the messages log for real-time events</p>
            <p>4. <strong>Debug:</strong> Check browser console for detailed logs</p>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Make sure the backend Socket.IO server is running on port 3001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
