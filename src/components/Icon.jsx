import React from "react";
import styles from "./Icon.module.css";

function Icon({ type, style }) {
  return <i className={`material-icons  ${styles.icon} ${style} `}>{type}</i>;
}

export default React.memo(Icon);
