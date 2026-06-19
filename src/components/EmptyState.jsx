import React from "react";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={42} className="empty-state-icon" />}
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="primary-button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
