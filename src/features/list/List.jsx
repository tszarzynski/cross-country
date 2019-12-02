import React, { useEffect, useState } from "react";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./List.module.css";
import ListItem from "./ListItem";


const List = () => {
    const [{ waypoints }, dispatch] = useStateValue();
    const [items, setItems] = useState([])
    useEffect(() => {
        setItems(waypoints)
    }, [waypoints]);
    const [draggedItem, setDraggedItem] = useState()

    const removeWaypoint = (id) => dispatch({ type: Actions.REMOVE_WAYPOINT, payload: { id } })

    const onDragStart = (e, id) => {
        setDraggedItem(waypoints.find(item => item.id === id))
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    }

    const onDragEnd = () => {
        setDraggedItem(null)

        dispatch({ type: Actions.UPDATE, payload: { waypoints: items } })
    }
    const onDragOver = (index) => {
        const draggedOverItem = waypoints[index];

        // if the item is dragged over itself, ignore
        if (draggedItem === draggedOverItem) {
            return;
        }

        // filter out the currently dragged item
        let items = waypoints.filter(item => item !== draggedItem);

        // add the dragged item after the dragged over item
        items.splice(index, 0, draggedItem);

        setItems(items);
    }


    return (
        <div className={styles.container}>
            <ul>
                {items.map((waypoint, index) => (
                    <ListItem key={index}
                        index={index}
                        waypoint={waypoint}
                        removeWaypoint={removeWaypoint}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                    />
                ))}
            </ul>
        </div>)

}

export default List;