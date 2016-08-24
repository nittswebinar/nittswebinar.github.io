/**
 *
 *  NITTS Front-end UI
 *  copyright NITTS Webinar 2016
 *  v1.0.0
 *
 *
 */

'use strict';

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


nittsApp.run(['amMoment', 'editableOptions', 'editableThemes', function(amMoment, editableOptions, editableThemes) {
  // amMoment configuration for french only
  amMoment.changeLocale('fr');

  // editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';

}]);
