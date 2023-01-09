import React from "react";

function PaginationArrow({ classname }) {
  return (
    <svg
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classname}
    >
      <path
        d="M1 9.25L5.5 5L1 0.75"
        stroke="#AAAAAA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classname}
      />
    </svg>
  );
}

export default PaginationArrow;
