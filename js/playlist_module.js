var Playlist=angular.module('Playlist', []);

/*Services*/
Playlist.service('PlaylistCreate', ['$q', '$rootScope', '$http', '$sce', 'MapCreate', 'HashCreate','$location','$routeParams','States', 'Spotify', 'ChunkSongs','Favorites', '$cacheFactory',
function($q, $rootScope, $http, $sce, MapCreate, HashCreate, $location, $routeParams, States, Spotify, ChunkSongs, Favorites, $cacheFactory) {
	var cache = $cacheFactory('songs_location');

	return {
		 runPlaylist : function(cities, index) {
			$rootScope.noGeo=false;
			var citiesStr = ""
			cities.forEach((city) => {
				var x = cities.indexOf(city);
				if(x < cities.length-1) {
					citiesStr+=`'${city}',`;
				} else {
					citiesStr+=`'${city}'`;
				}
			});

			songs = {},
			url = `https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+ArtistId%2C+Name%2C+Sid%2CCity%2CCityId%2CLat%2CLng%2CHotness+FROM+15UlsGab9-IJ7Hq4ypRYiQMWd2QkGaywgs2WMUuTJ+WHERE+CityId%20IN%20(${citiesStr})+ORDER%20BY+Hotness&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK`,

			deferred = $q.defer();
			if(!cache.get(cities[0].city_id)) {
				return $http({
					cache:true,
					url:url,
					method:'jsonp'
				}).then(function(data) {
					var songs_length;
					var num_groups //to help chunk into groups of 50 (max number that can be sent to spotify api);
					var remainder //to help to chunk into groups of 50 (max number that can be sent to spotify api);

					var artists =  {artists:[], chunkedArr: [], artistIds: [] };
					//Massaging the data so that all artists have the proper location info attached to them
					songs.location = $routeParams.location;
					if(data.data.rows) {
						data.data.rows.reverse().forEach((item) => {
								artists.artists.push({
									id: item[0],
									name: item[1],
									sid: item[2],
									city: item[3],
									cityId: item[4],
									lat: item[5],
									lng: item[6],
									hotness: item[7],
							});
							artists.artistIds.push(item[2]);
						});
					}

					num_groups = artists.artists.length/50;
					remainder = artists.artists.length%50;
					//turn this into a util/helper function
					if (artists.artists.length > 50) {
						for(var i=1; i<num_groups; i++) {
								artists.chunkedArr.push({ artists: artists.artists.slice((i-1)*50,i*50), artistIds: artists.artistIds.slice((i-1)*50,i*50) });
							}
						} else {
							artists.chunkedArr = [{ artists: artists.artists, artistIds: artists.artistIds }];
					}
					return artists;

				},function(error){
					$rootScope.errorMessage=true;

				})
			} else {
				songs = cache.get(id);
				deferred.resolve(songs);
				return deferred.promise;
		};
	},
	};
}]);


Playlist.service("Spotify",[ '$q', '$rootScope', '$http', '$sce','$routeParams','Favorites','MapCreate','HashCreate','ChunkSongs','$cacheFactory',
function($q, $rootScope, $http, $sce, $routeParams, Favorites, MapCreate, HashCreate, ChunkSongs, $cacheFactory){
	var cache = $cacheFactory('spotify');

	return{
		runGenres: function() {
			var arguments = Array.prototype.slice.call(arguments),
				args = arguments[0],
				len = arguments[1] || args.chunkedArr.length-1,
				allArtists = [],
				location = $routeParams.location.replace(/, /g, '*'),
				cacheKey = `${location}_${args.chunkedArr[0].artistIds.toString()}}`,
				deferred = $q.defer();

			if(!sessionStorage.access_token) {
				runAuthorization();
			}

			if (!cache.get(cacheKey)) {
				var x = 0;
				args.chunkedArr.forEach(function(chunk) {
					var url = `https://api.spotify.com/v1/artists?ids=${chunk.artistIds.toString()}`;
					if(x < len) {
						x++;
						return $http({
							cache:true,
							url:url,
							method:'get' ,
							headers: {
						  	'Authorization': `Bearer ${sessionStorage.access_token}`
							}
						}).then(function(data) {
							var artists = data.data.artists;
							if(artists) {
								artists.forEach((artist) => {
									var x = artists.indexOf(artist);
									artist.location = chunk.artists[x].city;
									artist.location_link = chunk.artists[x].city.replace(/, /g, '*');
									artist.lat = chunk.artists[x].lat;
									artist.lng = chunk.artists[x].lng;
									allArtists.push(artist);
								});
							}
							if(x === len) {
								deferred.resolve(allArtists);
							}
						}, (error) => {
							if(error.status) {
								runAuthorization();
							}
						});
					}
				});
				return deferred.promise;
			} else {
				artists = cache.get(cacheKey);
				deferred.resolve(artists)
				return deferred.promise;
			}
		},
			runTopSongs: function() {
			//TODO: Make it so this can accept an array or just an object (spread arguments - see LIL code)
			// Run loops in service (as opposed to in the controller -- this will be cleaner and allow for easier promise chaining)
			// see runGenres method above (line 82)
				//no need for caching, want it to be up-to-date at all times
				
				var args = Array.prototype.slice.call(arguments),
					artists = args[0],
					finalTracks = [],
					deferred = $q.defer();

				artists.forEach((artist) => {
					const url = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?country=US`
					return $http({
						cache:true,
						url:url,
						method:'get' ,
						headers: {
					  	'Authorization': `Bearer ${sessionStorage.access_token}`
						}
					}).then((tracks) => {
						var x = artists.indexOf(artist),
							len = artists.length-1;
						if(tracks) {
							tracks.spotStr='';
							tracks.idStr = '';
							tracks.data.tracks.forEach((track) => {
								track.genres = artist.genres;
								track.location = artist.location;
								track.lat = artist.lat;
								track.lng = artist.lng;
								track.favorite = 'off';
								track.num_id = x;
							})
						finalTracks.push(tracks);
						if(x === len) {
							deferred.resolve(finalTracks);
						}
					}
				})
			});
			return deferred.promise;
		},

		// runLyricsnMusic: function(searchterm)
		// {
		// 	return $http.jsonp('http://api.lyricsnmusic.com/songs?api_key=548b2523656cf7b2bbf49252673c24&lyrics="'+searchterm+'"&callback=JSON_CALLBACK').then(function(result)
		// 	{
		//
		// 		var LnM_songs = result.data.data
		//
		//
		// 		return LnM_songs;
		// 	});
		// },

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
							track.num_id=finalSongs.length;
							track.artist_location = songsArr[y].artist_location;
							finalSongs.push(track);


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
			else{
				zoom=10;
			}
			return zoom;
		}

	};
}]);

//////////////////Need to lose the rootScopes and run in different service calls in the controller @ runSongAboutSearch in hashedLocation Controller
Playlist.service("ChunkSongs",[ '$q', '$rootScope', '$http', '$sce','LocationDataFetch',
function($q, $rootScope, $http, $sce, LocationDataFetch)
{
	//make this accept arrays (see runTopSongs above)
	return{
		createChunks:function(artists, num)
		{
				artists.chunkedArr =[];
				artists.tracks = [];
				artists.savSpotArr = [];
				var deferred = $q.defer(),
				len = artists.length,
				num_groups = Math.floor(len/num),
				remainder = len%num;
				//turn this into a util/helper function
				if(len > num) {
					if(num_groups > 1) {
						for (var i=1; i<num_groups; i++) {
							artists.chunkedArr.push(artists.slice((i-1),(i*num)));
						}
						artists.chunkedArr[num_groups] = artists.slice(len-remainder, len);
					} else if(remainder > 0) {
						artists.chunkedArr[0] = artists.slice(0, num);
						artists.chunkedArr[1] = artists.slice(num, num+remainder);
					} else {
						artists.chunkedArr[0] = artists.slice(0, num);
					}
				} else {
					artists.chunkedArr = [artists];
				}
				artists.chunkedArr[0].forEach(function(track) {
					var x = artists.chunkedArr[0].indexOf(track);
					artists.tracks.push(track.id);
					track.num_id = x;
					artists.savSpotArr.push(`spotify:track:${track.id}`)
				});

				//will need to create a mechanism to change the index based on a click or infinite scroll
				artists.songs_ids = artists.tracks.toString();
				artists.spotStr=$sce.trustAsResourceUrl(`https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:${songs.songs_ids}`);
				deferred.resolve(artists);
				return deferred.promise;
		},
	};
}]);


Playlist.service("Wiki", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams','Spotify',
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
				$.loading_tags=true;
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









/*Controllers*/

Playlist.controller('hashedLocation', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'Wiki', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs', 'getLocation', 'Spotify','HashCreate','ChunkSongs','deviceDetector','Twitter',function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, Wiki, MapCreate, States, $sce, Favorites, ShareSongs, getLocation, Spotify, HashCreate, ChunkSongs, deviceDetector, Twitter) {
	$scope.location_for_dom = $location.path().split('/')[2].replace(/_/g, ' ').replace(/\*/g, ', ')

	$scope.runApp = function() {
			$rootScope.mapOpening = true;
			$rootScope.loading = true;
			var cities,
				songs = { tracks: [], idStr: '', spotStr:'', savSpotArr:[], allArtists: [], selectedGenres: [], chunkedArr: [] },
				spotStr = '';
			retrieveLocation.runLocation(location_comp).then(function(data) {
				cities = data;
				PlaylistCreate.runPlaylist(cities).then(function(data){
					$rootScope.playlistData = data;
					songs.artistIds = data.artistIds;
					songs.chunkedArr = data.chunkedArr;
					songs.artists = data.artists;
					Spotify.runGenres(data, 1).then(function(artists) {
						Spotify.runTopSongs(artists, 1).then((data) => {
							data.forEach((track) => {
								if(track.data.tracks[0]) {
									let data = track.data.tracks[0];
									songs.tracks.push(data);
									songs.savSpotArr.push(`spotify:track:${data.id}`)
									songs.idStr+=`${data.id},`;
								}
							})
							songs.tracks = songs.tracks.SortObjAsc('num_id', 'num');
							$rootScope.songs = songs
							$rootScope.songsCopy = angular.copy($rootScope.songs);

							$rootScope.spotStr = $sce.trustAsResourceUrl(`https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:${songs.idStr}`);
							Favorites.checkFavorites($rootScope.songs.tracks);
							$scope.loading = false;
							$scope.mapdata.lat=$rootScope.songs.tracks[0].lat;
							$scope.mapdata.lng=$rootScope.songs.tracks[0].lng;
							$scope.mapdata.markers=$rootScope.songs.tracks;
							$scope.newlocation = false;
							$rootScope.mapOpening = false;
							$rootScope.loading = false;
						});
					});
				});

			},function(error){
				$scope.errorMessage = true;
			});
		}

	//};

	$scope.icons = $rootScope.icons;
	runSymbolChange.changeSymbol();

	$scope.song_str = '';
	$rootScope.showHint = false;

	$scope.runSongAboutSearch=function(number, iterator, usergen)
	{
		//////////when there is a user-generated search -> add items to localStorage and attach it to a city - so the next time they look up a specific city,
		/////////those items show up.
		/////////Take the "JSON" from the local storage and create CSV to add to the Songs About DB//////////
		///////////Once there is a backend, this will enable user-generated content - i.e. all searches will go to the DB and be held there.
		if($rootScope.aboutMarked==false || $scope.finalcollector.length<50 && $scope.lookUpSongs.length==0)
		{

			$rootScope.loading_tags=true;
			$scope.noSongsAbout = false;

			$scope.number = number;

			var location_arr=[];
			$scope.start_index=number;
			$scope.iterator=20;

				var location_stringy = $routeParams.location;
				location_stringy = location_stringy.replace(/_/g, ' ');
				if(location_stringy=="WASHINGTON*DISTRICT_OF_COLUMBIA")
				{
					location_stringy = "Washington, DC"
				}
				/////////City, State//////////
				if(location_stringy.split('*').length>1)
				{
					var states = States.createStateObj();
					for (var i = 0; i < states.length; i++) {
						///////US city and full state name

						if (location_stringy.toLowerCase().split('*')[1] == states[i].name.toLowerCase()) {
						var location_full = location_stringy.split('*')[0]+', '+states[i].name;
						var location_ab = location_stringy.split('*')[0]+', '+states[i].abbreviation;
						//$scope.runUserSearch(location_full, 15, 'no');

						}
						/////////US city and abbrev
						else if (location_stringy.toLowerCase().split('*')[1] == states[i].abbreviation.toLowerCase()){
						var location_full = location_stringy.split('*')[0]+', '+states[i].name;
						var location_ab=location_stringy.split('*')[0]+', '+states[i].abbreviation;
						//$scope.runUserSearch(location_full, location_ab, 15, 'no');

						}

						///////////Foreign city////////////
						else if (i==states.length-1 && location_full==undefined )
						{

						var location_ab=location_stringy;

						}

					}
					$scope.runUserSearch(location_ab, 30, 'no', 'auto')	;
					//$scope.countRunUserSearch = $scope.countRunUserSearch+1;

				}


				/////////////no songs/////////////
				else
				{

					$scope.runUserSearch(location_stringy, 30, 'no', 'auto')
				}

		}
		else{
			$rootScope.loading_tags=false;

		}

		//}

	};
	$scope.runUserSearch=function(searchterm, number, usergen, auto_or_user, form)
	{

	///////////////////////////Create JSON for all of the Cities over 100K (see google Spreadsheet) run against spotify.
	//////////////////////////Add those to lists that already exist and put in fusion table to avoid having to hit Echonest
	//////////////////////////and spotify over and over again for Songs About.  Just do one big data dump///////////////////////////
	///////////Run the following code to get songs from Songs About DB///////////////
	/*Spotify.runFusionTableJSON(38.35, -77.0, .75).then(function(data){
			$scope.data=data;

		});	*/
		if($rootScope.aboutMarked==false ||$scope.finalcollector.length<50 && $scope.lookUpSongs.length==0)
		{


				$scope.finalcollector.idArr=[];
				$scope.finalcollector.savSpotArr=[];
				$scope.finalcollector.location_arr=[];
				$scope.location_arr=[];
				$scope.finalcollector.artistlocation='';
				$scope.finalcollector.artistlocations ={latitude:[], longitude:[]};
				var ft_length=0;
				//$rootScope.loading_tags=true;
				////////////////Create the .3 dynamically so it re-runs until that number is over one////////////////
				//////////////Runs the various functions  to create the songs about Cities array/////////////
				///////////////collects the song in the $scope.collector_arr///////////////////
				Spotify.runFusionTableJSON($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude, .3).then(function(data){

				if($scope.countRunUserSearch<4)
				{
						if(auto_or_user=="auto" )
						{
							ft_length = data.length;
							if(data.length>0 && data.length<400)
								{

								$scope.collector_arr=$scope.collector_arr.concat(data);
								Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
											var lengthy = result.length;
											$scope.collector_arr=$scope.collector_arr.concat(result);

												$scope.runNearbySearch($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude,searchterm);
												$scope.runCityStateSearch(searchterm);
												$scope.countRunUserSearch++;
									});
								}
								else if(data.length>400)
								{
											$scope.collector_arr=$scope.collector_arr.concat(data);
											$scope.countRunUserSearch=2;
											$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true);
											$scope.parseSongData($scope.collector_arr.reverse(), 'yes')	;
								}

							else if(data.length==0 )
								{

									$scope.runNearbySearch($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude,searchterm);
									$scope.runCityStateSearch(searchterm);
									$scope.countRunUserSearch++;

								}

						}
						else if(auto_or_user=="user"){


							Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {

										$scope.collector_arr = result;
											$scope.countRunUserSearch=2;

											if(result.length==0 && form!=undefined)
											{
												$scope.userGenMessage =true;
											}
											else{
												$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true);
												$scope.parseSongData($scope.collector_arr,'yes');
											}

							});
							}
						else if(typeof(auto_or_user) ==='number' ){

							Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {

											$scope.collector_arr=result.concat($scope.collector_arr)
										//	$scope.parseSongData(result, 'yes', 'no')	;
											$scope.countRunUserSearch=2;
											if($scope.pass_length-1== auto_or_user)
											{
											$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true);
											$scope.parseSongData($scope.collector_arr, 'no')
											}
									});
						}
						else {

							Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
								$scope.collector_arr=result.concat($scope.collector_arr)
								$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true)
								$scope.parseSongData($scope.collector_arr, 'no')
							});
						}

					}


					},function(error){
						$scope.errorMessage = true;
					});



				}


		else{
					$rootScope.loading_tags=false;
					$scope.about_shower=true;
					var lat_range =Math.abs($scope.finalcollector.artistlocations.latitude[($scope.finalcollector.artistlocations.latitude.length)-2]-$scope.finalcollector.artistlocations.latitude[0]);
					var lng_range = Math.abs($scope.finalcollector.artistlocations.longitude[($scope.finalcollector.artistlocations.longitude.length)-2]-$scope.finalcollector.artistlocations.longitude[0]);
					var lat_avg = ($scope.finalcollector.artistlocations.latitude[($scope.finalcollector.artistlocations.latitude.length-2)]+$scope.finalcollector.artistlocations.latitude[0])/2;
					var lng_avg=($scope.finalcollector.artistlocations.longitude[($scope.finalcollector.artistlocations.longitude.length-2)]+$scope.finalcollector.artistlocations.longitude[0])/2;

					if(lat_range>lng_range)
					{
						var finalRange=lat_range
					}
					else
					{
						var finalRange=lng_range;
					}
					$rootScope.aboutMarked =true;
					$scope.zoom=Spotify.runRange(finalRange);
					//$scope.parseSongData($scope.finalcollector, 'no')



				}


	};
	$scope.parseSongData=function(result, usergen)
	{


		var collector=[];
		var arr=[];
		var songStr='';

		if(result.length==0 && $scope.countRunUserSearch==5)
		{
		$scope.showCityMessage=true;
		$rootScope.loading_tags=false;
		}
		else{
		$scope.lengthy = $scope.lengthy+result.length;
		var deferred = $q.defer();

			if(usergen=='yes')

			{
				var resultNoDups=result
				if(resultNoDups.length==0 && $scope.countRunUserSearch==5)
				{
				$scope.showCityMessage = true;
				$rootScope.loading_tags=false;
				}
			}
			else{
				var resultNoDups=result;
				if(resultNoDups.length==0 && $scope.countRunUserSearch==5)
				{
				$scope.showCityMessage = true;
				$rootScope.loading_tags=false;

				}
			}
			 resultNoDups=resultNoDups.removeDuplicatesArrObj('name',true);
			var lengthy = resultNoDups.length;


					for(var t=0; t<resultNoDups.length; t++)
					{
						resultNoDups[t].favorite='off';

						if((localStorage.country!="" || localStorage.country!=undefined) && resultNoDups[t].available_markets.toString().match(localStorage.country))
						{

						Spotify.lookUpEchonest(resultNoDups[t]).then(function(result){
						collector.push(resultNoDups[t]);


							result.num_id=t;
							if(usergen=='yes')
							{
								$scope.finalcollector.splice(0, 0, result)
								$scope.finalcollector.idArr.splice(0,0, result.id);

								$scope.finalcollector.savSpotArr.splice(0,0,'spotify:track:'+result.id)
								$scope.location_arr.splice(0,0,result.artist_location.location +'@@'+result.artist_location.latitude + ':' + result.artist_location.longitude+'&&<h5>'+result.name+'</h5><p>'+result.artists[0].name+'</p><a href="spotify:track:'+result.id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+result.artist_location.location.replace(', ' , '*').split(',')[0]+'/'+result.artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');

							}
							else{

								$scope.finalcollector.push(result)
								$scope.finalcollector.idArr.push(result.id);

								$scope.finalcollector.savSpotArr.push('spotify:track:'+result.id);
								$scope.location_arr.push(result.artist_location.location +'@@'+result.artist_location.latitude + ':' + result.artist_location.longitude+'&&<h5>'+result.name+'</h5><p>'+result.artists[0].name+'</p><a href="spotify:track:'+result.id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+result.artist_location.location.replace(', ' , '*').split(',')[0]+'/'+result.artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
							}

							Favorites.checkFavorites(result);
							$scope.finalcollector.artistlocation =result.artist_location.location;
							if(isNaN(result.artist_location.latitude)==false && isNaN(result.artist_location.longitude)==false)
							{
							$scope.finalcollector.artistlocations.latitude.push(parseFloat(result.artist_location.latitude));
							$scope.finalcollector.artistlocations.longitude.push(parseFloat(result.artist_location.longitude));
							$scope.finalcollector.artistlocations.latitude.sort();
							$scope.finalcollector.artistlocations.longitude.sort();
							}

						if(lengthy==collector.length)
						{
							//$scope.finalcollector=$scope.finalcollector.removeDuplicatesArrObj('name', true)
							$scope.createMapAbout($scope.finalcollector, 0);
						}




						});
						}
					songStr+=resultNoDups[t].name;
					$rootScope.loading_tags=false;
					$scope.aboutShower=true;

				}


		}


	};

	$scope.createMapAbout=function(arr, start_index)
	{
			$scope.finalcollector =arr;
			//$scope.finalcollector = $scope.finalcollector.removeDuplicatesArrObj('name',true);
			if($scope.finalcollector.length==0)
			{
				$scope.showCityMessage=true;
			}

			else if($scope.finalcollector.length>15)
				{

				$scope.lookUpSongs=$scope.finalcollector.slice(start_index,start_index+$scope.iterator);
				$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr.slice(start_index,start_index+$scope.iterator);
				$scope.idArr=$scope.finalcollector.idArr.slice($scope.start_index,$scope.iterator);
				$scope.finalcollector.location_arr=$scope.location_arr
				$rootScope.idArr_arr = $scope.idArr.slice(0, $scope.iterator);
				$rootScope.lookUpSongs_arr = $scope.finalcollector.slice(start_index,start_index+$scope.iterator);
				$rootScope.finalcollector_arr = $scope.finalcollector;
				//$scope.finalcollector.idStr=$scope.finalcollector.idArr.toString();
				$rootScope.moreLookUp=true;
				$scope.prevLookUp=false;
				}
				else{
				$scope.lookUpSongs=$scope.finalcollector;
				$rootScope.lookUpSongs_arr = $scope.lookUpSongs;
				$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr;
				$rootScope.finalcollector_arr = $scope.finalcollector
				$scope.idArr=$scope.finalcollector.idArr
				$rootScope.idArr_arr = $scope.finalcollector.idArr;
				$scope.finalcollector.location_arr = $scope.location_arr;
				$scope.finalcollector.idStr=$scope.finalcollector.idArr.toString();
				$rootScope.moreLookUp=false;
				}
			for(var x=0; x<$scope.lookUpSongs.length; x++)
				{
					$scope.lookUpSongs[x].num_id=x;
				}

			$scope.lookUpSongs.idStr =  $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.idArr.toString());
			$rootScope.lookUpSongs_arr.idStr =  $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$rootScope.idArr_arr.toString());
			$scope.finalcollector.artistlocations.longitude.sort();
			$scope.finalcollector.artistlocations.latitude.sort();

			var lat_range =Math.abs($scope.finalcollector.artistlocations.latitude[$scope.finalcollector.artistlocations.latitude.length-1]-$scope.finalcollector.artistlocations.latitude[0]);
			var lng_range = Math.abs($scope.finalcollector.artistlocations.longitude[$scope.finalcollector.artistlocations.longitude.length-2]-$scope.finalcollector.artistlocations.longitude[0]);
			var lat_avg = ($scope.finalcollector.artistlocations.latitude[$scope.finalcollector.artistlocations.latitude.length-1]+$scope.finalcollector.artistlocations.latitude[0])/2;
			var lng_avg=($scope.finalcollector.artistlocations.longitude[$scope.finalcollector.artistlocations.longitude.length-1]+$scope.finalcollector.artistlocations.longitude[0])/2
			if(lat_range>lng_range)
			{
				var finalRange=lat_range
			}
			else
			{
				var finalRange=lng_range;
			}
			$scope.zoom=Spotify.runRange(finalRange);


			Spotify.createLatLng($scope.finalcollector.location_arr,0, $scope.zoom,lat_avg, lng_avg, $scope.lookUpSongs).then(function(data){
				$rootScope.mapdata = data;
				LocationDataFetch.count=200000000000;
				$rootScope.loading_tags=false;
				$scope.showCityMessage=false;
				$rootScope.loading_tags=false;
			});


	};

	$scope.runNearbySearch=function(lat, lng, searchterm)
	{
		var deferred = $q.defer();

		var ratio = .3*$scope.nearBy;

			if($scope.nearBy<=5)
			{
			Spotify.createCities(lat, lng, ratio).then(function(data){


					var arr=[];
					if(data.length>0)
					{
						if(data.length<=2)
						{
							var lengthy=data.length;
						}
						else{
							var lengthy=3;
						}
						for(var y=0; y<lengthy; y++)
   						{

							$scope.runUserSearch(data[y].city, 10, 'yes', 'user');
							$scope.nearBy=5;
						}
				}
				else if(data.length==0 && $scope.nearBy<=5)
				{
					$scope.nearBy++;
					$scope.runNearbySearch(lat,lng,searchterm);
				}
				 if ($scope.nearBy==6){
					$scope.countRunUserSearch++;
					$scope.runCitySearch(searchterm);
				}
			});
			}

	};
	$scope.runCitySearch = function(searchterm)
	{
		$scope.countRunUserSearch++;
		$scope.runUserSearch(searchterm.split(',')[0], 15, 'yes', '')	;
	};
	$scope.runCityStateSearch = function(searchterm)
	{
		$scope.countRunUserSearch++;
		$scope.runUserSearch(searchterm, 30, 'no', '')
	};
	$scope.removeSong = function(id, about_or_from) {
		$scope.spot_arr = [];
		////*****************************Add leaveOuts to LS so songs do not come back after reload of app///******************************************
		if (about_or_from == 'from') {
			for (var i = 0; i < $rootScope.songs.spotify_info.length; i++) {

				if (id == $rootScope.songs.spotify_info[i].id) {

					$rootScope.songs.spotify_info[i].closeButton = true;
					$scope.leaveOut.push($rootScope.songs.spotify_info[i].id);
					var existingLeaveOut = JSON.parse(localStorage.getItem("leaveOutArr"));
					if (existingLeaveOut == null)
						existingLeaveOut = [];
						var item = {
						title : $rootScope.songs.spotify_info[i].name,
						id : $rootScope.songs.spotify_info[i].id

					};

					localStorage.setItem("leaveOut", JSON.stringify(item));
					// Save allEntries back to local storage
					existingLeaveOut.push(item);
					localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));

				} else if (!$scope.leaveOut.toString().replace(/\W/g, '').match($rootScope.songs.spotify_info[i].id.replace(/\W/g, ''))) {

					$scope.spot_arr.push($rootScope.songs.spotify_info[i].id);

				}

			}
		 }
		else {
		// 	$scope.lookUpSongs.idArr=[];
		// 	for (var i = 0; i < $scope.lookUpSongs.length; i++) {
		//
		// 		if (id == $scope.lookUpSongs[i].id) {
		// 			$scope.lookUpSongs[i].closeButton = true;
		// 			$scope.leaveOut.push($scope.lookUpSongs[i].id);
		//
		// 			var existingLeaveOut = JSON.parse(localStorage.getItem("leaveOutArr"));
		// 			if (existingLeaveOut == null)
		// 				existingLeaveOut = [];
		// 			var item = {
		// 				song : $scope.lookUpSongs[i].name,
		// 				id : $scope.lookUpSongs[i].id
		// 			};
		//
		// 			localStorage.setItem("leaveOut", JSON.stringify(item));
		// 			// Save allEntries back to local storage
		// 			existingLeaveOut.push(item);
		// 			localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));
		//
		// 		} else {
		// 			//$scope.spot_arr.push($scope.lookUpSongs[i].id);
		// 			$scope.lookUpSongs.idArr.push($scope.lookUpSongs[i].id)
		//
		// 		}
		//
		//
		//
		// 	}

			////$scope.parseSongData($scope.finalcollector, 'no', 'no')
		}
		$scope.lookUpSongs.idStr = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.lookUpSongs.idArr.toString();
		$scope.lookUpSongs.idStr = $sce.trustAsResourceUrl($scope.lookUpSongs.idStr);

	};

	$scope.switchFavorite = function(id, num_id, about_or_from) {
		var songId = [];
		if (localStorage.getItem('FavoriteArr') !== null && localStorage.getItem('FavoriteArr') !== '') {
			var songFav = jQuery.parseJSON(localStorage.FavoriteArr);

		} else {
			var songFav = [];
		}

		if (about_or_from == 'from') {

			if ($rootScope.songs.tracks[num_id].favorite === 'off') {
				$rootScope.songs.tracks[num_id].favorite = 'on';
				songFav.push($rootScope.songs.tracks[num_id]);
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				//$scope.favorites = Favorites.addFavorites();
			}
			else {
				for (var x = 0; x < songFav.length; x++) {
					songId.push(songFav[x].id);
				}

				var index = songId.indexOf($rootScope.songs.tracks[num_id].id);
				songFav.splice(index, 1);
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				$rootScope.songs.tracks[num_id].favorite = 'off';
			}
		}
		//else if(about_or_from=='about')
		// {
		// 	if ($scope.lookUpSongs[num_id].favorite == 'off') {
		// 		if(id= $scope.lookUpSongs[num_id].id)
		// 		$scope.lookUpSongs[num_id].favorite = 'on';
		// 		songFav.push($scope.lookUpSongs[num_id]);
		//
		// 		localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
		// 		$scope.favorites = Favorites.addFavorites();
		// 	}
		// 	else {
		// 		for (var x = 0; x < songFav.length; x++) {
		// 			songId.push(songFav[x].id);
		// 		}
		// 	var index = songId.indexOf($scope.songs[num_id].id);
		//
		// 	songFav.splice(index, 1);
		// 	localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
		// 	$scope.lookUpSongs[num_id].favorite = 'off';
		// 	}
		//
		//
		//
		// }

	};

	$scope.goBack = function() {
		if($scope.location!=undefined)
		{
		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
		}
		else{
			$location.path('map/');
		runSymbolChange.changeSymbol();
		}
	};
	$scope.infiniteTest = function(){
		console.log('test')
	}

	$scope.moreSongs = function() {
		$scope.start_number=$scope.start_number+50;
		$scope.btnCount++
		var index1 = ($scope.btnCount*20);
			if(($scope.btnCount*20)+20<$scope.holder_arr.length)
			{
			var index2 = ($scope.btnCount*20)+20;
			}
			else{
				var index2 = $scope.holder_arr.length;
			}
		if(($scope.holder_arr.length-$scope.btnCount*20)>1 )
		{
			Spotify.createPlaylist($scope.holder_arr).then(function(result) {

						$scope.songs = result.songs.slice(index1, index2)
						$scope.songs.forEach(function(song){
							var i=$scope.songs.indexOf(song)
							song.num_id=i;
						});
						$scope.songs.spot_arr = result.spot_arr.slice(index1, index2)
						artistlocation = result.artistlocation.slice(index1, index2)
						$scope.songs.location_arr = result.location_arr.slice(index1, index2)
						$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
						$rootScope.songs_root = $scope.songs;
						Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
						LocationDataFetch.count=1;
						$rootScope.mapdata = data;
						$scope.stillLooking = false;
						$rootScope.loading=false;
						$rootScope.mapOpening=false;
						$scope.checkForMore=true;

						});

					},function(error){
						$scope.errorMessage = true;
					});


		}


		else if($scope.checkForMore==true&&$scope.btnCount<10)
		{
			LocationDataFetch.count=0;
			$rootScope.loading=true;
			if(!$rootScope.songs)
			{
				$scope.runApp();
			}

		}
		else{
			$scope.moreHider=true;
			$scope.noMoreSongs = true;
		}

		goToByScrollTop('spot_holder');
	};
	$scope.backSongs = function()
	{

		$scope.moreHider=false;
		$scope.noMoreSongs = false;

		var index1 = ($scope.btnCount*20)-20;
		var index2 = ($scope.btnCount*20);
		Spotify.createPlaylist($scope.holder_arr).then(function(result) {

			$scope.songs = result.songs.slice(index1, index2)
			$scope.songs.spot_arr = result.spot_arr.slice(index1, index2)
			//$scope.songs.savSpotArr = result.savSpotArr.slice(index1, index2)
			artistlocation = result.artistlocation.slice(index1, index2)
			$scope.songs.location_arr = result.location_arr.slice(index1, index2)
			$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
			$rootScope.songs_root = $scope.songs;

				Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
				LocationDataFetch.count=1;
				$rootScope.mapdata = data;
				$scope.stillLooking = false;
				$rootScope.loading=false;
				$rootScope.mapOpening=false;
				$scope.checkForMore=true;
				});
				$scope.btnCount--;
		},function(error){
			$scope.errorMessage = true;
		});
	};

	$scope.moreSongsAbout=function(iterator)
	{


		$scope.number=$scope.number+1;
		if(($scope.number*iterator)+iterator<$scope.finalcollector.length)
		{
		$scope.prevLookUp=true;
		$scope.end_index = ($scope.number*iterator)+iterator;
		$scope.start_index = $scope.start_index+iterator;
		$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index);
		$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr.slice($scope.start_index, $scope.end_index);
		$scope.lookUpSongs.idStr="";
			for(var x=0; x<$scope.lookUpSongs.length; x++)
			{
				$scope.lookUpSongs.idStr+=$scope.lookUpSongs[x].id+',';
				$scope.lookUpSongs[x].num_id=x;

			}
			$scope.lookUpSongs.idStr= $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.lookUpSongs.idStr);
		}

		else
		{

			$scope.prevLookUp=true;
			$scope.end_index = $scope.finalcollector.length;
			$scope.start_index = $scope.start_index+iterator;
			$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index);
			$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr.slice($scope.start_index, $scope.end_index);
			$scope.lookUpSongs.idStr="";
			for(var x=0; x<$scope.lookUpSongs.length; x++)
			{
				$scope.lookUpSongs.idStr+=$scope.lookUpSongs[x].id+',';
				$scope.lookUpSongs[x].num_id=x

			}
			$scope.lookUpSongs.idStr= $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.lookUpSongs.idStr);
			$scope.moreLookUp=false;
		}
		goToByScrollTop('spot_holder');


	};
	$scope.prevSongsAbout=function(iterator)
	{
		$scope.number=$scope.number-1;

		if($scope.number>=0)
		{

		$scope.end_index = ($scope.number*iterator)+iterator;

		$scope.start_index = $scope.end_index-iterator;
		$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index);
		$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr.slice($scope.start_index, $scope.end_index)
		$scope.lookUpSongs.idStr="";
			for(var x=0; x<$scope.lookUpSongs.length; x++)
			{
				$scope.lookUpSongs.idStr+=$scope.lookUpSongs[x].id+',';

			}
			$scope.lookUpSongs.idStr= $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.lookUpSongs.idStr);
			if($scope.number==0)
			{
				$scope.prevLookUp=false;
			}
			if(($scope.number*iterator)+iterator<$scope.finalcollector.length)
			{
			$scope.moreLookUp=true;
			$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index)
			$scope.lookUpSongs.savSpotArr = $scope.finalcollector.savSpotArr.slice($scope.start_index, $scope.end_index);
			$scope.lookUpSongs.idStr="";
			for(var x=0; x<$scope.lookUpSongs.length; x++)
			{
				$scope.lookUpSongs.idStr+=$scope.lookUpSongs[x].id+',';

			}
			$scope.lookUpSongs.idStr= $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.lookUpSongs.idStr);
			}
		}
		goToByScrollTop('spot_holder');


	};
	///////////////Start here............///////////////
//	$scope.getSongs = function(songs) {
		// var deferred = $q.defer();
		// if(songs[0].artist_location==undefined)
		// 	{
		// 	var location = $routeParams.location;
		// 	var str='';
		// 	songs[0].artist_location = {};
		//
		// 	retrieveLocation.runLocation(location.replace(/_/g,' '), 'lat', counter).then(function(result){
		//
		// 		songs[0].artist_location.latitude = result.latitude;
		// 		retrieveLocation.runLocation(location.replace(/_/g,' '), 'long', counter).then(function(result)
		// 			{
		//
		// 				songs[0].artist_location.longitude = result.longitude;
		//
		//
		// 				for(var x=1; x<songs.length; x++)
		// 				{
		// 					songs[x].artist_location={};
		// 					songs[x].artist_location.latitude = songs[0].artist_location.latitude;
		// 					songs[x].artist_location.longitude = songs[0].artist_location.longitude;
		// 				}
		//
		//
		// 				ShareSongs.getSongs(songs, $routeParams.location).then(function(url){
		// 					ShareSongs.getLongURL(url).then(function(result) {
		// 						$scope.long_url = result;
		// 						ShareSongs.getBitLy($scope.long_url).then(function(result) {
		//
		// 							$scope.short_url = result;
		//
		// 							$scope.shareBox = true;
		//
		// 							$scope.message = 'Check out my playlist from @MusicWhereYouR, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
		// 							$scope.message_link = encodeURIComponent($scope.message);
		// 						},function(error){
		// 						$scope.errorMessage = true;
		// 						});
		//
		// 					},function(error){
		// 					$scope.errorMessage = true;
		// 					});
		// 				},function(error){
		// 				$scope.errorMessage = true;
		// 				});
		// 			},function(error){
		// 			$scope.errorMessage = true;
		// 			});
		// 		},function(error){
		// 		$scope.errorMessage = true;
		// 		});
		// 	}
		// 	else
		// 	{
		// 	ShareSongs.getSongs(songs, $routeParams.location).then(function(url){;
		//
		// 		ShareSongs.getLongURL(url).then(function(result) {
		//
		// 			$scope.long_url = result.url;
		// 			if(result.sliced=='yes')
		// 			{
		// 				$scope.tooMany=true;
		//
		// 			}
		//
		// 			ShareSongs.getBitLy($scope.long_url).then(function(result) {
		//
		// 				$scope.short_url = result;
		//
		// 				$scope.shareBox = true;
		//
		// 				$scope.message = 'Check out my playlist from @MusicWhereYouR, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
		// 				$scope.message_link = encodeURIComponent($scope.message);
		// 			},function(error){
		// 			$scope.errorMessage = true;
		// 			});
		//
		// 		},function(error){
		// 		$scope.errorMessage = true;
		// 		});
		// 	},function(error){
		// 		$scope.errorMessage = true;
		// 	});
		// }
	//};

	$scope.changeClass = function(obj) {
		//$scope.location = $location.path().split('/')[2];
		for (var i = 0; i < $scope.sm_btns.length; i++) {
			$scope.sm_btns[i].state = 'off';
			$scope.sm_btns[i].classy = 'hider';
			if ($scope.sm_btns[i].name == obj.name) {
				$scope.sm_btns[i].state = 'on';
				$scope.sm_btns[i].classy = 'shower'
			} else {

				$scope.sm_btns[i].state = 'off';
				$scope.sm_btns[i].classy = 'hider';
			}
		}

	};

	$scope.buttons = [{
		name : 'artists',
		state : 'shower',
		classy : 'button_on'
	}, {
		name : 'songs',
		state : 'hider',
		classy : 'button_off'
	}];

	//$scope.noPickedGenre = false;
	$scope.runButtons = function(id) {
		if(id=="artists")
		{
			$scope.fromShower=true;
			$scope.aboutShower=false;
			$scope.shareBox=false;

		}
		else if (id=="songs")
		{

			$scope.fromShower=false;
			$scope.aboutShower=true;
			$scope.shareBox=false;

		}
		for (var c = 0; c < $scope.buttons.length; c++) {
			if ($scope.buttons[c].name == id) {
				$scope.buttons[c].state = 'shower';
				$scope.buttons[c].classy = 'button_on';

			} else {
				$scope.buttons[c].state = 'hider'
				$scope.buttons[c].classy = 'button_off';
			}

		}

	};
	$scope.detectDevice = function()
	{

		if(deviceDetector.device=="android" || deviceDetector.device=="ipad" || deviceDetector.device=="iphone" || deviceDetector.device=='kindle')
		{
			$scope.spot_iframe_hider =true;
		} else {
		$scope.spot_iframe_hider=false;
		}
	}

	if ($routeParams.location == undefined) {
		$rootScope.loading = true;
		//$scope.location = 'Finding your location...';
		getLocation.checkGeoLocation();

	} else {
		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
		$scope.location_link = $routeParams.location;
		$scope.tagsArr = [];
		$scope.wikiTags = [];
		$rootScope.spot_results = [];
		$rootScope.noSongs = false;
		$scope.latitudeObj = {};
		$scope.longitudeObj = {};
		$scope.sharer = false;
		$scope.shareBox = false;
		$scope.sm_btns = [{
			name : 'facebook',
			state : 'on',
			classy : 'shower'
		}, {
			name : 'twitter',
			state : 'off',
			classy : 'hider'
		}, {
			name : 'googleplus',
			state : 'off',
			classy : 'hider'
		}];
		var id_str = '';
		$scope.leaveOut = [];

		var location_comp = $routeParams.location;
		if(!$rootScope.songs) //|| (location_comp && $rootScope.songs.location !== location_comp ) )
		{ 
			$scope.runApp();
		} else {
			Favorites.checkFavorites($rootScope.songs.tracks);
		}




	}
	$scope.detectDevice();

	$scope.minus = function(x, y){
		$scope.x=10;
		$scope.y=1;
		$scope.z=$scope.x-$scope.y;
	};

}]).controller('PostController',['$scope', '$http', function($scope, $http){

	$scope.runPost=function(data)
	{
		$http.post('php/result.php', data.holder_arr).success(function(response) {
			$scope.response = response;
			console.log($scope.response)
		 });
	};


}]);
Playlist.controller('Spotify', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams',
function($scope, $location, $rootScope, runSymbolChange, $routeParams) {
	$scope.songs_arr = [];

	$scope.SavePlaylist = function(arr, title) {
		var title = 'MusicWYA: ' + title;
		var client_id = '';
		var redirect_uri = '';
		if (window.location.href.match('localhost:8000')) {

			client_id = '59a6ff9db9a642c6adfd2ee2fd33a30f';
			redirect_uri = 'http://localhost:8000/callback.html';
		} else {
			client_id = '70521c59988a4ff4afa24aabc182b94a';
			redirect_uri = 'http://musicwhereyour.com/callback.html';
		}

		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id + '&response_type=token' + '&scope=playlist-modify-private' + '&redirect_uri=' + encodeURIComponent(redirect_uri);

		localStorage.setItem('createplaylist-tracks', JSON.stringify(arr));
		localStorage.setItem('createplaylist-name', title);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	}
}]);

function runAuthorization() {
	const client_id = '2816af78ef834a668eab78a86ec8b4e6',
		scope = 'playlist-modify-private playlist-modify-public',
		//TODO: Create Session Storage Service
		hash = window.location.hash;
		sessionStorage.setItem('city', hash);
		let http = '';
	if(window.location.hostname === 'localhost')
	{
		http = `http://localhost:8000/index.html`;
	} else {
		http = `https://musicwhereyour.com/`;
	}

	const authorization_url = `https://accounts.spotify.com/en/authorize?response_type=token&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${http}`;
	window.open(authorization_url, '_self');
}
