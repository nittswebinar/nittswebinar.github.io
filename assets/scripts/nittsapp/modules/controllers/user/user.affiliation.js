

UserAffiliationController.$inject = ['$scope', 'api', 'Session'];
function UserAffiliationController($scope, api, Session) {

  $scope.affiliates = [];

  api.read('user/' + Session.getScopeData().user.id + '/hasAffiliated', function(data) {
    $scope.affiliates = data;
  });

}
nittsApp.controller('UserAffiliationController', UserAffiliationController);
