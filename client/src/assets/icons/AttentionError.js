import React from "react";

function AttentionError({ className }) {
  return (
    <svg
      width="24"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || ""}
    >
      <g clipPath="url(#clip0_77_8)">
        <path
          d="M12 3.94365L22.2338 21L1.76619 21L12 3.94365Z"
          fill="#FF5F4A"
          stroke="#FF5F4A"
          strokeWidth="2"
        />
        <path d="M12 10L12 15M12 18L12 16.5" stroke="white" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_77_8">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default AttentionError;
