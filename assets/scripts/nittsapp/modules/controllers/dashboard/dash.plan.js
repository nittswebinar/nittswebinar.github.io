/**
 * nittsApp DashPlanController
 */

nittsApp.controller('DashPlanController', ['$scope', '$state', 'api', 'Session', function($scope, $state, api, Session) {
  // notify the DashboardController
  // $scope.$emit('planLoaded');

  // initialize the $scope attributes
  $scope.event = {
    date: new Date()
  };
  $scope.webinar = {};

  // $scope attributes for datepicker directive
  $scope.minDate = new Date();
  $scope.status = {
    opened: false
  };
  $scope.open = function() {
    $scope.status.opened = true;
  };

  // define the $scope functions
  $scope.createWebinar = function() {
    var webinar = $scope.webinar;
    api.create('webinar', webinar, function(data) {
        $scope.webinar = data;
        $scope.createEvent();
    });
  };

  $scope.createEvent = function() {
    var event = $scope.event;
    event.webinar = $scope.webinar.id;
    api.create('event', event, function(data) {
        $scope.event = data;
        $state.go('main.dashboard.conf', {id: $scope.event.id}, {reload: true});
    });
  };
}]);
