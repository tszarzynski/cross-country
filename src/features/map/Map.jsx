import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MAPBOX_ACCESS_TOKEN } from "../../config";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./Map.module.css";
import { makeLayerData } from "./utils";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

function Map() {
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [{ waypoints }, dispatch] = useStateValue();

  useEffect(() => {
    // array of waypoints ids
    const waypointIds = waypoints.map(waypoint => waypoint.id);
    // array of markers ids
    const markerIds = markers.map(marker => marker.id);

    // added waypoints
    const diffAdded = waypointIds.filter(
      waypointId => !markerIds.includes(waypointId)
    );

    //removed waypoints
    const diffRemoved = markerIds.filter(
      markerId => !waypointIds.includes(markerId)
    );

    console.log("Diff +" + diffAdded.length + " -" + diffRemoved.length);
    // remove unused markers
    const markersAfterRemoval = markers.filter(marker => {
      const shouldRemove = diffRemoved.includes(marker.id);
      if (shouldRemove) marker.markerRef.remove();
      return !shouldRemove;
    });

    // add new markers
    const newMarkers = waypoints
      .filter(waypoint => diffAdded.includes(waypoint.id))
      .map(waypoint => {
        var el = document.createElement("div");
        el.className = styles.marker;
        el.innerText = waypoint.id;

        return {
          id: waypoint.id,
          markerRef: new mapboxgl.Marker(el)
            .setLngLat(waypoint.coords)
            .addTo(map)
        };
      });

    // update markers if necessary
    if (diffAdded.length | diffRemoved.length)
      setMarkers([...markersAfterRemoval, ...newMarkers]);

    // draw route if enough waypoints
    if (waypoints.length) {
      const newData = makeLayerData(waypoints);
      map.getSource("trace").setData(newData);
    }
  }, [waypoints, map, markers]);

  useLayoutEffect(() => {
    const handleClick = e => {
      const { lngLat } = e;
      dispatch({
        type: Actions.ADD_WAYPOINT,
        payload: { coords: lngLat }
      });
    };

    const initializeMap = () => {
      const opts = {
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [13.3842189630532, 52.51553727399474],
        zoom: 10
      };

      const map = new mapboxgl.Map(opts);

      map.on("load", () => {
        setMap(map);
        map.resize();
        map.on("click", handleClick);

        map.addSource("trace", {
          type: "geojson",
          data: makeLayerData([])
        });
        map.addLayer({
          id: "trace",
          type: "line",
          source: "trace",
          paint: {
            "line-color": "#0F86E8",
            "line-width": 5
          }
        });
      });
    };

    if (!map) initializeMap();
  }, [map, dispatch]);

  return <div ref={mapContainer} className={styles.container} />;
}
export default Map;
