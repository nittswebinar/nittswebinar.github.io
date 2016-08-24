/**
 *   Angular nittsAppSession module
 */

var sessionService = angular.module('nittsAppSessions', ['ngCookies']);

sessionService.service('Session', ['$http', '$cookies', function($http, $cookies) {

  var API_URL = "https://www.nittswebinar.com"
  var AUTH_URL = API_URL + "/auth"

  // get the session data from the local cookies storage
  var scopeData = {
    attendee: $cookies.getObject("attendee") || {},
    user: $cookies.getObject("user") || {}
  };
  if (scopeData.user.id) scopeData.authenticated = true;


  this.isAuthorized = function () {
    return scopeData.authenticated;
  };


  this.checkIfAuthenticated = function() {
    updateUserData(scopeData.user.id);
  };

  this.userUpdated = function(user) {
    updateUserCookie(user);
  };

  this.getScopeData = function() {
    return scopeData;
  };

  this.login = function(credentials, callback) {
    $http.post(AUTH_URL + '/local', {identifier: credentials.email, password: credentials.password}).then(function (res) {
      // success response
      if (res.status == 200) {
        // success on server authentication

        // mixpanel tracking
        // identify the user if he deleted the mixpanel cookie
        mixpanel.identify(res.data.session.passport.user);
        mixpanel.people.set({
          "$email": credentials.email,
          "$last_login": new Date()
        });

        scopeData.authenticated = true;
        updateUserData(res.data.session.passport.user, function() {});

        // this.retryLastRequest();
      }
      else {
        console.log(res.data);
        console.log(res.status);
      }
      callback(res.status);
    }, function(res) {
      // error response
      if(res.status == 403) {
        // TODO: display an "bad password or something error"
        // or propose to register as a new user
      }
      else {
        console.log(res.data);
        console.log(res.status);
      }
      callback(res.status);
    });
  };

  this.register = function(credentials, callback) {
    $http.post(AUTH_URL + '/local/register', {identifier: credentials.email, password: credentials.password}).then(function (res) {
      // success response
      if (res.status == 200) {
        // success on server authentication
        // track register process successful
				mixpanel.track("Register process successful");
        // track user profile
        mixpanel.alias(res.data.session.passport.user);
        mixpanel.people.set({
          "$email": credentials.email,
          "$created": new Date(),
          "$last_login": new Date()
        });

        scopeData.authenticated = true;
        updateUserData(res.data.session.passport.user, function() {});

        // this.retryLastRequest();
      }
      else {
        console.log(res.data);
        console.log(res.status);
      }
      callback(res.status);
    }, function(res) {
      // error response
      if(res.status == 403) {
        // TODO: display an "bad password or something error"
        // or propose to register as a new user
      }
      callback(res.status);
    });
  };

  this.logout = function() {
    // send logout request to the api
    $http.get(API_URL + '/logout').then(function(res) {
      if (res.status == 200) {
        updateUserData();
      }
      else {
        console.log(res.data);
        console.log(res.status);
      }
    });
  };

  this.forgot = function(email, callback) {
    $http.post(AUTH_URL + '/forgot', {email: email}).then(function (res) {
      // success response
      // email send from the server
      callback(res.data);

    }, function(res) {
      // error response
      // TODO: display an alert message
      // need to create an angular alert service share by all the application
    });
  };

  this.openAttendeeSession = function(attendee) {
    scopeData.attendee = attendee;
    $cookies.putObject("attendee", attendee);
  };

  function updateUserData (userId, cb) {
    var cb = cb || function() {};
    // if the function is called without argument, reset the session locally
    if (!userId) {
      updateUserCookie({});
      // redirect to the home
      return
      // TODO : open login modal
    }
    // else, get user data from the api
    else {
      $http.get(API_URL + '/user/' + userId).then(function(res) {
        // if success, update the session locally

        updateUserCookie(res.data);
        return cb();

      }, function(res) {
        // if error, then reset the session locally
        if (res.status == 403) {
          
          updateUserCookie({});

          // redirect to the home
          return
        }
      });
    }
  }
  function updateUserCookie (user) {
    $cookies.putObject("user", user);
    scopeData.user = user;
    scopeData.authenticated = user.id ? true : false;
  }
}]);
