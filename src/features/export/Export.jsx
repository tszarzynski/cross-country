import React, { useCallback, useState, useEffect } from "react";
import Button from "../../components/Button";
import { useStateValue } from "../../state/provider";
import { downloadFile, makeGPX } from "./utils";

const Export = () => {
  const [{ waypoints }] = useStateValue();
  const [canExport, setCanExport] = useState(waypoints.length !== 0);

  const handleClick = useCallback(() => {
    const gpx = makeGPX(waypoints);
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
};

export default Export;
