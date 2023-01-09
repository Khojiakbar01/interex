import React from "react";

function XButtonIcon({ classname }) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classname}
    >
      <path
        d="M1.24182 1L15.4836 15.0418"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={classname}
      />
      <path
        d="M15.2418 1L1.00003 15.0418"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        className={classname}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default XButtonIcon;
