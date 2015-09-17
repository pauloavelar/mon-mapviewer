var View = (function() {

  /* --- Private variables --- */

  // View init state control flag
  var hasInitBeenCalled = false;

  // jQuery selectors
  var selectors;

  /* --- Module functions --- */

  // Must be called whenever the page is created
  var fnInit = function() {
    if (hasInitBeenCalled) return;
    // creates selectors reference
    selectors = Utils.selectors;
    // creates the backdrop modal (by default an uncloseable one)
    $(selectors.fileModal.main).modal({
      show: false, backdrop: 'static', keyboard: false
    });
    // registers DOM listeners for static elements
    $(selectors.navBar.btnOpenFile).on('click', fnOpenFileModal);
    $(selectors.fileModal.dropzone)
      .on('dragover dragleave drop', fnHandleDropzone)
      .on('drop', FileLoader.handleFileDrop)
      .on('click', fnClickDropzone);
    $(selectors.fileModal.filePicker).on('change', fnChangeFile);
    $(selectors.fileModal.btnLoadMap).on('click', fnClickLoad);
    // registers DOM listeners for dynamic elements
    $(selectors.headers.table)
      .on('change', selectors.headers.usage, fnHandleHeaderUsage);
    // sets up Leaflet maps
    MapManager.init();
    // hides the loading div
    $(selectors.loading).fadeOut();
    // shows the modal with a half-second delay
    window.setTimeout(fnOpenFileModal, 500, {firstTime: true});
    // updates the flag to avoid double binding
    hasInitBeenCalled = true;
  };

  var fnChangeFile = function($event) {
    var file = $event.target.files[0];
    fnUpdateDropzone('file', file);
    FileLoader.select(file);
  };

  var fnClickDropzone = function() {
    $(selectors.fileModal.filePicker).click();
  };

  // parses the interface to get map options
  var fnClickLoad = function($event) {
    if ($($event.target).hasClass('disabled')) return;
    fnShowError();
    var mapOptions = fnPrepareMapOptions();
    if (mapOptions) {
      MapManager.load(mapOptions);
      fnHideFileModal();
    }
 };

  // handles drag and drop events in dropzone
  var fnHandleDropzone = function($event) {
    var file;
    if ($event.type == 'drop') {
      file = $event.originalEvent.dataTransfer.files[0];
      FileLoader.select(file);
    }
    fnUpdateDropzone($event.type, file);
    fnShowError();
    return false; // calls stopPropagation() and preventDefault()
  };

  // updates the dropzone with proper formatting
  var fnUpdateDropzone = function(state, file) {
    var $dropzone = $(selectors.fileModal.dropzone);
    switch (state) {
      case 'dragover':
        $dropzone.addClass('drop-hovered');
        break;
      case 'dragleave':
        $dropzone.removeClass('drop-hovered');
        break;
      case 'drop': // no break intended
        $dropzone.removeClass('drop-hovered');
      case 'file':
        fnClearHeaders();
        fnUpdateProgress(0, false);
        if (!file) {  // no file selected
          $dropzone.removeClass('file-selected file-error').addClass('no-file');
        } else if (!FileLoader.isValid(file)) {  // invalid file selected
          $dropzone.removeClass('no-file file-selected').addClass('file-error');
        } else {  // valid file, load details
          var details = FileLoader.getDetails(file);
          $(selectors.fileModal.fileName).html(details.name);
          $(selectors.fileModal.fileSize).html(details.size);
          $dropzone.removeClass('no-file file-error').addClass('file-selected');
        }
        break;
    }
  };

  // updates file loader progress bar
  var fnUpdateProgress = function(percent, isRunning) {
    var $progressBar = $(selectors.fileModal.progressBar);

    if (isNaN(percent)) percent = 0;
    if (percent > 100) percent = 100;

    $progressBar.css('width', percent + '%');
    if (isRunning)
      $progressBar.addClass('active');
    else
      $progressBar.removeClass('active');
  };

  // Opens the file opener modal, no need for a closing function
  // @param {firstTime: true/false} - makes the modal [un]closeable
  var fnOpenFileModal = function(options) {
    var $fileModal = $(selectors.fileModal.main);
    var $modalData = $fileModal.data('bs.modal');

    if (options.firstTime === true) {
      // hides the cancel button
      $fileModal.find(selectors.fileModal.btnCancel).hide();
      $modalData.options.backdrop = 'static';
      $modalData.options.keyboard = false;
    } else {
      // default: shows the cancel button, allows backdrop and kbd escaping
      $fileModal.find(selectors.fileModal.btnCancel).show();
      $modalData.options.backdrop = true;
      $modalData.options.keyboard = true;
    }

    $modalData.escape(); // apparently necessary to update the data
    $fileModal.modal('show'); // opens the modal itself
  };

  var fnHideFileModal = function() {
    $(selectors.fileModal.main).modal('hide');
  };

  var fnShowError = function(message) {
    var $panel = $(selectors.errors.panel);
    if (!message) {
      $panel.addClass('hidden');
      return;
    }
    $panel.removeClass('hidden');
    $(selectors.errors.message).html(message);
    // sets the modal to a position where error is visible
    $(selectors.fileModal.main).scrollTo($panel, {
      easing: 'swing', duration: 200, offset: -10
    });
  }

  var fnClearHeaders = function() {
    $(selectors.headers.panel).addClass('hidden');
    $(selectors.headers.table).html('');
    $(selectors.fileModal.btnLoadMap).addClass('disabled');
  };

  var fnAddHeaderRow = function(headerId, headerName) {
    var $table = $(selectors.headers.table);
    var $row = HeaderRowFactory.create(headerId, headerName);
    $(selectors.headers.panel).removeClass('hidden');
    $(selectors.fileModal.btnLoadMap).removeClass('disabled');
    $table.append($row);
  };

  // gets header usage and displays additional actions
  var fnHandleHeaderUsage = function($event) {
    var $row = $($event.target).closest('tr');
    var $action = $row.find(selectors.headers.action);

    switch($event.val) { // holds the selected option value
      case 'ignore': case 'origin': case 'destination':
        $action.html('');
        break;
      case 'filter':
        var items = FileLoader.getHeaderItems($row.data('id'));
        if (items.length == 0) {
          fnShowRowError($row, Strings.errorNoItems);
          return;
        }
        $action.html(RowFilterFactory.create(items));
        break;
      case 'lineWidth': case 'lineColor':
        var items = FileLoader.getHeaderItems($row.data('id'));
        if (!Utils.isNumberArray(items)) {
          fnShowRowError($row, Strings.errorsUsage.numeric[$event.val]);
          return;
        }
        if ($event.val == 'lineColor') {
          $action.append(ColorSetupFactory.create());
        }
        break;
    }
  };

  var fnShowRowError = function($row, message) {
    $row.find(selectors.headers.action)
      .html($('<span>').addClass('glyphicon glyphicon-exclamation-sign'))
      .append(' ' + message + '.');
  };

  var fnPrepareMapOptions = function() {
    var mapOptions = { filters: [] };
    var anyError = false;

    $(selectors.headers.table).find('tr').each(function(index) {
      var rowError;
      var $row = $(this);
      var usage = $row.find(selectors.headers.usage).val();
      var rowData = { id: $row.data('id'), name: $row.data('name') };

      switch (usage) {
        case 'filter':
          var values = $row.find(selectors.headers.filter).val();
          if (!values || values.length == 0) {
            rowError = 'empty';
          } else {
            mapOptions.filters.push({ field: rowData, accept: values });
          }
          break;
        case 'origin': case 'destination':
          if (mapOptions[usage]) { // check if unique
            rowError = 'unique';
          } else {
            mapOptions[usage] = rowData;
          }
          break;
        case 'lineWidth':
          var items = FileLoader.getHeaderItems(rowData.id);
          if (!Utils.isNumberArray(items)) { // check if numeric
            rowError = 'numeric';
          } else if (mapOptions[usage]) {   // check if unique
            rowError = 'unique';
          } else {
              mapOptions[usage] = rowData;
          }
          break;
        case 'lineColor':
          var items = FileLoader.getHeaderItems(rowData.id);
          if (!Utils.isNumberArray(items)) { // check if numeric
            rowError = 'numeric';
          } else if (mapOptions[usage]) {   // check if unique
            rowError = 'unique';
          } else {
            var radio = $row.find(selectors.headers.selectedRadio);
            mapOptions[usage] = { field: rowData, pattern: radio.val() };
          }
          break;
      }
      if (rowError) {
        fnShowError(Strings.errorsUsage[rowError][usage]);
        $row.addClass('danger');
        anyError = true;
        return false;
      }
    });
    // checks if no error occured, but still origin or destination is missing
    if (!anyError && (!mapOptions.origin || !mapOptions.destination)) {
      fnShowError(Strings.errorsUsage.empty.location);
      return;
    }
    return mapOptions;
  };

  /* --- Publicly visible module props --- */
  return {
    init: fnInit,
    openFileModal: fnOpenFileModal,
    hideFileModal: fnHideFileModal,
    showError: fnShowError,
    updateProgress: fnUpdateProgress,
    clearHeaders: fnClearHeaders,
    addHeaderRow: fnAddHeaderRow
  };

})();
