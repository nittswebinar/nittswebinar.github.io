﻿var youtube = angular.module('youtube-embed', []);

youtube.factory('youtubeEmbed', ['$document', '$q', '$rootScope', function($document, $q, $rootScope){

	var y = $q.defer();

	function onScriptLoad(){
		y.resolve(window.yt);
	}

	var scriptTag = $document[0].createElement('script');
	scriptTag.type = 'text/javascript';
	scriptTag.async = true;
	scriptTag.src = 'https://www.youtube.com/iframe_api';
	scriptTag.onreadystatechange = function(){
		if(this.readyState == 'complete')
			onScriptLoad();
	}
	scriptTag.onload = onScriptLoad();

	var s = $document[0].getElementsByTagName('body')[0];
	s.appendChild(scriptTag);

	return {
		yt: function(){ return y.promise; }
	};

}]);

youtube.directive('youtube', ['youtubeEmbed', '$window', function(youtubeEmbed, $window){
	return {
		restrict: 'E',
		template: '<div id="player"></div>',
		link: function(scope, element, attrs){
			youtubeEmbed.yt().then(function(yt){
				$window.onYouTubePlayerAPIReady = function(){
					scope.player = new YT.Player('player', {
						height: attrs.height,
						width: attrs.width,
						videoId: attrs.id,
						playerVars: {
							    autoplay: 1,
							    autohide: 1,
							    modestbranding: 1,
							    playsinline: 0,
							    rel: 0,
							    showinfo: 0
							}
					});

					scope.$watch(function(){ return attrs.id;}, function(newVal){
						var videoId = newVal;
						scope.player = scope.createPlayer(attrs);
					});

					scope.createPlayer = function(attrs){
						if(scope.player) scope.player.destroy();
						return new YT.Player('player', {
							height: attrs.height,
							width: attrs.width,
							videoId: attrs.id,
							playerVars: {
							    autoplay: 1,
							    autohide: 1,
							    modestbranding: 1,
							    playsinline: 0,
							    rel: 0,
							    showinfo: 0
							}
						});
					}

				}

			});
		}
	};
}]);
