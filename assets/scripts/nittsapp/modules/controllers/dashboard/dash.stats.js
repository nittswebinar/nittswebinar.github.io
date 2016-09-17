/**
 * nittsApp DashStatsController
 */

nittsApp.controller('DashStatsController', ['$scope', '$state', 'api', function($scope, $state, api) {
  // notify the DashboardController
  $scope.$emit('statsLoaded');

}]);
