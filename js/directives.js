'use strict';

/* Directives */

MusicWhereYouAreApp.directive('mwyaMap',  function ($rootScope) {
 return {
 	 	
    	 restrict: 'AE',
         scope: { }, 
         transclude: true,
            link: function(rootScope, element, attrs ) {
            	
            	attrs.$observe('latitude', function(){
            	var loc_arr_string='';	
            	//console.log(attrs.latitude)
            	var loc_arr=[];
            	var zoom =parseInt(attrs.zoom);
            	var iw_content=''
            	var styles=[{"featureType":"landscape","stylers":[{"color":"#fefef3"},{"saturation":100},{"lightness":40.599999999999994},{"gamma":.75}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":30.4000000000000057},{"gamma":.75}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
				$rootScope.noSongs=false;
				loc_arr_string = $rootScope.locationarrstr.replace(/,%%/g, '%%');
				loc_arr = loc_arr_string.split('%%');
				var LatLng = new google.maps.LatLng(attrs.latitude, attrs.longitude);
				var infowindow_textArr =[];
				var mapOptions = {
					center : LatLng,
					zoom : zoom,
					mapTypeId : google.maps.MapTypeId.ROADMAP,
					draggable : true,
					 styles: styles
				};

				var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				
				
				var marker_image = 'genre_icons/marker_sm.svg';
				for (var i = 1; i < loc_arr.length; i++) {
					iw_content+=('<b>'+loc_arr[(i)].split('@@')[0].replace(/, US/g,'')+'</b><br/>'+loc_arr[(i)].split('&&')[1].replace(/,\<h5\>/g, '<h5>'))
					var LatLng_marker = new google.maps.LatLng(loc_arr[i].split('@@')[1].split(':')[0], loc_arr[i].split('@@')[1].split(':')[1].split('&&')[0]);
					var geomarker = new google.maps.Marker({
						position : LatLng_marker,
						map : map,
						icon : marker_image
					});
					var infowindow = new google.maps.InfoWindow();
					var geomarker, i;
										google.maps.event.addListener(geomarker, 'click', (function(geomarker, i) {
							return function() {
															
								infowindow.setContent('<b>'+loc_arr[(i)].split('@@')[0].replace(/, US/g,'')+'</b><br/>'+loc_arr[(i)].split('&&')[1].replace(/,\<h5\>/g, '<h5>')+'<br/>');
								infowindow.open(map, geomarker);
							};
						})(geomarker, i));
						
					
				}		
            	
            	
            
           });	
				

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

MusicWhereYouAreApp.directive('fastRepeat', function(){
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