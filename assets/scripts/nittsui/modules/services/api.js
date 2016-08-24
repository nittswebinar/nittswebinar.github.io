/**
 *  Angular nittsAppApi Module
 */

var apiService = angular.module('nittsAppApi', ['nittsAppSessions', 'nittsAlert']);

// api service definition
apiService.provider('api', [function () {

	var apiDomain = 'https://nittswebinar.com/';
	var apiPrefix = '/';

	this.setApiDomain = function(_apiDomain) {
		apiDomain = _apiDomain;
	};

	this.setApiPrefix = function(_apiPrefix) {
		apiPrefix = _apiPrefix;
	};



	var api = function($http, Session, alerts) {

		var errorHandler = function(response) {
			// catch http errors and return a boolean
			var st = response.status || response.statusCode;

			alerts.add({message: 'Oups, une erreur est survenu : Erreur ' + st, type: 'danger'})
			if (!st) {
				console.log('no status received');
				console.log(response);
				return true;
			}
			// 100s and 200s responses
			if (st < 300) {
				return false;
			}
			// 300s redirections
			else if (st < 400) {
				console.log('redirection ' + st);
				return false;
			}
			// 400s errors
			else if (st < 500) {
				if (st == 403) Session.checkIfAuthenticated();
				console.log('error ' + st);
				return true;
			}
			// 500s errors
			else {
				console.log('internal server error ' + st);
				return true;
			}
		};

		this.patch = function(ressource, data, callback) {
			$http.patch(apiDomain + ressource, data).then(function(res) {
				return callback(res.data);
			}, errorHandler);
		};
		this.create = function(ressource, data, callback) {
			$http.post(apiDomain + ressource, data).then(function(res) {
				return callback(res.data);
			}, errorHandler);
			// TODO : _crsf
		};
		this.read = function(ressource, callback) {
			$http.get(apiDomain + ressource).then(function(res) {
				return callback(res.data);
			}, errorHandler);
		};
		this.update = function(ressource, data, callback) {
			$http.put(apiDomain + ressource, data).then(function(res) {
				return callback(res.data);
			}, errorHandler);
			// TODO : _crsf
		};
		this.delete = function(ressource, callback) {
			$http.delete(apiDomain + ressource).then(function(res) {
				return callback(res.data);
			}, errorHandler);
			// TODO : _crsf
		};
	};

	this.$get = ['$http', 'Session', 'alerts', function($http, Session, alerts) {
		return new api($http, Session, alerts);
	}];
}]);
