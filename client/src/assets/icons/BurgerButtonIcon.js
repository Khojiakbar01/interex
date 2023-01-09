import React from "react";

function BurgerButtonIcon({ classname }) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classname}
    >
      <path
        d="M4.125 18.875H19.875M4.125 12.875H19.875M4.125 6.875H19.875"
        stroke="#7D41ED"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BurgerButtonIcon;
