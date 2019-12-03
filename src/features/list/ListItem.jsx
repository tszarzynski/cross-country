import React from "react";
import styles from "./ListItem.module.css";
import Icon from "../../components/Icon";

function ListItem({
  waypoint,
  index,
  removeWaypoint,
  onDragStart,
  onDragEnd,
  onDragOver
  //   onMouseEnter,
  //   onMouseLeave
}) {
  return (
    <li
      className={styles.item}
      onDragOver={e => onDragOver(e, waypoint.id)}
      //   onMouseEnter={e => onMouseEnter(e, waypoint.id)}
      //   onMouseLeave={e => onMouseLeave(e, waypoint.id)}
    >
      <div>{`${index + 1}: `}</div>
      <div
        className={styles.draggable}
        draggable={true}
        onDragStart={e => onDragStart(e, waypoint.id)}
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
}

export default React.memo(ListItem);
