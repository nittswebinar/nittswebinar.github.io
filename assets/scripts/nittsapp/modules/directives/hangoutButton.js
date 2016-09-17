/**
 *  Angular nittsAppHangoutButton Module
 */

var hangoutButton = angular.module('nittsAppHangoutButton', []);

// hangoutButton
hangoutButton.directive('ghangout', [function() {

	var hangoutButtonLink = function (scope, element, attrs) {

		// Get the event id from the 'event' attribute of the directive
		var eventId = attrs.event;
		var hangoutToken = attrs.token;
		var title = attrs.title;

		// render the button using google sdk
    gapi.hangout.render('hangout-button', {
      'render': 'createhangout',
      'initial_apps': [{app_id: '303734047399', start_data: hangoutToken, 'app_type': 'ROOM_APP'}],
      'hangout_type': 'onair',
			'topic': title,
      'widget_size': 175
    });
		// element.bind("click", function() {});
  };


  return {
      restrict: 'E',
			template: '<div id="hangout-button"></div>',
      link: hangoutButtonLink
  };
}]);
