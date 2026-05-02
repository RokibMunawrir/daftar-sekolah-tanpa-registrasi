import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'default' | 'delete' | 'logout';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  type = 'default',
  onConfirm,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    delete: {
      confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500/20 shadow-red-500/10',
      icon: (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
      )
    },
    logout: {
      confirmBtn: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500/20 shadow-amber-500/10',
      icon: (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </div>
      )
    },
    default: {
      confirmBtn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500/20 shadow-indigo-500/10',
      icon: null
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[4px] transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] w-full max-w-md shadow-2xl p-6 z-10 transform scale-100 transition-all duration-300 animate-scaleIn">
        
        {/* Render Icon for templates */}
        {currentStyle.icon}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mx-auto text-center">{title}</h3>
        </div>

        {/* Body */}
        <div className="mb-6">
          {children ? children : (
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              {type === 'delete' && 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.'}
              {type === 'logout' && 'Apakah Anda yakin ingin keluar dari akun administrator saat ini?'}
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          
          {onConfirm && (
            <button 
              type="button" 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-4 shadow-lg transition-all cursor-pointer ${currentStyle.confirmBtn}`}
            >
              {type === 'delete' ? 'Hapus' : type === 'logout' ? 'Logout' : confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
