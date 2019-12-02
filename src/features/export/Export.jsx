import React, { useCallback, useState, useEffect } from "react";
import Button from "../../components/Button";
import { useStateValue } from "../../state/provider";
import { downloadFile, makeGPX } from "./utils";

function Export() {
  const [{ waypoints }] = useStateValue();
  const [canExport, setCanExport] = useState(waypoints.length !== 0);

  const handleClick = useCallback(() => {
    // create GPX file from stored waypoints
    const gpx = makeGPX(waypoints);
    // trigger file download
    downloadFile("cross-country.gpx", gpx);
  }, [waypoints]);

  useEffect(() => {
    setCanExport(waypoints.length !== 0);
  }, [waypoints]);

  return (
    <Button
      label="Download your route"
      onClick={handleClick}
      disabled={!canExport}
    />
  );
}

export default Export;
