/**
 * nittsApp DashSettingsController
 */

nittsApp.controller('DashSettingsController', ['$scope', '$state', 'api', function($scope, $state, api) {
  // notify the DashboardController
  $scope.$emit('settingsLoaded');
  
}]);
