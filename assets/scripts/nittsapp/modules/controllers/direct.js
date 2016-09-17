
/**
 * nittsApp DirectController
 */

nittsApp.controller('DirectController', ['$scope', '$state', 'api', 'Session', function($scope, $state, api, Session) {
  // access restricted : connected users only
  Session.checkIfAuthenticated();

  // initialize the $scope attributes
  $scope.event = {};
  $scope.attendees = [];

  $scope.hangoutToken;
  $scope.hangoutButtonDisplayed = false;
  $scope.attendeeDetailsTemplateUrl = 'views/elements/attendeeDetailsPopover.html';
  // $scope.attendees = [];
  // $scope.linkUrl = "";

  // define the controller variables
  var eventId = $state.params.id; ;
  $scope.event.id = eventId;
  $scope.registerToEventLink = $state.href('viewer.register', {id: eventId}, {absolute: true});


  // retrieve datas from the api and update the scope attributes
  api.read('event/' + eventId + '/hangoutToken', function(data) {
    $scope.hangoutToken = data;
  });

  api.read('event/' + eventId, function (data) {
    $scope.event = data;
  });

  // Join the live event room
  io.socket.get('/event/' + eventId + '/joinAsMaster', function(data, jwres) {
    // TODO : do something when connected and joined
  });

  // Listen to the the event and update the $scope attributes when changes
  io.socket.on('EventUpdate', function(data) {
    $scope.event = data;
    $scope.$apply();
  });


  io.socket.get('/event/' + eventId + '/attendees', function(resData, jwres) {
    $scope.attendees = resData;
    $scope.$apply();
  });

  // listen to Attendee events in real time
	io.socket.on("AttendeeUpdate", function (data) {
    $scope.attendees = data;
    $scope.$apply();
  });

  $scope.activateReplay = function() {
    api.update('event/' + eventId, {status: 'replaying'}, function (data) {
      $scope.event = data;
    });
  };

  $scope.displayHangoutButton = function() {
    $scope.hangoutButtonDisplayed = true;
  };

  $scope.resetHangout = function () {
    $scope.event.status = 'waiting';
  };

}]);
