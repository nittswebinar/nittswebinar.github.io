/**
 *  Angular nittsAppHangoutButton Module
 */


// hangoutButton
nittsApp.controller('ProgressBarController', ['$scope', function($scope) {

  // initialize $scope attributes
  $scope.progressBar = {
    value: 0,
    type: 'default',
    status: "Chargement"
  };


  $scope.$watch('event', function(event) {
    updateProgressBar(event.status);
  });


  function updateProgressBar(status) {

    switch (status) {
      case "planned":
        $scope.progressBar = {
          value: 20,
          type: "primary",
          status: "Plannifié"
        };
        break;

      case "waiting":
        $scope.progressBar = {
          value: 40,
          type: "warning",
          status: "En attente de présentateur"
        };
        break;

      case "inProgress":
        $scope.progressBar = {
          value: 50,
          type: "warning",
          status: "Présentateur connecté"
        };
        break;

      case "broadcasting":
        $scope.progressBar = {
          value: 60,
          type: "danger",
          status: "Diffusion en direct"
        };
        break;

      case "finished":
        $scope.progressBar = {
          value: 80,
          type: "info",
          status: "Terminé"
        };
        break;

      case "replaying":
        $scope.progressBar = {
          value: 100,
          type: "success",
          status: "En replay"
        };
        break;

      default:
        $scope.progressBar = {
          value: 0,
          type: 'default',
          status: "Chargement"
        };
        break;

    }
  }

}]);
