var UI=angular.module('UI', []);

/*Services*/

UI.factory("HintShower", ['$q', '$rootScope', '$http', '$sce', '$location','States','retrieveLocation',
function($q, $rootScope, $http, $sce, $location, States, retrieveLocation) {
	var canceller = $q.defer();
	//bring in locations object from json if they don't already exist

	return {
		showHint : function(location)
		{
			// 	if(location.length==3)
			// {
			//
			// if(location[1].length<3)
			// {
			// 	console.log('test3')
			// 	states.forEach(function(state){
			// 		if(location[1].toUpperCase().match(states.abbreviation))
			// 		{
			// 			state_location = state.name;
			// 		}
			//
			// 	});
			// }
			// return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID,Lat,Long+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region'+contains+'%27'+state_location+'%27+AND+CityName'+contains+'%27'+location[0].replace(/_/g, " ")+'%27+AND+CountryID%=%27'+location[2]+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
			// 	hints = result.data.rows;
			// 	if(result.data.rows!=undefined)
			// 	{
			// 	hints.finalArr=[];
			// 	 	result.data.rows.forEach(function(hint){
			// 			states.forEach(function(state) {
			// 				if(hint[0].toLowerCase() === state.name.toLowerCase()) {
			// 					hint[0] = state.abbreviation
			// 				}
			// 			});
			// 	 		hints.stateArr.push(hint[0]);
			// 			hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_'), fullname: hint[1]+', '+hint[0]+', '+hint[2], lat: hint[3], long:hint[4] })	;
			// 		 });
			// 	}
			// 	});
			// 	}
			// 	if(location.length==2)
			// {
			// 	console.log('test1')
			// var state_location = location[1];
			// return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID,Lat,Long+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region'+contains+'%27'+state_location.toUpperCase()+'%27+AND+CityName'+contains+'%27'+location[0].replace(/_/g, " ").toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0')
			// 	.then(function(result) {
			// 	if(result.data.rows!=undefined)
			// 	{
			// 		hints = result.data.rows;
			//
			// 		hints.finalArr=[];
			//
			// 		if(result.data.rows.length!=null)
			// 		{
			//  		result.data.rows.forEach(function(hint){
			// 			states.forEach(function(state) {
			// 				if(hint[0].toLowerCase() === state.name.toLowerCase()) {
			// 					hint[0] = state.abbreviation
			// 				}
			// 			})
			// 			hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_'),fullname: hint[1]+', '+hint[0]+', '+hint[2], lat: hint[3], long:hint[4] })	;
			// 	 	});
			// 		return hints;
			// 		}
			// 	}
			// 	});
			// 	}
			// 	if(location.length==1)
			// {
				//return $http.get('/php/geolocation.php?city='+location[0].toUpperCase(), { timeout: canceller.promise }).then(function(result) {

				// 	if(result.data.rows!=undefined)
				// {
				// 	hints = result.data.rows;
				// 	hints.finalArr=[];
				// 		result.data.rows.forEach(function(hint){
				// 		states.forEach(function(state) {
				// 			if(hint[0].toLowerCase() === state.name.toLowerCase()) {
				// 				hint[0] = state.abbreviation
				// 			}
				// 		})
				// 		hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_'), fullname: hint[1]+', '+hint[0]+', '+hint[2], lat:hint[3], long:hint[4]})	;
				//  	});
				// return hints;
				//}
			//});
			if(!$rootScope.locations) {
				var locations =[];
				$http.get('json/locations_ft.json').then(function(result) {
				 result.data.rows.forEach((location) => {
					 locations.push({
						 city_id: location[0],
						 city: location[1],
						 lat: location[2],
						 lng: location[3]
					 })
				 });

				 $rootScope.locations = locations;

			 	});
			}
			var states = States.createStateObj(),
			hints=[],

			location = location.toString().toLowerCase().replace(', ', ' ');
			location_regex = new RegExp(location);

			$rootScope.locations.forEach(function(loc) {
				if(loc.city.toLowerCase().replace(', ', ',').match(location) && location.length >= 3) {
					hints.push({city: loc.city.replace(/,/g, ', '), href: loc.city.replace(/, /g, '*'), long: loc.lng, lat: loc.lat});
				}
			});
			return hints;
		}

	//},
	};
}]);

UI.factory("runSymbolChange", ['$rootScope','$location', function($rootScope, $location)
{
	return {
		addButtons:function()
		{
			var genre_class = {}
			var playlist_class = {};
			var favorite_class = {};
			var map_class = {};
			var jukebox_class = {};
			var roadsoda_class = {};
			//menuPos=true;
			genre_class.name = 'genre';
			genre_class.classy = "iconequalizer12";
			genre_class.state = 'off';
			//genre_class.href = '#/genres/' + location;

			playlist_class.name = 'playlist';
			playlist_class.classy = "icon-song";
			playlist_class.state = 'off';
			//playlist_class.href = '#/playlist/' + location;

			favorite_class.name = 'favorite';
			favorite_class.classy = "iconfavorite";
			favorite_class.state = 'off';
			//favorite_class.href = '#/favorites/' + location;

			map_class.name = 'map';
			map_class.classy = "iconmap";
			map_class.state = 'off';
			//map_class.href = '#/map/' + location;

			jukebox_class.name = 'jukebox';
			jukebox_class.classy = "jukebox";
			jukebox_class.state = 'off';
			//jukebox_class.href = '#/jukebox/' + location;

			roadsoda_class.name = 'roadsoda';
			roadsoda_class.classy = "roadsoda";
			roadsoda_class.state = 'off';
			//roadsoda_class.href = '#/roadsoda/' + location;

			info_class.name = 'info';
			info_class.classy = "info";
			info_class.state = 'off';

			icons = [genre_class, playlist_class, favorite_class, map_class, jukebox_class, info_class];
			$rootScope.icons = icons;
			return icons;
		},

		changeSymbol: function(state, obj, classy ,url, link, object2)
		{
		if($rootScope.icons!=undefined)
		{
		$rootScope.icons.forEach(function(icon){

				icon.state='off';
				if($location.path().match(icon.name))
				{
					icon.state ='on';

				}
			});
		}
	}
};

}]);

/*Controllers*/
UI.controller('formController', ['$scope', '$rootScope', 'retrieveLocation', 'getLocation', '$q', 'HashCreate', '$location', 'HintShower', '$timeout', 'States', '$routeParams','LocationDataFetch',
function($scope, $rootScope, retrieveLocation, getLocation, $q, HashCreate, $location, HintShower, $timeout, States, $routeParams, LocationDataFetch) {
	$rootScope.showHint = false;

	$scope.hintShower = function(location, guess) {
		if(location.length > 3) {
			$timeout(function() {
				$scope.hints =  HintShower.showHint($scope.type_location, guess);
				$scope.hints = orderCitiesByDistance($scope.hints, $rootScope.mapdata.lat, $rootScope.mapdata.lng)
				$rootScope.showHint = true;
			}, 750);
		} else {
			$scope.type_location = "";
			$scope.locaitons = ""
			$scope.hints = [];
		}

		$scope.location_ = location;
		if ($scope.location_.toTitleCase().match('St.')) {
			$scope.location_ = $scope.location_.replace('St.', 'Saint');
		}
		// if ($scope.location_.toTitleCase().match('New York,')) {
		// 	$scope.location_ = $scope.location_.replace('New York,', 'New York City,');
		// }

		$scope.type_location = $scope.location_.split(', ');

	};

	$scope.controlForm = function(location) {
		LocationDataFetch.count=0;
		$rootScope.songs = undefined;
		if(location!=undefined)
		{
			if(location[location.length-3]==' ')
			{
				var location =location.slice(0, (location.length-3))+ ','+location.slice(location.length-2, location.length);
				location = location.replace(/ /g, '_')
			}
			else{
				var location=location.replace(/ /g, '_');
			}

		var states = States.createStateObj();
		if(location.split(',').length>1)
				{
					$scope.genres = '';
					if ($scope.location == undefined || $scope.location == "") {
						var deferred_loc = $q.defer();
						getLocation.checkGeoLocation();
					} else {
						$scope.location = location.replace(' ', '_');
						if($scope.location.length==2)
							{
								var ab = location.toUpperCase();
								states.forEach(function(item){
									if(item.abbreviation==ab)
									{
										$scope.location =(item.name);
									}

								});

							}
						$scope.location = $scope.location.replace(',_', '*').replace(',', '*')
						$location.path('playlist/' + $scope.location);
					};
				}
				else{
					$scope.hintShower(location, true)
				}
			}
			else{
			getLocation.checkGeoLocation();
				}
			};


	$scope.closeHint = function() {

		$rootScope.showHint = false;
		$rootScope.songs = null;

		$scope.location = ''
	};

}]);
UI.controller('controlSymbol', ['$scope', '$location', '$rootScope', 'runSymbolChange',
function($scope, $location, $rootScope, runSymbolChange) {

	$scope.location = $location.path().split('/')[2];
	if ($scope.location == undefined) {
		$scope.location = '';
	}
	$scope.hideIcons = false;
	//$scope.icons=runSymbolChange.addButtons()
	$scope.genre_class = {}
	$scope.playlist_class = {};
	$scope.favorite_class = {};
	$scope.map_class = {};
	$scope.jukebox_class = {};
	$scope.roadsoda_class = {};
	$scope.calendar_class = {};
	$scope.info_class={};
	//$scope.menuPos=true;

	$scope.playlist_class.name = 'playlist';
	$scope.playlist_class.classy = "icon-song";
	$scope.playlist_class.state = 'off';
	$scope.playlist_class.href = '#/playlist/' + $scope.location;

	$scope.genre_class.name = 'genre';
	$scope.genre_class.classy = "iconequalizer12";
	$scope.genre_class.state = 'off';
	$scope.genre_class.href = '#/genres/' + $scope.location;

	$scope.favorite_class.name = 'favorite';
	$scope.favorite_class.classy = "iconfavorite";
	$scope.favorite_class.state = 'off';
	$scope.favorite_class.href = '#/favorites/' + $scope.location;

	$scope.map_class.name = 'map';
	$scope.map_class.classy = "iconmap";
	$scope.map_class.state = 'off';
	$scope.map_class.href = '#/map/' + $scope.location;

	$scope.jukebox_class.name = 'jukebox';
	$scope.jukebox_class.classy = "jukebox";
	$scope.jukebox_class.state = 'off';
	$scope.jukebox_class.href = '#/jukebox/' + $scope.location;

	$scope.roadsoda_class.name = 'roadsoda';
	$scope.roadsoda_class.classy = "roadsoda";
	$scope.roadsoda_class.state = 'off';
	$scope.roadsoda_class.href = '#/roadsoda/' + $scope.location;



	$scope.calendar_class.name = 'calendar';
	$scope.calendar_class.classy = "calendar";
	$scope.calendar_class.state = 'off';
	$scope.calendar_class.href = '#/calendar/' + $scope.location;

	$scope.info_class.name = 'iconinfo';
	$scope.info_class.classy = "iconinfo";
	$scope.info_class.state = 'off';
	$scope.info_class.href = '';





	$scope.icons = [$scope.genre_class, $scope.playlist_class, $scope.favorite_class, $scope.map_class, $scope.jukebox_class, $scope.calendar_class];
	$rootScope.icons = $scope.icons;
	runSymbolChange.changeSymbol();
	$scope.changeMenu = function() {
		if ($scope.menuPos == true) {

			$scope.menuPos = false;
		} else {

			$scope.menuPos = true;
			$location.path('map/' + $scope.location.replace(', ', '*'));
		}
	};
	$scope.changeClass = function(state, obj, classy, url, link) {

		if(link=='info'){
				if($rootScope.infoMessage==true)
				{
					$rootScope.infoMessage=false;
					console.log($rootScope.infoMessage)
				}
				else{
					$rootScope.infoMessage=true;
					console.log($rootScope.infoMessage)
				}
				if (state == 'on') {
					obj.state = 'off';

				} else {
					obj.state = 'on';

				}
		}
		else{
			$scope.location = $location.path().split('/')[2];
			var hashy = $location.path().split('/')[2];
			if (state == 'on') {
				obj.state = 'off';
				obj.href = '#/map/' + $scope.location;
			} else {
				obj.state = 'on';
				obj.href = '#/' + link + '/' + $scope.location;
			}
			for (var i = 0; i < $scope.icons.length; i++) {
				if ($scope.icons[i].name != obj.name) {
					$scope.icons[i].state = 'off';
				}

			};
		}

	};
	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	$scope.toggleIcons = function() {

		if ($scope.hideIcons == true) {
			$scope.hideIcons = false;

		} else {
			$scope.hideIcons = true;
		}

	};

}]);

/*Directives*/
UI.directive(
	"eventDelegate",
	function( $parse ) {

	    // I bind the DOM and event handlers to the scope.
	    function link( $scope, element, attributes ) {
	        // Right now, the delegate can be defined as
	        // either selector and an expression; or simply
	        // as an expression.
	        var config = attributes.eventDelegate.split( "|" );
					var eventtype=attributes.type;
	        // Only an expression has been defined - default
	        // the selector to any anchor link.
	        if ( config.length === 1 ) {

	            var selector = "a";
	            var expression = config[ 0 ];
	        // Both selector and expression are defined.
	        } else {

	            var selector = config[ 0 ];
	            var expression = config[ 1 ];

	        }
	        // Parse the expression into an invokable
	        // function. This way, we don't have to re-parse
	        // it every time the event handler is triggered.
	        var expressionHandler = $parse( expression );
	        // Bind to the click (currently only supported
	        // event type) to the root element and listen for
	        // clicks on the given selector.
	        element.on(
	            eventtype+".eventDelegate",
	            selector,
	            function( event ) {
	                // Prevent the default behavior - this is
	                // not a "real" link.
	                event.preventDefault();
	                // Find the scope most local to the target
	                // of the click event.
	                var localScope = $( event.target ).scope();
	                // Invoke the expression in the local scope
	                // context to make sure we adhere to the
	                // proper scope chain prototypal inheritance.
	                localScope.$apply(
	                    function() {

	                        expressionHandler( localScope );
	                    }
	                );
	            }
	        );

	        // When the scope is destroyed, clean up.
	        $scope.$on(
	            "$destroy",
	            function( event ) {

	                element.off( eventtype+".clickDelegate" );

	            }
	        );
	    }


	    // Return the directive configuration.
	    return({
	        link: link,
	        restrict: "A"
	    });

	});
UI.directive('musicCard', function($location) {
	return {
		restrict : 'AE',
		templateUrl : 'partials/directives/music-card.html',
		link: function(scope) {
			if(/favorite/.test($location.path())) {
				scope.showLocation = true;
			}
		}
	}
});

UI.directive('downloadButton',  function ($compile) {
 return {
 		restrict: 'AE',
 		link: function(scope,elem, attrs)
 		{
 			var data = {};
 			console.log(attrs)
 			attrs.$observe('data', function(){
			var data = attrs.data;
			console.log(data)
			var json = JSON.stringify(data);
			var blob = new Blob([json], {type: "application/json"});
			var url  = URL.createObjectURL(blob);

			elem.html($compile(
            '<a class="btn" download="data.json"' +
                'href="' + url + '">' +
                'Download Data' +
                '</a>'
        )(scope));
 		});
 		}
 	};
 });

 UI.directive('buttonToggle', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {
            var classToToggle = attr.buttonToggle;
            element.bind('click', function() {
                var checked = ctrl.$viewValue;
                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(!checked);
                });
            });

            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                newValue ? element.addClass(classToToggle) : element.removeClass(classToToggle);
            });
        }
    };
});


UI.directive('viewAnimation', function ($route) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var animation = $route.current.animation;
      if (animation) element.addClass(animation);
    }
  };
});


UI.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

UI.directive('backButton', function(){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', goBack);

        function goBack() {
         $location.path('#/playlist')
        }
      }
    };
});

UI.directive('yearSlider', function($compile){
	return{
		restrict: 'AE',
		link: function(scope, elm, attrs)
		{
		var d=new Date();
		scope.d=d.getFullYear()	;
		$compile(elm.contents())(scope);
		},
		template:'Start Year: <input class="year_slider" type="range" ng-model="start_year" min="1890" max="{{d}}" step="1"  name="start" value="{{start_year}}"><br>End Year: &nbsp;<input class="year_slider" type="range" ng-model="end_year" min="1890" max="{{d}}"  step="1"  name="end" value="{{end_year}}"> '
	};


});
UI.directive('drawerHeight', function($window, $location, $timeout) {
	return function(rootScope, element) {


			var w = angular.element($window);
			rootScope.getWindowDimensions = function() {
				return {
					'h' : w.height(),
					'w' : w.width()
				};
			};
			$timeout(function(){
			rootScope.$watch(rootScope.getWindowDimensions, function(newValue, oldValue) {
					if($location.path().match('genres')){
					rootScope.drawerHeight = $('#genre_holder').height()+25
						if(rootScope.drawerHeight<w.height()){
							rootScope.drawerTop = (w.height()-rootScope.drawerHeight)-($('.navigation_holder').height()+25);
						}else{
							rootScope.drawerHeight=w.height();
							rootScope.drawerTop=0;
						}
				}
			}, true);
		},100);
			w.bind('resize', function() {
				if($location.path().match('genres')){
					rootScope.drawerHeight = $('#genre_holder').height()+25
						if(rootScope.drawerHeight<w.height()){
							rootScope.drawerTop = (w.height()-rootScope.drawerHeight)-($('.navigation_holder').height()+25);
						}else{
							rootScope.drawerHeight=w.height();
							rootScope.drawerTop=0;
						}
				}
				rootScope.$apply();

		});
	};
});

UI.directive('ngDelay', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: true,
        compile: function (element, attributes) {
            var expression = attributes['ngChange'];
            if (!expression)
                return;

            var ngModel = attributes['ngModel'];
            if (ngModel) attributes['ngModel'] = '$parent.' + ngModel;
            attributes['ngChange'] = '$$delay.execute()';

            return {
                post: function (scope, element, attributes) {
                    scope.$$delay = {
                        expression: expression,
                        delay: scope.$eval(attributes['ngDelay']),
                        execute: function () {
                            var state = scope.$$delay;
                            state.then = Date.now();
                            $timeout(function () {
                                if (Date.now() - state.then >= state.delay)
                                    scope.$parent.$eval(expression);
                            }, state.delay);
                        }
                    };
                }
            }
        }
    };
}]);

UI.directive('fastRepeat', function(){
      return{
          restrict: 'AE',
          scope:{
              data: '='
          },
          link:function(scope, el, attrs){
              scope.$watch('data', function(newValue, oldValue){
                  React.renderComponent(
                      MYLIST({data:newValue}),
                      el[0]
                  );
              });
          }
      };
});
