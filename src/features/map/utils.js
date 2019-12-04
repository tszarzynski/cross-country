export function makeLayerData(markers) {
  const coords = markers.map(marker => {
    const { lng, lat } = marker.markerRef.getLngLat();
    return [lng, lat];
  });

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
