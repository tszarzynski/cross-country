import React from "react";
import styles from "./ListItem.module.css"

const ListItem = ({ waypoint, index, removeWaypoint, onDragStart, onDragEnd, onDragOver }) => {


    return (
        <li className={styles.item} onDragOver={() => onDragOver(index)}>
            <div draggable={true}
                onDragStart={(e) => onDragStart(e, waypoint.id)}
                onDragEnd={() => onDragEnd()}>
                <i className="material-icons">drag_handle</i>
            </div>
            <span>{waypoint.name}</span>
            <button className={styles.delete} onClick={() => removeWaypoint(waypoint.id)}>
                <i className="material-icons" >delete</i></button></li>
    )
}

export default ListItem;