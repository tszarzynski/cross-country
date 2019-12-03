import React from "react";
import styles from "./Button.module.css";

function Button({ label, onClick, disabled }) {
  return (
    <button className={styles.btn} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default React.memo(Button);
