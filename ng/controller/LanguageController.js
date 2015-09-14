app.controller('LanguageController', ['$scope', function($scope) {
  var language = window.location.hash.substr(1).toLowerCase();
  if (strings[language])
    $scope.string = strings[language];
  else
    $scope.string = strings['en'];
}]);
