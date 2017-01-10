var Location=angular.module('Location', []);
/*Services*/

Location.service("retrieveLocation", ['$http', '$sce', '$location','States','$routeParams','$rootScope',
function( $http, $sce, $location,States, $routeParams, $rootScope) {

	//////////////////////MAKE WORK for LOWERCASE
	//////////////Manipulate strings so all items look like, 'Test, TS' to the program//////////////
	return {

		runLocation : function(location, latorlng, ratio) {
			var cities;
			var city_matches = [];
			var location_regex = new RegExp(location.replace(/\*/g, ',').toLowerCase().replace(/_/g, ' '));
			console.log(location_regex)
			return $http.get('json/locations.json').then(function(data) {
				var cities = data.data;
				cities.forEach(function(city){

					if(location_regex.test(city.city.toLowerCase()))
					{
					city_matches.push(city.city_id);
					}
				});
				return city_matches;
			});
		// 	console.log(location)
		// 	$rootScope.hideiconHolder=false;
		// 	$rootScope.noGeo=false;
		// //	 $rootScope.lookUpSongs_arr;=[];
		// 	//$rootScope.lookUpSongs=[];
		// 	var location = location.replace('*',', ');
		// 	var lat_min;
		// 	var long_min;
		// 	var long_max;
		// 	var lat_max;
		// 	var latitude;
		// 	var longitude;
		// 	var lats = Number();
		// 	var longs = Number();
		// 	var geolocation ={};
		// 	var states = States.createStateObj();
		// 	var location = location.replace(/'/, '')
		//
		// 	if (location.split(' ').length > 1 && location.match(',')) {
		// 		var zoom = 10;
		// 		///////city+full state//////
		// 		if (location.split(',')[1].replace(' ', '').length > 2) {
		// 			var locationSplit = location.split(',');
		// 			var loc1 = locationSplit[0].toTitleCase();
		// 			var loc2 = locationSplit[1].replace(' ', '').toTitleCase();
		// 		}
		// 		else
		// 		{
		//
		// 			location = location.replace('_', ' ');
		// 			var ab = location.split(', ')[1].split(' ')[0].toUpperCase();
		// 			for (var x=0; x<states.length; x++){
		// 				if(states[x].abbreviation==ab)
		// 				{
		//
		// 					var state =(states[x].name);
		// 					var locationSplit = location.split(', ');
		// 					var loc1 = locationSplit[0].toTitleCase();
		// 					var loc2 = state;
		//
		// 				}
		// 			};
		//
		// 		}
		// 		var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region = %27'+loc2.toUpperCase()+'%27+AND+CityName = %27'+loc1.toUpperCase()+'%27+ORDER%20BY+Lat&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
		// 			var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Long,Region,CityName,CountryID,Lat+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region = %27'+loc2.toUpperCase()+'%27+AND+CityName = %27'+loc1.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
		//
		// 			if(latorlng=="lat")
		// 			{
		// 			return	$http.jsonp(lat_url).then(function(data){
		// 				if (data.data.rows != null) {
		// 					data.data.rows.forEach(function(data)
		// 						{
		// 							lats += parseFloat(data[0]);
		//
		// 						});
		//
		// 					geolocation.latitude=lats/data.data.rows.length;
		// 					var miles_to_lat = distance_to_degrees_lat(3*ratio);
		// 					var miles_to_lon = distance_to_degrees_lon(geolocation.latitude , 3*ratio);
		// 					geolocation.lat_min = data.data.rows[0][0] - miles_to_lat;
		//
		//
		// 					geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lat;
		// 					geolocation.location = location;
		// 					geolocation.country = data.data.rows[0][3];
		// 					if(localStorage.country==null)
		// 					{
		// 						localStorage.country = geolocation.country;
		// 					}
		// 				} else {
		// 					$rootScope.noSongs=true;
		// 				}
		// 				return (geolocation);
		// 			});
		//
		// 			}
		//
		// 			else
		// 			{
		//
		// 			return	$http.jsonp(long_url).then(function(data){
		//
		// 				if (data.data.rows != null) {
		// 					data.data.rows.forEach(function(data)
		// 						{
		// 							longs += parseFloat(data[0]);
		// 							lats+= parseFloat(data[4]);
		// 						});
		//
		// 					geolocation.longitude=longs/data.data.rows.length;;
		// 					var latitude=lats/data.data.rows.length;
		// 					var miles_to_lat = distance_to_degrees_lat(3*ratio);
		// 					var miles_to_lon = distance_to_degrees_lon(latitude , 3*ratio);
		// 					geolocation.long_min = data.data.rows[0][0] - miles_to_lon;
		// 					geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lon;
		// 					geolocation.location = location;
		// 					geolocation.country = data.data.rows[0][3];
		// 				} else {
		// 					$rootScope.noSongs=true;
		// 				}
		// 				return (geolocation);
		// 			});
		// 			}
		//
		//
		//
		// 		}
		//
		// 		else {
		// 		var zoom = 6;
		// 		///Full State
		// 		if(location.length==2)
		// 		{
		// 			var ab = location.toUpperCase();
		//
		//
		// 			for(var x=0; x<states.length; x++)
		// 			{
		//
		// 				if(states[x].abbreviation==ab)
		// 				{
		// 					var location =(states[x].name.toLowerCase());
		//
		//
		// 				}
		// 			}
		// 		}
		// 		else {
		// 			var location =location;
		// 		}
		// 			var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region = %27'+location.toUpperCase()+'%27+ORDER%20BY+Lat&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
		// 			var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Long,Region,CityName,CountryID,Lat+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region = %27'+location.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
		//
		//
		// 			location = location.toTitleCase();
		// 			if(latorlng=="lat")
		// 				{
		// 				return	$http.jsonp(lat_url).then(function(data){
		// 				if (data.data.rows != null ) {
		// 					data.data.rows.forEach(function(data)
		// 						{
		// 							lats += parseFloat(data[0]);
		//
		// 						});
		// 					geolocation.latitude=lats/data.data.rows.length;
		// 					var miles_to_lat = distance_to_degrees_lat(7*ratio);
		// 					var miles_to_lon = distance_to_degrees_lon(latitude , 7*ratio);
		// 					geolocation.lat_min = data.data.rows[0][0] - miles_to_lat;
		//
		// 					geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lat;
		// 					geolocation.location = location;
		// 					geolocation.country = data.data.rows[0][3];
		// 					if(localStorage.country==null)
		// 					{
		// 						localStorage.country = geolocation.country;
		// 					}
		// 				} else {
		// 					$rootScope.noSongs=true;
		// 				}
		// 				return (geolocation);
		// 			});
		// 				}
		// 				else
		// 				{
		//
		// 				return	$http.jsonp(long_url).then(function(data){
		// 					if (data.data.rows != null || !data.stringify.match('error')) {
		// 						geolocation.longitude=data.data.rows[0][0];
		// 						data.data.rows.forEach(function(data)
		// 						{
		// 							longs += parseFloat(data[0]);
		// 							lats+= parseFloat(data[4]);
		//
		// 						});
		//
		// 					geolocation.longitude=longs/data.data.rows.length;;
		// 					var latitude=lats/data.data.rows.length;
		// 						var miles_to_lat = distance_to_degrees_lat(7*ratio);
		// 						var miles_to_lon =distance_to_degrees_lon(latitude , 7*ratio);
		// 						geolocation.long_min = data.data.rows[0][0] - miles_to_lon;
		// 						geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lon;
		// 						geolocation.location = location;
		// 						geolocation.country = data.data.rows[0][3];
		// 					} else {
		// 						$rootScope.noSongs=true;
		// 					}
		// 					return (geolocation);
		// 				});
		// 				}
		//
		//
		// 			}


		}
	};

}]);


Location.service("HashCreate", ['$q', '$rootScope', '$http', '$sce','$location','$routeParams',
function($q, $rootScope, $http, $sce, $location, $routeParams) {
	return{
			runHash : function(lat, lng, url_change, ratio) {

			$rootScope.hideiconHolder=false;
			var url = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+CityName%2C+Region%2C+CountryID+FROM+1B8NpmfiAc414JhWeVZcSqiz4coLc_OeIh7umUDGs+WHERE+Lat+<=" + (lat+ratio) + "+AND+Lat>=" + (lat - ratio) + "+AND+Long<=" + (lng+ratio) + "+AND+Long>=" + (lng -ratio) + "&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0";
			return $http.get(url).then(function(data) {

				if (data.data.rows != null) {

					var city = data.data.rows[0][0];
					var state = data.data.rows[0][1];
					var country = data.data.rows[0][2];
					if(localStorage.country==null)
					{
					localStorage.country = country;
					}
					var obj={'city':city, 'state':state }
					if (city.split(' ') > 1) {
						city = city.replace(/ /g, '_');
					}

					if (state.split(' ') > 1) {
						state = state.replace(/ /g, '_');
					}
					var hashy = $location.path().split('/')[1].split('/')[0];
					var location = city + '*' +state+'/';
					if(url_change ==true)
					{
					return hashy+'/'+location.replace(/ /g, '_');
					}

					return 	obj;


				}
				else{
					$rootScope.noGeo=true;
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
