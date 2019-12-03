import React, { useCallback, useMemo, useState } from "react";
import Button from "../../components/Button";
import { useStateValue } from "../../state/provider";
import { downloadFile, makeGPX } from "./utils";

function useCanExport(waypoints) {
  const [canExport, setCanExport] = useState();

  useMemo(() => {
    setCanExport(waypoints.length > 1);
  }, [waypoints.length]);

  return [canExport];
}

function Export() {
  const [{ waypoints }] = useStateValue();
  const [canExport] = useCanExport(waypoints);

  const handleClick = useCallback(() => {
    // create GPX file from stored waypoints
    const gpx = makeGPX(waypoints);
    // trigger file download
    downloadFile("cross-country.gpx", gpx);
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
