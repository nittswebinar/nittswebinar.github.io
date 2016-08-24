/**
 *  Angular nittsAppSessionButton Module
 */

var sessionButton = angular.module('nittsAppSessionButton', ['ui.bootstrap', 'nittsAppSessions']);

sessionButton.controller('loginController', ['$scope', function($scope) {
	$scope.credentials = {};
}]);

sessionButton.controller('loginErrorController', ['$scope', function($scope) {
	$scope.context = {
		text: 'Mauvais mot de passe. Réessayez de vous connecter',
		isLoginError: true
	};
}]);

// loginButton
sessionButton.directive('login', ['$uibModal', 'Session', function($uibModal, Session) {

	var loginButtonLink = function (scope, element, attrs) {

		function handleLoginResponse(loginStatus) {
			element.html(element.data("content"));
			if (loginStatus == 200) {
				//Do nothing special
			}
			else {
				$uibModal.open({
					templateUrl: TEMPLATE_ELEMENTS_URL + '/ErrorModal.html',
					controller: 'loginErrorController'
				});
			}
		}


		element.bind("click", function() {

			$uibModal.open({
	      size: 'sm',
	      templateUrl: TEMPLATE_ELEMENTS_URL + '/loginLightbox.html',
	      controller: 'loginController'
	  	}).result.then(function (credentials) {
	      // Login lightbox submitted => send login request
	      Session.login(credentials, handleLoginResponse);
				element.data("content", element.html());
				element.html('<i class="fa fa-spinner fa-lg fa-pulse"></i>');
	    });
    });
	};

  return {
      restrict: 'A',
			// template: '<i class="fa fa-spinner fa-lg fa-pulse"></i> <span ng-transclude></span>',
			// transclude: true,
			link: loginButtonLink
  };
}]);


sessionButton.controller('registerErrorController', ['$scope', function($scope) {
	$scope.context = {
		text: 'Il y a eu un problème avec l\'authentification. Veuillez réessayer.'
	}
}]);

// registerButton
sessionButton.directive('register', ['$uibModal', 'Session', function($uibModal, Session) {

	var RegisterButtonLink = function (scope, element, attrs) {

		function handleRegisterResponse(loginStatus) {
			element.html(element.data("content"));
			if (loginStatus == 200) {
				//Do nothing special
			}
			else {

				$uibModal.open({
					templateUrl: TEMPLATE_ELEMENTS_URL + '/ErrorModal.html',
					controller: 'registerErrorController'
				});
			}
		}


		element.bind("click", function() {

			// track register button clicked
			mixpanel.track("Click register button");

			$uibModal.open({
				templateUrl: TEMPLATE_ELEMENTS_URL + '/RegisterLightbox.html',
				controller: 'loginController'
			}).result.then(function (credentials) {

				// track register form validated
				mixpanel.track("Validate register form");

				// Login lightbox submitted => send login request
				Session.register(credentials, handleRegisterResponse);
				element.data("content", element.html());
				element.html('<i class="fa fa-spinner fa-lg fa-pulse"></i>');
			});
		});
};

return {
		restrict: 'A',
		// template: '<i class="fa fa-spinner fa-lg fa-pulse"></i> <span ng-transclude></span>',
		// transclude: true,
		link: RegisterButtonLink
};
}]);


// logoutButton
sessionButton.directive('logout', ['Session', function(Session) {

	function logoutButtonLink(scope, element, attrs) {
		element.bind('click', function() {
			Session.logout();
		});
	}

	return {
      restrict: 'A',
			link: logoutButtonLink
  };
}]);


// sessionButton.controller('forgotController', ['$scope', function($scope) {
// 	$scope.email = '';
// }]);

sessionButton.controller('forgotAlertController', ['$scope', function($scope) {
	$scope.context = {
		title: 'Mot de passe oublié ?',
		text: 'Un email vient de vous être envoyé pour réinitialiser votre mot de passe.',
		type: 'alert-success'
	};
}]);

// forgotButton
sessionButton.directive('forgot', ['$uibModal', 'Session', function($uibModal, Session) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

			element.bind("click", function() {
				$uibModal.open({
					templateUrl: TEMPLATE_ELEMENTS_URL + '/ForgotLightbox.html'
					// controller: 'forgotController'
				}).result.then(function (email) {
					// Login lightbox submitted => send login request
					Session.forgot(email, function(data) {
						$uibModal.open({
							templateUrl: TEMPLATE_ELEMENTS_URL + '/alertModal.html',
							controller: 'forgotAlertController'
						});
					});
				});
			});
		}
	}
}]);
