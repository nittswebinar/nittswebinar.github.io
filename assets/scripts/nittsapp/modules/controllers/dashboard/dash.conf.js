/**
 * nittsApp DashConfController
 */

nittsApp.controller('DashConfController', ['$scope', '$state', '$uibModal', 'api', function($scope, $state, $uibModal, api) {
  // notify the DashboardController
  // $scope.$emit('confLoaded');

  // initialize the $scope attributes
  $scope.event = {};
  // $scope.progressBar = {};
  // $scope.displayCountdown = true;
  $scope.registerToEventLink = '';

  // retrieve data from the api and update the $scope attributes
  api.read('event/' + $state.params.id, function(data) {
      $scope.event = data;
  });

  $scope.registerToEventLink = $state.href('viewer.register', {id: $state.params.id}, {absolute: true});

  $scope.deleteEvent = function (eventId) {
    $uibModal.open({
			templateUrl: 'views/elements/actionConfirmationModal.html',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.modalPurpose = 'supprimer le webinaire';
				$scope.ok = function() {
					$uibModalInstance.close('ok');
				};

				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
			}]
		}).result.then(function(data) {
			// confirmation through modal => send the link using socket
			api.delete('event/' + eventId, function(data) {
				// TODO : display something to the user to confirm that it has been deleted
        $state.go('main.dashboard.plan', {}, {reload: true});
			});

		}, function () {
			//modal dismissed => do nothing
		});
  };

  $scope.countdownFinished = function() {
    // $scope.displayCountdown = false;
  };

}]);
