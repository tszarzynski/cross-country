/**
 * Creates GPX file from waypoints
 * @param {array} waypoints
 */
export function makeGPX(waypoints) {
  const doc = document.implementation.createDocument("", "", null);

  // gpx node
  const gpxElem = doc.createElement("gpx");
  gpxElem.setAttribute("version", "1.1");
  gpxElem.setAttribute("xmlns", "http://www.topografix.com/GPX/1/1");
  gpxElem.setAttribute(
    "xmlns:xsi",
    "http://www.w3.org/2001/XMLSchema-instance"
  );
  gpxElem.setAttribute(
    "xsi:schemaLocation",
    "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
  );

  // name node
  const nameElem = doc.createElement("name");
  nameElem.appendChild(doc.createTextNode("Cross Coutry Route"));

  // metadata noda
  const metaElem = doc.createElement("metadata");
  metaElem.appendChild(nameElem.cloneNode(true));

  // trk node
  const trkElem = doc.createElement("trk");
  trkElem.appendChild(nameElem.cloneNode(true));

  //trkseg node
  const trksegElem = doc.createElement("trkseg");

  waypoints.forEach(({ coords: { lng, lat } }) => {
    const trkptElem = doc.createElement("trkpt");
    trkptElem.setAttribute("lat", lat);
    trkptElem.setAttribute("lon", lng);
    trksegElem.appendChild(trkptElem);
  });

  trkElem.appendChild(trksegElem);

  gpxElem.appendChild(metaElem);
  gpxElem.appendChild(trkElem);
  doc.appendChild(gpxElem);

  // serialize
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(doc);

  return xmlString;
}

/**
 * Saves file
 * @param {string} filename
 * @param {string} text
 */
export function downloadFile(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
