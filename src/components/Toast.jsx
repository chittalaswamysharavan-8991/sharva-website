import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function Toast({ message, type = "info", onDismiss, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
      <button onClick={() => { setVisible(false); if (onDismiss) onDismiss(); }} className="toast-close" aria-label="Dismiss toast">
        <X size={14} />
      </button>
    </div>
  );
}
