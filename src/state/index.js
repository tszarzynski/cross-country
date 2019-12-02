export const Actions = {
  ADD_WAYPOINT: "AddWaypoint",
  REMOVE_WAYPOINT: "RemoveWaypoint",
  UPDATE: "Update"
};

export const initialState = {
  waypoints: []
};

let nextId = 0;
export const reducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case Actions.ADD_WAYPOINT:
      const {
        payload: { coords }
      } = action;

      const newWaypoint = {
        id: ++nextId,
        name: `Waypoint ${nextId}`,
        coords
      };

      return {
        ...state,
        waypoints: [...state.waypoints, newWaypoint]
      };

    case Actions.REMOVE_WAYPOINT:
      const {
        payload: { id }
      } = action;

      return {
        ...state,
        waypoints: state.waypoints.filter(waypoint => waypoint.id !== id)
      };

    case Actions.UPDATE:
      const {
        payload: { waypoints }
      } = action;

      return { ...state, waypoints };

    default:
      return state;
  }
};
