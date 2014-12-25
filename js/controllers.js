/* Controllers */

angular.module('UI-Loader', []).controller('Geolocate', ['$scope', '$window', '$http', '$sce', 'getLocation', '$rootScope', '$q', '$routeParams',
function($scope, $window, $http, $sce, getLocation, $q, $rootScope, $routeParams) {

	if ($('#map-canvas').html().match('loading.gif"') || window.location.hash.split('/') < 2) {
		$rootScope.noSongs = false;

		getLocation.checkGeoLocation();

	}

}]);

angular.module('Forms', []).controller('formController', ['$scope', '$rootScope', 'retrieveLocation', 'getLocation', '$q', 'HashCreate', '$location', 'HintShower', '$timeout', 'States', '$routeParams',
function($scope, $rootScope, retrieveLocation, getLocation, $q, HashCreate, $location, HintShower, $timeout, States, $routeParams) {

	$rootScope.showHint = false;
	
	var count = 0;
	count2 = 0;
	$scope.hintShower = function(location) {
		count = count + 1;

		$timeout(function() {
			count2 = count2 + 1;
			if (count2 == count) {

				HintShower.showHint($scope.type_location).then(function(result) {
					if (result != undefined) {
						$rootScope.showHint = true;
						$scope.hints = result.finalArr;
						$scope.finalHints = [];

						var city_str = '';
						var state_str = '';
						for (var i = 0; i < $scope.hints.length; i++) {
							if (!state_str.replace(/\W/g, '').match($scope.hints[i].state.replace(/\W/g, ''))) {
								$scope.finalHints.push($scope.hints[i]);
							}

							city_str += $scope.hints[i].city;
							state_str += $scope.hints[i].state;

						}
					}
				});
			}
		}, 300);
		$scope.location_ = location;
		if (toTitleCase($scope.location_).match('St.')) {
			$scope.location_ = $scope.location_.replace('St.', 'Saint');
		}
		if (toTitleCase($scope.location_).match('New York')) {
			$scope.location_ = $scope.location_.replace('New York,', 'New York City,');
		}
		$scope.type_location = $scope.location_.split(', ');

	};

	$scope.controlForm = function(location) {
		var states = States.createStateObj();
		$scope.location = location;
		$scope.genres = '';
		if ($scope.location == null || $scope.location == "") {
			var deferred_loc = $q.defer();
			getLocation.checkGeoLocation();
		} else {
			$location.path('map/' + $scope.location.replace(', ', '*'))
		};

	};
	$scope.closeHint = function() {

		

		$rootScope.showHint = false;
		$scope.location = ''
	};

}]).controller('hashedLocation', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs','getLocation',
function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, MapCreate, States, $sce, Favorites, ShareSongs,getLocation) {

	$scope.loading=true;
	$scope.sharer =false;
	$scope.shareBox=false;
	
	//$rootScope.removeOut=[];
	
	
	$scope.runCycle = function(start_number, counter) {
		//$scope.sharer =false;
	$scope.shareBox=false;
		if ($routeParams.location.split('*').length > 1) {
			$scope.zoom = 10;

		} else {
			$scope.zoom = 6;
		}
		

		$scope.start_number = start_number;
		$scope.ratio = .05 * counter

		$scope.counter = counter;
		if (LocationDataFetch.count == 0) {
			$rootScope.mapOpening = true;

			retrieveLocation.runLocation(replacePatterns(location_comp), 'lat', $scope.ratio).then(function(data) {

				$scope.latitudeObj = data;
				$rootScope.latitudeObj_root = data;

				//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
				$scope.latitude = $scope.latitudeObj.latitude;
				retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {

					$rootScope.longitudeObj_root = {};
					$scope.longitudeObj = data;
					$rootScope.longitudeObj_root = data;

					$scope.longitude = $scope.longitudeObj.longitude;
					$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
					//console.log($scope.geolcication);
					//console.log(jQuery.parseJSON(localStorage.FavoriteArr));
					
					////
					if ($routeParams.qs == undefined) {
						$scope.sharer=false;
						$scope.shareBox=false;
						PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, '0', $rootScope.genres, $rootScope.era, start_number).then(function(data) {
							$rootScope.songs_root = {};
							$scope.songs = data.data.response.songs;
							$scope.loading=false;
							
							for(var z=0; z<$scope.songs.length; z++)
				 	 		{
				 	 			$scope.songs[z].favorite = 'off';
				 	 			Favorites.checkFavorites($scope.songs[z]);	
				 	 		}
				 	 		
							//$scope.songs.spot_str='';
							//Favorites.runFavorites($scope.songs);
							$rootScope.songs_root =$scope.songs;

							///

							if ($scope.songs.spot_arr.length < 1) {
								$scope.counter = $scope.counter + 1;

								if ($scope.counter <= 5) {

									LocationDataFetch.count = 0;
									$scope.runCycle(0, $scope.counter);

								} else {
									$rootScope.noSongs = true;
								}
							} else {
								MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs.final_loc_arr, $scope.songs.spot_arr);
								$rootScope.mapOpening = false;
							}
						});
					} else {
						ShareSongs.createSongsList().then(function(result) {
							$scope.sharer=true;
							$scope.shareBox=false;
							
							$scope.songs = result;
							$scope.songs.pop();
							$scope.loading=false;
							for(var b=0; b<$scope.songs.length; b++)
							{
								$scope.songs[b].num_id=b;
								$scope.songs[b].favorite='off'
								Favorites.checkFavorites($scope.songs[b]);	
							}
							
							
							$rootScope.songs_root =$scope.songs;
							
						
							MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs.final_loc_arr, $scope.songs.spot_arr);
							$rootScope.mapOpening = false;
							LocationDataFetch.count =0;
							//Favorites.runFavorites($scope.songs);
						});
					}
					
				});

			});

		} else if (location_comp.replace('*', ', ').replace(/_/g, ' ').toLowerCase() != $rootScope.longitudeObj_root.location.replace(/_/g, ' ').toLowerCase() && locationdatacount != 0) {

			LocationDataFetch.count = 0;
			$rootScope.latitudeObj_root.location = $routeParams.location.replace('*', ' ');
			$rootScope.era = '';
			$rootScope.start_year = '';
			$rootScope.end_year = '';
			$scope.runCycle(0, 1);

		} else if (LocationDataFetch.count > 0) {

			$scope.shareBox=false;
			$scope.latitudeObj = {};
			$scope.longitudeObj = {};
			$scope.songs = {};

			$scope.latitudeObj = $rootScope.latitudeObj_root;
			$scope.longitudeObj = $rootScope.longitudeObj_root;
			$scope.songs = $rootScope.songs_root;
				
		
			
			for(var zz=0; zz<$scope.songs.length; zz++)
			{
				$scope.songs[zz].favorite='off';
				
				Favorites.checkFavorites($scope.songs[zz]);	
			}
			$scope.loading=false;
			
		}
		locationdatacount = LocationDataFetch.count += 1;
	};

	$scope.icons = $rootScope.icons;
	runSymbolChange.changeSymbol();
	
	$scope.song_str = '';
	$rootScope.showHint = false;

	$scope.removeSong = function(id) {
		$scope.spot_arr = [];

		////*****************************Add leaveOuts to LS so songs do not come back after reload of app///******************************************

		for (var i = 0; i < $scope.songs.length; i++) {

			if (id == $scope.songs[i].tracks[0].foreign_id.split(':')[2]) {

				$scope.songs[i].closeButton = true;
				$scope.leaveOut.push($scope.songs[i].tracks[0].foreign_id.split(':')[2]);
				var existingLeaveOut = JSON.parse(localStorage.getItem("leaveOutArr"));
				if (existingLeaveOut == null)
					existingLeaveOut = [];
				var item = {
					song : $scope.songs[i].title,
					id : $scope.songs[i].tracks[0].foreign_id.split(':')[2]
				};

				localStorage.setItem("leaveOut", JSON.stringify(item));
				// Save allEntries back to local storage
				existingLeaveOut.push(item);
				localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));

			} else if (!$scope.leaveOut.toString().replace(/\W/g, '').match($scope.songs[i].tracks[0].foreign_id.split(':')[2].replace(/\W/g, ''))) {

				$scope.spot_arr.push($scope.songs[i].tracks[0].foreign_id.split(':')[2]);

			}

			$scope.runCycle(0, 1);

		}
		//console.log($scope.spot_arr.length);
		$scope.songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
		$scope.songs.spot_str = $sce.trustAsResourceUrl($scope.songs.spot_str);

	};

	$scope.switchFavorite = function(id) {
		//$scope.favoritesArr=[];
		
		var songId=[];
		if(localStorage.getItem('FavoriteArr')!=null && localStorage.getItem('FavoriteArr')!='')
		{
			var songFav = jQuery.parseJSON(localStorage.FavoriteArr);
		
		}
		else
		{
			var songFav=[]; 
		}
		
		//console.log(jQuery.parseJSON(localStorage.FavoriteArr));		
		
		if($scope.songs[id].favorite=='off')
			{
				
				$scope.songs[id].favorite='on';
				songFav.push( $scope.songs[id]);
				
				localStorage.setItem('FavoriteArr',  JSON.stringify(songFav));
				$scope.favorites = Favorites.addFavorites();
				
			}
			else{
				for(var x=0; x<songFav.length; x++)
				{
					songId.push(songFav[x].tracks[0].foreign_id.split(':')[2]);
				}
				var index=songId.indexOf($scope.songs[id].tracks[0].foreign_id.split(':')[2]);
				songFav.splice(index, 1);
				localStorage.setItem('FavoriteArr',  JSON.stringify(songFav));
				$scope.songs[id].favorite='off';
				

			}
		
		
		
			

	

	};

	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

	$scope.moreSongs = function(number) {
		//var fav = jquery.parseJSON(localStorage.getItem('FavoriteArr'));

		LocationDataFetch.count = 0;
		$scope.runCycle(number, 1);
		goToByScrollTop('spot_holder');
		//localStorage.setItem('FavoriteArr', fav);
		//Favorites.runFavorites($scope.songs);

	};

	$scope.getSongs = function() {

		
		var url = ShareSongs.getSongs($scope.songs, $routeParams.location);
		//=url =url.replace(' ', '');
		
		ShareSongs.getLongURL(url).then(function(result){
			$scope.long_url = result;
			ShareSongs.getBitLy($scope.long_url).then(function(result)
			{
				
				console.log($scope.message);
				$scope.short_url=result;
				$scope.shareBox=true;
				$scope.message='Check out my playlist from %23MusicWhereYouAre, a geolocation-based music discovery app. Hows the music where you are? '+$scope.short_url
				$scope.message_link=encodeURIComponent($scope.message);
				});
			
		});

		
	
		

	};
	
	$scope.changeClass = function(obj) {
		//$scope.location = $location.path().split('/')[2];
		for (var i = 0; i < $scope.sm_btns.length; i++) {
			$scope.sm_btns[i].state='off';
			$scope.sm_btns[i].classy='hider';
			if ( $scope.sm_btns[i].name == obj.name) {
				console.log($scope.sm_btns[i].name)
				 $scope.sm_btns[i].state = 'on';
				 $scope.sm_btns[i].classy = 'shower'
			} else {

				 $scope.sm_btns[i].state = 'off';
				 $scope.sm_btns[i].classy = 'hider';
			}
		}
		
	};

	if($routeParams.location==undefined)
	{
	$scope.loading=true;
	$scope.location = 'Finding your location...';
	getLocation.checkGeoLocation()
		
	
	
	}
	else{
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	
	$rootScope.noSongs = false;
	$scope.latitudeObj = {};
	$scope.longitudeObj = {};
	$scope.sharer =false;
	$scope.shareBox=false;
	$scope.sm_btns = [{name:'facebook', state:'on', classy:'shower'}, {name:'twitter', state:'off', classy:'hider'}, {name: 'googleplus', state:'off', classy:'hider'}];
	var id_str = '';
	$scope.leaveOut = [];
	$scope.location = $routeParams.location.replace(/\*/g, ', ');
	$scope.location_link = $routeParams.location;

	/////compare a $rootScope location variable to routeParams.location + $rootScope.genres - if locations don't equal and genres do equal re-run retrieve, else nothing/
	var locationdatacount = LocationDataFetch.count;
	//$rootScope.locationdata = $rootScope.latitudeObj_root.location;
	var location_comp = $routeParams.location;
	if (location_comp.length == 2) {
		var states = States.createStateObj();
		for (var i = 0; i < states.length; i++) {
			if (location_comp.toLowerCase() == states[i].abbreviation.toLowerCase()) {
				location_comp = states[i].name;
			}
		}
	}

	$scope.runCycle(0, 1);
	Favorites.addFavorites();

	}
	
	
}]).controller('Spotify', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams',
function($scope, $location, $rootScope, runSymbolChange, $routeParams) {
	$scope.songs_arr = [];
	
	$scope.SavePlaylist = function(arr, title) {
		var title = 'MusicWYA: ' + title;
		var client_id = '';
		var redirect_uri = '';

		if (window.location.href.match('localhost:8888')) {

			client_id = '2816af78ef834a668eab78a86ec8b4e6';
			redirect_uri = 'http://localhost:8888/MusicWhereYouAre/app/callback.html';
		} else {
			client_id = '59a6ff9db9a642c6adfd2ee2fd33a30f';
			redirect_uri = 'http://cityblinking.com/MusicWhereYouAre/app/callback.html';
		}

		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id + '&response_type=token' + '&scope=playlist-modify-private' + '&redirect_uri=' + encodeURIComponent(redirect_uri);

		localStorage.setItem('createplaylist-tracks', JSON.stringify(arr));
		console.log(JSON.stringify(arr));
		localStorage.setItem('createplaylist-name', title);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	};
	//https://accounts.spotify.com/authorize?client_id=59a6ff9db9a642c6adfd2ee2fd33a30f&response_type=token&scope=playlist-modify-private&redirect_uri=http%3A%2F%2Fcityblinking.com%2FMusicWhereYouAre%2Fapp%2Fcallback.html
}]);

angular.module('Symbol', []).controller('controlSymbol', ['$scope', '$location', '$rootScope', 'runSymbolChange',
function($scope, $location, $rootScope, runSymbolChange) {

	$scope.location = $location.path().split('/')[2];
	$scope.hideIcons=false;
	//$scope.icons=runSymbolChange.addButtons()
	$scope.genre_class = {}
	$scope.playlist_class = {};
	$scope.favorite_class = {};
	$scope.map_class = {};
	$scope.jukebox_class = {};
	$scope.roadsoda_class = {};
	$scope.calendar_class = {}
	//$scope.menuPos=true;
	$scope.genre_class.name = 'genre';
	$scope.genre_class.classy = "iconequalizer12";
	$scope.genre_class.state = 'off';
	$scope.genre_class.href = '#/genres/' + $scope.location;

	$scope.playlist_class.name = 'playlist';
	$scope.playlist_class.classy = "icon-song";
	$scope.playlist_class.state = 'off';
	$scope.playlist_class.href = '#/playlist/' + $scope.location;

	$scope.favorite_class.name = 'favorite';
	$scope.favorite_class.classy = "iconfavorite";
	$scope.favorite_class.state = 'off';
	$scope.favorite_class.href = '#/favorites/' + $scope.location;

	$scope.map_class.name = 'map';
	$scope.map_class.classy = "iconmap";
	$scope.map_class.state = 'off';
	$scope.map_class.href = '#/map/' + $scope.location;

	$scope.jukebox_class.name = 'jukebox';
	$scope.jukebox_class.classy = "jukebox";
	$scope.jukebox_class.state = 'off';
	$scope.jukebox_class.href = '#/jukebox/' + $scope.location;

	$scope.roadsoda_class.name = 'roadsoda';
	$scope.roadsoda_class.classy = "roadsoda";
	$scope.roadsoda_class.state = 'off';
	$scope.roadsoda_class.href = '#/roadsoda/' + $scope.location;

	$scope.calendar_class.name = 'calendar';
	$scope.calendar_class.classy = "calendar";
	$scope.calendar_class.state = 'off';
	$scope.calendar_class.href = '#/calendar/' + $scope.location;

	$scope.icons = [$scope.genre_class, $scope.playlist_class, $scope.favorite_class, $scope.map_class, $scope.jukebox_class, $scope.calendar_class];
	$rootScope.icons = $scope.icons;
	runSymbolChange.changeSymbol();
	$scope.changeMenu = function() {
		if ($scope.menuPos == true) {

			$scope.menuPos = false;
		} else {

			$scope.menuPos = true;
			$location.path('map/' + $scope.location.replace(', ', '*'));
		}
	};
	$scope.changeClass = function(state, obj, classy, url, link) {
		$scope.location = $location.path().split('/')[2];
		var hashy = $location.path().split('/')[2];
		if (state == 'on') {
			obj.state = 'off';
			obj.href = '#/map/' + $scope.location;
		} else {
			obj.state = 'on';
			obj.href = '#/' + link + '/' + $scope.location;
		}
		for (var i = 0; i < $scope.icons.length; i++) {
			if ($scope.icons[i].name != obj.name) {
				$scope.icons[i].state = 'off';
			}

		};

	};
	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	$scope.toggleIcons = function()
	{
		
		if($scope.hideIcons==true)
		{
			$scope.hideIcons=false;
			
		}
		else{
			$scope.hideIcons=true;
		}
		
	};
}]);

angular.module('Info', []).controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo', 'retrieveLocation',
function($scope, $location, $rootScope, runSymbolChange, $routeParams, retrieveInfo, retrieveLocation) {
	$scope.loading=true;
	$scope.buttons = retrieveInfo.createObjects();
	$scope.buttonsArr = [$scope.buttons.bio, $scope.buttons.photos, $scope.buttons.videos, $scope.buttons.topsongs, $scope.buttons.news, $scope.buttons.related];
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	$scope.location_link = $routeParams.location;
	$scope.name = removeSpecialChar($routeParams.artist);
	$scope.artistdata = false;

	$scope.tabs = retrieveInfo.createObjects();

	retrieveInfo.infoRetrieve($scope.name).then(function(data) {

		$scope.artistinfo = data;
		$scope.artistinfo.bioCheck = true;
		$scope.artistinfo.photosCheck = true;
		$scope.artistinfo.newsCheck = true;
		$scope.artistinfo.videoCheck = true;
		if ($scope.artistinfo.bio.length == 0) {
			$scope.artistinfo.bioCheck = false;
		}
		if ($scope.artistinfo.video.length == 0) {
			$scope.artistinfo.videoCheck = false;
		}
		if ($scope.artistinfo.news.length == 0) {
			$scope.artistinfo.newsCheck = false;
		}
		if ($scope.artistinfo.images.length < 1) {
			$scope.artistinfo.photosCheck = false;
		}

		retrieveInfo.relatedRetrieve($scope.name).then(function(data) {
			$scope.relatedartists = data.data.response.artists;

		});

		$scope.artistdata = true;
		retrieveLocation.runLocation(replacePatterns($scope.location), $rootScope.genres);
		retrieveInfo.spotifyRetrieve($scope.name).then(function(data) {
		$scope.spotify = data.data;
		$scope.loading=false;

		});

	});

	$scope.changeClass = function(state, obj) {
		//$scope.location = $location.path().split('/')[2];

		for (var i = 0; i < $scope.buttonsArr.length; i++) {

			if ($scope.buttonsArr[i].name == obj.name) {
				$scope.buttonsArr[i].state = 'on';
				$scope.buttonsArr[i].classy = 'shower'
			} else {

				$scope.buttonsArr[i].state = 'off';
				$scope.buttonsArr[i].classy = 'hider';
			}
		}
		goToByScrollLeft('boxes')
	};

	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

}]);

angular.module('Genre', []).controller('GenreController', ['$scope', '$routeParams', 'retrieveLocation', 'LocationDataFetch', 'PlaylistCreate', 'MapCreate', '$location', '$rootScope', '$q', 'loadGenreCheckData', 'runSymbolChange',
function($scope, $routeParams, retrieveLocation, LocationDataFetch, PlaylistCreate, MapCreate, $location, $rootScope, $q, loadGenreCheckData, runSymbolChange) {

	///////////////////////Fix this; this is a mess.... Turn it into a service that can be called here and in the retrieve location controller/////////////////////////////

	$scope.buttons = [{
		name : 'genres',
		state : 'shower',
		classy : 'button_on'
	}, {
		name : 'eras',
		state : 'hider',
		classy : 'button_off'
	}, {
		name : 'moods',
		state : 'hider',
		classy : 'button_off'
	}]
	$scope.noPickedGenre = false;
	$scope.runButtons = function(id) {

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

	/////////////////////////Move this object to Services and bring it in? -- See TAS Project////////////////////////
	$scope.Genre = loadGenreCheckData.getGenre();
	$scope.avant_garde = $scope.Genre[0].genre;
	$scope.blues = $scope.Genre[1].genre;
	$scope.classic_rock = $scope.Genre[2].genre;
	$scope.classical = $scope.Genre[3].genre;
	$scope.comedy = $scope.Genre[4].genre;
	$scope.country = $scope.Genre[5].genre;
	$scope.drama = $scope.Genre[6].genre;
	$scope.electronic = $scope.Genre[7].genre;
	$scope.folk = $scope.Genre[8].genre;
	$scope.hip_hop = $scope.Genre[9].genre;
	$scope.holiday = $scope.Genre[10].genre;
	$scope.indie = $scope.Genre[11].genre;
	$scope.jazz = $scope.Genre[12].genre;
	$scope.kid_music = $scope.Genre[13].genre;
	$scope.latin = $scope.Genre[14].genre;
	$scope.new_age = $scope.Genre[15].genre;
	$scope.motown = $scope.Genre[16].genre;
	$scope.pop = $scope.Genre[17].genre;
	$scope.rock = $scope.Genre[18].genre;
	$scope.soft_rock = $scope.Genre[19].genre;
	$scope.world = $scope.Genre[20].genre;
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.genre_hash = '';

	$scope.Era = loadGenreCheckData.getEra();
	$scope.Era.twentyten = $scope.Era[0].era;
	$scope.Era.twenty = $scope.Era[1].era;
	$scope.Era.nineteenninty = $scope.Era[2].era;
	$scope.Era.nineteenteighty = $scope.Era[3].era;
	$scope.Era.nineteenseventy = $scope.Era[4].era;
	$scope.Era.nineteensixty = $scope.Era[5].era;
	$scope.Era.nineteenfifty = $scope.Era[6].era;
	$scope.Era.nineteenforty = $scope.Era[7].era;
	$scope.Era.nineteenthirty = $scope.Era[8].era;
	$scope.Era.nineteentwenty = $scope.Era[9].era;
	$scope.Era.nineteenten = $scope.Era[10].era;
	$scope.Era.nineteen = $scope.Era[11].era;
	$scope.Era.eighteenninty = $scope.Era[12].era;
	$scope.Era.eighteeneighty = $scope.Era[13].era;
	$scope.Era.eighteenseventy = $scope.Era[14].era;
	$scope.Era.eighteensixty = $scope.Era[15].era;
	$scope.range_message = false;
	$scope.selectera = false;
	$scope.selectmood = false;
	var d = new Date();
	$scope.d = d.getFullYear();

	if ($rootScope.start_year == '' || $rootScope.start_year == null) {
		$scope.start_year = 1890;
	}
	if ($rootScope.end_year == '' || $rootScope.end_year == null) {
		$scope.end_year = $scope.d;
	} else {
		$scope.end_year = $rootScope.end_year;
		$scope.start_year = $rootScope.start_year;
	}
	$scope.runApp = function(start_number, counter) {
		$rootScope.mapOpening = true;
		if ($routeParams.location.split('*').length > 1) {
			$scope.zoom = 10;

		} else {
			$scope.zoom = 6;
		}
		$scope.start_number = start_number;

		$scope.counter = counter;
		$scope.ratio = .05 * counter;

		retrieveLocation.runLocation(replacePatterns($scope.location), 'lat', $scope.ratio).then(function(data) {

			$scope.latitudeObj = data;
			$rootScope.latitudeObj_root = data;

			//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
			$scope.latitude = $scope.latitudeObj.latitude;
			retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
				$rootScope.longitudeObj_root = {};
				$scope.longitudeObj = data;
				$rootScope.longitudeObj_root = data;

				$scope.longitude = $scope.longitudeObj.longitude;
				$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];

				PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, '0', $rootScope.genres, $rootScope.era, start_number).then(function(data) {
					$rootScope.songs_root = {};
					$scope.songs = data.data.response.songs;
					
					$rootScope.songs_root = data.data.response.songs;
					if ($scope.songs.spot_arr.length < 1) {
						
						$scope.counter = $scope.counter + 1;

						if ($scope.counter <= 10) {

							$scope.runApp(0, $scope.counter);

						} else {
							$rootScope.noSongs = true;
						}
					} else {
						MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs.final_loc_arr, $scope.songs.spot_arr);
						$rootScope.mapOpening = false;
					}
				});

			});

		});

	};
	
	
	
	$scope.checkGenre = function(genre) {

		for (var x = 0; x < $scope.Genre.length; x++) {

			if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'off') {
				$scope.Genre[x].genre.state = 'on';
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
			} else if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'on') {
				$scope.Genre[x].genre.state = 'off';
				$rootScope.genres = '';
			} else if ($scope.Genre[x].genre.state == 'on') {
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
			}
		}
		if ($rootScope.genres == "") {
			$rootScope.genres = '****';
		}
		$scope.genre_str += $rootScope.genres;
		$scope.location = $scope.location.replace(/\*/g, ', ');

		$scope.runApp(0, 1);
		$scope.genre_hash = $location.path() + '/' + $rootScope.genres;
	};

	$scope.checkEra = function(start_year, end_year) {
		$scope.start_year = start_year;
		$scope.end_year = end_year;
		$rootScope.start_year = start_year;
		$rootScope.end_year = end_year;

		var d = new Date();
		$scope.d = d.getFullYear()
		if (start_year < end_year) {
			if (start_year == undefined) {
				$rootScope.era = '&aritist_end_year_before=' + end_year;
			} else if (end_year == undefined) {
				$rootScope.era = '&artist_start_year_after=' + start_year;
			} else if (end_year == '') {

				$rootScope.era = '&artist_start_year_after=' + start_year;
			} else if (start_year == '') {
				$rootScope.era = '&artist_end_year_before=' + end_year + '&artist_start_year_after=1890';
			} else if (end_year == $scope.d) {
				$rootScope.era = '&artist_start_year_after=' + start_year;
			} else {
				$rootScope.era = '&artist_end_year_before=' + end_year + '&artist_start_year_after=' + start_year;
			}
		} else {
			$scope.range_message = true;
		}
		console.log($rootScope.era);
		$scope.era_str += $rootScope.era;
		$scope.location = $scope.location.replace(/\*/g, ', ');

		$scope.runApp(0, 1);
		$scope.era_hash = $location.path() + '/' + $rootScope.genres;
	};

	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

	$scope.lookUpGenre = function(genre) {

		$scope.noPickedGenre = false
		loadGenreCheckData.loadEchonestStyles().then(function(result) {
			var availableGenres = result;
			availableGenres.push({name:'holiday'});
			var genreArr = [];

			//$rootScope.genres=''
			if (genre.match(', ')) {
				var genreArr = genre.split(', ');
			} else {
				genreArr = [genre];
			}
			for (var x = 0; x < availableGenres.length; x++) {
				for (var u = 0; u < genreArr.length; u++) {
					

					if (availableGenres[x].name.toLowerCase() == (genreArr[u].replace().toLowerCase())) {
						$rootScope.genres += '****' + genreArr[u];

						$scope.noPickedGenre = false;
						$scope.runApp(0, 1);
					}
					
				}
			}
			$rootScope.genresSans = $rootScope.genres.split('****');
			$rootScope.genresSans.shift();
			if ($rootScope.genres.length == 0) {
				$scope.noPickedGenre = true;
			}
		});

	};

	$scope.toggleGenre = function(genre) {
		//$rootScope.genres='';
		var index = $rootScope.genresSans.indexOf(genre);
		if (index > -1) {
			$rootScope.genresSans.splice(index, 1)
		}

		if ($rootScope.genresSans.length > 0) {
			for (var x = 0; x < $rootScope.genresSans.length; x++) {

				$rootScope.genres = '****' + $rootScope.genresSans[x];

			}
			$scope.runApp(0, 1);
		} else {
			$rootScope.genres = '';
			$scope.runApp(0, 1);
		}

	};

	for (var x = 0; x < $scope.Genre.length; x++) {
		$scope.Genre[x].genre.state = "off";

		for (var i = 0; i < $rootScope.genres.split('***').length; i++) {

			if ($rootScope.genres.split('***')[i].replace('*', '') == $scope.Genre[x].genre.similarGenres) {

				$scope.Genre[x].genre.checked = true;
				$scope.Genre[x].genre.isSelected = true;
				$scope.Genre[x].genre.state = "on";
			}
		}
	}

	if ($routeParams.genre !== undefined) {
		$rootScope.genres = $routeParams.genre;
	}
	//////////////////////////create Genre Service out of this function - run it in locationHash and here///////////////////
	if ($('#map-canvas').html().match('loading.gif"')) {
		$scope.runApp(0, 1);
	}
	runSymbolChange.changeSymbol();

}]);

var FavoritesControllers = angular.module('FavoritesControllers', [])
FavoritesControllers.controller('LoadFav', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Favorites', 'ShareSongs','getLocation',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Favorites, ShareSongs, getLocation) {
	var removeArr = [];
	
	$scope.sharer =false;
	$scope.shareBox=false;

	$scope.sm_btns = [{name:'facebook', state:'on', classy:'shower'}, {name:'twitter', state:'off', classy:'hider'}, {name: 'googleplus', state:'off', classy:'hider'}];
	$scope.location = $routeParams.location;
	$scope.leaveOut = [];
	$scope.d = new Date();
	$scope.date = $scope.d.getMonth() + '/' + $scope.d.getDate() + '/' + $scope.d.getFullYear();
	$scope.start_number=0;
	var ls_arr = jQuery.parseJSON(localStorage.FavoriteArr);
	$scope.moreHider=true;
	$scope.backHider=true;
	$scope.viewall=false;
	Favorites.addFavorites();
	
	
	$scope.runApp = function(start_number, counter) {
		if ($('#map-canvas').html().match('loading.gif')) {
			$rootScope.mapOpening = true;
			if ($routeParams != null) {
				if ($routeParams.location.split('*').length > 1) {
					$scope.zoom = 10;

				} else {
					$scope.zoom = 6;
				}
			} else {
				$scope.zoom = 6;
			}
			$scope.start_number = start_number;
			$scope.ratio = .05 * counter
			retrieveLocation.runLocation(replacePatterns($scope.location), 'lat', $scope.ratio).then(function(data) {

				$scope.latitudeObj = data;
				$rootScope.latitudeObj_root = data;
				$scope.latitude = $scope.latitudeObj.latitude;
				retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
					$rootScope.longitudeObj_root = {};
					$scope.longitudeObj = data;
					$rootScope.longitudeObj_root = data;

					$scope.longitude = $scope.longitudeObj.longitude;
					$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];

					PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, '0', $rootScope.genres, $rootScope.era, start_number).then(function(data) {
						//$rootScope.songs_fav = {};
						$scope.songs_playlist = data.data.response.songs;
						for(var x=0; x<0; x++)
						{
							$scope.songs_playlist.song_id=x;
						}
						$scope.moreSongs(0, 25);
						//$rootScope.songs_root = data.data.response.songs;
						if ($scope.songs_playlist.spot_arr.length == 0) {
							$rootScope.noSongs = true;
						} else {
							MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs_playlist.final_loc_arr, $scope.songs_playlist.spot_arr);
							$rootScope.mapOpening = false;
						}
					});

				});

			});
		}
	};

	$scope.switchFavorite = function(id) {
		//$scope.favoritesArr=[];
		
		var songId=[];
		if(localStorage.getItem('FavoriteArr')!=null && localStorage.getItem('FavoriteArr')!='')
		{
			var songFav = jQuery.parseJSON(localStorage.FavoriteArr);
		
		}
		else
		{
			var songFav=[]; 
		}
		
		//console.log(jQuery.parseJSON(localStorage.FavoriteArr));		
		
		if($scope.songs[id].favorite=='off')
			{
				
				$scope.songs[id].favorite='on';
				songFav.push( $scope.songs[id]);
				
				localStorage.setItem('FavoriteArr',  JSON.stringify(songFav));
				
				
			}
			else{
				for(var x=0; x<songFav.length; x++)
				{
					
					songId.push($scope.songs[id].tracks[0].foreign_id.split(':')[2]);
				}
				
				var index=songId.indexOf($scope.songs[id].tracks[0].foreign_id.split(':')[2]);
				
				songFav.splice(index, 1);
				localStorage.setItem('FavoriteArr',  JSON.stringify(songFav));
	
				$scope.songs[id].favorite='off';
				$scope.songs[id].closeButton=true;
				console.log(jQuery.parseJSON(localStorage.FavoriteArr));
				if($scope.songs.length<1)
				{
					$scope.getFav=false;
				}	
			
			}
		
		
		
			

	

	};
	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	
	$scope.moreSongs = function(number, iterator) {
		//var fav = jquery.parseJSON(localStorage.getItem('FavoriteArr'));
		
		$scope.songs=[];
		$scope.start_number = $scope.start_number;
		$scope.start_number= number;
		if($scope.start_number-25<0)
		{
			$scope.start_number=0;
			var iterator=iterator;
		}
		if(ls_arr.length>25)
		{
			if($scope.start_number>0)
			{
			$scope.backHider=false;
			}
			else{
				$scope.backHider=true;
			}
			$scope.moreHider=false;
		}
		
		if($scope.start_number+25>ls_arr.length)
		{
			var iterator=ls_arr.length;
			$scope.moreHider=true;
		}
		else
		{
			$scope.start_number=$scope.start_number
		}
		
	
		for(var x=$scope.start_number; x<iterator; x++)
		{
			$scope.songs.push(ls_arr[x]);
		}
		goToByScrollTop('fav_holder');
		//localStorage.setItem('FavoriteArr', fav);
		//Favorites.runFavorites($scope.songs);

	};
	
	$scope.viewAll = function()
	{
		$scope.songs=[];
		$scope.viewall=true;	
		$scope.moreSongs (0, ls_arr.length);
		$scope.moreHider=true;
		$scope.backHider=true;
		$scope.sharer=true;
	};
	$scope.view25 = function()
	{
		$scope.songs=[];
		$scope.viewall=false;	
		$scope.moreSongs (0, 25);
		$scope.moreHider=false;
		$scope.sharer=false;
		
	};
	$scope.getSongs = function() {

		
		var url = ShareSongs.getSongs($scope.songs, $routeParams.location);
		//=url =url.replace(' ', '');
		
		ShareSongs.getLongURL(url).then(function(result){
			$scope.long_url = result;
			ShareSongs.getBitLy($scope.long_url).then(function(result)
			{
				
				console.log($scope.message);
				$scope.short_url=result;
				$scope.shareBox=true;
				$scope.message='Check out my playlist from %23MusicWhereYouAre, a geolocation-based music discovery app. Hows the music where you are? '+$scope.short_url
				$scope.message_link=encodeURIComponent($scope.message);
				});
			
		});

	
		$scope.sharer=true;

	};
	$scope.closeShareBox=function()
	{
		$scope.sharer=false;
		$scope.shareBox=false;
	}
	
	$scope.changeClass = function(obj) {
		//$scope.location = $location.path().split('/')[2];
		
		for (var i = 0; i < $scope.sm_btns.length; i++) {
			$scope.sm_btns[i].state='off';
			$scope.sm_btns[i].classy='hider';
			if ( $scope.sm_btns[i].name == obj.name) {
				console.log($scope.sm_btns[i].name)
				 $scope.sm_btns[i].state = 'on';
				 $scope.sm_btns[i].classy = 'shower'
			} else {

				 $scope.sm_btns[i].state = 'off';
				 $scope.sm_btns[i].classy = 'hider';
			}
		}
		
	};


	runSymbolChange.changeSymbol();
	if($routeParams.location==undefined)
	{
	$scope.loading=true;
	$scope.location = 'Finding your location...';
	getLocation.checkGeoLocation()
		
	
	
	}
	else{
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	if ($('#map-canvas').html().match('loading.gif"')) {
	$scope.runApp(0,1);	
	}
	}

	$scope.songs = [];
	$scope.save_arr = [];

	$scope.songs_repeater = jQuery.parseJSON(localStorage.getItem('FavoriteArr'));
	var fav = localStorage.getItem('FavoriteArr');
	if (fav == null)
		fav = [];
	if (fav.length == 2 || fav == null) {
		$scope.getFav = false;
		localStorage.setItem('FavoriteArr', '[]');
	}
	var txt = '';
	if ($scope.songs_repeater != null) {
		for (var x = 0; x < $scope.songs_repeater.length; x++) {

			if (!txt.replace(/\W/g, '').match($scope.songs_repeater[x].tracks[0].foreign_id.split(':')[2].replace(/\W/g, ''))) {
				$scope.songs.push($scope.songs_repeater[x]);
			}
			txt += $scope.songs_repeater[x].tracks[0].foreign_id.split(':')[2];
		}
	}
	$scope.spot_arr = [];
	//$scope.songs.spot_str='';
	if ($scope.songs != null) {
		$scope.songs.spot_str = '';
		for (var x = 0; x < $scope.songs.length; x++) {
			$scope.spot_arr.push($scope.songs[x].tracks[0].foreign_id.split(':')[2]);
			$scope.save_arr.push('spotify:track:' + $scope.songs[x].tracks[0].foreign_id.split(':')[2]);
			$scope.songs[x].favorite = 'on';
		}

		$scope.songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
		$scope.songs.spot_str = $sce.trustAsResourceUrl($scope.songs.spot_str);

	} else {
		$scope.songs = []
		$scope.songs.spot_str = ''
	}
	$scope.location_link = $routeParams.location;
	
	
	
}]);

var Events = angular.module('Events', [])
Events.controller('LoadEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','getLocation',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, getLocation){
	
	
	
	$scope.runApp = function(start_number, counter) {
		$rootScope.mapOpening = true;
		if ($routeParams.location.split('*').length > 1) {
			$scope.zoom = 10;

		} else {
			$scope.zoom = 6;
		}
		$scope.start_number = start_number;

		$scope.counter = counter;
		$scope.ratio = .05 * counter;

		retrieveLocation.runLocation(replacePatterns($scope.location), 'lat', $scope.ratio).then(function(data) {

			$scope.latitudeObj = data;
			$rootScope.latitudeObj_root = data;

			//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
			$scope.latitude = $scope.latitudeObj.latitude;
			retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
				$rootScope.longitudeObj_root = {};
				$scope.longitudeObj = data;
				$rootScope.longitudeObj_root = data;

				$scope.longitude = $scope.longitudeObj.longitude;
				$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];

				PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, '0', $rootScope.genres, $rootScope.era, start_number).then(function(data) {
					$rootScope.songs_root = {};
					$scope.songs = data.data.response.songs;
					$scope.runEvents();
					$rootScope.songs_root = data.data.response.songs;
					if ($scope.songs.spot_arr.length < 1) {
						
						$scope.counter = $scope.counter + 1;

						if ($scope.counter <= 10) {

							$scope.runApp(0, $scope.counter);

						} else {
							$rootScope.noSongs = true;
						}
					} else {
						MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs.final_loc_arr, $scope.songs.spot_arr);
						$rootScope.mapOpening = false;
					}
				});

			});

		});
		

	};
	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	
	if($routeParams.location==undefined)
	{
	$scope.loading=true;
	$scope.location = 'Finding your location...';
	getLocation.checkGeoLocation()
	}
	else{
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	if ($('#map-canvas').html().match('loading.gif"')) {
	$scope.runApp(0,1);	
	}
	}
	
	$scope.runEvents = function()
	{
	$scope.eventData=false;
	$scope.loading=true;
	 Events.getGeoEvents($scope.location.split(',')[0]).then(function(result){
		//$scope.events =[];
		if(JSON.stringify(result).match('We could not find any upcoming events based on your specified location'))
		{	
			$scope.noShows =true;
			console.log($scope.noShows)
		}
		else{
			$scope.noShows =false;
			if(typeof result.data.events.event!='array')
			{
			
				$scope.events=[];
				$scope.events.push(result.data.events.event);
			}
			else
			{
			$scope.events=(result.data.events.event);	
			}
			$scope.events=(result.data.events.event);
			
			for(var t=0; t<$scope.events.length; t++)
			{
				if(typeof $scope.events[t].artists.artist=='string')
				{
					$scope.events[t].artists.artist=[$scope.events[t].artists.artist];
				}
				$scope.date=new Date($scope.events[t].startDate);
				$scope.hours =$scope.date.getHours();
				$scope.fin_hours = $scope.date.getHours()+2;
				$scope.month = ($scope.date.getMonth()+1);
				if($scope.events[t].tags!=undefined&&$scope.events[t].tags.tag!=undefined)
				{				
					$scope.events[t].tagsStr = $scope.events[t].tags.tag.toString().replace(/,/g, ', ')
					
				}
				if($scope.hours.toString().length<2)
				{
					$scope.hours =0+''+$scope.hours
				}
				if($scope.fin_hours.toString().length<2)
				{
					$scope.fin_hours =0+''+$scope.fin_hours;
				}
				
				if($scope.month.toString().length<2)
				{
					$scope.month =0+''+$scope.month;
				}
				
				$scope.events[t].date =$scope.date.getFullYear()+''+($scope.month)+''+$scope.date.getDate()+'T'+$scope.hours+'0000/'+$scope.date.getFullYear()+''+($scope.month)+''+$scope.date.getDate()+'T'+$scope.fin_hours+'0000';
		
				//console.log($scope.date);
				
				
			}
		}
		$scope.eventData=true;
		$scope.loading=false;
	 });
	
		};	
	
	$scope.runApp(0,1);
}]);

Events.controller('LoadBandEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events){
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	$scope.artist = $location.path().split('/')[3];
	
	$scope.runApp = function(start_number, counter) {
		$rootScope.mapOpening = true;
		if ($routeParams.location.split('*').length > 1) {
			$scope.zoom = 10;

		} else {
			$scope.zoom = 6;
		}
		$scope.start_number = start_number;

		$scope.counter = counter;
		$scope.ratio = .05 * counter;

		retrieveLocation.runLocation(replacePatterns($scope.location), 'lat', $scope.ratio).then(function(data) {

			$scope.latitudeObj = data;
			$rootScope.latitudeObj_root = data;

			//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
			$scope.latitude = $scope.latitudeObj.latitude;
			retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
				$rootScope.longitudeObj_root = {};
				$scope.longitudeObj = data;
				$rootScope.longitudeObj_root = data;

				$scope.longitude = $scope.longitudeObj.longitude;
				$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];

				PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, '0', $rootScope.genres, $rootScope.era, start_number).then(function(data) {
					$rootScope.songs_root = {};
					$scope.songs = data.data.response.songs;
					
					$rootScope.songs_root = data.data.response.songs;
					if ($scope.songs.spot_arr.length < 1) {
						
						$scope.counter = $scope.counter + 1;

						if ($scope.counter <= 10) {

							$scope.runApp(0, $scope.counter);

						} else {
							$rootScope.noSongs = true;
						}
					} else {
						MapCreate.runMap($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.songs.final_loc_arr, $scope.songs.spot_arr);
						$rootScope.mapOpening = false;
					}
				});

			});

		});
		

	};
	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		
		runSymbolChange.changeSymbol();
	};
	if ($('#map-canvas').html().match('loading.gif"')) {
		$scope.runApp(0, 1);
	}
	$scope.eventBandData=false;
	$scope.loading=true;

	 Events.getArtistEvents($scope.artist).then(function(result){
			//$scope.shows=[];

		if(result.data.events.event==undefined)
		{	
			$scope.noEvents =true;
		}
		else{
			console.log(result.data.events.event.length)
			console.log(result.data.events.event);
			if(result.data.events.event.length==undefined)
			{
				
				$scope.shows=[result.data.events.event]
			}
			else
			{
			$scope.shows=result.data.events.event;	
			}
			$scope.noEvents =false;
			$scope.shows.performers=[]
			for(var t=0; t<$scope.shows.length; t++)
			{
				
				
				if(typeof $scope.shows[t].artists.artist=='string')
				{
					$scope.shows[t].artists.artist=[$scope.shows[t].artists.artist]
				}
				
				
				$scope.date=new Date($scope.shows[t].startDate);
				$scope.hours =$scope.date.getHours();
				$scope.fin_hours = $scope.date.getHours()+2;
				$scope.month = ($scope.date.getMonth()+1);
				if($scope.shows[t].tags!=undefined&&$scope.shows[t].tags.tag!=undefined)
				{				
					$scope.shows[t].tagsStr = $scope.shows[t].tags.tag.toString().replace(',', ' ')
					
				}
				if($scope.hours.toString().length<2)
				{
					$scope.hours =0+''+$scope.hours
				}
				if($scope.fin_hours.toString().length<2)
				{
					$scope.fin_hours =0+''+$scope.fin_hours;
				}
				
				if($scope.month.toString().length<2)
				{
					$scope.month =0+''+$scope.month;
				}
				
				$scope.shows[t].date =$scope.date.getFullYear()+''+($scope.month)+''+$scope.date.getDate()+'T'+$scope.hours+'0000/'+$scope.date.getFullYear()+''+($scope.month)+''+$scope.date.getDate()+'T'+$scope.fin_hours+'0000';
					
			}
		}
		$scope.eventBandData=true;
		$scope.loading=false;
		
		console.log($scope.shows);
	 });
	
			
	
	
}]);


var LinerNotesControllers = angular.module('LinerNotesControllers', [])
LinerNotesControllers.controller('WriteLinerNotes', ['$scope', '$http',
function($scope, $http) {
	alert('liner notes')
}]);




var LinerNotesControllers = angular.module('LinerNotesControllers', [])
LinerNotesControllers.controller('WriteLinerNotes', ['$scope', '$http',
function($scope, $http) {
	alert('liner notes')
}]);

/////////////////Helper Functions////////////////////

function removeHTML(str) {
	return jQuery('<div />', {
		html : str
	}).text();
}

function replacePatterns(str) {
	str = str.replace('#/map/', '')
	str = str.replace('#/playlist/', '');
	str = str.replace(/_/g, ' ');
	//str = str.replace(/St. /i, 'Saint ');
	//str = str.replace(/St /i, 'Saint ');
	str = str.replace('New York, ', 'New York City, ');

	return str;
}

function locationReplace(str) {
	str = str.replace(', ', '*');
	str = str.replace(',', '*');
	str = str.replace(/ /g, '_');
	return str;
}

function removeSpecialChar(str) {
	str = str.replace('&', 'and');
	str = str.replace(/[^a-zA-Z, ^1-9 ]/g, "");
	return str;
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function textSlicer(text, numchar) {
	var slice_text = text.slice(numchar, text.length);

	var text_index = slice_text.indexOf('.');
	var final_text = text.slice(0, (numchar + text_index + 1));
	return final_text;

}

function goToByScrollTop(id) {
	// Remove "link" from the ID

	id = id.replace("link", "");
	// Scroll
	$('#' + id).animate({
		scrollTop : 0
	}, 'slow');

}

function goToByScrollLeft(id) {
	// Remove "link" from the ID

	id = id.replace("link", "");
	// Scroll
	$('#' + id).animate({
		scrollLeft : 0
	}, 'slow');

}

function GetUnique(inputArray) {
	var outputArray = [];
	for (var i = 0; i < inputArray.length; i++) {
		if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
			outputArray.push(inputArray[i]);
		}
	}
	return outputArray;
}


function get_short_url(long_url, login, api_key, func) {
	$.getJSON("http://api.bitly.com/v3/shorten?callback=?", {
		"format" : "json",
		"apiKey" : api_key,
		"login" : login,
		"longUrl" : long_url
	}, function(response) {
		func(response.data.url);
	});
}