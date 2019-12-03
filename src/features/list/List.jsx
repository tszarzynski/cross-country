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
  const [draggedItemId, setDraggedItemId] = useState();
  const [shouldUpdateOrder, setShouldUpdateOrder] = useState(false);

  const removeWaypoint = useCallback(
    id => dispatch({ type: Actions.REMOVE_WAYPOINT, payload: { id } }),
    [dispatch]
  );

  const onDragStart = useCallback((e, id) => {
    setDraggedItemId(id);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedItemId(null);
    setShouldUpdateOrder(true);
  }, []);

  const onDragOver = useCallback(
    (e, draggedOverId) => {
      e.preventDefault();
      // Set the dropEffect to move
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

        return [
          ...itemsWithoutDragged.slice(0, draggedOverIndex),
          prevItems.find(item => item.id === draggedItemId),
          ...itemsWithoutDragged.slice(draggedOverIndex)
        ];
      });
    },
    [draggedItemId]
  );

  //   const onMouseEnter = useCallback(
  //     (e, id) => dispatch({ type: Actions.HIGHLIGHT_WAYPOINT, payload: { id } }),
  //     [dispatch]
  //   );

  //   const onMouseLeave = useCallback(
  //     (e, id) =>
  //       dispatch({ type: Actions.HIGHLIGHT_WAYPOINT, payload: { id: null } }),
  //     [dispatch]
  //   );

  useEffect(() => {
    if (shouldUpdateOrder) {
      dispatch({
        type: Actions.UPDATE_WAYPOINTS,
        payload: { waypoints: items }
      });

      setShouldUpdateOrder(false);
    }
  }, [shouldUpdateOrder, dispatch, items]);

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
          //   onMouseEnter={onMouseEnter}
          //   onMouseLeave={onMouseLeave}
        />
      ))}
    </ul>
  );
}

export default List;
