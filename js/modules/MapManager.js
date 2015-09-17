var MapManager = (function() {

  var mMap;

  var IconTemplate = L.Icon.extend({
    options: {
      iconSize: [20, 30],
      iconAnchor: [10, 29],
      popupAnchor: [0, -32]
    }
  });

  var icons = {
    default: new IconTemplate({ iconUrl: 'img/marker-default.png' }),
    dc: new IconTemplate({ iconUrl: 'img/marker-dc.png' }),
    plant: new IconTemplate({ iconUrl: 'img/marker-plant.png' }),
    both: new IconTemplate({ iconUrl: 'img/marker-both.png' }),
  };

  var fnBind = function(map) {
    mMap = map;
  };

  var fnLoad = function(options) {
    // fetches locations

    // create line matrix
    // iterate csv
      // check filters
      // set width and color in matrix
    // call plotMap
  };

  var fnPlot = function(matrix, mapOptions) {
    var minW, maxW, minC, maxC;
    var currW, currC;

    // gets minimum and maximum values for width and color
    Utils.iterate2D(matrix, function(item, outerProp, innerProp) {
      if (!minW || minW > item.width) minW = item.width;
      if (!maxW || maxW < item.width) maxW = item.width;

      if (!minC || minC > item.color) minC = item.color;
      if (!maxC || maxC < item.color) maxC = item.color;
    });

    // gets all locations in the matrix
    var props = Utils.getAllProperties(matrix, 1);
    var locations = Utils.makeUniqueArray(props);

    // adds all the locations in the matrix
    locations.forEach(function(id) {
      var location = Locations.findById(id);
      fnAddMarker({
        latitude: location.lat,
        longitude: location.long,
        kind: location.kind,
        title: location.name
      });
    });

    // iterates the matrix and plot each line
    Utils.iterate2D(matrix, function(item, oProp, iProp) {
      var start = Locations.findById(oProp);
      var end   = Locations.findById(iProp);

      if (start && end) {
        var color = Utils.getColor({
          mode: colorMode, min: minC, max: maxC, val: item.color
        });
        var popup = PopupTextFactory.create(item, {
          origin: , destination: ,
          widthField: ,
          colorField:
        });

        fnAddLine({ points: [
            [ start.latitude, start.longitude ],
            [ end.latitude, end.longitude ]
          ],
          width: Utils.getPercent(item.width, minW, maxW),
          color: color,
          popup: popup });
      }
    });
  };

  /* Adds a marker to the map
   * params: details = {
   *   latitude, longitude, kind, title
   * }
   */
  var fnAddMarker = function(details) {
    var marker = L.marker([details.latitude, details.longitude], {
      icon: icons[details.kind] || icons.default,
      title: details.title
    }).addTo(mMap);
    if (details.title) marker.bindPopup(details.title);
  };

  /* Adds a marker to the map
   * params: details = {
   *   points: [ { latitude, longitude } ], color, width, popup
   * }
   */
  var fnAddLine = function(details) {
    var calculatedWidth = details.width * 7;
    if (calculatedWidth < 1)
      calculatedWidth = 1;
    else if (calculatedWidth > 7)
      calculatedWidth = 7;
    var polyline = L.polyline(details.points, {
      color: details.color, fill: false, lineCap: 'round',
      weight: calculatedWidth // max: 7px
    }).addTo(mMap);
    if (details.popup) polyline.bindPopup(details.popup);
  };

  return {
    bind: fnBind,
    load: fnLoad,
    plot: fnPlot,
    addMarker: fnAddMarker,
    addLine: fnAddLine
  };

})();
