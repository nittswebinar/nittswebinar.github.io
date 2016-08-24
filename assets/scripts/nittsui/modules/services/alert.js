/**
 *  Angular nittsAlert Module
 */

var nittsAlert = angular.module('nittsAlert', ['ui.bootstrap']);

nittsAlert.directive('alertDisplay', [function() {


  return {
      restrict: 'E',
			template: '<uib-alert ng-repeat="alert in alerts.all" type="{{alert.type}}" close="closeAlert($index)">{{alert.message}}</uib-alert>',
      controller: ['$scope', 'alerts', function($scope, alerts) {

        $scope.alerts = {
          all: []
        };

        $scope.alerts = alerts.get();

        $scope.closeAlert = function(index) {
          alerts.remove(index);
        };

      }]
  };

}]);


// alert service definition
nittsAlert.service('alerts', [function() {

  // initialize the data with empty alert array
  var alerts = {
    all: []
  }

  this.get = function() {
    return alerts;
  };

  this.add = function(alert) {
    alerts.all.push(alert);
  };

  this.remove = function(index) {
    alerts.all.splice(index, 1);
  };

  this.clear = function() {
    alerts.all = [];
  };

}]);
