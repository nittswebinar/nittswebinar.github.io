/**
 *  nittsApp LinkController
 */


nittsApp.controller('LinkController', ['$scope', '$state', 'api', 'Session', '$uibModal', function($scope, $state, api, Session, $uibModal) {

	// initialize the $scope attributes
	$scope.links = [];
	$scope.newLink = {};
	$scope.linkCreation = false;
	var oldLink = {};

	// retrieve links data from the api
	api.read('event/' + $state.params.id +'/links', function(data) {
		$scope.links = data;
	});

	// define $scope methods

	$scope.shareLink = function(link) {
		$uibModal.open({
			templateUrl: 'views/elements/actionConfirmationModal.html',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.modalPurpose = 'partager le lien';
				$scope.ok = function() {
					$uibModalInstance.close('ok');
				};

				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
			}]
		}).result.then(function(data) {
			// confirmation through modal => send the link using socket
			io.socket.post('/link/share', link, function(resData, jwres) {
				// TODO : display a message if the link has been shared correctly
				// message in green !
			});

		}, function () {
			//modal dismissed => do nothing
		});

	};

	$scope.synchroniseLink = function() {
		// TODO : check if the url is valid

		if ($scope.newLink.id) {
			var link = {
				title: $scope.newLink.title,
				url: $scope.newLink.url,
				CallToAction: $scope.newLink.CallToAction
			};
		 	api.update('link/' + $scope.newLink.id, link, function(data) {
				$scope.links[$scope.links.indexOf(oldLink)] = data;
				oldLink = {};
			});
		}

		else {
			var newLink = {
				title: $scope.newLink.title,
				url: $scope.newLink.url,
				CallToAction: $scope.newLink.CallToAction,
				event: $scope.event.id
			};

			api.create('link', newLink, function(data) {
				$scope.links.push(data);
			});
		}
		$scope.linkCreation = false;
		$scope.newLink = {};
	};

	$scope.deleteLink = function(linkId) {

		$uibModal.open({
			templateUrl: 'views/elements/actionConfirmationModal.html',
			controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
				$scope.modalPurpose = 'supprimer le lien';
				$scope.ok = function() {
					$uibModalInstance.close('ok');
				};

				$scope.cancel = function() {
					$uibModalInstance.dismiss('cancel');
				};
			}]
		}).result.then(function(data) {
			// confirmation through modal => send the link using socket
			api.delete('link/' + linkId, function(data) {
				$scope.links.splice($scope.links.indexOf(data), 1);
			});

		}, function () {
			//modal dismissed => do nothing
		});

	};

	$scope.modifyLink = function(link) {
		$scope.newLink = link;
		oldLink = link;
		$scope.linkCreation = true;
	};

	$scope.createLink = function() {
		$scope.newLink = {};
		$scope.linkCreation = true;
	};

	$scope.hideLinkCreation = function() {
		$scope.linkCreation = false;
		$scope.newLink = {};
	};

}]);
