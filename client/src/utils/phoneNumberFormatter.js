export const phoneNumberFormat = (phoneNumber) => {
  const num = phoneNumber;
  return `(${num ? num.slice(0, 4) : ""})-${num ? num.slice(4, 6) : ""}-${
    num ? num.slice(6, 9) : ""
  }-${num ? num.slice(9, 11) : ""}-${num ? num.slice(11, 13) : ""}`;
};
