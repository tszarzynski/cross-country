export function makeLayerData(waypoints) {
  const coords = waypoints.map(waypoint => [
    waypoint.coords.lng,
    waypoint.coords.lat
  ]);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coords
        }
      }
    ]
  };
}
