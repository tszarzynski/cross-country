import React, { useEffect, useState, useCallback } from "react";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./List.module.css";
import ListItem from "./ListItem";

function List() {
  const [{ waypoints }, dispatch] = useStateValue();
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(waypoints);
  }, [waypoints]);
  const [draggedItem, setDraggedItem] = useState();

  const removeWaypoint = useCallback(
    id => dispatch({ type: Actions.REMOVE_WAYPOINT, payload: { id } }),
    [dispatch]
  );

  const onDragStart = useCallback(
    (e, id) => {
      setDraggedItem(items.find(item => item.id === id));
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/html", e.target.parentNode);
      e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    },
    [items]
  );

  const onDragEnd = useCallback(() => {
    setDraggedItem(null);
    // update list order
    dispatch({ type: Actions.UPDATE_WAYPOINTS, payload: { waypoints: items } });
  }, [items, dispatch]);

  const onDragOver = useCallback(
    (e, id) => {
      e.preventDefault();
      // Set the dropEffect to move
      e.dataTransfer.dropEffect = "move";

      const draggedOverItem = items.find(item => item.id === id);
      const draggedOverIndex = items.findIndex(item => item.id === id);

      // if the item is dragged over itself, ignore
      if (draggedItem === draggedOverItem) {
        return;
      }

      // filter out the currently dragged item
      let itemsWithoutDragged = items.filter(item => item !== draggedItem);

      // add the dragged item after the dragged over item
      itemsWithoutDragged.splice(draggedOverIndex, 0, draggedItem);

      setItems(itemsWithoutDragged);
    },
    [draggedItem, items]
  );

  if (!items.length) return <p>Place markers on the map to create route</p>;

  return (
    <ul className={styles.container}>
      {items.map(waypoint => (
        <ListItem
          key={waypoint.id}
          //   index={index}
          waypoint={waypoint}
          removeWaypoint={removeWaypoint}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        />
      ))}
    </ul>
  );
}

export default List;
