
/**
 * nittsApp DashboardController
 */

nittsApp.controller('DashboardController', ['$scope', '$state', 'api', 'Session', function($scope, $state, api, Session) {
  // access restricted : connected users only
  Session.checkIfAuthenticated();

  // initialize $scope attributes
  $scope.events = [];



  // retrieve data from the api and update the $scope
  api.read('event/all', function(data) {
    $scope.events = data;
  });


  // initialize the $scope attributes
  // $scope.activeTab = 0;
  //
  // // catch the tabLoaded events and set the tab accordingly
  // $scope.$on('confLoaded', function() {
  //     $scope.activeTab = 1;
  // });
  // $scope.$on('statsLoaded', function() {
  //     $scope.activeTab = 2;
  // });
  // $scope.$on('planLoaded', function() {
  //     $scope.activeTab = 3;
  // });
  // $scope.$on('settingsLoaded', function() {
  //     $scope.activeTab = 4;
  // });

}]);
