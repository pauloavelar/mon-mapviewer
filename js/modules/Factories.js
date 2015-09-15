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
          .append(Strings.optIgnore)
        )
        .append($('<option>')
          .attr('value', 'filter')
          .append(Strings.optUseAsFilter)
        )
        .append($('<option>')
          .attr('value', 'origin')
          .append(Strings.optUseAsOrigin)
        )
        .append($('<option>')
          .attr('value', 'destination')
          .append(Strings.optUseAsDestination)
        )
        .append($('<option>')
          .attr('value', 'lineWidth')
          .append(Strings.optUseAsLineWidth)
        )
        .append($('<option>')
          .attr('value', 'markerText')
          .append(Strings.optUseAsMarkerText)
        )
      );
    var $cell3rd = $('<td>').addClass('col-md-6 vert-align header-action');

    mTemplate = $('<tr>').append($cell1st).append($cell2nd).append($cell3rd);
  };

  var fnCreate = function(headerName) {
    if (!mTemplate) fnCreateTemplate();

    var $instance = mTemplate.clone();
    $instance.val(headerName);
    $instance.find(Utils.selectors.headers.rowName).html(headerName);
    $instance.find(Utils.selectors.headers.usage).select2({
      minimumResultsForSearch: Infinity
    });

    return $instance;
  };

  return {
    create: fnCreate
  };

})();


var RowFilterFactory = (function() {

  var mTemplate;

  var fnCreateTemplate = function() {
    if (mTemplate) return;
    mTemplate = $('<select>')
      .addClass('form-control header-filter')
      .attr('multiple', 'multiple')
      .css('width', '100%'); // inline CSS because of select2
  };

  var fnCreate = function(items) {
    if (!mTemplate) fnCreateTemplate();

    var itemDisplay;
    var $instance = mTemplate.clone();
    var isNumeric = Utils.isNumberArray(items);
    items.forEach(function(item) {
      itemDisplay = (isNumeric ? $.number(item, 2) : item);
      $instance.append($('<option>').val(item).append(itemDisplay));
    });
    $instance.select2({ placeholder: Strings.showOnly });

    return $instance;
  };

  return {
    create: fnCreate
  };

})();
