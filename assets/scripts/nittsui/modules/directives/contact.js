/**
 *  Angular contactMe Module and directive
 */

var contactMe = angular.module('contactMe', ['ui.bootstrap', 'nittsAppApi', 'nittsAppSessions', 'nittsAlert']);


/**
 * contact-me attribute
 * @type prefilled type
 * @message prefilled message
 * @object prefilled object
 * @auto send automatically the message
 */

contactMe.directive('contactMe', ['api', '$uibModal', 'Session', 'alerts', function(api, $uibModal, Session, alerts) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {


        var type = attrs.type || 'question';
        var preFilled = {
          message: attrs.message || '',
          object: attrs.object || ''
        };


        element.bind('click', function() {

          var sessionData = Session.getScopeData();
          var email = '';
          var senderType = 'visitor';
          var sender = {
            type: 'visitor',
            email: '',
            name: ''
          };

          if (sessionData.user) {
            sender = sessionData.user;
            sender.type = 'user';
          }
          else if (sessionData.attendee && sessionData.attendee.screenName) {
            sender = sessionData.attendee;
            sender.type = 'attendee';
          }

          var message = {
            sender: sender,
            object: preFilled.object,
            message: preFilled.message,
            type: type
          };

          if (attrs.auto != undefined) return sendMessage(message);

          else {
            $uibModal.open({
              size: 'lg',
              templateUrl: TEMPLATE_ELEMENTS_URL + '/contactMe.html',
              controller: ['$scope', function($scope) {
                $scope.availableTypes = ['Poser une question', 'Signaler un bug', 'Problème technique', 'Partenariat', 'Demande spéciale', 'Autre'];
                $scope.contactMe = message;
              }]
            }).result.then(sendMessage);
          }

        });

        function sendMessage(message) {
          var messageData = message;
          messageData.sentAt = new Date();
          api.create('contact', messageData, function(data) {
            alerts.add({message: 'Votre message a bien été envoyé. ', type: 'info'});
          });
        }

      }
    };

  }]);
