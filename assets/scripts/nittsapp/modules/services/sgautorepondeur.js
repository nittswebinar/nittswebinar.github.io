/**
 *  Angular SGAutorepondeur Module
 */

var SGAutorepondeurModule = angular.module('SGAutorepondeurModule', []);

// SGAutorepondeur service definition
SGAutorepondeurModule.service('SGAutorepondeur', ['$http', function($http) {

	this.registerUrl = 'https://sg-autorepondeur.com/inscriptionabonne.php';

  this.register = function(options, cb) {
		var data = {
			email: options.attendee.email,
			prenom: options.attendee.screenName,
			listeid: options.listeid,
			membreid: options.membreid
		};
    $http.post(this.registerUrl, data).then(function (res) {
			console.log(res);
      // success response
			cb();
    }, function(res) {
			console.log('error : ', res);
			cb()
      // error response
        // TODO: display an "bad password or something error"
        // or propose to register as a new user
    });
  };

}]);
