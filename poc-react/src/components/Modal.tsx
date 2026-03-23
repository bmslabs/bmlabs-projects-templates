/**
 * Modal Component (Prompt A - CreateComponent)
 * Accessible dialog component with overlay
 */

import React from 'react';
import clsx from 'clsx';

export interface ModalProps {
  /** Modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Footer content (buttons, etc) */
  footer?: React.ReactNode;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal Component - Accessible dialog overlay
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirm">
 *   <p>Are you sure?</p>
 *   <div className="flex gap-2">
 *     <Button onClick={handleClose}>Cancel</Button>
 *     <Button variant="danger" onClick={handleConfirm}>Delete</Button>
 *   </div>
 * </Modal>
 */
const Modal = React.memo<ModalProps>(
  ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeStyles = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    };

    return (
      <div
        role="presentation"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <dialog
          open
          className={clsx(
            'relative bg-white rounded-lg shadow-xl p-6',
            'focus:outline-none',
            sizeStyles[size]
          )}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <h2 id="modal-title" className="text-xl font-bold text-slate-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          )}

          {/* Content */}
          <div className="mb-6">{children}</div>

          {/* Footer */}
          {footer && <div className="flex gap-2 pt-4 border-t border-slate-200">{footer}</div>}
        </dialog>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };
export default Modal;
