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
      table: '#headers-table',
      usage: 'select.header-use'
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
      .on('dragover dragleave drop', fnUpdateDropzone)
      .on('drop', FileLoader.handleFileDrop);
      .on('click', $(selectors.fileModal.filePicker).click);
    $(selectors.fileModal.filePicker).on('change', fnUpdateDropzone);
    // registering DOM listeners for dynamic elements
    $(selectors.headers.table)
      .on('change', selectors.headers.usage, fnManageAction);
    // updates the flag to avoid double binding
    hasInitBeenCalled = true;
  };

  // handles drag and drop events in dropzone
  var fnHandleDropzone = function($event) {
    $event.stopPropagation();
    $event.preventDefault();

    var file = $event.dataTransfer.files[0];
    updateDropzone($event.type, file);
    FileLoader.selectFile(file);
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
        $(selectors.fileModal.headersPanel).addClass('hidden');
        updateProgress(0, false);
        if (!file) {  // no file selected
          $dropzone.removeClass('file-selected file-error').addClass('no-file');
        } else if (!FileLoader.isValid(file)) {  // invalid file selected
          $dropzone.removeClass('no-file file-selected').addClass('file-error');
        } else {  // valid file, load details
          var details = FileLoader.getDetails(file);
          $(selector.fileModal.fileName).html(details.name);
          $(selector.fileModal.fileSize).html(details.formattedSize);
          $dropzone.removeClass('no-file file-error').addClass('file-selected');
          if (details.size > 5000000)
            fnShowError(ErrorCode.FILE_TOO_BIG);
          else
            fnShowError(ErrorCode.NO_ERROR);
        }
        break;
    }
  };

  var fnUpdateProgress = function(percent, isRunning) {
    var $progressBar = $(selectors.fileModal.progressBar);
    if (isNaN(percent)) percent = 0;
    if (percent > 100) percent = 100;

    if (isRunning)
      $progressBar.css('width', percent + '%').addClass('active');
    else
      $progressBar.css('width', '0%').removeClass('active');
  };

  // Opens the file opener modal, no need for a closing function
  // @param {firstTime: true/false} - makes the modal [un]closeable
  var fnOpenFileModal = function(options) {
    if (!hasInitBeenCalled) init();

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

  var fnShowError = function(errorMessage) {
    
  }

  /* --- Publicly visible module props --- */
  return {
    init: fnInit,
    openFileModal: fnOpenFileModal
  };
})();
