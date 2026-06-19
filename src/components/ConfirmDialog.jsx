import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  destructive = false
}) {
  if (!open) return null;

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="confirm-dialog-header">
          {destructive && <AlertTriangle className="destructive-icon" size={20} />}
          <h3 id="dialog-title">{title}</h3>
        </div>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button onClick={onCancel} className="secondary-button cancel-btn">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={destructive ? "primary-button destructive-btn" : "primary-button confirm-btn"}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
