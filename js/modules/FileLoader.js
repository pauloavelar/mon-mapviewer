var FileLoader = (function() {

  /* --- Enums --- */
  var ErrorCode = Object.freeze({
    NO_ERROR: 100, FILE_TOO_BIG: 101, TOO_MANY_LINES: 102, PARSING_ERROR: 103
  });

  /* --- Private properties --- */

  // file reference and content
  var mSelectedFile;
  var mCsv = [];

  /* --- Publicly visible functions --- */

  // checks if a file is valid
  var fnIsValid = function(file) {
    return file && file.name.split('.').pop().toLowerCase().match('csv');
  };

  // sets selectedFile to the file reference
  var fnSelect = function(file) {
    mSelectedFile = file;
    fnRead(mSelectedFile);
  };

  var fnGetFile = function() {
    return mSelectedFile;
  };

  // gets details of a given file (name and formatted size)
  var fnGetDetails = function(file) {
    if (!fnIsValid(file)) return;

    var units = [ 'B', 'KB', 'MB' ];
    var name = file.name;
    var size = file.size;

    if (name.length > 43) {
      name = name.substr(0, 20) + '...' + name.substr(name.length - 20, 20);
    }
    for (i = 0, len = units.length; i < len; i++) {
      if (size < 1024) {
        size = parseInt(size) + units[i];
        break;
      }
      size /= 1024;
    }

    return { name: name, size: size };
  };

  var fnShowError = function(errorCode) {
    switch (errorCode) {
      case ErrorCode.PARSING_ERROR:
        View.showError(Strings.get(parsingError));
        break;
      case ErrorCode.FILE_TOO_BIG:
        View.showError(Strings.get(fileTooBig));
        break;
      case ErrorCode.TOO_MANY_LINES:
        View.showError(Strings.get(tooManyLines));
        break;
      default:
        View.showError();
        break;
    }
  };

  var fnRead = function(file) {
    csv = [];
    // checks if the file is a valid CSV
    if (!fnIsValid(file)) return;

    // reading headers for filtering
    Papa.parse(file, {
      encoding: 'CP1250', // default MS Excel encoding
      step: function(results, parser) {
        if (results.errors.length > 0) {
          fnShowError(ErrorCode.PARSING_ERROR);
          parser.abort();
          return;
        }
        csv.push(results.data[0]);
        var percent = Math.round(results.meta.cursor / file.size * 100);
        View.updateProgress(percent, true);
      },
      complete: function(results) {
        View.updateProgress(100, false);
        fnLoadHeaders();
      }
    });
  };

  var fnLoadHeaders = function() {
    View.clearHeaders();
    csv[0].forEach(function(header) {
      if (header.length > 0)
        View.addHeaderRow(header);
    });
  };

  return {
    isValid: fnIsValid,
    getDetails: fnGetDetails,
    select: fnSelect
  };

})();



function getHeaderItems(headerName) {
  if (!csvContent[0]) return [];
  var headerIndex = -1;
  var headerItems = [];
  for (i = 0, len = csvContent[0].length; i < len; i++) {
    if (csvContent[0][i] == headerName) {
      headerIndex = i;
      break;
    }
  }
  var item;
  if (headerIndex != -1) {
    for (i = 1, len = csvContent.length; i < len; i++) {
      item = csvContent[i][headerIndex];
      if (item && item.length > 0 && headerItems.indexOf(item) == -1) {
        headerItems.push(csvContent[i][headerIndex]);
      }
    }
  }
  headerItems.sort();
  return headerItems;
}

function clickLoadMap() {
  var mapSetup = {
    filters: [],
    origin: getOrigin(),
    destination: getDestination()
  };
}

function showLineError(line, message) {
  line.find('.header-filter')
    .append($('<span>')
      .addClass('glyphicon glyphicon-exclamation-sign')
    )
    .append(' ' + message + '.');
}
