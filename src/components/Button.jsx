import React from "react";
import styles from "./Button.module.css";
import Icon from "./Icon";

function Button({ label, onClick, disabled, icon }) {
  return (
    <button className={styles.btn} onClick={onClick} disabled={disabled}>
      {icon && <Icon type={icon} style={styles.icon} />}
      <span>{label}</span>
    </button>
  );
}

export default React.memo(Button);
