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
Geolocation.directive('mwyaMap',  function () {

 return {
	 restrict: 'AE',
     transclude: true,

    link: function(scope, element, attr ) {
			scope.mapdata={};
			scope.mapdata.lat = 41.654811;
      scope.mapdata.lng = -91.5380717;
			scope.mapdata.markers = [];
			scope.mapdata.orig_lat=0;
			scope.mapdata.orig_lng=0;
			scope.mapdata.zoom=13;
			scope.mapOpening=true;


			var map = new L.Map("map",{});
			var markers=[];
			var cirlce;

			//var MAP = Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri&mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',

			var MAP =  L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
				attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				subdomains: 'abcd',
				minZoom: 0,
				maxZoom: 20,
				ext: 'png'
			});
			var marker_content = '';

			map.addLayer(MAP);

    	attr.$observe('change', function() {
				marker_content='';

				markers.forEach(function(item){
    			map.removeLayer(item);
    		});
				if(scope.mapdata.orig_lat === undefined || scope.mapdata.orig_lng === undefined || scope.mapdata.orig_lat===0 || scope.mapdata.orig_lng === 0)
					{
						scope.mapdata.orig_lat = scope.mapdata.lat
						scope.mapdata.orig_lng = scope.mapdata.lng
					}

      	if(scope.mapdata.markers.length>0)
      	{
      		markers =[];
      		var i =0;
					var mwyaIcon = L.icon({
					    iconUrl: 'genre_icons/marker_sm.svg',
						})

      		scope.mapdata.markers.forEach(function(marker) {
	      		i++;
						marker_content+=`<a href="${marker.uri}"><b>${marker.name}</b></a><br>${marker.artists[0].name}</b><br><i>${marker.album.name}</i><br>${marker.location.city}<br><br>`
						markers.push(L.marker([marker.lat, marker.lng], { icon: mwyaIcon }).bindPopup(marker_content));
					});
       	}

	      map.animate=true;
				map._zoom = 10;
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
