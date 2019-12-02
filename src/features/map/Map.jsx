import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { MAPBOX_ACCESS_TOKEN } from "../../config";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./Map.module.css";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const makeLayerData = coords => {
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
};

const Map = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);
  const [{ waypoints }, dispatch] = useStateValue();

  useEffect(() => {
    if (!waypoints.length) return;
    const waypointIds = waypoints.map(waypoint => waypoint.id);
    const markerIds = markers.map(marker => marker.id);

    const diffAdded = waypointIds.filter(
      waypointId => !markerIds.includes(waypointId)
    );
    const diffRemoved = markerIds.filter(
      markerId => !waypointIds.includes(markerId)
    );

    // if (!(diffAdded.length | diffRemoved.length)) return;

    console.log("Added: " + diffAdded);
    console.log("Removed: " + diffRemoved);
    if (diffRemoved.length) {
      markers.filter(marker => {
        const shouldRemove = diffRemoved.includes(marker.id);
        if (shouldRemove) marker.markerRef.remove();

        return !shouldRemove;
      });
    }

    const tempMarkers = waypoints
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

    setMarkers(prev => [...prev, ...tempMarkers]);

    const routeCoords = waypoints.map(waypoint => [
      waypoint.coords.lng,
      waypoint.coords.lat
    ]);
    const newData = makeLayerData(routeCoords);
    map.getSource("trace").setData(newData);
  }, [waypoints, map]);

  const handleClick = e => {
    const { lngLat } = e;
    dispatch({
      type: Actions.ADD_WAYPOINT,
      payload: { coords: lngLat }
    });
  };

  useLayoutEffect(() => {
    const initializeMap = () => {
      console.log("init");
      const opts = {
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [0, 0],
        zoom: 5
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
            "line-color": "blue",
            "line-width": 5
          }
        });
      });
    };

    if (!map) initializeMap();
  }, []);

  return <div ref={mapContainer} className={styles.container} />;
};
export default Map;
