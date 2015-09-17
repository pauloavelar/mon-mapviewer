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

  var fnInit = function(map) {
    mMap = L.map('map').setView([-15, -55], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
    }).addTo(mMap);
  }

  var fnLoad = function(options) {
    var matrix = {};

    // fetches locations
    var locations = Locations.getAll();
    var len = locations.length;

    // creates lines matrix
    for (var i = 0; i < len; i++) {
      matrix[locations[i].id] = {};
      for (var j = 0; j < len; j++) {
        matrix[locations[i].id][locations[j].id] = {};
        matrix[locations[i].id][locations[j].id].width = 0;
        matrix[locations[i].id][locations[j].id].color = 0;
      }
    }

    // gets contents from FileLoader
    var csv = FileLoader.getCsvContents();
    if (!csv || !Array.isArray(csv)) return;

    var widthId = (options.lineWidth ? options.lineWidth.id : false);
    var colorId = (options.lineColor ? options.lineColor.field.id : false);
    var originId = options.origin.id;
    var destinationId = options.destination.id;

    // iterates the whole csv, except headers
    for (var i = 1, len = csv.length; i < len; i++) {
      // check filters, if failed then go to next row
      if (!fnTestFilters(csv[i], options.filters)) continue;
      // set width and color in matrix

      var row  = csv[i];
      try {
        var cell = matrix[row[originId]][row[destinationId]];
      } catch(err) {
        continue;
      }
      if (widthId) {
        cell.width += parseFloat(row[widthId]);
      } else {
        cell.width = 1;
      }
      if (colorId) {
        cell.color += parseFloat(row[colorId]);
      } else {
        cell.color = 1;
      }
    }
    // calls plotMap
    fnPlot(matrix, options);
  };

  var fnPlot = function(matrix, options) {
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
          mode: (options.lineColor ? options.lineColor.pattern : 'gray'),
          min: minC, max: maxC, val: item.color
        });
        var popup = PopupTextFactory.create(item, {
          origin: start.name, destination: end.name,
          widthField: (options.lineWidth ? options.lineWidth.name : null),
          colorField: (options.lineColor ? options.lineColor.field.name : null)
        });

        if (minW > 0 || item.width == 0) return true; // calls next
        fnAddLine({ points: [
            [ start.lat - 0.0005, start.long - 0.0005],
            [ end.lat + 0.00005, end.long + 0.00005 ]
          ], // small fix in end coordinates to avoid line overlapping
          width: Utils.getPercent(item.width, minW, maxW),
          color: color,
          popup: popup
        });
      }
    });
  };

  var fnTestFilters = function(row, filters) {
    for (var i = 0, len = filters.length; i < len; i++) {
      var field  = filters[i].field;
      var accept = filters[i].accept;

      if (accept.indexOf(row[field.id]) == -1) return false;
    }
    return true;
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
    var calculatedWidth = details.width * 8 + 2;
    if (calculatedWidth < 2)
      calculatedWidth = 2;
    else if (calculatedWidth > 10)
      calculatedWidth = 10;
    var polyline = L.polyline(details.points, {
      color: details.color, fill: false, lineCap: 'round',
      weight: calculatedWidth
    }).addTo(mMap);
    if (details.popup) polyline.bindPopup(details.popup);
  };

  return {
    init: fnInit,
    load: fnLoad,
    plot: fnPlot,
    addMarker: fnAddMarker,
    addLine: fnAddLine
  };

})();
