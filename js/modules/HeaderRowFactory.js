var HeaderRowFactory = (function() {

  var mTemplate;

  var fnCreateTemplate = function() {
    if (mTemplate) return;

    var $cell1st = $('<td>')
      .addClass('col-md-2 vert-align header-name');
    var $cell2nd = $('<td>')
      .addClass('col-md-4 vert-align')
      .append($('<select>')
        .addClass('form-control header-use')
        .append($('<option>')
          .attr('selected', 'selected').attr('value', 'ignore')
          .append(Strings.get('optIgnore'))
        )
        .append($('<option>')
          .attr('value', 'filter')
          .append(Strings.get('optUseAsFilter'))
        )
        .append($('<option>')
          .attr('value', 'origin')
          .append(Strings.get('optUseAsOrigin'))
        )
        .append($('<option>')
          .attr('value', 'destination')
          .append(Strings.get('optUseAsDestination'))
        )
        .append($('<option>')
          .attr('value', 'lineWidth')
          .append(Strings.get('optUseAsLineWidth'))
        )
        .append($('<option>')
          .attr('value', 'markerText')
          .append(Strings.get('optUseAsMarkerText'))
        )
      );
    var $cell3rd = $('<td>').addClass('col-md-6 vert-align header-action');

    mTemplate = $('<tr>').append($cell1st).append($cell2nd).append($cell3rd);
  }

  var fnCreate = function() {
    if (!mTemplate) fnCreateTemplate();
    return mTemplate.clone();
  }

  return {
    create: fnCreate
  };

})();
