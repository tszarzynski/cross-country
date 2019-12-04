export const Actions = {
  ADD_WAYPOINT: "AddWaypoint",
  REMOVE_WAYPOINT: "RemoveWaypoint",
  UPDATE_WAYPOINT: "UpdateWaypoint",
  UPDATE_WAYPOINTS: "UpdateWaypoints"
};

export const initialState = {
  waypoints: []
};

let nextId = 0; //track waypoint ids
export const reducer = (state, action) => {
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

    case Actions.UPDATE_WAYPOINT: {
      const {
        payload: { id, coords }
      } = action;

      return {
        ...state,
        waypoints: state.waypoints.map(waypoint =>
          waypoint.id === id ? { ...waypoint, coords } : waypoint
        )
      };
    }
    case Actions.UPDATE_WAYPOINTS:
      const {
        payload: { waypoints }
      } = action;

      return { ...state, waypoints };

    default:
      return state;
  }
};
