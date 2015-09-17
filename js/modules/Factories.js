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
          .attr('value', 'lineColor')
          .append(Strings.optUseAsLineColor)
        )
      );
    var $cell3rd = $('<td>').addClass('col-md-6 vert-align header-action');

    mTemplate = $('<tr>').append($cell1st).append($cell2nd).append($cell3rd);
  };

  var fnCreate = function(headerId, headerName) {
    if (!mTemplate) fnCreateTemplate();

    var $instance = mTemplate.clone();
    $instance.data('id', headerId).data('name', headerName);
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
    mTemplate = $('<span>') // span neeeded because select2 needs a parent
      .append($('<select>')
        .addClass('form-control header-filter')
        .attr('multiple', 'multiple')
        .css('width', '100%') // inline CSS because of select2
      );
  };

  var fnCreate = function(items) {
    if (!mTemplate) fnCreateTemplate();

    var itemDisplay;
    var $instance = mTemplate.clone();
    var $select = $instance.find(Utils.selectors.headers.filter);
    var isNumeric = Utils.isNumberArray(items);
    items.forEach(function(item) {
      itemDisplay = (isNumeric ? $.number(item, 2) : item);
      $select.append($('<option>').val(item).append(itemDisplay));
    });
    $select.select2({ placeholder: Strings.showOnly });

    return $instance;
  };

  return {
    create: fnCreate
  };

})();


var ColorSetupFactory = (function() {

  var mTemplate;

  var fnGetRadioOptions = function() {
    var options = [
      { value: 'greenToRed', label: Strings.radio.greenToRed },
      { value: 'redToGreen', label: Strings.radio.redToGreen }
    ];
    return options;
  };

  var fnCreateTemplate = function() {
    if (mTemplate) return;
    mTemplate = $('<div>').addClass('radio');

    fnGetRadioOptions().forEach(function(opt) {
      mTemplate.append($('<label>')
        .addClass('radio-inline')
        .append($('<input>')
          .attr('type', 'radio')
          .attr('name', 'colorRadio')
          .val(opt.value)
        )
        .append(opt.label)
      );
    });
  };

  var fnCreate = function() {
    if (!mTemplate) fnCreateTemplate();
    return mTemplate.clone();
  };

  return {
    create: fnCreate
  };

})();


var PopupTextFactory = (function() {

  var mTemplate;

  var fnCreateTemplate = function() {
    if (mTemplate) return;
    mTemplate = $('<div>')
      .append($('<span>')
        .addClass('width-label')
        .append(Strings.map.lineWidthLabel)
      )
      .append('<br>')
      .append($('<span>')
        .addClass('width-text')
      )
      .append('<br>').append('<br>')
      .append($('<span>')
        .addClass('color-label')
        .append(Strings.map.lineColorLabel)
      )
      .append('<br>')
      .append($('<span>')
        .addClass('color-text')
      );
  };

  var fnFormatLabel = function(info) {
    if (!info.field) return Strings.map.nothing;
    return info.field + ' ' + Strings.map.from + ' ' +
           info.from + ' ' + Strings.map.to + ' ' +
           info.to + ': ' + $.number(info.value, 2);
  };

  // item; info: origin, destination, widthField, colorField
  var fnCreate = function(item, info) {
    if (!mTemplate) fnCreateTemplate();

    var $instance = mTemplate.clone();

    var widthText = fnFormatLabel({
      field: info.widthField, value: item.width,
      from: info.origin, to: info.destination
    });
    var colorText = fnFormatLabel({
      field: info.colorField, value: item.color,
      from: info.origin, to: info.destination
    });

    $instance.find(Utils.selectors.map.widthText).html(widthText);
    $instance.find(Utils.selectors.map.colorText).html(colorText);

    return $instance.html(); // only the html is needed
  };

  return {
    create: fnCreate
  };

})();
