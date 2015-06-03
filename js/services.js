
/* Services */

//Checks to see if Geolocation is Activated.  If it is it creates a geolocation variable and sends them as parameters to HashCreate service////

///If Geolocation is not enabled, alerts user to the fact/////////
MusicWhereYouAreApp.factory("getLocation", ['$q', '$http', '$sce', 'PlaylistCreate', 'HashCreate','$rootScope','$location',
function($q, $http, $sce, PlaylistCreate, HashCreate, $rootScope, $location) {
	
	
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
			HashCreate.runHash(currentLat, currentLong, true, .05).then(function(data){
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




/////////////////Runs the geolocations through Echonest and filters results based on type of location (city, region or just region, removes duplicates, etc.)
////////////////Checks to see if any items in this playlist have been favorites
MusicWhereYouAreApp.factory('PlaylistCreate', ['$q', '$rootScope', '$http', '$sce', 'MapCreate', 'HashCreate','$location','$routeParams','States',
function($q, $rootScope, $http, $sce, MapCreate, HashCreate, $location, $routeParams, States) {
	

	return {
		 runPlaylist : function(zoom, lat, long,lat_min, lat_max, long_min, long_max, genres, era, start_number){
		 	var lsTitleArr=[];
			var lsIdArr=[];
			var lsTitleStr='';
			var lsIdStr='';
			var lsIdFavArr=[];
		 	var genresSplit = genres.split('**');
		 	var eraSplit=era.split('**');
		 	var finalgenres = '';
		 	var era1='';
		 	var era2='';
		 	
		 	for (var i=0; i<genresSplit.length; i++)
		 	{
		 		
		 		if(genresSplit.length>0&& genresSplit[i]!="")
		 		{
			 		if(genresSplit[i]!='holiday')
			 		{	
			 		finalgenres +='&style='+genresSplit[i];
			 		}
			 		else
			 		{
			 			finalgenres+='&song_type=christmas';
			 		}
		 		}
		 		
		 	}
		 	songs = {};
		 	 if(finalgenres=='' && era=='')
		 	{
			var url = 'http://developer.echonest.com/api/v4/song/search?api_key=3KFREGLKBDFLWSIEC&format=jsonp&results=50&min_latitude=' + lat_min + '&max_latitude=' + lat_max + '&min_longitude=' + long_min + '&max_longitude=' + long_max + '&bucket=artist_location&bucket=id:spotify-WW&bucket=tracks&limit=true&&song_type=studio&rank_type=familiarity&song_min_hotttnesss=.3&start='+start_number+'&callback=JSON_CALLBACK';
			}
			else{
				var url = 'http://developer.echonest.com/api/v4/song/search?api_key=3KFREGLKBDFLWSIEC&format=jsonp&results=50&min_latitude=' + lat_min + '&max_latitude=' + lat_max + '&min_longitude=' + long_min + '&max_longitude=' + long_max + '&bucket=artist_location&bucket=id:spotify-WW&bucket=tracks&limit=true&&song_type=studio&rank_type=familiarity&song_min_hotttnesss=.2&start='+start_number+finalgenres+era+'&callback=JSON_CALLBACK'
			}
			return $http.jsonp(url).then(function(data) {
				
				var songs = data.data.response.songs;
				songs = songs.removeDuplicatesArrObj( 'title', true);
				songs.songsArr=[];
				songs.songsArr.spot_arr = [];
			 	songs.songsArr.spot_playlist=[];
				songs.songsArr.location_arr = [];
				songs.songsArr.final_loc_arr=[];
				songs.songsArr.lat_min = lat_min;
				songs.songsArr.long_min = long_min;
				songs.songsArr.spot_str = '';
				var song_str = '';
				var location_str = '';
				var location_rp = $routeParams.location;
				if(localStorage.leaveOutArr!=null){
				var LeaveOut =jQuery.parseJSON(localStorage.leaveOutArr);
				}else{
					var LeaveOut=[];
				}
				var states = States.createStateObj();
				//var countries = States.createCountriesObj
				if(location_rp.split('*').length==1)
				{
					///StateAB/////////
					if(location_rp.length==2)
					{
						
						for(var yy=0; yy<states.length; yy++)
						{
							
							if(location_rp.toLowerCase() ==states[yy].abbreviation.toLowerCase())
							{
								location_rp1 = states[yy].name;
								location_rp2=states[yy].abbreviation;
								
							}
						
						}
					}
					else
					{
						//////////////State///////////
						//location_rp = location_rp.replace('*',', ');
						for(var yy=0; yy<states.length; yy++)
						{
							
							if(location_rp.replace(/_/g, ' ').toUpperCase() ==states[yy].name)
							{
								location_rp1 = states[yy].name;
								location_rp2=states[yy].abbreviation;
							}
							
							else 
							{
								location_rp1 = location_rp;
								//location_rp2=location_rp;
								
								
							}
						}
					}
				}
				else
				{
					 var location_rpS =location_rp.split('*')[1];
					////////////////City Region/////////////////
					 if(location_rpS.length==2)
					{
						
						for(var yy=0; yy<states.length; yy++)
						{
							if(location_rpS ==states[yy].abbreviation)
							{
								location_rp1 = states[yy].name;
								location_rp2=states[yy].abbreviation;
								
							}
						}
					}
					else
					{
						//location_rp = location_rp.replace('*',', ');
						for(var yy=0; yy<states.length; yy++)
						{
							if(location_rpS.toUpperCase() ==states[yy].name)
							{
								location_rp1 = states[yy].name;
								location_rp2=states[yy].abbreviation;
								
							}
						}
					
					}
					
					
				}
				
				
				songs.forEach(function(song) {
					var x=songs.indexOf(song)
					
					var songtitle=song.title
					
					///////////////////City Region//////////////////////
						if(location_rp.split('*').length==1)
						{
						/////////////////////////check for song against Local Storage so LeaveOuts are left out///////////////////////////////////	
						if (!song_str.toLowerCase().replace(/\W/g,' ').match(songtitle.toLowerCase().replace(/\W/g,' '))&&!lsIdArr.toString().replace(/\W/g, '').match(song.id.replace(/\W/g,'')) && !lsTitleArr.toString().toLowerCase().replace(/\W/g, '').match(song.title.toLowerCase().replace(/\W/g,'')))
						{
							if((song.artist_location.location.replace(/\W/g, '').toUpperCase().match(location_rp1.replace(/\W/g, '').toUpperCase()))||(song.artist_location.location.replace(/\W/g, '').toUpperCase().match(location_rp2.replace(/\W/g, '').toUpperCase()))||song.tracks.length!=0)
							{
							
									
							if(song.title == null || song.artist_location == null||song.artist_location.location==null || song.id == null)
							{
							
							x=x+1;
							}
							
							if(lsIdFavArr.toString().replace(/\W/g, '').match(song.id))
								{
								song.favorite='on';
								}
							else
								{
								song.favorite='off';
								}
							song.closeButton=false;
							
							song.num_id=x;
							song.id=x;
							songs.songsArr.push(song);
							songs.songsArr.spot_arr.push("spotify:track:"+song.id);
							songs.songsArr.spot_playlist.push(song.id);
							songs.songsArr.spot_str+=song.id+',';
							song_str += songtitle;
								}
							
							}
						}
					else{
						
						
						if (!song_str.toLowerCase().replace(/\W/g,' ').match(songtitle.toLowerCase().replace(/\W/g,' '))&&!lsIdArr.toString().replace(/\W/g, '').match(song.id.replace(/\W/g,'')) && !lsTitleArr.toString().toLowerCase().replace(/\W/g, '').match(song.title.toLowerCase().replace(/\W/g,''))|| song.tracks.length!=0)
						{
							
								
							
						if(song.title == null || song.artist_location == null||song.artist_location.location==null || song.id == null )
						{
						x=x+1;
						}
						
						if(lsIdFavArr.toString().replace(/\W/g, '').match(song.id))
							{
							
							song.favorite='on';
							}
						else
							{
							song.favorite='off';
							}
						song.closeButton=false;
						song.num_id=x;
						//song.favorite='off'
						song.id=x;
						songs.songsArr.push(song);
						songs.songsArr.spot_arr.push("spotify:track:"+song.id);
						songs.songsArr.spot_playlist.push(song.id);
						songs.songsArr.spot_str+=song.id+',';
						
						song_str += songtitle;

								
						}
					}
				});
				
				songs = songs.compareArraysObj(LeaveOut, 'title');
				//console.log(songs)
				return songs;
				
			},function(error){
				$rootScope.errorMessage=true;
				
			});
		 	},
		 	createPlaylist:function(songlist)
			{
				var deferred = $q.defer();
				var songs={};
				songs.songs=[];
				songs.spot_arr=[];
				songs.savSpotArr=[];
				songs.artistlocation ='';
				songs.spot_str='';
				songs.location_arr=[];
				songlist.forEach (function(song) {
					var x = songlist.indexOf(song);
					song.artists[0].name=song.artists[0].name.findThe();
					song.num_id=x;
					songs.songs.push(song);
					Favorites.checkFavorites(song);
					songs.spot_arr.push(song.id);
					songs.savSpotArr.push('spotify:track:'+song.id);
					songs.artistlocation = $routeParams.location;
					songs.tracks=[{foreign_id: song.uri}]
					
					songs.location_arr.push(song.artist_location.location + '@@' + song.artist_location.latitude + ':' + song.artist_location.longitude + '&&<h5>' + song.name + '</h5><p>' + song.artists[0].name + '</p><a href="spotify:track:' + song.id + '" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+songs.length></div></a><a><a a href="#/info/' + songs.artistlocation + '/' + song.artists[0].name.replace('The ', '') + '" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+songs.length  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
					
				});
				
				//songs.location_arr.sort();
				songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_arr.toString();
				songs.spot_strFinal = $sce.trustAsResourceUrl(songs.spot_str);
				//console.log(songs)
				deferred.resolve(songs);
				return deferred.promise;
				
			},
		 	
		 	
		 	
		 	
	};
}]);



/////////////////////Takes multiple variables from the PlaylistCreate function and creates a google map with markers for where the artists are from/////////////////
MusicWhereYouAreApp.factory('MapCreate', ['$q', '$http', '$sce','$rootScope',
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

MusicWhereYouAreApp.factory('LocationDataFetch', [ 'retrieveLocation',
function(location, latorlng) {
	//return {
	var locationdata = {};
	

	locationdata.count = 0;
	return locationdata;
	//};
}]);

MusicWhereYouAreApp.factory("retrieveLocation", ['$http', '$sce', '$location','States','$routeParams','$rootScope',
function( $http, $sce, $location,States, $routeParams, $rootScope) {
	
	//////////////////////MAKE WORK for LOWERCASE
	//////////////Manipulate strings so all items look like, 'Test, TS' to the program//////////////
	return {
		
		runLocation : function(location, latorlng, ratio) {
			$rootScope.hideiconHolder=false;
			$rootScope.noGeo=false;
			//$rootScope.lookUpSongs=[];
			var location = location.replace('*',', ');
			var lat_min;
			var long_min;
			var long_max;
			var lat_max;
			var latitude;
			var longitude;
			var lats = Number();
			var longs = Number();
			var geolocation ={};
			var states = States.createStateObj();
			var location = location.replace(/'/, '')
			
			if (location.split(' ').length > 1 && location.match(',')) {
				var zoom = 10;
				///////city+full state//////
				if (location.split(',')[1].replace(' ', '').length > 2) {
					var locationSplit = location.split(',');
					var loc1 = locationSplit[0].toTitleCase();
					var loc2 = locationSplit[1].replace(' ', '').toTitleCase();
				}	
				else
				{
					
					location = location.replace('_', ' ');
					var ab = location.split(', ')[1].split(' ')[0].toUpperCase();
					for (var x=0; x<states.length; x++){
						if(states[x].abbreviation==ab)
						{
						
							var state =(states[x].name);
							var locationSplit = location.split(', ');
							var loc1 = locationSplit[0].toTitleCase();
							var loc2 = state;
							
						}
					};
					
				}	
					var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region CONTAINS IGNORING CASE %27'+loc2.toUpperCase()+'%27+AND+CityName CONTAINS IGNORING CASE %27'+loc1.toUpperCase()+'%27+ORDER%20BY+Lat&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
					var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Long,Region,CityName,CountryID,Lat+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region CONTAINS IGNORING CASE %27'+loc2.toUpperCase()+'%27+AND+CityName CONTAINS IGNORING CASE %27'+loc1.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
					
					if(latorlng=="lat")
					{
					return	$http.jsonp(lat_url).then(function(data){
						if (data.data.rows != null) {
							data.data.rows.forEach(function(data)
								{
									lats += parseFloat(data[0]);
									
								});
							geolocation.latitude=lats/data.data.rows.length;
							var miles_to_lat = distance_to_degrees_lat(7*ratio);
							var miles_to_lon = distance_to_degrees_lon(latitude , 7*ratio);
							geolocation.lat_min = data.data.rows[0][0] - miles_to_lat;
							
							geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lat;
							
							geolocation.location = location;
							geolocation.country = data.data.rows[0][3];
							if(localStorage.country==null)
							{
								localStorage.country = geolocation.country;
							}
						} else {
							$rootScope.noSongs=true;
						}	
						return (geolocation);
					});
					
					}
					
					else
					{
					
					return	$http.jsonp(long_url).then(function(data){
						
						if (data.data.rows != null) {
							data.data.rows.forEach(function(data)
								{
									longs += parseFloat(data[0]);
									lats+= parseFloat(data[4]);
								});
								
							geolocation.longitude=longs/data.data.rows.length;;
							var latitude=lats/data.data.rows.length;
							var miles_to_lat = distance_to_degrees_lat(7*ratio);
							var miles_to_lon = distance_to_degrees_lon(latitude , 7*ratio);
							geolocation.long_min = data.data.rows[0][0] - miles_to_lon;
							geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lon;
							geolocation.location = location;
							geolocation.country = data.data.rows[0][3];
						} else {
							$rootScope.noSongs=true;
						}
						return (geolocation);
					});
					}
					
				 
				
				}
				
				else {
				var zoom = 6;
				///Full State
				if(location.length==2)
				{
					var ab = location.toUpperCase();
					
					
					for(var x=0; x<states.length; x++)
					{
						
						if(states[x].abbreviation==ab)
						{
							var location =(states[x].name.toLowerCase());
							
							
						}
					}
				}
				else {
					var location =location;
				}	
					var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region CONTAINS IGNORING CASE %27'+location.toUpperCase()+'%27+ORDER%20BY+Lat&key CONTAINS IGNORING CASE AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
					var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql CONTAINS IGNORING CASE SELECT+Long,Region,CityName,CountryID,Lat+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region CONTAINS IGNORING CASE %27'+location.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK';
					

					location = location.toTitleCase();
					if(latorlng=="lat")
						{
						return	$http.jsonp(lat_url).then(function(data){
						if (data.data.rows != null ) {
							data.data.rows.forEach(function(data)
								{
									lats += parseFloat(data[0]);
									
								});
							geolocation.latitude=lats/data.data.rows.length;
							var miles_to_lat = distance_to_degrees_lat(7*ratio);
							var miles_to_lon = distance_to_degrees_lon(latitude , 7*ratio);
							geolocation.lat_min = data.data.rows[0][0] - miles_to_lat;
							
							geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lat;
							geolocation.location = location;
							geolocation.country = data.data.rows[0][3];
							if(localStorage.country==null)
							{
								localStorage.country = geolocation.country;
							}
						} else {
							$rootScope.noSongs=true;
						}	
						return (geolocation);
					});
						}
						else
						{
						
						return	$http.jsonp(long_url).then(function(data){
							if (data.data.rows != null || data.stringify.match('error')) {
								geolocation.longitude=data.data.rows[0][0];
								data.data.rows.forEach(function(data)
								{
									longs += parseFloat(data[0]);
									lats+= parseFloat(data[4]);
									
								});
								
							geolocation.longitude=longs/data.data.rows.length;;
							var latitude=lats/data.data.rows.length;
								var miles_to_lat = distance_to_degrees_lat(7*ratio);
								var miles_to_lon =distance_to_degrees_lon(latitude , 7*ratio);
								geolocation.long_min = data.data.rows[0][0] - miles_to_lon;
								geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + miles_to_lon;
								geolocation.location = location;
								geolocation.country = data.data.rows[0][3];
							} else {
								$rootScope.noSongs=true;
							}
							return (geolocation);
						});
						}

					
					}
					
			
		}	
	};
	
}]);




MusicWhereYouAreApp.factory("HashCreate", ['$q', '$rootScope', '$http', '$sce','$location','$routeParams',
function($q, $rootScope, $http, $sce, $location, $routeParams) {
	return{
			runHash : function(lat, lng, url_change, ratio) {
			$rootScope.hideiconHolder=false;
			var url = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+CityName%2C+Region%2C+CountryID+FROM+1B8NpmfiAc414JhWeVZcSqiz4coLc_OeIh7umUDGs+WHERE+Lat+<=" + (lat+ratio) + "+AND+Lat>=" + (lat - ratio) + "+AND+Long<=" + (lng+ratio) + "+AND+Long>=" + (lng -ratio) + "&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0";
			return $http.get(url).then(function(data) {
				
				if (data.data.rows != null || data.stringify.match('error')) {
				
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
								
			});
		}
	};	
}]);

MusicWhereYouAreApp.factory("loadGenreCheckData", ['$routeParams','$http',
function($routeParams, $http){
	return {
			  getGenre: function() {
				
			var Genre=[{genre: {checked : false,isSelected : false, state: 'off',  genre: 'avant garde', similarGenres: 'avant garde**avant garde jazz**avant garde metal', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'blues', similarGenres: 'blues**blues guitar**blues revival**blues rock**blues-rock**british blues**chicago blues**classic blues**contemporary blues**country blues**delta blues**electric blues**juke joint blues louisiana blues**memphis blues**modern blues**modern electric blues**new orleans blues**slide guitar blues**soul blues**texas blues', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'classic rock', similarGenres: 'classic rock' , year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre: 'classical', similarGenres: 'classical**classical pop**contemporary classical music**crossover classical**modern classical', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'comedy', similarGenres:'comedy**comedy rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'country', similarGenres: 'country rock**alternative country**country**honky tonk**cowboy punk**classic country**modern country**hillbilly**rockabilly**bluegrass**country pop**outlaw country**pop country**progressive country**texas country', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'drama', similarGenres: 'drama', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'electronic', similarGenres: 'electronic**electro**electro hip hop**electro house**electro rock**electro-funk**electro-industrial**electro jazz**experimental electronic**indie electronic', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'folk', similarGenres: 'folk**acid folk**alternative folk**contemporary folk**country folk**electric folk**folk pop**folk revival**folk rock**folk pop**indie folk**neo folk**pop folk**psychedelic folk**stomp and holler**traditional folk**urban folk', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'hip hop', similarGenres:'hip hop**classic hip hop**rap**west coast hip hop**alternative hip hop**east coast hip hop**electro hip hop**experimental hip hop**independent hip hop**indie hip hop**jazz hip hop**old school hip hop**southern hip hop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',   genre: 'holiday', similarGenres: 'holiday', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'indie', similarGenres: 'indie rock**geek rock**lo fi**math rock**indie folk**indie hip hop**indie**indy', year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre : 'jazz', similarGenres: 'jazz**jazz blues**jazz funk**jazz fusion**jazz hip hop**jazz rock**jazz vocal**latin jazz**modern jazz**new orleans jazz**soul jazz**traditional jazz' , year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: "kid music", similarGenres:'children\'s music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'latin', similarGenres: 'latin**latin jazz**jazz latino**latin alternative**latin folk**latin hip hop**latin pop**latin music**latin rap**latin rock**latin ska', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'new age', similarGenres:'new age**new age music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'motown', similarGenres: 'motown**classic motown**soul**memphis soul**old school soul**soul music**soul', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'pop', similarGenres:'pop 60s pop**80s pop**acoustic pop**alternative pop**pop rock**dance pop**folk pop**jangle pop**pop country**pop punk**pop rap**pop folk**psychedelic pop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'punk', similarGenres: 'punk**punk rock**acoustic punk**art punk**anarcho punk**classic punk**cowpunk**dance-punk**cyberpunk**emo punk**folk punk**garage punk**hardcore punk**indie punk**old school punk**political punk**skate punk**street punk', year_end:''}},{genre : {checked : false,isSelected : false, state: 'off',  genre: 'rock', similarGenres: 'rock**punk rock**classic rock**college rock**dance rock**electro rock**folk rock**garage rock**jam band**hard rock**modern rock**psychedelic stoner rock**punk**southern rock**80s rock**90s rock**70s rock**60s rock**alternative rock**acoustic rock**acid rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'soft rock', similarGenres: 'soft rock**easy listening', year_end:''}}, {genre: {checked : false,isSelected : false, state: 'off',  genre: 'world', similarGenres: 'world world music**world beat**world fusion', year_end:''}}];	
	
	
	return Genre;
	},
	getEra: function() {
			var d=new Date();	
			var Era=[{era: {checked : false,isSelected : false, state: 'off',  era: 'twentyten', year_begin: '2010', year_end: d.getFullYear()}},{era: {checked : false,isSelected : false, state: 'off',  era: 'twenty', year_begin: '2000', year_end:'2009'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenninty', year_begin: '1990', year_end:'1999'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteeneighty', year_begin: '1980', year_end:'1989'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenseventy', year_begin: '1970', year_end:'1979'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteensixty', year_begin: '1960', year_end:'1969'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenfifty', year_begin: '1950', year_end:'1959'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenforty', year_begin: '1940', year_end:'1949'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenthrity', year_begin: '1930', year_end:'1939'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteentwenty', year_begin: '1920', year_end:'1929'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenten', year_begin: '1910', year_end:'1919'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteen', year_begin: '1900', year_end:'1909'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteenninty', year_begin: '1890', year_end:'1899'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteeneighty', year_begin: '1880', year_end:'1889'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'eighteenseventy', year_begin: '1870', year_end:''}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteensixty', year_begin: '1860', year_end:'1869'}}];	
	
	return Era;
	},
	
	getMood: function() {
				
			var Mood=[{mood: {checked : false,isSelected : false, state: 'off',  mood: 'happy', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'angry', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'sad', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'sexy', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'quiet', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'dark', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'epic', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'party_music', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'intense', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'rowdy', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'cheerful', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'carefree', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'energetic', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'laid-back', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'rebellious', year_end:''}}];	
	
	
	return Mode;
	},
	
	loadEchonestStyles:function()
	{
		var url ='json/echonest_genres.json'
     			
     			
     			return $http.get(url).then(function(result)
     			{
     				var genres= result.data.response.terms
     				
     				return genres;
     			});
     			
	}		  
	
};
}]);

MusicWhereYouAreApp.factory("runSymbolChange", ['$rootScope','$location', function($rootScope, $location)
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
		
			icons = [genre_class, playlist_class, favorite_class, map_class, jukebox_class];
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

MusicWhereYouAreApp.factory("retrieveInfo", ['$q', '$rootScope', '$http', '$sce', '$location',
function($q, $rootScope, $http, $sce, $location) {
return{
	
     		infoRetrieve: function(artistname){
     			var artistinfo = {};
     			var artistname_echo = artistname.replace(/\*/g, ' ');
     		
     			//var feed = 'http://teacheratsea.wordpress.com/category/'+$routeParams.teachername.split('*')[0].toLowerCase()+'-'+$routeParams.teachername.split('*')[1].toLowerCase()+'/feed';
     			
     			var url ='http://developer.echonest.com/api/v4/artist/search?api_key=3KFREGLKBDFLWSIEC&format=jsonp&name='+artistname_echo+'&results=1&bucket=songs&bucket=biographies&bucket=images&bucket=id:spotify-WW&limit=true&bucket=video&bucket=news&bucket=artist_location&rank_type=familiarity&callback=JSON_CALLBACK'
     			
     			
     			return $http.jsonp(url).then(function(result)
     			{
     			artistinfo =result.data.response.artists[0];
       			artistinfo.spot_url=[];
     			artistinfo.bio={};
     			artistinfo.bio.text='';
     			artistinfo.ytArr=[];
     			artistinfo.videoArr=[];
     			artistinfo.lastfm_imgs=[];
     			
	     			artistinfo.video.forEach(function(video){
	     			
	     			if(video.url.match('youtube'))
		     			{
		     			artistinfo.ytArr.push(video.url);
		     			}
	     			});
     			
	     			artistinfo.news.forEach(function(news){
		     			news.news_summary=news.summary.removeHTML();
	     			});
     			
     			if(artistinfo.ytArr.length<7)
     			{
     			var yt_length = artistinfo.ytArr.length;
     			}
     			else{
     			var yt_length = 7;
     			}
     			for (var g=0; g<yt_length; g++)
	     			{
	     				artistinfo.videoArr.push($sce.trustAsResourceUrl('http://www.youtube.com/embed/'+artistinfo.ytArr[g].slice(artistinfo.ytArr[g].indexOf('?v='),artistinfo.ytArr[g].indexOf('&feature')).replace('?v=','')));
	     			};
     			
     			
	     			for(var i=0; i<artistinfo.biographies.length; i++)
	     			{
	     				
	     				if(artistinfo.biographies[i].site.match('last.fm'))
	     				{
	     					artistinfo.bio=result.data.response.artists[0].biographies[i];
	     					if(artistinfo.bio.text.length>2700)
	     					{
	     						artistinfo.bio.text = artistinfo.bio.text.Slicer(2700) +'... ';
								artistinfo.bio_site = 'Read More at ' +artistinfo.bio.site;
	     					}
	     					else
		     				{
		     					artistinfo.bio_site = 'Courtesy of ' +artistinfo.bio.site;
		     				}
	     				}
	     				
	     				
	     			}
     			
     			if(artistinfo.bio.text=='')
     			{
     				artistinfo.bio.text='No published biography exists for this band.';
     			}
     			
     			for(var h=0; h<artistinfo.images.length; h++)
     			{
     				if(artistinfo.images[h].url.match('last.fm'))
	     					{
	     						if(artistinfo.images[h].url.match('serve'))
	     						{
	     						var img_id = artistinfo.images[h].url.split('serve/')[1]
	     						img_id=img_id.slice(artistinfo.images[h].url.split('serve/')[1].indexOf('/'),artistinfo.images[h].url.split('serve/')[1].length);
	     							
	     						artistinfo.images[h].src ='http://userserve-ak.last.fm/serve/126s'+img_id;	
	     						
	     									
	     						artistinfo.lastfm_imgs.push(artistinfo.images[h]);
	     						 }    						
	     					}
	     				}
	     				if(artistinfo.images.length==0)
	     				{
	     					for (var y=0; y<5; y++)
	     					{
	     					artistinfo.images.push('logo4_sm.png');	     				
	     					}
	     				}
     			
     			return artistinfo;
		});	
		
	},
     		imagesRetrieve: function(artistname){
     			var artistimages = {};
     			
     			
     			var url ='php/wikimedia.php?q='+artistname.replace(/\*/g,' ')+'music';
     			
     			
     			return $http.get(url).success(function(result)
     			{
	
     			artistimages =(result.data);
     			
     			return artistimages;
		});	
		
	},
			lookUpArtist :function(artistname)
			{
				
				var url = 'https://api.spotify.com/v1/search?q="'+artistname+'"&type=artist&limit=1';
				return $http.get(url).success(function(result)
     			{
					var artistid= result.artists.items[0].id;
					return artistid;
					
		});	
			},
			spotifyRetrieve :function(id)
			{
				return $http.get('https://api.spotify.com/v1/artists/'+id+'/top-tracks?country=US').success(function(result){
						artistsongs =result;
     					artistsongs.spot_url=[];
     					artistsongs.spot_url_button=[];
						
     			
     			
     			artistsongs.tracks.forEach(function(track)
	     			{
	     				
	     				artistsongs.spot_url.push(track.id);
	     				artistsongs.spot_url_button.push(track.id);
	     				
	     			});
     			artistsongs.spot_url_str = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+artistsongs.spot_url.toString());
     			return artistsongs;
     			});
			},
			
			relatedRetrieve: function(artistname)
			{
				
				relatedartists={};
			
				var url ='http://developer.echonest.com/api/v4/artist/similar?api_key=3KFREGLKBDFLWSIEC&format=json&name='+artistname+'&results=10&&bucket=id:spotify-WW&bucket=images&bucket=artist_location';
				return $http.get(url).success(function(result)
     			{
     			relatedartists =result.response.artists;
     			relatedartists.relatedartistsfinal = [];	
     			relatedartists.forEach(function(artist)
	     			{
	     				if(artist.artist_location!=null)
	     				{
	     				relatedartists.relatedartistsfinal.push(artist);
	     				
	     				
	     				}
	     			});
	     			
	     			relatedartists.relatedartistsfinal.forEach(function(relatedartist)
	     			{	
	     				relatedartist.href = '#/info/'+$location.path().split('/')[2]+'/'+relatedartist.name.replace('The ', '');
	     				relatedartist.lastfm_imgs =[];
	     				relatedartist.images.forEach(function(image)
	     				{
	     					if(image.url.match('last.fm'))
	     					{
	     						if(image.url.match('serve'))
	     						{
	     						var img_id = image.url.split('serve/')[1]
	     						img_id=img_id.slice(image.url.split('serve/')[1].indexOf('/'),image.url.split('serve/')[1].length);
	     						
	     						image.src ='http://userserve-ak.last.fm/serve/126s'+img_id;	
	     									
	     						relatedartist.lastfm_imgs.push(image);
	     						
	     						}
	     					}
	     				});
	     				
	     				if(relatedartist.lastfm_imgs.length==0)
	     				{
	     					relatedartist.lastfm_imgs.push({src:'/MusicWhereYouAre/logo4_sm.png'});	     				
	     				}
	     			});
	     			
						
	     			return relatedartists;
     			});
			},
	
	
			     createObjects: function() {	
					
					var buttons={};
					buttons.bio={};
					buttons.photos={};
					buttons.videos={};
					buttons.topsongs={};
					buttons.news={};
					buttons.related={};
					
					buttons.bio.name='bio';
					buttons.bio.classy= "shower";
					buttons.bio.state='on';
					//buttons.bio.href='#/'+$routeParams.year+'/'+$routeParams.teachername+'/blogs';
					
					buttons.photos.name='photos';
					buttons.photos.classy= "hider";
					buttons.photos.state='off';
					//buttons.photos.href=$routeParams.year+'/'+$routeParams.teachername+'/blogs';
					
					buttons.videos.name='videos';
					buttons.videos.classy= "hider";
					buttons.videos.state='off';
					//buttons.videos.href=$routeParams.year+'/'+$routeParams.teachername+'/videos';
					
					buttons.topsongs.name='top songs';
					buttons.topsongs.classy= "hider";
					buttons.topsongs.state='off';
					//buttons.topsongs.href=$routeParams.year+'/'+$routeParams.teachername+'/lessons';
					
					buttons.news.name='news';
					buttons.news.classy= "hider";
					buttons.news.state='off';
					//buttons.news.href=$routeParams.year+'/'+$routeParams.teachername+'/news';
					
					buttons.related.name='Related Artists';
					buttons.related.classy= "hider";
					buttons.related.state='off';
					//buttons.related.href=$routeParams.year+'/'+$routeParams.teachername+'/ship';
					return buttons;
				},
	
};
}]);


MusicWhereYouAreApp.factory('Favorites', ['$http', '$routeParams', '$location', '$rootScope', '$sce',
function($http, $routeParams, $location, $rootScope, $sce) {
	return {
		
		addFavorites:function()
		{
			if(localStorage.getItem('FavoriteArr')!=null && localStorage.getItem('FavoriteArr')!='')
			{
				var favorites = jQuery.parseJSON(localStorage.getItem('FavoriteArr'))

			}
			else
			{
				favorites=[];
				//favorites.blogHider=true;
			}
			favorites.forEach(function(favorite)
				{
					favorite.num_id=favorites.indexOf(favorite);
				});
			localStorage.setItem('FavoriteArr', JSON.stringify(favorites));
			
			
		},
		checkFavorites: function(obj)
		{
			
			if(localStorage.getItem('FavoriteArr')!=null && localStorage.getItem('FavoriteArr')!='')
			{
				var favoritesArr = jQuery.parseJSON(localStorage.getItem('FavoriteArr'))
				
			}
			else
			{
			favoritesArr=[];
				//favorites.blogHider=true;
			}
			//console.log(favoritesArr)
			favoritesArr.forEach(function(favorite)
			{
				favorite.favorite='off';
				if(favorite.id==obj.id)
				{
					obj.favorite='on';
				}
				

			});
		}
		
	};
	
	

}]);

MusicWhereYouAreApp.factory('States', ['$http', '$routeParams', '$location', '$rootScope', '$sce',
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

MusicWhereYouAreApp.factory("HintShower", ['$q', '$rootScope', '$http', '$sce', '$location','States','retrieveLocation',
function($q, $rootScope, $http, $sce, $location, States, retrieveLocation) {
	var canceller = $q.defer();
	
	 return {
			
			showHint : function(location)
			{

			var states = States.createStateObj();
		 	var hints={};
		 	
		 	if(location.length==3)
			{
			var state_location = location[1]	
			if(location[1].length<3)
			{
				states.forEach(function(state){
					if(location[1].toUpperCase().match(states.abbreviation))
					{

					}
				});
			
			}	
			return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+state_location+'%27+AND+CityName=%27'+location[0]+'%27+AND+CountryID%=%27'+location[2]+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				hints = result.data.rows;
				if(result.data.rows!=undefined)
				{
				hints.finalArr=[];
				 	result.data.rows.forEach(function(hint){
					 		hints.stateArr.push(hint[0]);
							hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_')})	;		
					 });
				}
				});
		 	}
		 	if(location.length==2)
			{	
			var state_location = location[1];
				
			if(location[1].length<3)
			{
				result.data.rows.forEach(function(hint){
				 		hints.stateArr.push(hint[0]);
						hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_')})	;		
				 });
				
			}	
				           
			return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+state_location.toUpperCase()+'%27+AND+CityName=%27'+location[0].toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				if(result.data.rows!=undefined)
				{
					hints = result.data.rows;
					hints.finalArr=[];
				 	
					if(result.data.rows.length!=null)
					{
					
			 		result.data.rows.forEach(function(hint){
						hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_')})	;		
				 	});
					
					return hints;
					}
				}
				});
		 	}
		 	if(location.length==1)
			{	
					           
				
 
				//return $http.get('/php/geolocation.php?city='+location[0].toUpperCase(), { timeout: canceller.promise }).then(function(result) {
				return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+CityName=%27'+location[0].toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				
			 	if(result.data.rows!=undefined)
				{
					hints = result.data.rows;
					hints.finalArr=[];
			 		result.data.rows.forEach(function(hint){
				 		
						hints.finalArr.push({city: hint[1], cityhref: hint[1].replace(/ /g, '_'), state: hint[0], statehref: hint[0].replace(/ /g, '_'), country: hint[2], countryhref: hint[2].replace(/ /g, '_')})	;		
				 	});	
				 	
					
				
				return hints;
				}
				});
				 
				
				
				
				
					
				//return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+CityName=%27'+location[0].toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				//hints = result.data.rows;
				
				
					
				
				
				
				
			}
		},	
			
				
			
		};
	
}]);	


MusicWhereYouAreApp.factory("Events", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams',
function($q, $rootScope, $http, $sce, $location, States, $routeParams) {
	return{
			getGeoEvents: function(lat, lng)
			{
				return $http.get('http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat='+lat +'&long='+lng+'&api_key=174019d04974adad421f3fb19681277e&limit=50&format=json&distance=41.5').then(function(results)
				{
					
					return results;
				});
			},
			
			getArtistEvents: function(artist)
			{
				return $http.get('http://ws.audioscrobbler.com/2.0/?method=artist.getevents&artist='+artist+'&api_key=174019d04974adad421f3fb19681277e&limit=25&format=json').then(function(results)
				{
					
					return results;
				});
			}
	};
}]);


MusicWhereYouAreApp.factory("ShareSongs", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams','retrieveLocation',
function($q, $rootScope, $http, $sce, $location, States, $routeParams, retrieveLocation) {
	return{
			
		getSongs: function(songs, location)
		{
		
		
			var deferred = $q.defer();	
			var str='';	
			
			songs.forEach(function(song)
			{
				
				str+=song.name.replace(/&/g, 'and').replace('?', 'q*m')+'{'+song.id+'~'+song.artists[0].name.replace(/&/g, 'and')+'}'+song.favorite+']'+song.artist_location.latitude+','+song.artist_location.longitude+'**';
			});
			//str = encodeURI(str);
			var url = location.replace(/ /g, '_')+'/'+str.replace(/%20/g, '_').replace(/\//g, '--');
			url = '/playlist/'+url.replace(/ /g, '_').replace(/%20/g, '_').replace(/\//g, '--');
			deferred.resolve(url)
			return deferred.promise;
			
		},
		createSongsList: function()
		{
			var deferred = $q.defer();
			var songs_str = $routeParams.qs;
			var songs=[]
			var location_str = '';
			var tmpArr=songs_str.split('**');
			var tmpIdArr=[]
			var tmpTitleArr=[];
			var tmpFavArr=[];
			var tmpLat=[];
			var tmpLong=[];
			var tmpArtistsArr=[]
			songs.spot_arr=[];
			songs.savSpotArr=[];
			songs.songsArr=[];
			songs.spot_str='';
			songs.location_arr=[];
			songs.final_loc_arr=[];
			songs.spot_arr=[];
			songs.song_arr=[];
			//tmpArr=tmpArr.slice(1,21);
					//console.log(tmpArr);
			tmpArr.pop();		
			for(var x=0; x<tmpArr.length;x++)
			{
				tmpTitleArr.push(tmpArr[x].split('{')[0].replace(/_/g, ' ').replace('q*m', '?'))
				tmpIdArr.push(tmpArr[x].split('{')[1].split('~')[0]);
				tmpArtistsArr.push(tmpArr[x].split('~')[1].split('}')[0].replace(/_/g, ' '));
				tmpFavArr.push(tmpArr[x].split('}')[1].split(']')[0]);
				tmpLat.push(parseFloat(tmpArr[x].split(']')[1].split(',')[0]));
				tmpLong.push(parseFloat(tmpArr[x].split(']')[1].split(',')[1]));
				songs.push({name:tmpTitleArr[x],tracks:{foreign_id:{spotify:{track:tmpIdArr[x]}}},favorite:tmpFavArr[x], artists:{0:{name:tmpArtistsArr[x]}},artist_location:{latitude: tmpLat[x], longitude: tmpLong[x], location:$location.path().split('/')[2].split('/')[0].replace('*', ', ').replace(/_/g, ' ')}});
				//tmpTitleArr[x]}{tracks:{foreign_id:{spotify:{track:tmpIdArr[x]}}}}
				songs.location_arr.push($location.path().split('/')[2].split('/')[0].replace('*', ', ')+'@@'+tmpLat[x] + ':' + tmpLong[x]+'&&<h5>'+tmpTitleArr[x]+'</h5><p>'+tmpArtistsArr[x]+'</p><a href="spotify:track:'+tmpIdArr[x]+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+$location.path().split('/')[2].split('/')[0]+'/'+tmpArtistsArr[x].replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
				songs.spot_str +=tmpIdArr[x]+',';
				songs.songsArr.push(songs[x]);
				songs.song_arr.push(tmpIdArr[x]);
				songs[x].id=tmpIdArr[x];
				songs.savSpotArr.push("spotify:track:"+tmpIdArr[x].id);
			}	
			songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE'+songs.spot_str);
				
				songs.location_arr.sort();
				
				songs.location_arr.forEach(function(location)
				{
					if(!location_str.match(location.split('@@')[0]))
					{
					songs.final_loc_arr.push('%%'+location);
					location_str += location.split('@@')[0];
					}
					else
					{
						songs.final_loc_arr.push(location.split('@@')[1].split('&&')[1]);
					}
				});	
				
			
			
				deferred.resolve(songs);
				return deferred.promise;
			
		},
		
		getLongURL:function(url)
		{
			
			var deferred = $q.defer();
			if(url.length>2000)
			{
				
				var url= url.slice(0, 2000);
				var index =url.lastIndexOf('**');
				url = url.slice(0, index);
				var urlObj = {'url': url.replace('--', '/'), 'sliced':'yes'}
				
			}
			else{
			
			var url = (url);
			var urlObj = {'url': url.replace('--', '/'), 'sliced':'no'}
			}
			
			
			url =url.replace('--', '/');
			deferred.resolve(urlObj);
			return deferred.promise;
			
		},
		getBitLy:function(url)
		{
			var bitly = 'http://api.bitly.com/v3/shorten?format=json&apiKey=R_06ae3d8226a246f2a0bb68afe44c8379&login=robostheimer&longUrl=http://musicwhereyour.com/%23'+encodeURIComponent(url);
				return $http.get(bitly).then(
				function(result){
					return result.data.data.url;
					
				});
		},	
	};
	


}]);	


MusicWhereYouAreApp.factory("Wiki", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams','Spotify',
function($q, $rootScope, $http, $sce, $location, States, $routeParams, Spotify) {
	return{
		getWikiLandmarks: function(lat,lng, country)
			{
				var country = '-'+country.toLowerCase();
				//var url='http://api.v3.factual.com/t/places-'+ $rootScope.longitudeObj_root.country.toLowerCase()+'?filters={%22category_ids%22:{%22$excludes_any%22:[2,347,308,432,123,384,385,405, 62,40, 235,414, 379, 23, 395,272,219,37,51,417,296,44,47,48,193,177,420,53,429, 375,377,378,380,381,382,383, 386,388,390,391,393,394,397,398,399,400,401,402,404,407,408,409,410,277]}}&include_count=true&limit=20&select=name&KEY=1ZlzUGTss1cocs7sHpIA6ypd3PJIsMs9Fwlth1Du&geo=%7B%22$circle%22:%7B%22$center%22:%5B'+lat+','+lng+'%5D,%22$meters%22:%2025000%7D%7D';		
				var url='http://api.v3.factual.com/t/places'+country+'?filters={%22category_ids%22:{%22$excludes_any%22:[2,347,308,432,123,384,385,405, 62,40, 235,414, 379, 23, 34, 221, 395,272,219,37,51,417,296,44,47,48,193,177,420,53,429, 375,377,378,380,381,382,383, 386,388,390,391,393,394,397,398,399,400,401,402,404,407,408,409,410,277]}}&include_count=true&limit=20&select=name&KEY=1ZlzUGTss1cocs7sHpIA6ypd3PJIsMs9Fwlth1Du&geo=%7B%22$circle%22:%7B%22$center%22:%5B'+lat+','+lng+'%5D,%22$meters%22:%2025000%7D%7D';
					
				
				return $http.get(url).then(function(results)
				{
					
					for(var x=0; x<results.data.response.data.length; x++)
					{
						results.data.response.data[x].number=5;
					}
					return results.data;
				});
			},
			
		lookUpTag: function(searchterm, number, qs, type) {
				$rootScope.loading_tags=true;
				var deferred = $q.defer();
				////////////////////Local Storage////////////////////////
				var ls_removeOut = jQuery.parseJSON(localStorage.getItem('leaveOutArr'));
				var ls_str=''
				var lsTitleArr = [];
				var lsIdArr=[];
				lsIdFavArr=[];
				if(ls_removeOut!=null)
				{
					ls_removeOut.forEach(function(ls)
					{
						lsTitleArr.push(ls.song);
						lsIdArr.push(ls.id);
					});

				}
				else
				{
					lsTitleArr=[];
					lsIdArr=[];
				}
				
				
				var ls_favorite = jQuery.parseJSON(localStorage.getItem('FavoriteArr'))
				if(ls_favorite!=null)
				{
					ls_favorite.forEach(function(ls)
					{
						lsIdFavArr.push(ls.id);
					});
				}
				else
				{
					lsIdFavArr=[];
				}
				var obj ={arr:lsTitleArr, searchterm:searchterm.replace(/The /g, ''), number:number, qs:qs,type:type };
				deferred.resolve(obj)
				return deferred.promise;
				///////////////////////End Local Storage/////////////////////
		
			
		}	
	};
}]);


MusicWhereYouAreApp.factory("Spotify",[ '$q', '$rootScope', '$http', '$sce','$routeParams','Favorites','MapCreate','HashCreate','ChunkSongs',
function($q, $rootScope, $http, $sce, $routeParams, Favorites, MapCreate, HashCreate, ChunkSongs){
	return{
		
		runLyricsnMusic: function(searchterm)
		{
			return $http.jsonp('http://api.lyricsnmusic.com/songs?api_key=548b2523656cf7b2bbf49252673c24&lyrics="'+searchterm+'"&callback=JSON_CALLBACK').then(function(result)
			{	
				
				var LnM_songs = result.data.data
				
				
				return LnM_songs;
			});
		},
		
		runSpotifySearch : function(searchterm, number, qs_noqs, arr)
		{
			
			if(localStorage.country!=undefined && localStorage.country!='')
			{
				if(qs_noqs=='no')

				{
					//'https://api.spotify.com/v1/search?q=%22'+searchterm+'%22OR%20%22'+searchterm.split(',')[0]+'%22&type=track&limit=30&ioffset=0&market=US'
					var url = 'https://api.spotify.com/v1/search?q='+searchterm+'%20AND%20NOT%20Live%20AND%20NOT%20%2250%20Songs%22%20AND%20NOT%20album:%22Live%22%20%20AND%20NOT%20album:%22 '+searchterm+'%22AND%20NOT%20genre:%22Audiobooks%22%20AND%20NOT%20genre:%22Spoken%20Word%22AND%20NOT%20genre:%22oratory%22AND%20NOT%20artist:%22'+searchterm+'%22AND%20NOT%20artist:"The%20Guy%20Who%20Sings%20Songs"AND%20NOT%20artist:"'+searchterm.split(', ')[0]+'"AND%20NOT%20artist:"'+searchterm.split(', ')[1]+'"&type=track&limit='+number+'&ioffset=0&market='+localStorage.country.toUpperCase();
				}
				else {
					
					var url = 'https://api.spotify.com/v1/search?q="'+searchterm.split(', ')[0]+'"%20AND%20NOT%20Live%20AND%20NOT%20%2250%20Songs%22%20AND%20NOT%20album:%22Live%22%20%20AND%20NOT%20album:%22 '+searchterm.split(', ')[0]+'%22AND%20NOT%20genre:%22Audiobooks%22%20AND%20NOT%20genre:%22Spoken%20Word%22AND%20NOT%20genre:%22oratory%22AND%20NOT%20artist:%22'+searchterm.split(', ')[0]+'%22AND%20NOT%20artist:"The%20Guy%20Who%20Sings%20Songs"AND%20NOT%20artist:"'+searchterm.split(', ')[0]+'"&type=track&limit='+number+'&ioffset=0&market='+localStorage.country.toUpperCase();
				}
				
			}
			else{
				if(qs_noqs=='no')
				{
				
				var url = 'https://api.spotify.com/v1/search?q='+searchterm+'%20AND%20NOT%20Live%20AND%20NOT%20%2250%20Songs%22%20AND%20NOT%20album:%22Live%22%20%20AND%20NOT%20album:%22 '+searchterm+'%22AND%20NOT%20genre:%22Audiobooks%22%20AND%20NOT%20genre:%22Spoken%20Word%22AND%20NOT%20genre:%22oratory%22AND%20NOT%20artist:%22'+searchterm+'%22AND%20NOT%20artist:"The%20Guy%20Who%20Sings%20Songs"AND%20NOT%20artist:"'+searchterm.split(', ')[0]+'"AND%20NOT%20artist:"'+searchterm.split(', ')[1]+'"&type=track&limit='+number+'&ioffset=0'
				}
				
				else
				{
					var url = 'https://api.spotify.com/v1/search?q="'+searchterm.split(', ')[0]+'"%20AND%20NOT%20Live%20AND%20NOT%20%2250%20Songs%22%20AND%20NOT%20album:%22Live%22%20%20AND%20NOT%20album:%22 '+searchterm.split(', ')[0]+'%22AND%20NOT%20genre:%22Audiobooks%22%20AND%20NOT%20genre:%22Spoken%20Word%22AND%20NOT%20genre:%22oratory%22AND%20NOT%20artist:%22'+searchterm.split(', ')[0]+'%22AND%20NOT%20artist:"The%20Guy%20Who%20Sings%20Songs"AND%20NOT%20artist:"'+searchterm.split(', ')[0]+'&type=track&limit='+number+'&ioffset=0'
				}	
			}
			return $http.get(url).then(function(results)
			{
				
				var songs= results.data.tracks.items;
				if(localStorage.leaveOutArr!=null){
				var LeaveOut =jQuery.parseJSON(localStorage.leaveOutArr);
				}else{
					var LeaveOut=[];
				}
				//songs.songsStr='';
				songs.forEach(function(song)
				{
					//songs.songsStr+=song.id;
					song.searchterm = searchterm;
				});
				songs = songs.compareArraysObj(LeaveOut, 'title');
				return songs;	
			});
		},
		checkSongMarket:function(songs)
		{
					var songsArr=[];
					var finalSongs=[];
					var songsArrStr='';
						songs.forEach(function(song)
						{
							songsArr.push(song);
							songsArrStr+=song.tracks[0].foreign_id.split(':')[2]+',';
											
						});	
						
					songsArrStr=songsArrStr.slice(0, (songsArrStr.length-1));
					var url='https://api.spotify.com/v1/tracks/?ids='+songsArrStr;
					return $http.get(url).then(function(results){
						var tracks= results.data.tracks;
					
					
							
							tracks.forEach(function(track)
							{
								var y= tracks.indexOf(track);
								if(localStorage.country!=undefined && localStorage.country!="")
								{
								track.favorite='off';
								track.num_id=finalSongs.length;
								track.artist_location = songsArr[y].artist_location;
								if(track.available_markets.toString().match(localStorage.country))
								{
									finalSongs.push(track);
									
								}
								
							}
							else{
							track.favorite='off';
							tracks=num_id=finalSongs.length;
							tracks.artist_location = songsArr[y].artist_location;
							finalSongs.push(tracks);
							
								
							}
						});
						
							return finalSongs;	
					});
					
				
		},
		
		
		
		createPlaylist:function(songlist)
		{
			var deferred = $q.defer();
			var songs={};
			songs.songs=[];
			songs.spot_arr=[];
			songs.savSpotArr=[];
			songs.artistlocation ='';
			songs.spot_str='';
			songs.location_arr=[];
			songlist.forEach (function(song) {
				var x = songlist.indexOf(song);
				song.artists[0].name=song.artists[0].name.findThe();
				song.num_id=x;
				songs.songs.push(song);
				Favorites.checkFavorites(song);
				songs.spot_arr.push(song.id);
				songs.savSpotArr.push('spotify:track:'+song.id);
				songs.artistlocation = $routeParams.location;
				songs.tracks=[{foreign_id: song.uri}]
				
				songs.location_arr.push(song.artist_location.location + '@@' + song.artist_location.latitude + ':' + song.artist_location.longitude + '&&<h5>' + song.name + '</h5><p>' + song.artists[0].name + '</p><a href="spotify:track:' + song.id + '" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+songs.length></div></a><a><a a href="#/info/' + songs.artistlocation + '/' + song.artists[0].name.replace('The ', '') + '" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+songs.length  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
				
			});
			
			//songs.location_arr.sort();
			songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_arr.toString();
			songs.spot_strFinal = $sce.trustAsResourceUrl(songs.spot_str);
			//console.log(songs)
			deferred.resolve(songs);
			return deferred.promise;
			
		},
		createLatLng:function(location_arr, counter, zoom, latitude, longitude, spot_arr)
		{
			//console.log(location_arr)
			location_arr.sort();
			var deferred = $q.defer();
			var location_str='';
			var final_loc_arr=[];
			var arr=[];
				for (var r = 0; r < location_arr.length; r++) {
					arr.push(r)
				if(!location_str.match(location_arr[r].split('@@')[0]))
					{
					final_loc_arr.push('%%'+location_arr[r]);
					location_str +=location_arr[r].split('@@')[0];
					} else {
					final_loc_arr.push(location_arr[r].split('@@')[1].split('&&')[1]);
					
				}
				
				if (r == (location_arr.length - 1 )/*&& (data.data.response.songs.songsArr.length >= 5 || counter == 5)*/){
						
					deferred.resolve({'zoom': zoom, 'latitude': latitude, 'longitude': longitude, locationarrstr: final_loc_arr.toString(), change:Math.random()});
					return deferred.promise;
					
				}
			}
			
		},
		
		
		lookUpEchonest:function(song)
		{
		
			
			/////////////////////////USE LastFM instead - has tag for place formed; that will give then run that location through retrievelocaiton to get lat, long info
			
			
			var deferred =$q.defer();
			if(song.artist_location==undefined ||jQuery.isEmptyObject(song.artist_location))
			{
				
				
				var songtitle = song.name.removeSpecialChar();
				var artist = song.artists[0].name.removeSpecialChar()
				//console.log(artist)
				return $http.get('http://developer.echonest.com/api/v4/song/search?api_key=MIV6XZXYU7FNSMMDN&format=json&results=1&&artist='+artist+'&bucket=artist_location').then(function(data){
				
				if(data.data.response.songs.length==0 )
				{
					//song.artist_location={latitude:song.song_location.latitude, longitude:song.song_location.longitude, location:'No Location Data Available', location_link:''};
					song.artist_location={latitude:$rootScope.latitudeObj_root.latitude, longitude:$rootScope.longitudeObj_root.longitude, location:'No Location Data Available', location_link:''} ;
					song.tracks = data.data.response.songs.tracks
				}
				else if(jQuery.isEmptyObject(data.data.response.songs[0].artist_location)==true)
				{
				//song.artist_location={latitude:song.song_location.latitude, longitude:song.song_location.longitude, location:'No Location Data Available', location_link:''};
						
				song.artist_location={latitude:$rootScope.latitudeObj_root.latitude, longitude:$rootScope.longitudeObj_root.longitude, location:'No Location Data Available', location_link:''} ;
				song.tracks = data.data.response.songs.tracks
				
				
				}
				else{
					
					song.artist_location= data.data.response.songs[0].artist_location;
					song.artist_location.location_link=data.data.response.songs[0].artist_location.location.replace(/,/g, '*');
					song.tracks = data.data.response.songs.tracks
				}
				return song;
			},function(error){
				
				song.artist_location={latitude:$rootScope.latitudeObj_root.latitude, longitude:$rootScope.longitudeObj_root.longitude, location:'No Location Data Available', location_link:''} ;
					
			});
			}
			else
			{
				song.artist_location.location_link= song.artist_location.location.replace(/,/g, '*')
				
				deferred.resolve(song)
				return deferred.promise;
				
			}
		},
		
		createCities:function(lat, long, ratio)
		{
			
			var songs=[];
			var arr=[];
			return $http.get('json/MajorCities.json').then(function(result){
				var data = result.data.feed.entry;
				var arr=[];
				
				data.lat_plus_long=[];
				//console.log(data)
				data.forEach(function(item)
				{
					var x= data.indexOf(item);
					var number=Math.abs(lat-item.latitude.$t)+Math.abs(long-item.longitude.$t);
					
					item.id=x;	
					if(number<ratio && $routeParams.location.split('*')[0].toLowerCase()!=item.city.$t.toLowerCase())
					{
					
					data.lat_plus_long.push({number:number,city:item.city.$t, lat:item.latitude.$t, long:item.longitude.$t});
					}
				});
   				
									
						
   					
   					data.lat_plus_long.sort(function(a, b) 
					{
						return a.number - b.number
					});
					

				
				return data.lat_plus_long;

				
			});
		},
		runSongsAbout:function(obj, number){
			
			
			if(localStorage.country!="")
			{
			var url='https://api.spotify.com/v1/search?q=track:"'+obj.song+'"&type=track&limit=1&offset=0&market='+localStorage.country.toUpperCase();
			}else{
				
			var url='https://api.spotify.com/v1/search?q=track:"'+obj.song+'"&type=track&limit=1&offset=0&market=';
			}
			return $http.get(url).then(function(data){
				data.data.tracks.artist_location={};
				data.data.tracks.artist_location.location = obj.city;
				data.data.tracks.artist_location.latitude=obj.geolocation.split(', ')[0];
				data.data.tracks.artist_location.longitude=obj.geolocation.split(', ')[1];
				//console.log(data.data.tracks)
				return data.data.tracks;
				
				
			});
		},
		/*runLocationJSON:function(){
			return $http.get('json/SongsAboutCities.json').then(function(data){
				console.log(data.data.feed.entry)
				return data.data.feed.entry;
			});
		},
		runFusionTableJSON2: function(city){
			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Id,Name,AvailableMarkets,DurationMs,CityLocation,CityLatitude,CityLongitude,ArtistsName,ArtistsId,AlbumId,AlbumName,AlbumAvailableMarkets+FROM+1_PGnF_OzyOksnVE6afVf7qkeKe4x_-fBe0Yi9k_U+WHERE+CityLocation=%27'+city+'%27+&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(data){
				//console.log(data.data.rows);
				var songs=[];
				var song_id='';
				
				for(var x=0; x<data.data.rows.length;x++)
				{
					if(!song_id.match(data.data.rows[x][0]))
					{
					songs.push({
						song_location:{location:data.data.rows[x][4], latitude:data.data.rows[x][5], longitude:data.data.rows[x][6]},
						name: data.data.rows[x][1],
						id: data.data.rows[x][0],
						artists:[{name:data.data.rows[x][7], id:data.data.rows[x][8]}],
						album: {id:data.data.rows[x][9], name:data.data.rows[x][10], available_markets: data.data.rows[x][11]},
						available_markets: data.data.rows[x][2],
						favorite:'off',
						//artist_location: {latitude:'', longitude:'', location:''}
						});
					}
					song_id+=data.data.rows[x][0]+':';
				}
				console.log(songs)
				return songs;
			});
		},*/
		
		runFusionTableJSON: function(lat,lng, ratio){
			if(lat==51.50853 && lng==-0.12574)
			{
			////////Fix for bad Data/////////
			///////Songs from London England actually going to London Canada geolocation/////////////////////	
			var url ='https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Id,Name,AvailableMarkets,SongLocation,SongLatitude,SongLongitude,ArtistsName,ArtistsId,AlbumId,AlbumName,AlbumAvailableMarkets,Favorite,ArtistLocation,ArtistLatitude,ArtistLongitude,ArtistLocationLink+FROM+16u2CEBr6_hvcYO9qoFEIQDMPb5TP60RHnLrI5Dgx++WHERE+SongLatitude+<=' + (42.98339+ratio) + "+AND+SongLatitude>=" + (42.98339 - ratio) + "+AND+SongLongitude<=" + (-81.23304+ratio) + "+AND+SongLongitude>=" + (-81.23304 -ratio) + '&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';	
			
			}
			else{
				var url ='https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Id,Name,AvailableMarkets,SongLocation,SongLatitude,SongLongitude,ArtistsName,ArtistsId,AlbumId,AlbumName,AlbumAvailableMarkets,Favorite,ArtistLocation,ArtistLatitude,ArtistLongitude,ArtistLocationLink+FROM+16u2CEBr6_hvcYO9qoFEIQDMPb5TP60RHnLrI5Dgx++WHERE+SongLatitude+<=' + (lat+ratio) + "+AND+SongLatitude>=" + (lat - ratio) + "+AND+SongLongitude<=" + (lng+ratio) + "+AND+SongLongitude>=" + (lng -ratio) + '&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';
				
			}
			return $http.get(url).then(function(data){
				
				var songs=[];
				var song_id='';
				var songStr='';
				if(localStorage.leaveOutArr!=null){
				var LeaveOut =jQuery.parseJSON(localStorage.leaveOutArr);
				}else{
					var LeaveOut=[];
				}
				if(data.data.rows!=undefined)
				{
					for(var x=0; x<data.data.rows.length;x++)
					{
						if((localStorage.country!=""||localStorage.country!=undefined)&&!song_id.match(data.data.rows[x][0])&&data.data.rows[x][2].toString().match(localStorage.country))
						{
								
									songs.push({
									song_location:{location:data.data.rows[x][3], latitude:data.data.rows[x][4], longitude:data.data.rows[x][5]},
									name: data.data.rows[x][1],
									id: data.data.rows[x][0],
									artists:[{name:data.data.rows[x][6], id:data.data.rows[x][7]}],
									album: {id:data.data.rows[x][8], name:data.data.rows[x][9], available_markets: data.data.rows[x][10]},
									available_markets: data.data.rows[x][2],
									favorite:'off',
									artist_location: {latitude:data.data.rows[x][13], longitude:data.data.rows[x][14], location:data.data.rows[x][12], location_link: data.data.rows[x][15]},
									searchterm: data.data.rows[x][3]
									});
									
								
							
							}
						
						song_id+=data.data.rows[x][0]+':';
						songStr+=data.data.rows[x][1]+':';
					}
				}
				songs = songs.compareArraysObj( LeaveOut, 'title');
				return songs;
			});
		},
			
		runRange:function(number)
		{
			//console.log(number)
			if(number>15 )
			{
				zoom=2;
			}
			if(number>10&&number<15)
			{
				zoom=3;
			}
			
			if(number>7&&number<10)
			{
				zoom=4;
			}
			else if(number>5&&number<7)
			{
				zoom=6
			}
			else if(number>3&&number<5)
			{
				zoom=7
			}
			
			else if(number>2 &&number<3) 
			{
				zoom=8
			}
			else if(number>1&&number<2)
			{
				zoom=9
			}
			else if(number>.8&&number<1) 
			{
				zoom=10
			}
			else if(number>.6 && number<.8)
			{
				zoom=11
			}
			else if(number>.29 && number<.6)
			{
				zoom=11
			}
			else if(number>.2 &&number<.29)
			{
				zoom=12
			}
			else if(number>=0 &&number<.2) 
			{
				zoom=15
			}
			return zoom;
		}
		
	};
}]);	

//////////////////Need to lose the rootScopes and run in different service calls in the controller @ runSongAboutSearch in hashedLocation Controller
MusicWhereYouAreApp.factory("ChunkSongs",[ '$q', '$rootScope', '$http', '$sce','LocationDataFetch',
function($q, $rootScope, $http, $sce, LocationDataFetch)
{
	return{
		createChunks:function(songs, number)
		{		
				var deferred = $q.defer();
				var remainder =songs.length%number;
				var divider=songs.length/number;
				var floor = Math.floor(divider);
				var songsFinal =[];
				var songsArrStr='';
				if(songs.length<number)
				{
					var songsArr=[];
					songs.forEach(function(item)
					{
						//console.log(SongSlicer[x])
						songsArr.push(item);
						songsArrStr+=item.tracks[0].foreign_id.split(':')[2]+',';
										
					});
					songsArrStr=songsArrStr.slice(0, (songsArrStr.length-1));
					songsFinal.push({songs:songs, url:'https://api.spotify.com/v1/tracks/?ids='+songsArrStr, ids: songsArrStr});
					deferred.resolve(songsFinal);
					return deferred.promise;	
				}
				else{
				
				
				//Cannot use ForEach because Floor is not an array, but a number//////////
				for(var z=0; z<floor; z++)
				{
					var songsArr=[];
					
					
					var SongSlicer=[];
					//console.log(z*number+':'+number)
					SongSlicer = songs.slice(z*number,(z*number)+number);
					
					//console.log(SongSlicer.length)
					SongSlicer.forEach(function(SongSlicer)
					{
						//console.log(SongSlicer[x])
						songsArr.push(SongSlicer);
						songsArrStr+=SongSlicer.tracks[0].foreign_id.split(':')[2]+',';
										
					});	
					songsArrStr=songsArrStr.slice(0, (songsArrStr.length-1));
					songsFinal.push({songs:songsArr, url:'https://api.spotify.com/v1/tracks/?ids='+songsArrStr, ids: songsArrStr});
					
				}
				if(remainder>0)
				{
					
					var songsArr=[];
					var SongSlicer =songs.slice(songs.length-remainder, songs.length);
					SongSlicer.forEach(function(SongSlicer)
					{
						//console.log(SongSlicer[x])
						songsArr.push(SongSlicer);
						songsArrStr+=SongSlicer.tracks[0].foreign_id.split(':')[2]+',';
										
					});	
					songsArrStr=songsArrStr.slice(0, (songsArrStr.length-1));
					songsFinal.push({songs:songsArr, url:'https://api.spotify.com/v1/tracks/?ids='+songsArrStr, ids: songsArrStr});
					
				}
				deferred.resolve(songsFinal);
				return deferred.promise;
			
				}
		},
	};	
}]);


        
 
 MusicWhereYouAreApp.factory('Twitter', ['$resource', '$http','$base64', function ($resource, $http, $base64) {
 	return{
 		getOAuth:function(){
            var consumerKey = encodeURIComponent('H3aaSwXzaaxG6aousz7n89vWz')
            var consumerSecret = encodeURIComponent('5ryizVky6YL9BYhFhMp83s6OOj6X2Dq6vWtCC7gfxYRGJNXPTO')
            var credentials = $base64.encode(consumerKey + ':' + consumerSecret)
            console.log(credentials);
            // Twitters OAuth service endpoint
            var twitterOauthEndpoint = $http.post(
               'https://api.twitter.com/oauth2/token'
                , "grant_type=client_credentials"
                , {headers: {'Authorization': 'Basic ' + credentials, 'Content-Type': 'application/x-www-form-urlencoded'}}
            );
            twitterOauthEndpoint.success(function (response) {
            	console.log(response);
                // a successful response will return
                // the "bearer" token which is registered
                // to the $httpProvider
                MusicWhereYouAreApp.$httpProvider.defaults.headers.common['Authorization'] = "Bearer " + response.access_token;
            }).error(function (response) {
                  // error handling to some meaningful extent
               });
 
           var r = $resource('https://api.twitter.com/1.1/search/:action',
                {action: 'tweets.json',
                    count: 10,
              });
               /* {
<span style="line-height: 1.5;">                    paginate: {method: 'GET'}</span>
                })
 
            return r;
        }

        .config(function ($httpProvider) {
           serviceModule.$httpProvider = $httpProvider;
        });*/
       }
	};
}]);


/*MusicWhereYouAreApp.factory("loadPlaylist",[ '$q', '$rootScope', '$http', '$sce','PlaylistCreate','Spotify','retrieveLocation','$routeParams',
function($q, $rootScope, $http, $sce, PlaylistCreate, Spotify, retrieveLocation, $routeParams)
{
	return{
		
		callPlaylistCreate:function(zoom, latitude, longitude, lat_min, lat_max, long_min, long_max, genres, era,start_number, arr, tmparr,holder_arr, index1, index2, number, counter)
		{
								
								
								var deferred = $q.defer();
								PlaylistCreate.runPlaylist(zoom, latitude,longitude, lat_min, lat_max, long_min, long_max, genres, era,start_number).then(function(data){
								arr = arr.concat(data);
								console.log(arr);
								
								if(tmparr.length==number)
									{
											
										///////////No songs from this geolocation///////////
										if(data.songsArr.length==0 && arr.length>0)
										{
											
											$rootScope.loading=false;
											/*if($scope.btnCount>0)
											{
											
											$rootScope.noMoreSongs=true;
											$scope.moreHider=true;
											}*/
											
											/*$rootScope.noMoreSongs=false;
											$rootScope.moreHider=false;
											
											
											$rootScope.donesy=true;

										}
										Spotify.createPlaylist(holder_arr).then(function(result) {
												var songs = result.songs.slice(index1, index2+20);
												songs.spot_arr = result.spot_arr.slice(index1,index2+20);
												songs.savSpotArr = result.savSpotArr.slice(index1, index2+20);
												artistlocation = result.artistlocation.slice(index1, index2+20);
												songs.location_arr = result.location_arr.slice(index1, index2+20);
												songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+songs.spot_arr.toString());
												$rootScope.songs_root = songs;
												console.log(holder_arr)
												deferred.resolve(songs);
												return deferred.promise;
												
											},function(error){
												$rootScope.errorMessage = true;
											});

									}
									else if (arr.length < 100 && counter<=5) {
											counter = counter + 1;
											/*if($rootScope.marked==true) {
											moreHider=true;	
											$rootScope.loading=false;
											noMoreSongs = true;
											}								
											
										 if (counter <= 5 && holder_arr.length<50) {
												if(counter>3)
												{
												$rootScope.stillLooking = true;
												}
												start_number=start_number+50;
												LocationDataFetch.count = 0;
												////////need to return something to tell controller to re-run runApp function
												//runApp(start_number, counter, '', arr, holder_arr);
												
											}
										
											//////////////////Number of songs is less than 50 and has gone through 5 ratio changes
											else if(arr.length<=50 && (counter>=6 ||data.songsArr.length==0))
											{
												
												Spotify.checkSongMarket(arr).then(function(result) {
													
												var tmparr=[];
												for (var x = 0; x < result.length; x++) {
														tmparr.push(x);
														songs_for_service.push(result[x]);
														if(tmparr.length==result.length)
														{
															holder_songs ={};	
															holder_arr = songs_for_service;	
															$rootScope.holder_arr_root = songs_for_service
															if(holder_arr.length<=20)
															{
																moreHider=true;
															}
					
															Spotify.createPlaylist(songs_for_service).then(function(result) {
																holder_songs.songs = result.songs;
																songs = result.songs.slice(index1, index2+20);
																songs.spot_arr = result.spot_arr.slice(index1, index2+20);
																songs.savSpotArr = result.savSpotArr.slice(index1, index2+20);
																artistlocation = result.artistlocation.slice(index1, index2+20);
																songs.location_arr = result.location_arr.slice(index1, index2+20);
																songs.holder_arr = holder_arr;
																songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_arr.toString());
																$rootScope.songs_root = songs;
																createMapArtist(songs.location_arr, counter, zoom, latitudeObj.latitude, longitudeObj.longitude, final_loc_arr, songs.spot_arr);
																
	king = false;
																	$rootScope.loading=false;
																	$rootScope.mapOpening=false;
																	checkForMore=false;
															});
															}
														}
													});		
											}
											////////////////Number of songs is greater than 50 but less than 100 and has gone through five ratio changes
											//////////Because it is over 50 it needs to be run through Chunksongs service to get it in a usable format for 
											/////////////Spotify API
											else if(arr.length>50 && arr.length<100 && counter>=6){
											ChunkSongs.createChunks(arr, 50).then(function(data){
											
												var tmparr=[];
												var tmparr2 =[];
												for(var y=0; y<data.length; y++)
												{
													tmparr.push(y);
													Spotify.checkSongMarket(data[y].songs).then(function(result) {
														
													
													for (var x = 0; x < result.length; x++) {
														
														tmparr2.push(x)
														songs_for_service.push(result[x]);
														if(tmparr.length==data.length &&tmparr2.length==result.length)
														{
														holder_songs ={};	
														holder_arr = songs_for_service;	
														$rootScope.holder_arr_root=songs_for_service;
														Spotify.createPlaylist(songs_for_service).then(function(result) {
															
															holder_songs.songs = result.songs;
															songs = result.songs.slice(index1, index2+20);
															songs.spot_arr = result.spot_arr.slice(index1, index2+20);
															songs.savSpotArr = result.savSpotArr.slice(index1, index2+20);
															artistlocation = result.artistlocation.slice(index1, index2+20);
															songs.location_arr = result.location_arr.slice(index1, index2+20);
															songs.holder_arr = holder_arr;
															songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_arr.toString());
															$rootScope.songs_root = songs;
															createMapArtist(songs.location_arr, counter, zoom, latitudeObj.latitude, longitudeObj.longitude, final_loc_arr, songs.spot_arr);
																$rootScope.stillLooking = false;
																$rootScope.loading=false;
																$rootScope.mapOpening=false;
																$scope.checkForMore=true;
																$rootScope.loading=false;
															
														});
														}
														
													}
													
														
												
													});
												}
												
												
											});		
														
									}	
								
							}
							else if(arr.length>50 &&($scope.donesy==false||$scope.donesy==undefined)){
											ChunkSongs.createChunks(arr, 50).then(function(data){
												
												var tmparr=[];
												var tmparr2 =[];
												for(var y=0; y<data.length; y++)
												{
													tmparr.push(y);
													Spotify.checkSongMarket(data[y].songs).then(function(result) {
													for (var x = 0; x < result.length; x++) {
														
														tmparr2.push(x);
														songs_for_service.push(result[x]);
														if(tmparr.length==data.length &&tmparr2.length==result.length)
														{
														holder_songs ={};	
														holder_arr = songs_for_service;
														$rootScope.holder_arr_root = songs_for_service;
														if(result.length%20>0 && counter<2 && holder_arr.length<150)
														{
															counter++;
															//start_number=start_number+50;
															LocationDataFetch.count=0;
															runApp(start_number, counter, '', [], holder_arr);
															
												
														}
														else{
															Spotify.createPlaylist(songs_for_service).then(function(result) {
															
															holder_songs.songs = result.songs;
															songs = result.songs.slice(index1, index2+20);
															songs.spot_arr = result.spot_arr.slice(index1, index2+20);
															songs.savSpotArr = result.savSpotArr.slice(index1, index2+20);
															artistlocation = result.artistlocation.slice(index1, index2+20);
															songs.location_arr = result.location_arr.slice(index1, index2+20);
															songs.holder_arr = holder_arr;
															songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_arr.toString());
															$rootScope.songs_root = songs;
															
																createMapArtist(songs.location_arr, counter, zoom, latitudeObj.latitude, longitudeObj.longitude, final_loc_arr, songs.spot_arr);
																stillLooking = false;
																$rootScope.loading=false;
																$rootScope.mapOpening=false;
																checkForMore=true;
																$rootScope.loading=false;
															
														
														});
														}
													  }
														
													}
													
														
												
												});
												}
												
											});		
														
										}
										else if (arr.length == 0) {
												//alert('true')
												
												$rootScope.noSongs=true;
												$location.path('#/map')
												}
									});
								}
									
	};
}]);		
	*/



 	