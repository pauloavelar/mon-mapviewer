var Utils = (function() {

  var mSelectors = Object.freeze({
    navBar: {
      btnOpenFile: '#btn-open-file'
    },
    loading: '#loading',
    fileModal: {
      main: '#file-modal',
      dropzone: '#dropzone',
      fileName: '#file-name',
      fileSize: '#file-size',
      filePicker: '#hidden-file',
      progressBar: '#file-progress div',
      btnLoadMap: '#btn-modal-load',
      btnCancel: '#btn-modal-cancel'
    },
    headers: {
      panel: '#headers',
      table: '#headers-table tbody',
      rowName: 'td.header-name',
      usage: 'select.header-use',
      action: 'td.header-action',
      filter: 'select.header-filter',
      firstRadio: 'input[type=radio]:first',
      selectedRadio: 'input[name=colorRadio]:checked'
    },
    errors: {
      panel: '#error-panel',
      message: '#error-message'
    },
    map: {
      widthText: '.width-text',
      colorText: '.color-text'
    }
  });

  var fnGetColor = function(opt) {
    if (opt && opt.mode) {
      if (!opt.val) opt.val = 0;
      if (!opt.min) opt.min = 0;
      if (!opt.max) opt.max = 100;

      var color = 200 * fnGetPercent(opt.val, opt.min, opt.max);

      switch (opt.mode) {
        case 'gray':
          return '#888';
        case 'redToGreen':
          return fnRgbToHex(200 - color, color, 0);
        case 'greenToRed':
          return fnRgbToHex(color, 200 - color, 0);
      }
    }
    return '';
  };

  var fnGetPercent = function(value, min, max) {
    if (!min && !max) return 0;
    if (!min) min = 0;
    if (!max) max = 0;
    if (!value) value = 0;

    if (min == max) return 0.2;

    if (min > max) {
      var aux = max;
      max = min;
      min = aux;
    }

    return (value - min) / (max - min);
 };

  var fnIsNumberArray = function(array) {
    if (!array || !Array.isArray(array)) return false;

    var result = true;
    array.forEach(function(item) {
      if (!item || isNaN(item)) {
        result = false;
        return;
      }
    });
    return result;
  };

  var fnCompareNumbers = function(a, b) {
    // NaN controls
    if (isNaN(a) && isNaN(b)) return 0;
    if (isNaN(a)) return -1; // a comes first
    if (isNaN(b)) return  1; // b comes first

    // Number comparisons
    var numA = parseFloat(a), numB = parseFloat(b);
    if (numA == numB) return 0;
    return (numA < numB ? -1 : 1);
  };

  var fnRgbToHex = function(r, g, b) {
    if (isNaN(r) || isNaN(g) || isNaN(b)) return;

    return '#' +
      ('0' + parseInt(r, 10).toString(16)).slice(-2) +
      ('0' + parseInt(g, 10).toString(16)).slice(-2) +
      ('0' + parseInt(b, 10).toString(16)).slice(-2);
  };

  var fnIterate2D = function(array2D, fn) {
    if (typeof fn != 'function') return;

    for (var oProp in array2D) {
      if (!array2D.hasOwnProperty(oProp)) continue;

      for (var iProp in array2D[oProp]) {
        if (!array2D[oProp].hasOwnProperty(iProp)) continue;

        if (fn(array2D[oProp][iProp], oProp, iProp) === false) return;
      }
    }
  };

  // list all properties of an object until nth level
  // obj.prop = level 0; obj.prop.prop = level 1; and so on
  var fnGetAllProps = function(obj, deepestLevel, currentLevel) {
    var props = [];
    if (!currentLevel) currentLevel = 0;

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        props.push(prop);
        if (currentLevel < deepestLevel) {
          if (typeof obj[prop] == 'object')
            props = props.concat(fnGetAllProps(obj, deepestLevel, currentLevel + 1));
        }
      }
    }

    return props;
  };

  var fnMakeUniqueArray = function(array) {
    if (!Array.isArray(array)) return array;

    var uniqueArray = [];
    array.forEach(function(item) {
      if (uniqueArray.indexOf(item) == -1) uniqueArray.push(item);
    });
    return uniqueArray;
  }

  return {
    selectors: mSelectors,
    compareNumbers: fnCompareNumbers,
    isNumberArray: fnIsNumberArray,
    getColor: fnGetColor,
    rgbToHex: fnRgbToHex,
    iterate2D: fnIterate2D,
    getAllProperties: fnGetAllProps,
    makeUniqueArray: fnMakeUniqueArray,
    getPercent: fnGetPercent
  };

})();
