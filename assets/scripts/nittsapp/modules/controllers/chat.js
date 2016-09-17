/**
 *  nittsApp ChatController
 */

// chatController
nittsApp.controller('ChatController', ['$scope', '$state', 'api', 'Session', function($scope, $state, api, Session) {
	// get the session data from the Session service
	var sessionData = Session.getScopeData();
	// initialize the $scope attributes
	$scope.chat = {
		messages: []
	};
	$scope.sending = false;

	//retrieve messages data from the api in real time
	api.read('event/' + $state.params.id + '/lastMessages', function(data) {
		// for (i=0, length=data.length; i < length; i++) {
		// 	if (data[i].emmiter && data[i].emmiter.email == sessionData.email) data[i].local = true;
		// }
		$scope.chat.messages = data;
	});

	// listen to messages events in real time
	io.socket.on("newMessage", function (data) {
    $scope.chat.messages.push(data);
    $scope.$apply();
  });


    // addMessage method
  $scope.addMessage = function() {
		// clean and check the form field
		$scope.sending = true;
  	var newMessage = $scope.chat.newMessage.trim();
  	if(!newMessage.length) return;

		// preparing the message to send
		var message = {};
		message.content = newMessage;
		// TODO : switch the type depending on something
		message.type = 'comment';

		// send the message in real time
		io.socket.post('/message', message, function(data, jwres) {
			if (jwres.statusCode != 201) return console.log('error ', jwres.statusCode, jwres);
			// add a tag to inform it has been sent from local
			data.local = true;
			$scope.chat.messages.push(data);
			$scope.chat.newMessage = '';
			$scope.sending = false;
			$scope.$apply();
		});

  };

  // removeMessage method
  $scope.removeMessage = function(message) {
		message.inProgress = true;
		io.socket.delete('/message/' + message.id, function(data, jwres) {
			if (jwres.statusCode != 200) return console.log('error ', jwres.statusCode);
			$scope.chat.messages.splice($scope.chat.messages.indexOf(message), 1);
		});
  };

	$scope.updateMessage = function(message) {

		return io.socket.put('/message/' + message.id, {content: message.content}, function(data, jwres) {
			// TODO : do something is sucessfull
		});
	};

}]);

// chatElement
// chat.directive('chatElement', function() {
//     return {
//         restrict: 'E',
//         templateUrl: 'views/elements/chat.html',
//         controller: 'ChatController'
//     };
// });
