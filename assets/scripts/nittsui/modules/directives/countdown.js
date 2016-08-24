
/**
 * Angular nittsAppCountdown module and directive
 */

var countdown = angular.module('nittsAppCountdown', []);


countdown.directive('countdown', ['$interval', '$timeout', function($interval, $timeout) {

   return {
      restrict: 'E',
      templateUrl: TEMPLATE_ELEMENTS_URL + '/countdown.html',
      scope: {
        date: '=',
        finish: '&finish'
      },
      link: function(scope, el, attrs) {
        // initialize the variables (global to the link function)
        var date = moment();
        var now = moment();
        scope.ready = false;
        scope.countdown = {};


        // update the countdown values when change of the date attribute value
        scope.$watch('date', function(newVal, oldVal) {
          date = moment(newVal);
          // call back finish if the countdown is over
          if (date.diff(now) < 1000) {
            scope.finish()
            scope.ready = false;
          }
          else {
            calculateTimes();
            scope.ready = true;
          }
        });


        // update the countdown values every second
        $interval(function() {
          calculateTimes();
        }, 1000);


        // define the computing values function
        function calculateTimes() {
          // update the now
          now = moment();

          // call back finish if the countdown is over
          if (date.diff(now) < 1000) {
            scope.finish()
            scope.ready = false;
          }

          // then update the countdown values
          scope.countdown = {
            days: date.diff(now, 'days'),
            hours: date.diff(now, 'hours') % 24,
            minutes: date.diff(now, 'minutes') % 60,
            seconds: date.diff(now, 'seconds') % 60
          };
        }

      }
   };
}]);
