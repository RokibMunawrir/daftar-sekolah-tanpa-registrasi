import React, { useState } from 'react';
import Modal from './modal';

export interface ConfirmModalProps {
  /**
   * The element that will trigger the modal when clicked.
   */
  children: React.ReactElement<any>;
  title: string;
  message?: string;
  type?: 'default' | 'delete' | 'logout';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  formId?: string; // Optional: ID of the form to submit when confirmed
}

export default function ConfirmModal({
  children,
  title,
  message,
  type = 'default',
  confirmText,
  cancelText,
  onConfirm,
  formId,
}: ConfirmModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();

    if (formId) {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        if (form.requestSubmit) {
          form.requestSubmit();
        } else {
          form.submit();
        }
      }
    }
    setIsOpen(false);
  };

  // Clone the child element to attach the onClick handler
  const trigger = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      if (children.props.onClick) {
        children.props.onClick(e);
      }
      handleOpen(e);
    }
  });

  return (
    <>
      {trigger}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        type={type}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={handleConfirm}
      >
        {message ? (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            {message}
          </p>
        ) : undefined}
      </Modal>
    </>
  );
}
