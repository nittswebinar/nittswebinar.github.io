/**
 * nittsApp DashModController
 */

nittsApp.controller('DashModController', ['$scope', '$state', '$uibModal', 'api', 'Session', function($scope, $state, $uibModal, api, Session) {



  // initialize the $scope attributes
  $scope.event = {}
  $scope.webinar = {};

  // $scope attributes for datepicker directive
  $scope.minDate = 0;
  $scope.status = {
    opened: false
  };
  $scope.open = function() {
    $scope.status.opened = true;
  };

  // update the $scope attributes from the api
  api.read('event/' + $state.params.id, function (data) {
    $scope.event = data;
    $scope.event.date = new Date(data.date);
    $scope.webinar = data.webinar;
  });

  // define the $scope functions
  $scope.validateModification = function() {
    $uibModal.open({
			templateUrl: 'views/elements/actionConfirmationModal.html',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.modalPurpose = 'modifier le webinaire';
				$scope.ok = function() {
					$uibModalInstance.close('ok');
				};

				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
			}]
		}).result.then(function(data) {
			// confirmation through modal => send the link using socket
      var webinar = {
        name: $scope.webinar.name,
        title: $scope.webinar.title,
        description: $scope.webinar.description
      };
      api.update('webinar/' + $scope.webinar.id, webinar, function(data) {
        $scope.webinar = data;
      });

      var _event = {
        date: $scope.event.date,
      };
      api.update('event/' + $state.params.id, _event, function(data) {
        $scope.event = data;
      });
      $state.go('main.dashboard.conf', {id: $state.params.id}, {reload: true});

		}, function () {
			//modal dismissed => do nothing
		});

  };

  $scope.cancelModification = function() {

    $state.go('main.dashboard.conf', {id: $state.params.id});
  };

}]);
