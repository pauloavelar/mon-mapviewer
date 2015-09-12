$(document).ready(function() {
  var csvModal  = $('#open-csv-modal');
  var btnCancel = $('#open-csv-btn-cancel');
  // hides the cancel button in modal for the 1st time
  btnCancel.hide();
  // shows the modal when the page is loaded
  csvModal.modal({
    backdrop: 'static',
    keyboard: false
  });
  // sets up the behavior change when the modal is first closed
  // restore cancel button visibility, ESC and click outside behaviors
  csvModal.on('hidden.bs.modal', function(evt) {
    if (btnCancel.is(':hidden')) {
      csvModal.data('bs.modal').options.backdrop = true;
      csvModal.data('bs.modal').options.keyboard = true;
      btnCancel.show();
    }
  });
  // sets up the click action for the open csv button
  $('#open-csv-btn').on('click', function() {
    csvModal.modal();
  });
});
