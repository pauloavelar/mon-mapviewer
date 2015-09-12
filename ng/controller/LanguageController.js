app.controller('LanguageController', ['$scope', function($scope) {
  switch (window.location.hash.substr(1)) {
    case 'pt-BR':
      $scope.string = {
        btnOpenCsvLabel: 'Abrir CSV',
        openCsvModalTitle: 'Carregue o conteúdo do seu mapa',
        hintMoreOptions: 'Mais opções',
        btnCancel: 'Cancelar',
        btnLoadIntoMap: 'Carregar no mapa'
      };
      break;
    case 'en-US': default:
      $scope.string = {
        btnOpenCsvLabel: 'Open CSV',
        openCsvModalTitle: 'Load your map contents',
        hintMoreOptions: 'More options',
        btnCancel: 'Cancel',
        btnLoadIntoMap: 'Load into map'
      };
      break;
  }
}]);
