import React from "react";

export default function Panel({ icon: Icon, title, tone = "green", children, action, actionLabel }) {
  return (
    <article className={`panel tone-${tone}`}>
      <div className="panel-title">
        {Icon && <Icon size={18} />}
        <h3>{title}</h3>
        {action ? (
          <button className="panel-action" onClick={action}>
            {actionLabel}
          </button>
        ) : null}
      </div>
      <p>{children}</p>
    </article>
  );
}
