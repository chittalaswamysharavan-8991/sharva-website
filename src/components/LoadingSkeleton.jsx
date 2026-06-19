import React from "react";

export default function LoadingSkeleton({ lines = 3, width, height }) {
  const lineArray = Array.from({ length: lines });

  return (
    <div className="skeleton-container" aria-label="Loading content placeholder">
      {lineArray.map((_, index) => (
        <div
          key={index}
          className="skeleton skeleton-line"
          style={{
            width: width || (index === lines - 1 && lines > 1 ? "60%" : "100%"),
            height: height || "16px",
            marginBottom: index === lines - 1 ? "0" : "12px"
          }}
        />
      ))}
    </div>
  );
}
