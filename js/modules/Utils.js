var Utils = (function() {

  var mSelectors = Object.freeze({
    navBar: {
      btnOpenFile: '#btn-open-file'
    },
    fileModal: {
      main: '#file-modal',
      dropzone: '#dropzone',
      fileName: '#file-name',
      fileSize: '#file-size',
      filePicker: '#hidden-file',
      progressBar: '#file-progress div',
      btnCancel: '#btn-modal-cancel'
    },
    headers: {
      panel: '#headers',
      table: '#headers-table tbody',
      rowName: 'td.header-name',
      usage: 'select.header-use',
      action: 'td.header-action',
      filter: 'select.header-filter'
    },
    errors: {
      panel: '#error-panel',
      message: '#error-message'
    }
  });

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

  return {
    isNumberArray: fnIsNumberArray,
    selectors: mSelectors
  };

})();
