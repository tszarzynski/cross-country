import React from "react";
import styles from "./ListItem.module.css";
import Icon from "../../components/Icon";

const ListItem = ({
  waypoint,
  index,
  removeWaypoint,
  onDragStart,
  onDragEnd,
  onDragOver
}) => {
  return (
    <li className={styles.item} onDragOver={e => onDragOver(e, index)}>
      <div
        className={styles.draggable}
        draggable={true}
        onDragStart={e => onDragStart(e, index)}
        onDragEnd={e => onDragEnd(e)}
      >
        <Icon type="drag_handle" />
      </div>
      <div className={styles.label}>{waypoint.name}</div>
      <button
        className={styles.delete}
        onClick={() => removeWaypoint(waypoint.id)}
      >
        <Icon type="delete" />
      </button>
    </li>
  );
};

export default ListItem;
