import React, { useEffect, useState, useCallback } from "react";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./List.module.css";
import ListItem from "./ListItem";

function List() {
  // state
  const [{ waypoints }, dispatch] = useStateValue();
  // rendered items
  const [items, setItems] = useState([]);
  useEffect(() => {
    setItems(waypoints);
  }, [waypoints]);
  // id of dragged waypoint
  const [draggedItemId, setDraggedItemId] = useState();

  const removeWaypoint = useCallback(
    id => dispatch({ type: Actions.REMOVE_WAYPOINT, payload: { id } }),
    [dispatch]
  );

  // "dragstart" event handler for list items
  const onDragStart = useCallback((e, id) => {
    setDraggedItemId(id);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  }, []);

  // "dragend" event handler for list items
  const onDragEnd = useCallback(() => {
    setDraggedItemId(null);

    dispatch({
      type: Actions.UPDATE_WAYPOINTS,
      payload: { waypoints: items }
    });
  }, [items, dispatch]);

  // "dragover" event handler for list items
  const onDragOver = useCallback(
    (e, draggedOverId) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      setItems(prevItems => {
        // if the item is dragged over itself, ignore
        if (draggedItemId === draggedOverId) {
          return prevItems;
        }

        // filter out the currently dragged item
        const itemsWithoutDragged = prevItems.filter(
          item => item.id !== draggedItemId
        );

        const draggedOverIndex = prevItems.findIndex(
          item => item.id === draggedOverId
        );

        const draggedItem = prevItems.find(item => item.id === draggedItemId);

        // update items reflecting the curent items order
        return [
          ...itemsWithoutDragged.slice(0, draggedOverIndex),
          draggedItem,
          ...itemsWithoutDragged.slice(draggedOverIndex)
        ];
      });
    },
    [draggedItemId]
  );

  if (!items.length) return <p>Place markers on the map to create route</p>;

  return (
    <ul className={styles.container}>
      {items.map((waypoint, index) => (
        <ListItem
          key={waypoint.id}
          index={index}
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
