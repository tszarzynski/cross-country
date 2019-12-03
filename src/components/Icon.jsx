import React from "react";
import styles from "./Icon.module.css";

function Icon({ type }) {
  return <i className={`material-icons ${styles.icon}`}>{type}</i>;
}

export default React.memo(Icon);
