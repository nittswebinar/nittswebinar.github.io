
/*
*  nittsApp Payment directive
*/

nittsUI.directive('payment', ['Session', 'api', '$uibModal', function(Session, api, $uibModal) {

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {


      // inititalize the $scope attributes
      var amount = attrs.amount || 29;
      var plan = attrs.membership || 'premium';

      var handler = StripeCheckout.configure({
        key: 'pk_live_L0hv8z2NpOM5cT1CCoYMVI1l',
        image: '/images/800x800-logo.png',
        name: 'NITTS Webinar',
        description: 'Abonnement Premium',
        panelLabel: 'Souscrire pour {{amount}}',
        allowRememberMe: false,
        locale: 'auto',
        currency: 'eur',
        // zipCode: true,
        // billingAddress: true,
        token: function(token) {
          // track the payment funnel step 3 => card data sent
          mixpanel.track("Credit Card data validated for" + plan);
          if (Session.isAuthorized()) {
            api.create('user/upgrade', {stripeToken: token.id, amount: amount, plan: plan}, function(data) {
              mixpanel.people.set({
                "accountType": plan
              });
              mixpanel.people.track_charge(amount);
            });
          }
          else {
            $uibModal.open({
      	      templateUrl: TEMPLATE_ELEMENTS_URL + '/passwordSet.html',
              backdrop: 'static',
              keyboard: false,
      	      controller: ['$scope', function($scope) {
      	        $scope.credentials = {};
      	      }]
      	  	}).result.then(function (credentials) {
      	      Session.register({email: token.email, password: credentials.password}, function(status) {
                api.create('user/upgrade', {stripeToken: token.id, amount: amount, plan: plan}, function(data) {
                  mixpanel.people.set({
                    "accountType": plan
                  });
                  mixpanel.people.track_charge(amount);
                });
              });
      	    });
          }
        }
      });


      element.bind('click', function() {
        //track the payment funnel step 2
        mixpanel.track("Click Subscribe button for" + plan);

        handler.open({
          amount: amount * 100
        });
      });
    }
  };

}]);
