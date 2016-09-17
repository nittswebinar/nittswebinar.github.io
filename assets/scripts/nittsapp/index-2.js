/**
 *
 *  NITTS Front-end Single page app
 *  copyright NITTS Webinar 2016
 *  v1.2.0
 *
 *
 */

'use strict';
var HOST_URL = location.protocol + '//' + location.host;
var TEMPLATE_ELEMENTS_URL = HOST_URL + "/assets/elements";

// Declaration of the main nittsApp module
var nittsUI = angular.module('nittsUI', [
    'nittsAppSessions',
    'nittsAppCountdown',
    'nittsAppApi',
    'nittsAppSessionButton',
    'nittsAlert',
    'contactMe',
    'angularMoment',
    'ui.bootstrap',
    'xeditable'
]);


nittsUI.run(['amMoment', 'editableOptions', 'editableThemes', '$rootScope', 'Session', 'alerts', function(amMoment, editableOptions, editableThemes, $rootScope, Session, alerts) {
  // amMoment configuration for french only
  amMoment.changeLocale('fr');

  // editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';

  // Atach global services to the rootScope to make them available directly in the views
  $rootScope.session = Session;

  $rootScope.alerts = alerts;

}]);
