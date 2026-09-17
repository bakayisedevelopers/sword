import React from 'react';
import { Button } from './Button.jsx';

/**
 * Reusable Dialog reproducing Flutter's AlertDialog.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'OK',
  cancelText,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-[24px] p-6 shadow-xl text-center">
        {title && <h3 className="text-lg font-bold text-ff-secondary mb-2">{title}</h3>}
        {message && <p className="text-sm text-slate-600 mb-6">{message}</p>}

        <div className="flex items-center justify-center gap-3">
          {cancelText && (
            <Button
              text={cancelText}
              color="#F1F5F9"
              textColor="#475569"
              borderColor="transparent"
              onClick={onClose}
            />
          )}
          <Button
            text={confirmText}
            color="#192431"
            textColor="#FFFFFF"
            borderColor="#192431"
            onClick={() => {
              if (onConfirm) onConfirm();
              if (onClose) onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Dialog;
