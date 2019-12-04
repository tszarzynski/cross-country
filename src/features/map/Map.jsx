import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { MAPBOX_ACCESS_TOKEN } from "../../config";
import { Actions } from "../../state";
import { useStateValue } from "../../state/provider";
import styles from "./Map.module.css";
import { makeLayerData } from "./utils";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

function Map() {
  const [{ waypoints }, dispatch] = useStateValue();
  const mapContainer = useRef(null);
  const [map, setMap] = useState();
  const [markers, setMarkers] = useState([]);

  const onDragEnd = useCallback(
    (e, id) => {
      dispatch({
        type: Actions.UPDATE_WAYPOINT,
        payload: { id, coords: e.target.getLngLat() }
      });
    },
    [dispatch]
  );

  const onDrag = useCallback(() => {
    // force markers redraw
    setMarkers(prev => [...prev]);
  }, []);

  useEffect(() => {
    // make new marker from waypoint
    function makeMarker(waypoint, index) {
      var el = document.createElement("div");
      el.className = styles.marker;
      el.innerText = index + 1;

      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat(waypoint.coords)
        .addTo(map);

      marker.on("dragend", e => onDragEnd(e, waypoint.id));
      marker.on("drag", e => onDrag(e, waypoint.id));

      return {
        id: waypoint.id,
        markerRef: marker
      };
    }

    setMarkers(prev => {
      // create markers for waypoints, but reuse existing ones
      const newMarkers = waypoints.map((waypoint, index) => {
        const existingMarker = prev.find(marker => marker.id === waypoint.id);

        if (existingMarker) {
          existingMarker.markerRef.getElement().innerText = index + 1;
          return existingMarker;
        } else {
          return makeMarker(waypoint, index);
        }
      });

      const newMarkerIds = newMarkers.map(marker => marker.id);

      // remove unused markers from map
      prev
        .filter(marker => !newMarkerIds.includes(marker.id))
        .forEach(markerToRemove => markerToRemove.markerRef.remove());

      return newMarkers;
    });
  }, [waypoints, map, onDrag, onDragEnd]);

  useLayoutEffect(() => {
    function update() {
      // console.log("redraw trace");
      const newData = makeLayerData(markers);
      map.getSource("trace").setData(newData);
    }
    // draw route if enough waypoints
    if (markers.length) {
      requestAnimationFrame(update);
    }
  }, [markers, map]);

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
        style: "mapbox://styles/mapbox/streets-v11?optimize=true", // stylesheet location
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
