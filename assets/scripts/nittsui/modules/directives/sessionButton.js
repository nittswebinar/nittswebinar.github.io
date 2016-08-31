/**
 *  Angular nittsAppSessionButton Module
 */

var sessionButton = angular.module('nittsAppSessionButton', ['ui.bootstrap', 'nittsAppSessions']);


sessionButton.controller('loginErrorController', ['$scope', function($scope) {
	$scope.context = {
		text: 'Mauvais mot de passe. Réessayez de vous connecter',
		isLoginError: true
	};
}]);

sessionButton.controller('registerErrorController', ['$scope', function($scope) {
	$scope.context = {
		text: 'Il y a eu un problème avec l\'authentification. Veuillez réessayer.'
	}
}]);


// loginButton
sessionButton.directive('nittsSession', ['$uibModal', 'Session', function($uibModal, Session) {

	var loginButtonLink = function (scope, element, attrs) {

		var sessionData = Session.getScopeData();


		if (attrs.nittsSession == 'authenticate') {
			element.bind("click", function() {

				$uibModal.open({
		      size: 'sm',
		      templateUrl: TEMPLATE_ELEMENTS_URL + '/loginLightbox.html'
		  	}).result.then(function (credentials) {
		      // Login lightbox submitted => send login request
					element.data("content", element.html());
					element.html('<i class="fa fa-spinner fa-lg fa-pulse"></i>');
		      Session.login(credentials, function() {
						element.html(element.data("content"));
					});

		    });
	    });
		}
		else if (attrs.nittsSession == 'logout') {
			element.bind('click', function() {
				Session.logout();
			});
		}
		else if (attrs.nittsSession == 'register') {

			element.bind("click", function() {
				// track register button clicked
				mixpanel.track("Click register button");

				$uibModal.open({
					templateUrl: TEMPLATE_ELEMENTS_URL + '/RegisterLightbox.html'
				}).result.then(function (credentials) {

					// track register form validated
					mixpanel.track("Validate register form");
					// send login request
					element.data("content", element.html());
					element.html('<i class="fa fa-spinner fa-lg fa-pulse"></i>');
					Session.register(credentials, function() {
						element.html(element.data("content"));
					});

				});
			});

		}
		else if (attrs.nittsSession == 'forgot') {

			element.bind("click", function() {
				$uibModal.open({
					templateUrl: TEMPLATE_ELEMENTS_URL + '/ForgotLightbox.html'
				}).result.then(function (email) {
					// Login lightbox submitted => send login request
					Session.forgot(email, function() {
						//TODO: do something after
					});
				});
			});

		}

	};

  return {
      restrict: 'A',
			link: loginButtonLink
  };
}]);
