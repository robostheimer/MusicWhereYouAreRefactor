'use strict';

/* Directives */

MusicWhereYouAreApp.directive('mwyaMap',  function ($rootScope) {
 return {
 	 	
    	 restrict: 'AE',
            replace: true,
           // template: '<div></div>',
            scope: true,
            link: function(scope, element, attrs ) {/*
				element.addClass('map');
				
                var myOptions = {
                    zoom: 12,
                    center: new google.maps.LatLng(0,0),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    scrollwheel: true
                };
                 var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
                if(attrs.latitude)
                {
                	var latitude = attrs.latitude;
                	myOptions.center=new google.maps.LatLng(attrs.latitude, 0)
                	alert(latitude)
                	
                }
                else
                {
                	var latitude = 30
                }
                scope.$watch($rootScope.finalLat, function(latitude) {
                 	alert('changed')
                 	alert(attrs.latitude)
                    map.setCenter(new google.maps.LatLng(attrs.latitude, 0));
                    alert(myOptions.center)
                }, true);
                 map = new google.maps.Map(document.getElementById('map-canvas'), myOptions); 
				// myOptions.center = new google.maps.LatLng(parseFloat(latitude), 0);
				 
                //zoom as attribute
               /* if(attrs.zoom && parseInt(attrs.zoom)) myOptions.zoom = parseInt(attrs.zoom);
                //center as attribute
                if(attrs.latitude){
                    var latitude = scope.$eval(attrs.latitude);
                    
                }
                if(attrs.longitude)
                {
                	var longitude=scope.eval(attrs.longitude)
                	console.log(longitude)
                }
                if(parseFloat(latitude) && parseFloat(longitude))
                {
                        myOptions.center = new google.maps.LatLng(parseFloat(scope.latitude), parseFloat(scope.longitude));
                 }       
                //maptype as attribute
                if(attrs.maptype){
                     switch(attrs.maptype.toLowerCase()){
                         case 'hybrid':
                             myOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                             break;
                         case 'roadmap':
                             myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                             break;
                         case 'satellite':
                             myOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
                             break;
                         case 'terrain':
                             myOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
                             break;
                         default:
                             myOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                             break;
                     }
                }
                if(attrs.scrollwheel){
                    switch(attrs.scrollwheel.toLowerCase()){
                        case 'true':
                            myOptions.scrollwheel = true;
                            break;
                        case 'false':
                            myOptions.scrollwheel = false;
                            break;
                        default:
                            myOptions.scrollwheel = true;
                            break;
                    }
                }

                var map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
                
                scope.$watch('latitude', function(latitude, longitude) {
                    map.setCenter(new google.maps.LatLng(latitude, longitude));
                }, true);
                console.log(myOptions);
               /* google.maps.event.addListener(map, 'drag', function(e) {
                    var Latlng = map.getCenter();
                    scope.$apply(function() {
                        scope.center.lat = Latlng.lat();
                        scope.center.lon = Latlng.lng();
                    });
                });

                google.maps.event.addListener(map, 'click', function(e) {
                    scope.$apply(function() {
                        var myLatlng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title:"Hello World!"
                        });
                    });
                }); // end click listener*/

            }
	
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
