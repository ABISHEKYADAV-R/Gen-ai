'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toastData: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    const toast: Toast = { ...toastData, id };
    
    setToasts(prev => [...prev, toast]);

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              max-w-md rounded-lg shadow-lg p-4 flex items-start space-x-3
              transform transition-all duration-300 ease-in-out
              ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {toast.type === 'error' && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={`
                text-sm font-medium
                ${toast.type === 'success' ? 'text-green-800' : ''}
                ${toast.type === 'error' ? 'text-red-800' : ''}
                ${toast.type === 'info' ? 'text-blue-800' : ''}
              `}>
                {toast.title}
              </p>
              <p className={`
                text-sm mt-1
                ${toast.type === 'success' ? 'text-green-700' : ''}
                ${toast.type === 'error' ? 'text-red-700' : ''}
                ${toast.type === 'info' ? 'text-blue-700' : ''}
              `}>
                {toast.message}
              </p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className={`
                flex-shrink-0 p-1 rounded-md hover:bg-opacity-20
                ${toast.type === 'success' ? 'hover:bg-green-500' : ''}
                ${toast.type === 'error' ? 'hover:bg-red-500' : ''}
                ${toast.type === 'info' ? 'hover:bg-blue-500' : ''}
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};