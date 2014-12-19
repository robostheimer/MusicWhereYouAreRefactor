//'use strict';

/* Services */

//var app = angular.module('ofm.services', []);
MusicWhereYouAreApp.factory("getLocation", ['$q', '$http', '$sce', 'PlaylistCreate', 'HashCreate','$rootScope',
function($q, $http, $sce, PlaylistCreate, HashCreate, $rootScope) {
	
	
	var zoom = 11;
	var currentLat = 41.5;
	var currentLong = -91.6;
	var deferred = $q.defer();
	$rootScope.genres='';
	$rootScope.era='';
	//$rootScope.location = [];
	var Geolocation = {
		_checkGeoLocation : function() {
			////////Checks if Geolocation is available;
			/////If it is is runs the handle_geolocation_query or the handle Gelocation.handle)errors function if access to the Geolocation API is denied by the user
			
			navigator.geolocation.getCurrentPosition(Geolocation.handle_geolocation_query, Geolocation.handle_errors);
		},

		handle_geolocation_query : function(position) {

			
			currentLat = (position.coords.latitude);
			currentLong = (position.coords.longitude);
			var lat_min = currentLat - .25;
			var lat_max = currentLat + .25;
			var long_min = currentLong - .25;
			var long_max = currentLong + .25;
			////Creates a promise that runs the Playlist creation Function and then the Map Create function.
			HashCreate.runHash(currentLat, currentLong);
			
						

		},

		handle_errors : function(error) {
			currentLat = 41.5;
			currentLong = 91.6
			lat_min = currentLat - .1;
			lat_max = currentLat + .1;
			long_min = currentLong - .1;
			long_max = currentLong + .25
			$rootScope.noSongs=true;
			switch(error.code) {
				case error.PERMISSION_DENIED:

					error = 'Choose a City and State from the form below or enable geolocation on your device.'
					break;

				case error.POSITION_UNAVAILABLE:
					error = 'We could not detect current position';
					break;

				case error.TIMEOUT:
					error = 'There was a server timeout.'
					break;

				default:
					error = 'There was an unknown error.';
					break;
			}
			
		},
	};
	return {
		checkGeoLocation : Geolocation._checkGeoLocation
	};
}]);





MusicWhereYouAreApp.factory('PlaylistCreate', ['$q', '$rootScope', '$http', '$sce', 'MapCreate', 'HashCreate','$location','$routeParams','States',
function($q, $rootScope, $http, $sce, MapCreate, HashCreate, $location, $routeParams, States) {
	

	return {
		 runPlaylist : function(zoom, lat, long,lat_min, lat_max, long_min, long_max, index, genres, era, start_number){
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
			var url = 'http://developer.echonest.com/api/v4/song/search?api_key=3KFREGLKBDFLWSIEC&format=json&results=25&min_latitude=' + lat_min + '&max_latitude=' + lat_max + '&min_longitude=' + long_min + '&max_longitude=' + long_max + '&bucket=artist_location&bucket=id:spotify-WW&bucket=tracks&limit=true&&song_type=studio&rank_type=familiarity&song_min_hotttnesss=.3&start='+start_number;
			}
			else{
				var url = 'http://developer.echonest.com/api/v4/song/search?api_key=3KFREGLKBDFLWSIEC&format=json&results=25&min_latitude=' + lat_min + '&max_latitude=' + lat_max + '&min_longitude=' + long_min + '&max_longitude=' + long_max + '&bucket=artist_location&bucket=id:spotify-WW&bucket=tracks&limit=true&&song_type=studio&rank_type=familiarity&song_min_hotttnesss=.2&start='+start_number+finalgenres+era;
			}
			
			return $http.get(url).success(function(data) {
				
				var songs = data.response.songs;
				songs.songsArr=[];
				
				songs.spot_arr = [];
			 	songs.spot_playlist=[];
				songs.location_arr = [];
				songs.final_loc_arr=[];
				songs.lat_min = lat_min;
				songs.long_min = long_min;
				songs.spot_str = '';
				var song_str = '';
				var location_str = '';
				var location_rp = $routeParams.location;
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
				////////////////////Local Storage////////////////////////
				var ls_removeOut = jQuery.parseJSON(localStorage.getItem('leaveOutArr'));
				var ls_str=''
				if(ls_removeOut!=null)
				{
					for (var xx=0; xx<ls_removeOut.length; xx++)
					{
						lsTitleArr.push(ls_removeOut[xx].song);
						lsIdArr.push(ls_removeOut[xx].id);
					}

				}
				else
				{
					lsTitleArr=[];
					lsIdArr=[];
				}
				
				
				var ls_favorite = jQuery.parseJSON(localStorage.getItem('FavoriteArr'))
				if(ls_favorite!=null)
				{
					for (var yy=0; yy<ls_favorite.length; yy++)
					{
						lsIdFavArr.push(ls_favorite[yy].tracks[0].foreign_id.split(':')[2])
					}
				}
				else
				{
					lsIdFavArr=[];
				}
				
				///////////////////////End Local Storage/////////////////////
				
				
				
				for (var x = 0; x < songs.length; x++) {
					
					var songtitle=songs[x].title
					
					///////////////////City Region//////////////////////
						if(location_rp.split('*').length==1)
						{
						/////////////////////////check for song against Local Storage so LeaveOuts are left out///////////////////////////////////	
						if (!song_str.toLowerCase().replace(/\W/g,' ').match(songtitle.toLowerCase().replace(/\W/g,' '))&&!lsIdArr.toString().replace(/\W/g, '').match(songs[x].tracks[0].foreign_id.split(':')[2].replace(/\W/g,'')) && !lsTitleArr.toString().toLowerCase().replace(/\W/g, '').match(songs[x].title.toLowerCase().replace(/\W/g,'')))
						{
							if((songs[x].artist_location.location.replace(/\W/g, '').toUpperCase().match(location_rp1.replace(/\W/g, '').toUpperCase()))||(songs[x].artist_location.location.replace(/\W/g, '').toUpperCase().match(location_rp2.replace(/\W/g, '').toUpperCase())))
							{
							
									
							if(songs[x].title == null || songs[x].artist_location == null||songs[x].artist_location.location==null || songs[x].tracks[0].foreign_id.split(':')[2] == null)
							{
							
							x=x+1;
							}
							
							if(lsIdFavArr.toString().replace(/\W/g, '').match(songs[x].tracks[0].foreign_id.split(':')[2]))
								{
								songs[x].favorite='on';
								}
							else
								{
								songs[x].favorite='off';
								}
							songs[x].closeButton=false;
							
							songs[x].num_id=x;
							songs[x].id=x;
							songs.songsArr.push(songs[x]);
							songs.spot_arr.push("spotify:track:"+songs[x].tracks[0].foreign_id.split(':')[2]);
							songs.spot_playlist.push(songs[x].tracks[0].foreign_id.split(':')[2]);
							songs.spot_str+=songs[x].tracks[0].foreign_id.split(':')[2]+',';
							//songs.push(songs[x]);
							
							//spot_arr.push(songs[x].tracks[0].foreign_id.split(':')[2]);
							song_str += songtitle;
							
							artistlocation=songs[x].artist_location.location.replace(/ /g, '*');
							
							songs.location_arr.push(songs[x].artist_location.location +'@@'+songs[x].artist_location.latitude + ':' + songs[x].artist_location.longitude+'&&<h5>'+songs[x].title+'</h5><p>'+songs[x].artist_name+'</p><a href="spotify:track:'+songs[x].tracks[0].foreign_id.split(':')[2]+'" target="_blank"><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+artistlocation+'/'+songs[x].artist_name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
							
								}
							
							}
						}
					else{
						//////////////////////////State////////////////////////
						/////////////////////////check for song against Local Storage so LeaveOuts are left out///////////////////////////////////	
						
						if (!song_str.toLowerCase().replace(/\W/g,' ').match(songtitle.toLowerCase().replace(/\W/g,' '))&&!lsIdArr.toString().replace(/\W/g, '').match(songs[x].tracks[0].foreign_id.split(':')[2].replace(/\W/g,'')) && !lsTitleArr.toString().toLowerCase().replace(/\W/g, '').match(songs[x].title.toLowerCase().replace(/\W/g,'')))
						{
							
								
							
						if(songs[x].title == null || songs[x].artist_location == null||songs[x].artist_location.location==null || songs[x].tracks[0].foreign_id.split(':')[2] == null||ls_str.match(songs[x].tracks[0].foreign_id.split(':')[2]))
						{
							
						x=x+1;
						}
						
						if(lsIdFavArr.toString().replace(/\W/g, '').match(songs[x].tracks[0].foreign_id.split(':')[2]))
							{
							
							songs[x].favorite='on';
							}
						else
							{
							songs[x].favorite='off';
							}
						songs[x].closeButton=false;
						songs[x].num_id=x;
						//songs[x].favorite='off'
						songs[x].id=x;
						songs.songsArr.push(songs[x]);
						songs.spot_arr.push("spotify:track:"+songs[x].tracks[0].foreign_id.split(':')[2]);
						songs.spot_playlist.push(songs[x].tracks[0].foreign_id.split(':')[2]);
						songs.spot_str+=songs[x].tracks[0].foreign_id.split(':')[2]+',';
						//songs.push(songs[x]);
						
						//spot_arr.push(songs[x].tracks[0].foreign_id.split(':')[2]);
						song_str += songtitle;
						
						artistlocation=$routeParams.location;
						
						songs.location_arr.push(songs[x].artist_location.location +'@@'+songs[x].artist_location.latitude + ':' + songs[x].artist_location.longitude+'&&<h5>'+songs[x].title+'</h5><p>'+songs[x].artist_name+'</p><a href="spotify:track:'+songs[x].tracks[0].foreign_id.split(':')[2]+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+artistlocation+'/'+songs[x].artist_name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
						
			
								
							}
					}
				}
				songs.location_arr.sort();
				for (var r=0; r<songs.location_arr.length; r++)
				{
					if(!location_str.match(songs.location_arr[r].split('@@')[0]))
					{
					songs.final_loc_arr.push('%%'+songs.location_arr[r]);
					location_str += songs.location_arr[r].split('@@')[0];
					}
					else
					{
						songs.final_loc_arr.push(songs.location_arr[r].split('@@')[1].split('&&')[1]);
						
					}
				}	
				
				songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + songs.spot_str;
				
				songs.spot_str = $sce.trustAsResourceUrl(songs.spot_str);
			
					if(songs.spot_playlist==0)
					{
						
						songs.noSongs=true;
						
					}
					else
					{
					songs.noSongs=false;
					}
				
				
				return songs;
			});
		 	},
		 	
		 	
		 	
		 	sharePlaylist:function()
		 	{
		 		
		 	}
	};
}]);




MusicWhereYouAreApp.factory('MapCreate', ['$q', '$http', '$sce','$rootScope',
function($q,  $http, $sce, $rootScope) {
	
	return {
		runMap :function(zoom,lat, long, arr, spot_arr){
		map;
		
		styles=[{"featureType":"landscape","stylers":[{"color":"#fefef3"},{"saturation":100},{"lightness":40.599999999999994},{"gamma":.75}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC200"},{"saturation":-61.8},{"lightness":45.599999999999994},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":51.19999999999999},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":52},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#0078FF"},{"saturation":-13.200000000000003},{"lightness":30.4000000000000057},{"gamma":.75}]},{"featureType":"poi","stylers":[{"hue":"#00FF6A"},{"saturation":-1.0989010989011234},{"lightness":11.200000000000017},{"gamma":1}]}];
			$rootScope.noSongs=false;
			var loc_arr=[];
			var loc_arr_string = arr.toString().replace(/<\/p>,/g, '');
			loc_arr_string = loc_arr_string.replace(/,%%/g, '%%');
			var loc_arr = loc_arr_string.split('%%');
			var LatLng = new google.maps.LatLng(lat, long);
			var infowindow_textArr =[];
			var mapOptions = {
				center : LatLng,
				zoom : zoom,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				draggable : true,
				 styles: styles
				
			};
			var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

			var marker_image = '/MusicWhereYouAre/genre_icons/marker_sm.png';
			for (var i = 1; i < loc_arr.length; i++) {
				var LatLng_marker = new google.maps.LatLng(loc_arr[i].split('@@')[1].split(':')[0], loc_arr[i].split('@@')[1].split(':')[1].split('&&')[0]);
				var geomarker = new google.maps.Marker({
					position : LatLng_marker,
					map : map,
					icon : marker_image
				});
				var infowindow = new google.maps.InfoWindow();
				var geomarker, i;
				//infowindow_textArr.push('<b>'+loc_arr[(i-1)].split('@@')[0].replace(/, US/g,'')+'</b><br><br/>'+loc_arr[(i-1)].split('&&')[1]);
				
				

					google.maps.event.addListener(geomarker, 'click', (function(geomarker, i) {
						return function() {
							
							infowindow.setContent('<b>'+loc_arr[(i)].split('@@')[0].replace(/, US/g,'')+'</b><br/>'+loc_arr[(i)].split('&&')[1].replace(/,\<h5\>/g, '<h5>')+'<br/>');
							infowindow.open(map, geomarker);
						};
					})(geomarker, i));
					
				
			}	
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

MusicWhereYouAreApp.factory("retrieveLocation", ['$q', '$rootScope', '$http', '$sce', '$window', '$location','States',
function($q, $rootScope, $http, $sce, $window,$location, States, $routeParams) {
	//////////////////////MAKE WORK for LOWERCASE
	//////////////Manipulate strings so all items look like, 'Test, TS' to the program//////////////
	return {
		runLocation : function(location, latorlng, ratio) {
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
			
			if (location.split(' ').length > 1 && location.match(',')) {
				var zoom = 10;
				///////city+full state//////
				if (location.split(',')[1].replace(' ', '').length > 2) {
					var locationSplit = location.split(',');
					var loc1 = toTitleCase(locationSplit[0]);
					var loc2 = toTitleCase(locationSplit[1].replace(' ', ''));
				}	
				else
				{
					location = location.replace('_', ' ');
					var ab = location.split(', ')[1].split(' ')[0].toUpperCase();
					
					
					for(var x=0; x<states.length; x++)
					{
						
						if(states[x].abbreviation==ab)
						{
							var state =(states[x].name);
							
							var locationSplit = location.split(',');
							var loc1 = toTitleCase(locationSplit[0]);
							var loc2 = toTitleCase(state);
							
						}
					}
					
				}	
					var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+loc2.toUpperCase()+'%27+AND+CityName=%27'+loc1.toUpperCase()+'%27+ORDER%20BY+Lat&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';
					var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Long,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+loc2.toUpperCase()+'%27+AND+CityName=%27'+loc1.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';
					if(latorlng=="lat")
					{
					return	$http.get(lat_url).then(function(data){
						if (data.data.rows != null) {
							for(var j=0; j<data.data.rows.length;j++)
								{
									lats += parseFloat(data.data.rows[j][0]);
									
								}
							geolocation.latitude=lats/data.data.rows.length;
							geolocation.lat_min = data.data.rows[0][0] - ratio;
							geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + ratio;
							geolocation.location = location;
						} else {
							$rootScope.noSongs=true;
						}	
						return (geolocation);
					});
					}
					else
					{
					
					return	$http.get(long_url).then(function(data){
						
						if (data.data.rows != null) {
							for(var j=0; j<data.data.rows.length;j++)
								{
									longs += parseFloat(data.data.rows[j][0]);
									
								}
							geolocation.longitude=longs/data.data.rows.length;;
							geolocation.long_min = data.data.rows[0][0] - ratio;
							geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + ratio;
							geolocation.location = location;
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
					var lat_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Lat,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+location.toUpperCase()+'%27+ORDER%20BY+Lat&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';
					var long_url = 'https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Long,Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+location.toUpperCase()+'%27+ORDER%20BY+Long&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0';
					

					location = toTitleCase(location);
					if(latorlng=="lat")
						{
						return	$http.get(lat_url).then(function(data){
							if (data.data.rows != null) {
								geolocation.latitude=data.data.rows[0][0];
								geolocation.lat_min = data.data.rows[0][0] - ratio
								geolocation.lat_max=data.data.rows[(data.data.rows.length-1)][0] + ratio;
								geolocation.location = location;
							} else {
								$rootScope.noSongs=true;
							}	
							return (geolocation);
						});
						}
						else
						{
						
						return	$http.get(long_url).then(function(data){
							if (data.data.rows != null) {
								geolocation.longitude=data.data.rows[0][0];
								geolocation.long_min = data.data.rows[0][0] - ratio;
								geolocation.long_max=data.data.rows[(data.data.rows.length-1)][0] + ratio;
								geolocation.location = location;
							} else {
								$rootScope.noSongs=true;
							}
							console.log(geolocation)
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
			runHash : function(lat, lng) {
			
			var url = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+CityName%2C+Region+FROM+1B8NpmfiAc414JhWeVZcSqiz4coLc_OeIh7umUDGs+WHERE+Lat+<=" + (lat+.05) + "+AND+Lat>=" + (lat - .05) + "+AND+Long<=" + (lng+.05) + "+AND+Long>=" + (lng -.05) + "&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0";
			$http.get(url).success(function(data) {
				if (data.rows != null) {
					var deferred = $q.defer();
					var city = data.rows[0][0];
					var state = data.rows[0][1];
					if (city.split(' ') > 1) {
						city = city.replace(/ /g, '_');
					}
					if (state.split(' ') > 1) {
						state = state.replace(/ /g, '_');
					}
					var location = city + '*' +state+'/';
					;
				} else {
					var location = "";
				}

				var hashy = $location.path().split('/')[1].split('/')[0];

				//window.location.href = '#'/hashy + '/' + location;
				$location.path(hashy+'/'+location.replace(/ /g, '_'));
				
				
			});
		}
	};	
}]);

MusicWhereYouAreApp.factory("loadGenreCheckData", ['$routeParams','$http',
function($routeParams, $http){
	return {
			  getGenre: function() {
				
			var Genre=[{genre: {checked : false,isSelected : false, state: 'off',  genre: 'avant garde', similarGenres: 'avant garde**avant garde jazz**avant garde metal', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'blues', similarGenres: 'blues**blues guitar**blues revival**blues rock**blues-rock**british blues**chicago blues**classic blues**contemporary blues**country blues**delta blues**electric blues**juke joint blues louisiana blues**memphis blues**modern blues**modern electric blues**new orleans blues**slide guitar blues**soul blues**texas blues', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'classic rock', similarGenres: 'classic rock' , year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre: 'classical', similarGenres: 'classical**classical pop**contemporary classical music**crossover classical**modern classical', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'comedy', similarGenres:'comedy**comedy rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'country', similarGenres: 'country rock**alternative country**country**honky tonk**cowboy punk**classic country**modern country**hillbilly**rockabilly**bluegrass**country pop**outlaw country**pop country**progressive country**texas country', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'drama', similarGenres: 'drama', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'electronic', similarGenres: 'electronic**electro**electro hip hop**electro house**electro rock**electro-funk**electro-industrial**electro jazz**experimental electronic**indie electronic', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'folk', similarGenres: 'folk**acid folk**alternative folk**contemporary folk**country folk**electric folk**folk pop**folk revival**folk rock**folk pop**indie folk**neo folk**pop folk**psychedelic folk**stomp and holler**traditional folk**urban folk', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'hip hop', similarGenres:'hip hop**classic hip hop**rap**west coast hip hop**alternative hip hop**east coast hip hop**electro hip hop**experimental hip hop**independent hip hop**indie hip hop**jazz hip hop**old school hip hop**southern hip hop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',   genre: 'holiday', similarGenres: 'holiday', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'indie', similarGenres: 'indie rock**geek rock**lo fi**math rock**indie folk**indie hip hop**indie**indy', year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre : 'jazz', similarGenres: 'jazz**jazz blues**jazz funk**jazz fusion**jazz hip hop**jazz rock**jazz vocal**latin jazz**modern jazz**new orleans jazz**soul jazz**traditional jazz' , year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: "kid music", similarGenres:'children\'s music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'latin', similarGenres: 'latin**latin jazz**jazz latino**latin alternative**latin folk**latin hip hop**latin pop**latin music**latin rap**latin rock**latin ska', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'new age', similarGenres:'new age**new age music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'motown', similarGenres: 'motown**classic motown**soul**memphis soul**old school soul**soul music**soul', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'pop', similarGenres:'pop 60s pop**80s pop**acoustic pop**alternative pop**pop rock**dance pop**folk pop**jangle pop**pop country**pop punk**pop rap**pop folk**psychedelic pop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'rock', similarGenres: 'rock**punk rock**classic rock**college rock**dance rock**electro rock**folk rock**garage rock**jam band**hard rock**modern rock**psychedelic stoner rock**punk**southern rock**80s rock**90s rock**70s rock**60s rock**alternative rock**acoustic rock**acid rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'soft rock', similarGenres: 'soft rock**easy listening', year_end:''}}, {genre: {checked : false,isSelected : false, state: 'off',  genre: 'world', similarGenres: 'world world music**world beat**world fusion', year_end:''}}];	
	
	
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
		var url ='http://developer.echonest.com/api/v4/artist/list_terms?api_key=3KFREGLKBDFLWSIEC&format=json&type=style'
     			
     			
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
			//$scope.menuPos=true;
			genre_class.name = 'genre';
			genre_class.classy = "iconequalizer12";
			genre_class.state = 'off';
			//genre_class.href = '#/genres/' + $scope.location;
		
			playlist_class.name = 'playlist';
			playlist_class.classy = "icon-song";
			playlist_class.state = 'off';
			//playlist_class.href = '#/playlist/' + $scope.location;
		
			favorite_class.name = 'favorite';
			favorite_class.classy = "iconfavorite";
			favorite_class.state = 'off';
			//favorite_class.href = '#/favorites/' + $scope.location;
		
			map_class.name = 'map';
			map_class.classy = "iconmap";
			map_class.state = 'off';
			//map_class.href = '#/map/' + $scope.location;
		
			jukebox_class.name = 'jukebox';
			jukebox_class.classy = "jukebox";
			jukebox_class.state = 'off';
			//jukebox_class.href = '#/jukebox/' + $scope.location;
			
			roadsoda_class.name = 'roadsoda';
			roadsoda_class.classy = "roadsoda";
			roadsoda_class.state = 'off';
			//roadsoda_class.href = '#/roadsoda/' + $scope.location;
		
			icons = [genre_class, playlist_class, favorite_class, map_class, jukebox_class];
			$rootScope.icons = icons;
			return icons;
		},
		
		changeSymbol: function(state, obj, classy ,url, link, object2)
		{
		if($rootScope.icons!=undefined)
		{
		for(var i=0; i<$rootScope.icons.length; i++)
			{
				
				
				$rootScope.icons[i].state='off';
				
				
			
				if($location.path().match($rootScope.icons[i].name))
				{
					$rootScope.icons[i].state ='on';
					
				}
			};
			
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
     			
     			var url ='http://developer.echonest.com/api/v4/artist/search?api_key=3KFREGLKBDFLWSIEC&format=json&name='+artistname_echo+'&results=1&bucket=songs&bucket=biographies&bucket=images&bucket=id:spotify-WW&limit=true&bucket=video&bucket=news&bucket=artist_location&rank_type=familiarity'
     			
     			
     			return $http.get(url).then(function(result)
     			{
     				
					
     				
     			artistinfo =result.data.response.artists[0];
       			artistinfo.spot_url=[];
     			artistinfo.bio={};
     			artistinfo.bio.text='';
     			artistinfo.ytArr=[];
     			artistinfo.videoArr=[];
     			artistinfo.lastfm_imgs=[];
     			
	     			for (var f=0; f<artistinfo.video.length; f++)
	     			{
	     			if(artistinfo.video[f].url.match('youtube'))
		     			{
		     			artistinfo.ytArr.push(artistinfo.video[f].url);
		     			}
	     			}
     			
	     			for (var g=0; g<artistinfo.news.length; g++)
	     			{
	     				
		     			artistinfo.news[g].news_summary=removeHTML(artistinfo.news[g].summary);
		     			
	     			}
     			if(artistinfo.ytArr.length<7)
     			{
     			var yt_length = artistinfo.ytArr.length;
     			}
     			else{
     			var yt_length = 7;
     			}
     			for(var g=0; g<yt_length; g++)
	     			{
	     				
	     				artistinfo.videoArr.push($sce.trustAsResourceUrl('http://www.youtube.com/embed/'+artistinfo.ytArr[g].slice(artistinfo.ytArr[g].indexOf('?v='),artistinfo.ytArr[g].indexOf('&feature')).replace('?v=','')));
	     			}
     			
     			
	     			for(var i=0; i<artistinfo.biographies.length; i++)
	     			{
	     				
	     				if(artistinfo.biographies[i].site.match('last.fm'))
	     				{
	     					artistinfo.bio=result.data.response.artists[0].biographies[i];
	     					if(artistinfo.bio.text.length>2700)
	     					{
	     						artistinfo.bio.text = textSlicer(artistinfo.bio.text, 2700) +'... ';
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
			spotifyRetrieve :function(artistname)
			{
				
				var spotifysongs ={}
				var url = 'http://ws.spotify.com/search/1/track.json?q=artist:'+artistname;
				return $http.get(url).success(function(result)
     			{
	
     			artistsongs =result;
     			artistsongs.spot_url=[];
     			artistsongs.spot_url_button=[];
     			
     			for(var i=0; i<25; i++)
     			{
     				
     				artistsongs.spot_url.push(artistsongs.tracks[i].href.replace('spotify:track:', ''));
     				artistsongs.spot_url_button.push(artistsongs.tracks[i].href);
     			}
     			
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
     			for(var i=0; i<relatedartists.length; i++)
	     			{
	     				if(relatedartists[i].artist_location!=null)
	     				{
	     				relatedartists.relatedartistsfinal.push(relatedartists[i]);
	     				
	     				
	     				}
	     			}
	     			
	     			for(var x=0; x<relatedartists.relatedartistsfinal.length; x++)
	     			{	
	     				relatedartists.relatedartistsfinal[x].href = '#/info/'+$location.path().split('/')[2]+'/'+relatedartists.relatedartistsfinal[x].name.replace('The ', '');
	     				relatedartists.relatedartistsfinal[x].lastfm_imgs =[];
	     				for(var u=0; u<relatedartists.relatedartistsfinal[x].images.length; u++)
	     				{
	     					if(relatedartists.relatedartistsfinal[x].images[u].url.match('last.fm'))
	     					{
	     						if(relatedartists.relatedartistsfinal[x].images[u].url.match('serve'))
	     						{
	     						var img_id = relatedartists.relatedartistsfinal[x].images[u].url.split('serve/')[1]
	     						img_id=img_id.slice(relatedartists.relatedartistsfinal[x].images[u].url.split('serve/')[1].indexOf('/'),relatedartists.relatedartistsfinal[x].images[u].url.split('serve/')[1].length);
	     						
	     						relatedartists.relatedartistsfinal[x].images[u].src ='http://userserve-ak.last.fm/serve/126s'+img_id;	
	     									
	     						relatedartists.relatedartistsfinal[x].lastfm_imgs.push(relatedartists.relatedartistsfinal[x].images[u]);
	     						
	     						}
	     					}
	     				}
	     				
	     				if(relatedartists.relatedartistsfinal[x].lastfm_imgs.length==0)
	     				{
	     					relatedartists.relatedartistsfinal[x].lastfm_imgs.push({src:'/MusicWhereYouAre/logo4_sm.png'});	     				
	     				}
	     				
	     				
	     				
	     			}
	     			
						
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
				//console.log(jQuery.parseJSON(localStorage.getItem('FavoriteArr')))
				var favorites = jQuery.parseJSON(localStorage.getItem('FavoriteArr'))
				//console.log(favorites)
				
				//favorites.blogHider=false;
			}
			else
			{
				favorites=[];
				//favorites.blogHider=true;
			}
			for(var x=0; x<favorites.length; x++)
				{
					favorites[x].id=x;
					favorites[x].num_id=x;
				}
			localStorage.setItem('FavoriteArr', JSON.stringify(favorites));
			
			//return favorites;
			
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
			
			for(var x=0; x<favoritesArr.length; x++)
			{
				favoritesArr[x].id=x;
				favoritesArr[x].favorite='off';
				
				if(favoritesArr[x].tracks[0].foreign_id.split(':')[2]==obj.tracks[0].foreign_id.split(':')[2])
				{
					obj.favorite='on';
					
				}
				

			}
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

MusicWhereYouAreApp.factory("HintShower", ['$q', '$rootScope', '$http', '$sce', '$location','States',
function($q, $rootScope, $http, $sce, $location, States) {
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
				
				for(var x=0; x<states.length; x++ )				           
				{
					if(location[1].toUpperCase().match(states[x].abbreviation))
					{
					var state_location = states[x].name;
					
					}
				}
			}	
			return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+state_location+'%27+AND+CityName=%27'+location[0]+'%27+AND+CountryID%=%27'+location[2]+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				hints = result.data.rows;
				if(result.data.rows!=undefined)
				{
				hints.stateArr =[];
				hints.cityArr=[];
				hints.countryArr=[];
				hints.finalArr=[];
			 		
				for(var i=0; i<hints.length; i++)
				{
							
					hints.stateArr.push(hints[i][0]);
					hints.cityArr.push( hints[i][1]);
					hints.countryArr.push(hints[i][2]);
					
				}
				for (var t=0; t<hints.cityArr.length; t++)
				{
					hints.finalArr.push({city:hints.cityArr[t], cityhref:hints.cityArr[t].replace(/ /g, '_'), state: hints.stateArr[t], statehref:hints.stateArr[t].replace(/ /g, '_'), country: hints.countryArr[t], countryhref: hints.countryArr[t].replace(/ /g, '_')});
				}
				return hints;
				}
				});
		 	}
		 	if(location.length==2)
			{	
			var state_location = location[1];
				
			if(location[1].length<3)
			{

				for(var x=0; x<states.length; x++ )				           
				{
					if(location[1].toUpperCase().match(states[x].abbreviation))
					{
					var state_location = states[x].name;
					
					}
				}
			}	
				           
			return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+Region=%27'+state_location.toUpperCase()+'%27+AND+CityName=%27'+location[0].toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				if(result.data.rows!=undefined)
				{
					hints = result.data.rows;
					hints.stateArr =[];
					hints.cityArr=[];
					hints.countryArr=[];
					hints.finalArr=[];
				 	
					if(result.data.rows.length!=null)
					{
					for(var i=0; i<hints.length; i++)
					{
						
						hints.stateArr.push(hints[i][0]);
						hints.cityArr.push( hints[i][1]);
						hints.countryArr.push(hints[i][2]);
						
					}
					for (var t=0; t<hints.cityArr.length; t++)
					{
						hints.finalArr.push({city:hints.cityArr[t], cityhref:hints.cityArr[t].replace(/ /g, '_'), state: hints.stateArr[t], statehref:hints.stateArr[t].replace(/ /g, '_'), country: hints.countryArr[t], countryhref: hints.countryArr[t].replace(/ /g, '_')});
					}
					
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
					hints.stateArr =[];
					hints.cityArr=[];
					hints.countryArr=[];
					hints.finalArr=[];
					for(var i=0; i<hints.length; i++)
					{
						
						hints.stateArr.push(hints[i][0]);
						hints.cityArr.push( hints[i][1]);
						hints.countryArr.push(hints[i][2]);
						
					}
					for (var t=0; t<hints.cityArr.length; t++)
					{
						hints.finalArr.push({city:hints.cityArr[t], cityhref:hints.cityArr[t].replace(/ /g, '_'), state: hints.stateArr[t], statehref:hints.stateArr[t].replace(/ /g, '_'), country: hints.countryArr[t], countryhref: hints.countryArr[t].replace(/ /g, '_')});
					}
				
				return hints;
				}
				});
				 
				
				
				
				/*return $http.get('/php/geolocation.php?city='+location[0].toUpperCase()).then(function(result) {
				//return $http.get('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+Region,CityName,CountryID+FROM+1_7XFAaYei_-1QN5dIzQQB8eSam1CL0_0wYpr0W0G+WHERE+CityName=%27'+location[0].toUpperCase()+'%27+ORDER%20BY+CityName&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0').then(function(result) {
				//hints = result.data.rows;
				hints=result.data;
				hints.stateArr =[];
				hints.cityArr=[];
				hints.countryArr=[];
				hints.finalArr=[];
				for(var i=0; i<hints.length; i++)
				{
					
					//hints.stateArr.push(hints[i][0]);
					//hints.cityArr.push( hints[i][1]);
					//hints.countryArr.push(hints[i][2]);
					hints.stateArr.push(hints[i].Region);
					hints.cityArr.push( hints[i].City);
					hints.countryArr.push(hints[i].Country);
					
				}
				for (var t=0; t<hints.cityArr.length; t++)
				{
					hints.finalArr.push({city:hints.cityArr[t], cityhref:hints.cityArr[t].replace(/ /g, '_'), state: hints.stateArr[t], statehref:hints.stateArr[t].replace(/ /g, '_'), country: hints.countryArr[t], countryhref: hints.countryArr[t].replace(/ /g, '_')});
				}
				
				return hints;
				});*/
			}
		},	
			
				
			
		};
	
}]);	

MusicWhereYouAreApp.factory("Events", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams',
function($q, $rootScope, $http, $sce, $location, States, $routeParams) {
	return{
			getGeoEvents: function(location)
			{
				return $http.get('http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location='+location+'&api_key=174019d04974adad421f3fb19681277e&limit=50&format=json').then(function(results)
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


MusicWhereYouAreApp.factory("ShareSongs", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams',
function($q, $rootScope, $http, $sce, $location, States, $routeParams) {
	return{
		getSongs: function(songs, location)
		{
			var str='';
			;
			for (var x=0; x<songs.length; x++)
			{
				
				str+=songs[x].title.replace(/&/g, 'and')+'$$$'+songs[x].tracks[0].foreign_id.split(':')[2]+'@@@'+songs[x].artist_name.replace(/&/g, 'and')+'!!!'+songs[x].favorite+'***';
			}
			//str = encodeURI(str);
			var url = location.replace(/ /g, '_')+'/'+str.replace(/%20/g, '_').replace(/\//g, '--');
			url = '/playlist/'+url.replace(/ /g, '_').replace(/%20/g, '_').replace(/\//g, '--');
			return url;
			
		},
		createSongsList: function()
		{
			var songs_str = $routeParams.qs;
			var songs;
			var location_str = '';
			return $http.get('/scripps.php?q='+songs_str.replace(/_/g, '%20').replace(/--/g, '/').replace(/ /g, '_')).then(function(result){
				songs=result.data;
				songs.spot_arr=[];;
				songs.songsArr=[];
				songs.spot_str='';
				songs.location_arr=[];
				songs.final_loc_arr=[];
				songs.spot_arr=[];
				for (var x=0; x<songs.length-1; x++)
				{
				
				songs[x].tracks=[];
				songs[x].location = ''
				songs[x].tracks.push({ "foreign_id": "spotify:track:"+songs[x].id});
				songs[x].title = songs[x].title.replace(/_/g, ' ').replace(/--/g, '/');
				songs[x].artist_name = songs[x].artist_name.replace(/_/g, ' ').replace(/--/g, '/');
				//songs.spot_arr.push('spotify:track'+songs[x].id);
				songs.location_arr.push(songs[x].location.replace(/_/g, ' ') +'@@'+songs[x].latitude + ':' + songs[x].longitude+'&&<h5>'+songs[x].title+'</h5><p>'+songs[x].artist_name+'</p><a href="spotify:track:'+songs[x].tracks[0].foreign_id.split(':')[2]+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+songs[x].location+'/'+songs[x].artist_name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
				songs.spot_str +=songs[x].id+',';
				songs.songsArr.push(songs[x]);
				songs.spot_arr.push("spotify:track:"+songs[x].tracks[0].foreign_id.split(':')[2]);
				}
				songs.spot_str ='https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+songs.spot_str;
				songs.spot_str = $sce.trustAsResourceUrl(songs.spot_str);
				
				songs.location_arr.sort();
				for (var r=0; r<songs.location_arr.length; r++)
				{
					if(!location_str.match(songs.location_arr[r].split('@@')[0]))
					{
					songs.final_loc_arr.push('%%'+songs.location_arr[r]);
					location_str += songs.location_arr[r].split('@@')[0];
					}
					else
					{
						songs.final_loc_arr.push(songs.location_arr[r].split('@@')[1].split('&&')[1]);
					}
				}	
				
				return songs;
			});
			
		},
		getLongURL:function(url)
		{
			
			var deferred = $q.defer();
			url ='http://cityblinking.com/MusicWhereYouAre/app/%23'+url.replace('--', '/');
			url = (url);
			deferred.resolve(url);
			return deferred.promise;
			
		},
		getBitLy:function(url)
		{
			var bitly = 'http://api.bitly.com/v3/shorten?format=json&apiKey=R_06ae3d8226a246f2a0bb68afe44c8379&login=robostheimer&longUrl='+url
			
			return $http.get(bitly).then(
				function(result){
					return result.data.data.url;
				});
		},	
	};
	


}]);	


