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

  var fnGetCsvContents = function() {
    return mCsv;
  }

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
    for (var i = 0, len = units.length; i < len; i++) {
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
        View.showError(Strings.parsingError);
        break;
      case ErrorCode.FILE_TOO_BIG:
        View.showError(Strings.fileTooBig);
        break;
      case ErrorCode.TOO_MANY_LINES:
        View.showError(Strings.tooManyLines);
        break;
      default:
        View.showError();
    }
  };

  var fnRead = function(file) {
    mCsv = [];
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
        mCsv.push(results.data[0]);
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
    for (var i = 0, len = mCsv[0].length; i < len; i++) {
      if (mCsv[0][i]) View.addHeaderRow(i, mCsv[0][i]);
    }
  };

  var fnGetHeaderItems = function(headerId) {
    if (!Array.isArray(mCsv) || !mCsv[0]) return [];

    var item, items = [];

    for (var i = 1, len = mCsv.length; i < len; i++) {
      item = mCsv[i][headerId];
      if (item && items.indexOf(item) == -1) {
        items.push(item); // pushes only unique and defined items
      }
    }
    var isNumeric = Utils.isNumberArray(items);
    return items.sort(isNumeric ? Utils.compareNumbers : undefined);
  };

  return {
    isValid: fnIsValid,
    getDetails: fnGetDetails,
    select: fnSelect,
    getHeaderItems: fnGetHeaderItems
  };

})();

function clickLoadMap() {
  var mapSetup = {
    filters: [],
    origin: getOrigin(),
    destination: getDestination()
  };
}
