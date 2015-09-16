var Strings = (function() {

  // strings repository
  var strings = {
    br: {
      appName: 'Map Viewer',
      or: 'ou',
      selectManually: 'para selecioná-lo em seu computador',
      dropHere: 'Solte um arquivo CSV aqui para carregá-lo',
      clickHere: 'clique aqui',
      selectedFile: 'Arquivo selecionado',
      btnOpenCsvLabel: 'Abrir CSV',
      selectOther: 'para selecionar outro arquivo',
      openFileModalTitle: 'Carregue o conteúdo do seu mapa',
      hintMoreOptions: 'Mais opções',
      btnCancel: 'Cancelar',
      btnLoadIntoMap: 'Carregar mapa',
      fileColumns: 'Colunas no arquivo selecionado',
      // select options
      optIgnore: 'Ignorar',
      optUseAsFilter: 'Usar como filtro',
      optUseAsOrigin: 'Usar como origem',
      optUseAsDestination: 'Usar como destino',
      optUseAsLineWidth: 'Usar como espessura da linha',
      optUseAsLineColor: 'Usar como cor da linha',
      showOnly: 'Selecione itens para serem exibidos',
      // errors
      tooManyLines: 'O arquivo selecionado excede o máximo de 10.000 linhas',
      fileTooBig: 'O arquivo selecionado é muito grande (maior que 5MB)',
      parsingError: 'Não foi possível ler o arquivo selecionado',
      errorNotCsv: 'O arquivo selecionado não é um arquivo CSV',
      errorNoItems: 'Não há dados neste campo',
      errorsUsage: {
        empty: {
          filter: 'Filtros não podem estar vazios',
          location: 'Origem e destino são campos obrigatórios'
        },
        unique: {
          origin: 'Dois campos não podem ser usados como origem ao mesmo tempo',
          destination: 'Dois campos não podem ser usados como destino ao mesmo tempo',
          lineWidth: 'Dois campos não podem ser usados como espessura de linha ao mesmo tempo',
          lineColor: 'Dois campos não podem ser usados como cor de linha ao mesmo tempo'
        },
        numeric: {
          lineWidth: 'Campos de espessura de linha precisam ser numéricos',
          lineColor: 'Campos de cor de linha precisam ser numéricos'
        }
      }
    },
    en: {
      appName: 'Map Viewer',
      or: 'or',
      selectManually: 'to select it in your computer',
      dropHere: 'Drop a CSV file here to load it',
      clickHere: 'click here',
      selectedFile: 'Selected file',
      btnOpenCsvLabel: 'Open CSV',
      selectOther: 'to select another file',
      openFileModalTitle: 'Load your map contents',
      hintMoreOptions: 'More options',
      btnCancel: 'Cancel',
      btnLoadIntoMap: 'Load map',
      fileColumns: 'Columns in the selected file',
      // select options
      optIgnore: 'Ignore',
      optUseAsFilter: 'Use as filter',
      optUseAsOrigin: 'Use as origin',
      optUseAsDestination: 'Use as destination',
      optUseAsLineWidth: 'Use as line width',
      optUseAsLineColor: 'Use as line color',
      showOnly: 'Select items to be shown',
      // errors
      tooManyLines: 'The selected file exceeds the maximum of 10,000 lines',
      fileTooBig: 'The selected file is too big (over 5MB)',
      parsingError: 'Unable to read the selected file',
      errorNotCsv: 'The selected file is not a CSV file',
      errorNoItems: 'There is no data in this field',
      errorsUsage: {
        empty: {
          filter: 'Filters cannot be empty',
          location: 'Origin and destination fields are required'
        },
        unique: {
          origin: 'Two fields cannot be used as origin at the same time',
          destination: 'Two fields cannot be used as destination at the same time',
          lineWidth: 'Two fields cannot be used as line width at the same time',
          lineColor: 'Two fields cannot be used as line color at the same time'
        },
        numeric: {
          lineWidth: 'Line width field values must be numeric',
          lineColor: 'Line color field values must be numeric'
        }
      }
    }
  };

  // loading language preference, default: en (english)
  var mHash = window.location.hash.substr(1).toLowerCase();
  var mLanguage = (strings[mHash] ? mHash : 'en');

  return strings[mLanguage];

})();
