/**
 *  Angular nittsAppSocket module
 */


var socketService = angular.module('nittsAppSocket', []);

socketService.factory('socket', [function () {
    return false; //io.connect();
}]);
