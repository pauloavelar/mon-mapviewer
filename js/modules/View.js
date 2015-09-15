var View = (function() {

  /* --- Private variables --- */

  // View init state control flag
  var hasInitBeenCalled = false;

  // jQuery selectors single reference
  var selectors = {
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
      rowName: '.header-name',
      usage: 'select.header-use',
      action: '.header-action',
      filter: 'select.header-filter'
    },
    errors: {
      panel: '#error-panel',
      message: '#error-message'
    }
  };

  /* --- Module functions --- */

  // Must be called whenever the page is created
  var fnInit = function() {
    if (hasInitBeenCalled) return;
    // creating the backdrop modal (by default an uncloseable one)
    $(selectors.fileModal.main).modal({
      show:false, backdrop: false, keyboard: false
    });
    // registering DOM listeners for static elements
    $(selectors.navBar.btnOpenFile).on('click', fnOpenFileModal);
    $(selectors.fileModal.dropzone)
      .on('dragover dragleave drop', fnHandleDropzone)
      .on('drop', FileLoader.handleFileDrop)
      .on('click', fnClickDropzone);
    $(selectors.fileModal.filePicker).on('change', fnChangeFile);
    // registering DOM listeners for dynamic elements
    $(selectors.headers.table)
      .on('change', selectors.headers.usage, fnManageAction);
    // showing the modal
    fnOpenFileModal({firstTime: true});
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

  // handles drag and drop events in dropzone
  var fnHandleDropzone = function($event) {
    var file;
    if ($event.type == 'drop') {
      file = $event.originalEvent.dataTransfer.files[0];
      FileLoader.select(file);
    }
    fnUpdateDropzone($event.type, file);
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
      // hides the cancel button, blocks backdrop and kbd escaping
      $fileModal.find(selectors.fileModal.btnCancel).hide();
      $modalData.options.backdrop = false;
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

  var fnShowError = function(message) {
    var $panel = $(selectors.errors.panel);
    if (!message) {
      $panel.addClass('hidden');
      return;
    }
    $panel.removeClass('hidden');
    $(selectors.errors.message).html(message);
  }

  var fnClearHeaders = function() {
    $(selectors.headers.panel).addClass('hidden');
    $(selectors.headers.table).html('');
  };

  var fnAddHeaderRow = function(headerName) {
    var $table = $(selectors.headers.table);
    var $row = HeaderRowFactory.create();

    $(selectors.headers.panel).removeClass('hidden');

    $row.find(selectors.headers.rowName).html(headerName);
    $row.val(headerName);
    $row.find(selectors.headers.usage).select2({
      minimumResultsForSearch: Infinity
    });
    $table.append($row);
  };

  // gets header usage and displays additional actions
  var fnHandleHeaderAction = function($event) {
    // edits td.header-filter accordingly
    var $row = $($event.target).closest('tr');
    $row.find('td.header-action').html('');

    switch($(event.target).val()) {
      case 'filter':
        var items = getHeaderItems(line.val());
        if (items.length == 0) {
          showLineError(line, string.errorNoItems);
        } else {
          var filterCell = line.find('td.header-action')
            .append($('<select class="header-filter">')
              .addClass('form-control')
              .css('width', '100%')
              .attr('multiple', 'multiple')
            );
          var itemDisplay;
          items.forEach(function(item) {
            if (isNaN(item))
              itemDisplay = item;
            else
              itemDisplay = $.number(item, 2);
            filterCell.find('select')
              .append($('<option>')
                .val(item)
                .append(itemDisplay)
              );
          });
          line.find('.header-filter select').select2({
            placeholder: string.showOnly
          });
        }
        break;
    }
  }

  /* --- Publicly visible module props --- */
  return {
    init: fnInit,
    openFileModal: fnOpenFileModal,
    showError: fnShowError,
    updateProgress: fnUpdateProgress,
    clearHeaders: fnClearHeaders,
    addHeaderRow: fnAddHeaderRow
  };

})();
