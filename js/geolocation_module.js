/*Services*/
var Geolocation = angular.module('Geolocation', []);
Geolocation.service("getLocation", ['$q', '$http', '$sce', 'HashCreate','$rootScope','$location',
function($q, $http, $sce, HashCreate, $rootScope, $location) {


	var zoom = 11;
	var currentLat = 41.5;
	var currentLong = -91.6;
	var deferred = $q.defer();
	$rootScope.genres='';
	$rootScope.tags=[];
	//$rootScope.geoloading=true;
	$rootScope.lookUpSongs=[];
	//console.log('geo:'+$rootScope.lookUpSongs)
	$rootScope.era='';
	$rootScope.noGeo=false;

	//$rootScope.location = [];
	var Geolocation = {
		_checkGeoLocation : function() {

			////////Checks if Geolocation is available;
			/////If it is is runs the handle_geolocation_query or the handle Gelocation.handle)errors function if access to the Geolocation API is denied by the user

			navigator.geolocation.getCurrentPosition(Geolocation.handle_geolocation_query, Geolocation.handle_errors);
		},

		handle_geolocation_query : function(position) {
			$rootScope.hideiconHolder=false;
			$rootScope.noGeo=false;
			$rootScope.geoloading=false;
			currentLat = (position.coords.latitude);
			currentLong = (position.coords.longitude);
			var lat_min = currentLat - .25;
			var lat_max = currentLat + .25;
			var long_min = currentLong - .25;
			var long_max = currentLong + .25;
			////Creates a promise that runs the Playlist creation Function and then the Map Create function.
			HashCreate.runHash(currentLat, currentLong, true, .03).then(function(data){
				$location.path(data);
			});
		},

		handle_errors : function(error) {
			$rootScope.noGeo=true;
			$rootScope.hideiconHolder=true;
			$rootScope.$apply();
		},
	};
	return {
		checkGeoLocation : Geolocation._checkGeoLocation
	};
}]);


/*Controllers*/

Geolocation.controller('Geolocate', ['$scope', '$window', '$http', '$sce', 'getLocation', '$rootScope', '$q', '$routeParams',
function($scope, $window, $http, $sce, getLocation, $q, $rootScope, $routeParams) {
		getLocation.checkGeoLocation()
		$scope.location=""
}]);



/*Directives*/
Geolocation.directive('mwyaMap',  function ($rootScope) {

 return {
	 restrict: 'AE',
     scope: { },
     transclude: true,

    link: function(scope, element, attr ) {
	    $rootScope.markers =[];
			$rootScope.mapdata={};
			$rootScope.mapdata.lat = 41.654811;
      $rootScope.mapdata.lng = -91.5380717;
			$rootScope.mapdata.orig_lat=0;
			$rootScope.mapdata.orig_lng=0;
			$rootScope.mapdata.zoom=13;
			$rootScope.mapOpening=true;


			var map = new L.Map("map",{});
			var markers=[];
			var cirlce;

			var MAP = Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri&mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',

			//var MAP = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
				subdomains: '1234',
				mapID: 'newest',
				app_id: 'Y8m9dK2brESDPGJPdrvs',
				app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
				base: 'base',
				minZoom: 0,
				maxZoom: 20
				});
			var marker_content = '';

			map.addLayer(MAP);

    	attr.$observe('change', function() {
				console.log('changing', $rootScope.mapdata.lat, $rootScope.mapdata.lng);
    		markers.forEach(function(item){
    			map.removeLayer(item);
    		});
				if($rootScope.mapdata.orig_lat === undefined || $rootScope.mapdata.orig_lng === undefined || $rootScope.mapdata.orig_lat===0 || $rootScope.mapdata.orig_lng === 0)
					{
						$rootScope.mapdata.orig_lat = $rootScope.mapdata.lat
						$rootScope.mapdata.orig_lng = $rootScope.mapdata.lng
					}
				var circle = L.circle([$rootScope.mapdata.orig_lat, $rootScope.mapdata.orig_lng], 125, {
				    color: '#428bca',
				    fillColor: '#428bca',
				    fillOpacity: 0.15
					}).addTo(map);

      	if($rootScope.markers.length>0)
      	{
      		markers =[];
      		var i =0
      		$rootScope.markers.forEach(function(marker) {
      		i++
					marker_content='<a href="'+marker.url+'" target="_blank">'+marker.name+'</a><br>'+marker.location.address[0]+'<br>'+marker.location.city+'<br><a href="tel://'+marker.display_phone+'">'+marker.display_phone+'</a><br><img src="'+marker.rating_img_url+'" alt="'+marker.rating+' stars">';
					markers.push(L.marker([marker.location.coordinate.latitude, marker.location.coordinate.longitude]).bindPopup(marker_content));
					});
       	}

	      map.animate=true;
				map._zoom = 8;
				map.scrollWheelZoom.disable();
				map.panTo([attr.latitude, attr.longitude]);
			 	map.zoomControl.options.position='topright';
				markers.forEach(function(marker) {
					marker.addTo(map);
				});
      });
    }
   }
 });




// Geolocation.directive('mwyaMap',  function ($rootScope) {
//  return {
//
//     	 restrict: 'AE',
//          scope: { },
//          transclude: true,
//        // template:'<div id="map"></div>',
//         	link: function(rootScope, element, attrs ) {
//
// 					$rootScope.mapdata={};
// 					$rootScope.mapdata.latitude=0;
// 					$rootScope.mapdata.longitude=0;
// 					$rootScope.mapdata.zoom=15;
// 					$rootScope.mapOpening=true;
//
//
// 					var map = new L.Map("map",{});
// 					console.log(map)
// 					var markers=[];
// 					//var HERE_normalDayGrey = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
// 					//var HERE_carnavDayGrey = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/carnav.day.grey/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
//
// 					//var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
// 					//var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// 					//var Esri_WorldStreetMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
// 	//});
// 		// 			var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
// 		// attribution: 'Tiles &copy; Esri&mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
//
// 					//var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
// 						subdomains: '1234',
// 						mapID: 'newest',
// 						app_id: 'Y8m9dK2brESDPGJPdrvs',
// 						app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
// 						base: 'base',
// 						minZoom: 0,
// 						maxZoom: 20
// 						});
//
//
// 					map.addLayer(Esri_WorldTopoMap);
//
// 	      	attrs.$observe('change', function(){
// 						console.log(attrs)
// 	        	// if(attrs.latitude!=0 && attrs.longitude!=0)
// 	        	// {
// 	          	if(markers.length>0)
// 	          	{
// 	          		markers.forEach(function(marker){
// 								map.removeLayer(marker);
// 							});
// 			      }
//
// 	        	markers=[];
// 	        	var loc_arr_string='';
// 	        	var loc_arr=[];
// 	        	loc_arr_string = $rootScope.mapdata.locationarrstr
// 						loc_arr_string= loc_arr_string.replace(/,%%/g, '%%');
// 						loc_arr = loc_arr_string.split('%%');
// 						var zoom =$rootScope.mapdata.zoom;
// 						var iw_content=''
// 	            var myIcon = L.icon({
// 						  iconUrl: 'genre_icons/marker_sm.svg',
// 						});
//
// 						map.animate=true;
// 						map._zoom=zoom;
// 						map.panTo([attrs.latitude, attrs.longitude]);
//
// 					 	map.zoomControl.options.position='topright';
// 						console.log(map);
//
// 						for (var i=1; i < loc_arr.length; i++) {
// 					 		iw_content='';
//
// 							iw_content+=('<b>'+loc_arr[(i)].split('@@')[0].replace(/, US/g,'')+'</b><br/>'+loc_arr[(i)].split('&&')[1].replace(/,\<h5\>/g, '<h5>'))
//
// 							 markers.push(L.marker([loc_arr[i].split('@@')[1].split(':')[0], loc_arr[i].split('@@')[1].split(':')[1].split('&&')[0]], {icon: myIcon}).bindPopup(iw_content));
// 						}
// 						console.log(map)
// 						// markers.forEach(function(marker){
// 						// 	marker.addTo(map);
// 						// });
// 					$rootScope.mapOpening=false;
// 					//}
//
//
//            });
//
//           }
//        };
//     });
