'use strict';

/* Directives */
MusicWhereYouAreApp.directive('mwyaMap',  function ($rootScope) {
 return {
 	 	
    	 restrict: 'AE',
         scope: { }, 
         transclude: true,
       // template:'<div id="map"></div>',
            link: function(rootScope, element, attrs ) {
			
				
				
		
				
				$rootScope.mapdata={};
				$rootScope.mapdata.latitude=0;
				$rootScope.mapdata.longitude=0;
				$rootScope.mapdata.zoom=15;
				$rootScope.mapOpening=true;
            	
		
				var map = new L.Map("map",{});
				 var markers=[];
				//var HERE_normalDayGrey = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
				//var HERE_carnavDayGrey = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/carnav.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',

				//var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
				//var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				//var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
//});			
				var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri&mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',

				//var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
					subdomains: '1234',
					mapID: 'newest',
					app_id: 'Y8m9dK2brESDPGJPdrvs',
					app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
					base: 'base',
					minZoom: 0,
					maxZoom: 20					
					});
				 	
			
				map.addLayer(Esri_WorldTopoMap); 	
            	
            	
            	attrs.$observe('change', function(){
            		
	            	if(attrs.latitude!=0 && attrs.longitude!=0)
	            	{
	            	
	            	
		            	if(markers.length>0)
		            	{
		            		markers.forEach(function(marker){
							map.removeLayer(marker);
						});
		            	}
	            	markers=[];
	            	var loc_arr_string='';	
	            	var loc_arr=[];
	            	loc_arr_string = $rootScope.mapdata.locationarrstr
					loc_arr_string= loc_arr_string.replace(/,%%/g, '%%');
					loc_arr = loc_arr_string.split('%%');
					var zoom =$rootScope.mapdata.zoom;
					var iw_content=''
            		var myIcon = L.icon({
					    iconUrl: 'genre_icons/marker_sm.svg',
					    
					});
					
					map.animate=true;
					map._zoom=zoom;
					map.panTo([attrs.latitude, attrs.longitude]);
				 	
				 	map.zoomControl.options.position='topright';
			 		for (var i = 1; i < loc_arr.length; i++) {
			 		
			 		iw_content='';
			 		
					iw_content+=('<b>'+loc_arr[(i)].split('@@')[0].replace(/, US/g,'')+'</b><br/>'+loc_arr[(i)].split('&&')[1].replace(/,\<h5\>/g, '<h5>'))
					
					 markers.push(L.marker([loc_arr[i].split('@@')[1].split(':')[0], loc_arr[i].split('@@')[1].split(':')[1].split('&&')[0]], {icon: myIcon}).bindPopup(iw_content));
					
					
					}
					markers.forEach(function(marker){
						marker.addTo(map);
					});
				$rootScope.mapOpening=false;
				}
            	
            	
           }); 
         
          }  
       };
    });      
 /////////////Can be used to download Data if necessary/////////////////   
MusicWhereYouAreApp.directive('downloadButton',  function ($compile) {
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
 
 
/*MusicWhereYouAreApp.directive('mwyaMap',  function ($rootScope) {
 return {
 	 	
    	 restrict: 'AE',
         scope: { }, 
         transclude: true,
            link: function(rootScope, element, attrs ) {
            	$rootScope.mapdata={};
				$rootScope.mapdata.locationarrstr=''
            	attrs.$observe('change', function(){	
            	var loc_arr_string='';	
            	
            	var loc_arr=[];
            	var zoom =parseInt(attrs.zoom);
            	var iw_content=''
            	var styles=[{"featureType":"landscape","stylers":[{"color":"#fefef3"},{"saturation":100},{"lightness":40.599999999999994},{"gamma":.75}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":30.4000000000000057},{"gamma":.75}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
				//$rootScope.noSongs=false;
				loc_arr_string = $rootScope.mapdata.locationarrstr
				loc_arr_string= loc_arr_string.replace(/,%%/g, '%%');
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


});*/



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
 MusicWhereYouAreApp.directive(
            "eventDelegate",
            function( $parse ) {
            	
                // I bind the DOM and event handlers to the scope.
                function link( $scope, element, attributes ) {
                	
                    // Right now, the delegate can be defined as
                    // either selector and an expression; or simply
                    // as an expression.
                    var config = attributes.eventDelegate.split( "|" );
                    ///////if not working problem could be that there is no 'type' attribute///////
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

            });;