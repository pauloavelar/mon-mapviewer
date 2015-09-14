var lang = window.location.hash.substr(1).toLowerCase() || 'en';
var csvContent = [];

var ErrorCode = {
  NO_ERROR: 100,
  FILE_TOO_BIG: 101,
  TOO_MANY_LINES: 102,
  PARSING_ERROR: 103
};

$(document).ready(function() {
  var dropZone = $('#drop-zone');
  // sets up drag and drop listeners
  dropZone.on('dragover', function(evt) {
    preventDefault(evt);
    dropZone.addClass('drop-hovered');
  });
  dropZone.on('dragleave', function(evt) {
    preventDefault(evt);
    dropZone.removeClass('drop-hovered');
  });
  dropZone.on('drop', function(evt) {
    preventDefault(evt);
    var f = evt.originalEvent.dataTransfer.files[0];
    selectFile(file);
  });
  // sets up button listeners for manual file picker
  $('#drop-zone').on('click', function() {
    $('#hidden-file').click();
  });
  $('#hidden-file').on('change', function(evt) {
    var file = evt.target.files[0];
    selectFile(file);
  });
  $('#headers-table').on('change', '.header-use', manageAction);
});

function preventDefault(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}

function selectFile(file) {
  csvContent = [];
  selectedFile = file;
  updateView(file);
  readFile(file);
}

function updateView(file) {
  $('#open-csv-progress div').css('width', '0%')
    .removeClass('active').attr('aria-valuenow', '0');
  $('#headers').addClass('hidden');

  if (file && file.type.match('text/csv')) {
    // name formatting
    var fileName = file.name;
    if (fileName.length > 40) {
      fileName = fileName.substr(0, 20) + '...' +
                 fileName.substr(fileName.length - 17, fileName.length);
    }
    // size formatting
    var fileSize = file.size;
    var units = [ 'B', 'KB', 'MB' ];
    for (i = 0, len = units.length; i < len; i++) {
      if (fileSize < 1024) {
        fileSize = parseInt(fileSize) + units[i];
        break;
      }
      fileSize /= 1024;
    }
    // adding to view
    $("#file-name").html(fileName);
    $("#file-size").html(fileSize);
    $('#drop-zone').removeClass('no-file file-error').addClass('file-selected');

    if (file.size > 5000000)
      showError(ErrorCode.FILE_TOO_BIG);
    else
      showError(ErrorCode.NO_ERROR);
  } else if (file) {
    $('#drop-zone').removeClass('no-file file-selected').addClass('file-error');
  } else {
    $('#drop-zone').removeClass('file-selected file-error').addClass('no-file');
  }
}

function readFile(file) {
  if (!file) return;

  // resets the progress bar
  var progress = $('#open-csv-progress div');
  progress.css('width', '0%').addClass('active');

  // reading headers for filtering
  Papa.parse(file, {
    encoding: 'CP1250',
    step: function(results, parser) {
      if (results.errors.length > 0) {
        showError(ErrorCode.PARSING_ERROR);
        parser.abort();
      }
      csvContent.push(results.data[0]);
      var percent = Math.round(results.meta.cursor / file.size * 100);
      progress.css('width', percent + '%');
    },
    complete: function(results) {
      progress.removeClass('active');
      showHeaders();
    }
  });
}

function showHeaders() {
  var currentLine;
  var headers = [];
  $('#headers').removeClass('hidden');
  var secondCell = $('<td>')
    .addClass('col-md-3 vert-align')
    .append($('<select>')
      .addClass('form-control header-use')
      .append($('<option>')
        .attr('selected', 'selected')
        .attr('value', 'ignore')
        .append(strings[lang].optIgnore)
      )
      .append($('<option>')
        .attr('value', 'filter')
        .append(strings[lang].optUseAsFilter)
      )
      .append($('<option>')
        .attr('value', 'origin')
        .append(strings[lang].optUseAsOrigin)
      )
      .append($('<option>')
        .attr('value', 'destination')
        .append(strings[lang].optUseAsDestination)
      )
      .append($('<option>')
        .attr('value', 'lineWidth')
        .append(strings[lang].optUseAsLineWidth)
      )
      .append($('<option>')
        .attr('value', 'markerText')
        .append(strings[lang].optUseAsMarkerText)
      )
    );

  csvContent[0].forEach(function(header) {
    if (header.length > 0) {
      var clone = secondCell.clone();
      currentLine = $('#headers-table').find('tbody:last-child')
        .append($('<tr>')
          .val(header)
          .append($('<td>')
            .addClass('col-md-3 vert-align header-name')
            .append('<strong>' + header + '</strong>')
          )
          .append(clone)
          .append($('<td>')
            .addClass('col-md-6 vert-align header-filter')
          )
        );
      clone.find('select.header-use').select2({
        minimumResultsForSearch: Infinity
      });
    }
  });
}

function manageAction(event) {
  // gets value from select.header-use in each line
  // edits td.header-filter accordingly
  var line = $(event.target).closest('tr');
  line.find('td.header-filter').html('');

  switch($(event.target).val()) {
    case 'filter':
      var items = getHeaderItems(line.val());
      if (items.length == 0) {
        showLineError(line, strings[lang].errorNoItems);
      } else {
        var filterCell = line.find('td.header-filter')
          .append($('<select class="header-filter">')
            .addClass('form-control')
            .css('width', '100%')
            .attr('multiple', 'multiple')
          );
        items.forEach(function(item) {
          filterCell.find('select')
            .append('<option>' + item + '</option');
        });
        line.find('.header-filter select').select2({
          placeholder: strings[lang].showOnly
        });
      }
      break;
  }
}

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
  if (headerIndex != -1) {
    for (i = 1, len = csvContent.length; i < len; i++) {
      if (headerItems.indexOf(csvContent[i][headerIndex]) == -1) {
        headerItems.push(csvContent[i][headerIndex]);
      }
    }
  }
  headerItems.sort();
  return headerItems;
}

function createMap(headers) {
  alert(worked);
}

function showLineError(line, message) {
  line.find('.header-filter')
    .append($('<span>')
      .addClass('glyphicon glyphicon-exclamation-sign')
    )
    .append(message + '.');
}

function showError(errorCode) {
  var errorPanel = $('#error-panel');
  var errorMessage = $('#error-message');

  if (errorCode != ErrorCode.NO_ERROR) {
    errorPanel.removeClass('hidden');
  } else {
    errorPanel.addClass('hidden');
  }

  switch (errorCode) {
    case ErrorCode.PARSING_ERROR:
      errorMessage.html(strings[lang].parsingError);
      break;
    case ErrorCode.FILE_TOO_BIG:
      errorMessage.html(strings[lang].fileTooBig);
      break;
    case ErrorCode.TOO_MANY_LINES:
      errorMessage.html(strings[lang].tooManyLines);
      break;
  }
}
