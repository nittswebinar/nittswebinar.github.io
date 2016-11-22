/**
 *   Angular nittsAppSession module
 */

var sessionService = angular.module('nittsAppSessions', ['ngCookies', 'nittsAlert']);

  sessionService.service('Session', ['$http', '$cookies', 'alerts', function($http, $cookies, alerts) {

  var API_URL = "https://www.app.nittswebinar.com";
  var AUTH_URL = API_URL + "/auth";

  // get the session data from the local cookies storage
  var scopeData = {
    attendee: $cookies.getObject("attendee") || {},
    user: $cookies.getObject("user") || {},
    accessToken: $cookies.getObject("accessToken") || null
  };

  this.isAuthenticated = function() {
    if (scopeData.user && scopeData.user.id) return true;
    else return false;
  };

  this.getAccessToken = function() {
    return scopeData.accessToken;
  };

  this.setAccessToken = function(accessToken) {
    scopeData.accessToken = accessToken;
    $cookies.putObject("accessToken", accessToken);
    return scopeData.accessToken;
  };

  this.getUser = function() {
    return scopeData.user;
  };

  this.setUser = function(user) {
    scopeData.user = user;
    $cookies.putObject("user", user);
    return scopeData.user;
  };

  this.setAttendee = function(attendee) {
    scopeData.attendee = attendee;
    $cookies.putObject("attendee", attendee);
    return scopeData.attendee;
  };

  this.destroy = function() {
    this.setUser({});
    this.setAccessToken(null);
  };

  this.checkIfAuthenticated = function(cb) {
    var cb = cb || function() {};
    var that = this;
    // if the function is called without argument, reset the session locally
    if (!this.isAuthenticated()) {
      that.destroy();
      alerts.add({type: 'warning', message: "Vous n'êtes pas authentifié. Veuillez vous connecter. "})
      // TODO : open login modal
      return cb();
    }
    // else, get user data from the api
    else {
      $http({
        method: 'GET',
        url: API_URL + '/user/' + scopeData.user.id,
        headers: {
          'Authorization': 'Bearer ' + this.getAccessToken()
        }
      }).then(function(res){
        // updae user datas in the local session
        that.setUser(res.data);
        return cb();

      }, function(res) {
        // if error, then reset the session locally
        that.destroy();
        return cb();
      });
    }
  };

  this.getScopeData = function() {
    return scopeData;
  };

  this.login = function(credentials, cb) {
    var cb = cb || function() {};
    var that = this;
    $http.post(AUTH_URL + '/local', {identifier: credentials.email, password: credentials.password})
    .then(function (res) {
      var data = res.data;
      // mixpanel tracking : identify the user if he deleted the mixpanel cookie
      mixpanel.identify(res.data.session.passport.user);
      mixpanel.people.set({
        "$email": credentials.email,
        "$last_login": new Date()
      });

      that.setUser(data.user);
      that.setAccessToken(data.accessToken);
      return cb();
    }, function(res) {
      var message = res.data ? res.data.message : "";
      alerts.add({type: "danger", message: "Une erreur est survenue pendant la connexion : " + message});
      return cb();
    });
  };

  this.register = function(credentials, cb) {
    var cb = cb || function(){};
    var that = this;
    $http.post(AUTH_URL + '/local/register', {identifier: credentials.email, password: credentials.password})
    .then(function (res) {
      var data = res.data;
      // track register process successful
			mixpanel.track("Register process successful");
      // track user profile
      mixpanel.alias(res.data.session.passport.user);
      mixpanel.people.set({
        "$email": credentials.email,
        "$created": new Date(),
        "$last_login": new Date()
      });

      that.setUser(data.user);
      that.setAccessToken(data.accessToken);
      return cb();
    }, function(res) {
      alerts.add({type: 'warning', message: "Une erreur est survenue pendant la création du compte. Veuillez réessayer. " + res.data.message});
      return cb();
    });
  };

  this.logout = function(cb) {
    var cb = cb || function(){};
    var that = this;
    $http({
      method: 'GET',
      url: API_URL + '/logout',
      headers: {
        'Authorization': 'Bearer ' + this.getAccessToken()
      }
    }).then(function(res) {
      that.destroy();
      return cb();
    }, function(res) {
      alerts.add({type: 'warning', message: "Une erreur est survenue pendant la deconnexion"});
      return cb();
    });
  };

  this.forgot = function(email, cb) {
    cb = cb || function(){};
    $http.post(AUTH_URL + '/forgot', {email: email}).then(function (res) {

      alerts.add({type: 'success', message: "Un email vient de vous être envoyé pour réinitialiser votre mot de passe."});
      // success response
      // email send from the server
      cb();

    }, function(res) {
      // error response
      alerts.add({type: 'danger', message: "Problème de réinitialisation de mot de passe : " + res.data.message});
      cb();
    });
  };

}]);
