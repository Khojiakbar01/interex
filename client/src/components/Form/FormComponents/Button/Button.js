import React from "react";
import styles from "./Button.module.css";
import Pen from "../../../../assets/icons/Pen";
import Plus from "../../../../assets/icons/Plus";
import Dots from "../../../../assets/icons/Dots";
import Trash from "../../../../assets/icons/Trash";

function Button({
  nameBtn,
  children,
  type,
  name,
  iconName,
  size,
  disabled,
  btnStyle,
  onClick,
  style,
}) {
  // NAME 1-"btn" 2-"icon" 3-"iconText" 4-"dots"
  // ICON NAME 1-"pen" 2-"plus" 3-"trash"
  // SIZE 1-"iconSmall" 2-"iconNormal" 3-"iconMedium" 4-"small" 5-"normal" 6-"medium"
  // DISABLED true||false
  // Function --> onClick={somethingFunction}
  // btnStyle

  const customFunction = () => {
    onClick?.();
  };

  let buttonSize;
  switch (size) {
    case "iconSmall":
      buttonSize = "iconSmall";
      break;
    case "iconNormal":
      buttonSize = "";
      break;
    case "iconMedium":
      buttonSize = "iconMedium";
      break;
    case "small":
      buttonSize = "small";
      break;
    case "normal":
      buttonSize = "normal";
      break;
    case "medium":
      buttonSize = "medium";
      break;
    default:
      buttonSize = "defaultSize";
  }

  return (
    <button
    nameBtn={nameBtn}
      disabled={disabled}
      className={`${styles[buttonSize]} ${styles[name]} ${
        name !== "dots" ? styles.btn : styles.dots
      }`}
      style={btnStyle}
      type={type || "submit"}
      onClick={customFunction}
    >
      {(name === "icon" || name === "iconText") && iconName === "trash" && (
        <Trash />
      )}
      {(name === "icon" || name === "iconText") && iconName === "plus" && (
        <Plus />
      )}
      {(name === "icon" || name === "iconText") && iconName === "pen" && (
        <Pen />
      )}
      {name === "dots" && <Dots classname={styles.dotsIcon} />}
      {(name === "btn" || name === "iconText") && children}
    </button>
  );
}

export default Button;
