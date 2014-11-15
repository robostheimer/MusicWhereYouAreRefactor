'use strict';

/* Directives */

MusicWhereYouAreApp.directive('mwyaMap',  function () {
 return {
 	 	/*restrict: 'AE',
    	scope:true,
    	replace:true,
    	link: function(scope, elem, attrs)
    	{
    		scope.latitude=42;
    		scope.longitude=-77;
    		console.log(scope.latitude)
    		var mapOptions = {
				center: new google.maps.LatLng(scope.latitude, scope.longitude),
				zoom : 7,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				draggable : true,
				 styles: scope.styles
				
			};
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    	}*/
 /*       controller: function ($scope) {
          var map;

          this.registerMap = function (myMap) {
            var center = myMap.getCenter(),
              latitude = center.lat(),
              longitude = center.lng();

            map = myMap;
            $scope.latitude = latitude;
            $scope.longitude = longitude;
          };

          $scope.$watch('latitude + longitude', function (newValue, oldValue) {
            if (newValue !== oldValue) { 
              var center = map.getCenter(),
                latitude = center.lat(),
                longitude = center.lng();
              if ($scope.latitude !== latitude || $scope.longitude !== longitude)
                map.setCenter(new google.maps.LatLng($scope.latitude, $scope.longitude));
            }
          });
        },
        link: function (scope, elem, attrs, ctrl) {
          var mapOptions,
            latitude = attrs.latitude,
            longitude = attrs.longitude,
            controlTemplate,
            controlElem,
            map;

          // parsing latLong or setting default location
          latitude = scope.latitude && parseFloat(latitude, 10) || 37.074688;
          longitude = scope.longitude && parseFloat(longitude, 10) || -85.384294;

          mapOptions = {
            zoom: 8,
            disableDefaultUI: true,
            center: new google.maps.LatLng(latitude, longitude),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          map = new google.maps.Map(elem[0], mapOptions);

          ctrl.registerMap(map);

          controlTemplate = document.getElementById('whereControl').innerHTML.trim();
          controlElem = $compile(controlTemplate)(scope);
          map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlElem[0]);

          function centerChangedCallback (scope, map) {
            return function () {
              var center = map.getCenter();
              scope.latitude = center.lat();
              scope.longitude = center.lng();
              if(!scope.$$phase) scope.$apply();
            };
          }
          google.maps.event.addListener(map, 'center_changed', centerChangedCallback(scope, map));
        }*/
      };
});



MusicWhereYouAreApp.directive('buttonToggle', function() {
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

	
MusicWhereYouAreApp.directive('viewAnimation', function ($route) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var animation = $route.current.animation;
      if (animation) element.addClass(animation);
    }
  };
});


MusicWhereYouAreApp.directive('ngEnter', function () {
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

MusicWhereYouAreApp.directive('backButton', function(){
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

MusicWhereYouAreApp.directive('yearSlider', function($compile){
	return{
		restrict: 'AE',
		link: function(scope, elm, attrs)
		{
		var d=new Date();
		scope.d=d.getFullYear()	;
		$compile(elm.contents())(scope);
		},
		template:'Start Year: <input class="year_slider" type="range" ng-model="start_year" min="1890" max="{{d}}" step="1"  name="start" value="{{start_year}}"> End Year<input class="year_slider" type="range" ng-model="end_year" min="1890" max="{{d}}"  step="1"  name="end" value="{{end_year}}"> '
	};
	
	
});


MusicWhereYouAreApp.directive('ngDelay', ['$timeout', function ($timeout) {
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
