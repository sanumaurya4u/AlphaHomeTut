import { useState } from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Confirm', isDestructive = false }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Confirm error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center py-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-red-50' : 'bg-amber-50'}`}>
          <AlertTriangle className={`w-7 h-7 ${isDestructive ? 'text-red-500' : 'text-amber-500'}`} />
        </div>
        <p className="text-gray-600 text-sm mb-6">{message || 'Are you sure you want to proceed?'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-60 ${
              isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-light'
            }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
