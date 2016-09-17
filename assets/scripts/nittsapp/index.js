/**
 *
 *  NITTS Client web application
 *  copyright NITTS Webinar 2015
 *  v0.2.0
 *
 *
 */

'use strict';

mixpanel.track("Load nittsapp angular application");

// Declaration of the main nittsApp module
var nittsApp = angular.module('nittsApp', [
    // 'nittsAppSessions',
    // 'nittsAppCountdown',
    // 'nittsAppApi',
    // 'nittsAppSessionButton',
    // 'nittsAlert',
    // 'ui.bootstrap',
    // 'xeditable',
    // 'angularMoment',
    // 'contactMe',
    'nittsUI',
    'nittsAppSocket',
    'nittsAppHangoutButton',
    'SGAutorepondeurModule',
    'ui.router',
    'youtube-embed',
    'ngSanitize'
]);

nittsApp.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {


	$urlRouterProvider.otherwise('/fr/');

	$stateProvider
    .state('user', {
      abstract: true,
      url: '/fr/',
      controller: 'UserController',
      templateUrl: 'assets/views/user/user.html'
    })
    .state('user.infos', {
      parent: 'user',
      url: '',
      templateUrl: 'assets/views/user/user.infos.html'
    })
    .state('user.autoresponder', {
      parent: 'user',
      url: '/autorepondeur',
      templateUrl: 'assets/views/user/user.autoresponder.html'
    })
    .state('user.affiliation', {
      parent: 'user',
      url: '/affiliation',
      controller: 'UserAffiliationController',
      templateUrl: 'assets/views/user/user.affiliation.html'
    })
		.state('dashboard', {
		    abstract: true,
		    url: 'dashboard',
		    controller: 'DashboardController',
		    templateUrl: 'assets/views/dashboard/dashboard.html'
		})
    .state('dashboard.plan', {
        url: '',
		    parent: 'dashboard',
		    controller: 'DashPlanController',
		    templateUrl: 'assets/views/dashboard/dash.plan.html'
		})
		.state('dashboard.conf', {
        url: '/evenement/:id',
		    parent: 'dashboard',
		    controller: 'DashConfController',
		    templateUrl: 'assets/views/dashboard/dash.conf.html'
		})
    .state('dashboard.modify', {
        url: '/evenement/:id/modifier',
        parent: 'dashboard',
        controller: 'DashModController',
        templateUrl: 'assets/views/dashboard/dash.modify.html'
    })
		.state('dashboard.stats', {
		    parent: 'dashboard',
		    controller: 'DashStatsController',
		    templateUrl: 'assets/views/dashboard/dash.stats.html'
		})
		.state('dashboard.settings', {
		    parent: 'dashboard',
		    controller: 'DashSettingsController',
		    templateUrl: 'assets/views/dashboard/dash.settings.html'
		})
		.state('live', {
		    url: 'direct/evenement/:id',
		    controller: 'DirectController',
		    templateUrl: 'assets/views/direct/controls.html'
    });


	// $locationProvider.html5Mode(true);
  //$httpProvider.defaults.withCredentials = true;
  $httpProvider.useApplyAsync(true);

}]);


nittsApp.run(['$http', 'amMoment', 'editableOptions', 'editableThemes', function($http, amMoment, editableOptions, editableThemes) {
  // amMoment configuration for french only
  amMoment.changeLocale('fr');

  // editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';

  // $http.get('/csrfToken').success(function(data) {
  //   $http.defaults.headers.common['x-csrf-token'] = data._csrf;
  // });

}]);
