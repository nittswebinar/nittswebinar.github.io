/**
 *  nittsApp UserController
 *  associated to the user.html view and manage the user settings
 *
 */


nittsApp.controller('UserController', ['$scope', 'api', 'Session', '$http', function($scope, api, Session, $http) {
  // initialize the scope datas
  $scope.user = Session.getScopeData().user;

  // retrieve data from the api and update the scope
  api.read('user/' + $scope.user.id, function (data) {
    $scope.user = data;
    Session.userUpdated(data);
  });



  $scope.updateUser = function(data, key) {
    // api.update('user/' + $scope.user.id, {name: data}, function(data) {
    //   return data;
    // });
    var user = {};
    user[key] = data;
    return $http.put('/user/' + $scope.user.id, user);
  };

}]);
