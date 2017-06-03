var Location=angular.module('Location', []);
/*Services*/

Location.service("retrieveLocation", ['$http', '$sce', '$location','States','$routeParams','$rootScope','$q', '$cacheFactory',
function( $http, $sce, $location,States, $routeParams, $rootScope, $q, $cacheFactory) {
	var cache = $cacheFactory('location');

	return {
		runLocation : function(location) {
			location = location.replace(/\*/g, ', ' ).replace('_', ' ');
			var cities,
				city_matches = [],
				location_regex = new RegExp(location.replace(/\*/g, ', ').toLowerCase()),
				deferred = $q.defer();

			//loads locations if they have not already been added
			if(!cache.get(location)) {
				var cities = [];
				var url = `https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+CityId%2CCity%2CLat%2CLng+FROM+18jFv1neX6lIDLe4Tg3CP9FUKhn3DuwuLy9irRXbk+WHERE+City%20CONTAINS%20IGNORING%20CASE%27${location}%27&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK`
				return $http({cache:true, url:url, method:'jsonp'}).then((data) => {
					data.data.rows.forEach(function(city){
						cities.push(city[0]);
					});
					return cities;
				});
			} else {
				songs = cache.get(location);
				deferred.resolve(cities);
				return deferred.promise;
			};
		}
	};

}]);


Location.service("HashCreate", ['$q', '$rootScope', '$http', '$sce','$location','$routeParams','States',
function($q, $rootScope, $http, $sce, $location, $routeParams, States) {
	return{
			runHash : function(lat, lng, url_change, ratio) {

			$rootScope.hideiconHolder=false;
			var url = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+CityName%2C+Region%2C+CountryID+FROM+1B8NpmfiAc414JhWeVZcSqiz4coLc_OeIh7umUDGs+WHERE+Lat+<=" + (lat+ratio) + "+AND+Lat>=" + (lat - ratio) + "+AND+Long<=" + (lng+ratio) + "+AND+Long>=" + (lng -ratio) + "&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0",
			states =States.createStateObj();
			return $http.get(url).then(function(data) {


				if (data.data.rows != null) {

					var city = data.data.rows[0][0];
					var state;
					var country = data.data.rows[0][2];
					states.forEach(function(item) {
						if(data.data.rows[0][1] === item.name) {
							state = item.abbreviation;
						}
					})
					if(localStorage.country==null)
					{
					localStorage.country = country;
					}
					var obj={'city':city, 'state':state, 'country': country }
					// if (city.split(' ') > 1) {
					// 	city = city.replace(/ /g, '_');
					// }

					// if (state.split(' ') > 1) {
					// 	state = state.replace(/ /g, '_');
					// }
					var hashy = $location.path().split('/')[1].split('/')[0];
					var location = `${city}*${state}*${country}/`;
					if(url_change ==true)
					{
					return hashy+'/'+location.replace(/ /g, '_');
					}

					return 	obj;


				}
				else{
					$rootScope.noGeo=false;
				}

			});
		}
	};
}]);

Location.service('MapCreate', ['$q', '$http', '$sce','$rootScope',
function($q,  $http, $sce, $rootScope) {

	///Creates compiled variables for mwya-map directive to create the map////
	$rootScope.latitude =0;
	$rootScope.longitude=150;
	$rootScope.locationarrstr='';
	$rootScope.zoom;

	$rootScope.mapOpening=true;

	///////////////Create a Directive to remove this from Services.  See evernote, but keep a watch on a specific "Map" object that includes {zoom, lat, long, arr, spot_arr};
	//////////////when this changes, change the map
	/////////////object should be modeled after finalcollector in each service//////////////////////
	/////////////Will need to be added to holder_arr.songs, finalcollector, and songFav////////////
	return {
		runMap :function(zoom,lat, long, arr, spot_arr){

			$rootScope.latitude =lat;
			$rootScope.longitude=long;
			$rootScope.locationarrstr=arr.toString();
			$rootScope.zoom = zoom;
			$rootScope.mapOpening=false;
		}
	};
}]);

Location.service('LocationDataFetch', [ 'retrieveLocation',
function(location, latorlng) {
	//return {
	var locationdata = {};


	locationdata.count = 0;
	return locationdata;
	//};
}]);


Location.service('States', ['$http', '$routeParams', '$location', '$rootScope', '$sce',
function($http, $routeParams, $location, $rootScope, $sce) {
	return {
		createStateObj : function()
		{
			var usStates = [
		    { name: 'ALABAMA', abbreviation: 'AL', num:0, isThere:false},
		    { name: 'ALASKA', abbreviation: 'AK',  num:0, isThere:false},
		    { name: 'ARKANSAS', abbreviation: 'AR',  num:0, isThere:false},
		    { name: 'AMERICAN SAMOA', abbreviation: 'AS',  num:0, isThere:false},
		    { name: 'ARIZONA', abbreviation: 'AZ',  num:0, isThere:false},
		    { name: 'CALIFORNIA', abbreviation: 'CA',  num:0, isThere:false},
		    { name: 'COLORADO', abbreviation: 'CO',  num:0, isThere:false},
		    { name: 'CONNECTICUT', abbreviation: 'CT',  num:0, isThere:false},
		    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC',  num:0, isThere:false},
		    { name: 'DELAWARE', abbreviation: 'DE',  num:0, isThere:false},
		    { name: 'FLORIDA', abbreviation: 'FL',  num:0, isThere:false},
		    { name: 'GEORGIA', abbreviation: 'GA',  num:0, isThere:false},
		    { name: 'GUAM', abbreviation: 'GU',  num:0, isThere:false},
		    { name: 'HAWAII', abbreviation: 'HI',  num:0, isThere:false},
		    { name: 'IOWA', abbreviation: 'IA', num:0, isThere:false},
		    { name: 'IDAHO', abbreviation: 'ID',  num:0, isThere:false},
		    { name: 'ILLINOIS', abbreviation: 'IL',  num:0, isThere:false},
		    { name: 'INDIANA', abbreviation: 'IN', num:0, isThere:false},
		    { name: 'KANSAS', abbreviation: 'KS',  num:0, isThere:false},
		    { name: 'KENTUCKY', abbreviation: 'KY',  num:0, isThere:false},
		    { name: 'LOUISIANA', abbreviation: 'LA',  num:0, isThere:false},
		    { name: 'MASSACHUSETTS', abbreviation: 'MA',  num:0, isThere:false},
		    { name: 'MARYLAND', abbreviation: 'MD',  num:0, isThere:false},
		    { name: 'MAINE', abbreviation: 'ME', num:0, isThere:false},
		    { name: 'MICHIGAN', abbreviation: 'MI',  num:0, isThere:false},
		    { name: 'MINNESOTA', abbreviation: 'MN',  num:0, isThere:false},
		    { name: 'MISSOURI', abbreviation: 'MO',  num:0, isThere:false},
		    { name: 'MISSISSIPPI', abbreviation: 'MS',  num:0, isThere:false},
		    { name: 'MONTANA', abbreviation: 'MT',  num:0, isThere:false},
		     { name: 'NORTH CAROLINA', abbreviation: 'NC',  num:0, isThere:false},
		    { name: 'NORTH DAKOTA', abbreviation: 'ND',  num:0, isThere:false},
		    { name: 'NEBRASKA', abbreviation: 'NE',  num:0, isThere:false},
		    { name: 'NEW HAMPSHIRE', abbreviation: 'NH',  num:0, isThere:false},
				{ name: 'NEW JERSEY', abbreviation: 'NJ',  num:0, isThere:false},
		    { name: 'NEW MEXICO', abbreviation: 'NM',  num:0, isThere:false},
		    { name: 'NEVADA', abbreviation: 'NV',  num:0, isThere:false},
		    { name: 'NEW YORK', abbreviation: 'NY',  num:0, isThere:false},
		    { name: 'OHIO', abbreviation: 'OH',  num:0, isThere:false},
		    { name: 'OKLAHOMA', abbreviation: 'OK',  num:0, isThere:false},
		    { name: 'OREGON', abbreviation: 'OR',  num:0, isThere:false},
		    { name: 'PENNSYLVANIA', abbreviation: 'PA',  num:0, isThere:false},
		    { name: 'PUERTO RICO', abbreviation: 'PR',  num:0, isThere:false},
		    { name: 'RHODE ISLAND', abbreviation: 'RI', num:0, isThere:false},
		    { name: 'SOUTH CAROLINA', abbreviation: 'SC',  num:0, isThere:false},
		    { name: 'SOUTH DAKOTA', abbreviation: 'SD', num:0, isThere:false},
		    { name: 'TENNESSEE', abbreviation: 'TN',  num:0, isThere:false},
		    { name: 'TEXAS', abbreviation: 'TX',  num:0, isThere:false},
		    { name: 'UTAH', abbreviation: 'UT',  num:0, isThere:false},
		    { name: 'VIRGINIA', abbreviation: 'VA', num:0, isThere:false},
		    { name: 'VIRGIN ISLANDS', abbreviation: 'VI', num:0, isThere:false},
		    { name: 'VERMONT', abbreviation: 'VT',  num:0, isThere:false},
		    { name: 'WASHINGTON', abbreviation: 'WA',  num:0, isThere:false},
		    { name: 'WISCONSIN', abbreviation: 'WI',  num:0, isThere:false},
		    { name: 'WEST VIRGINIA', abbreviation: 'WV',  num:0, isThere:false},
		    { name: 'WYOMING', abbreviation: 'WY',  num:0, isThere:false },
		    { name: 'BREMUDA', abbreviation: 'BM',  num:0, isThere:false }
	];

		return usStates;

	},
	createCountriesObj:function()
	{
		return $http.get('json/countries.json').then(function(result)
		{
			return result;
		});
	}
};
}]);
