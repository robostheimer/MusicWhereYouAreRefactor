var Favorites = angular.module('Favorites', [])
/*Services*/
Favorites.factory('Favorites', ['$http', '$routeParams', '$location', '$rootScope', '$sce',
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
			}

			obj.forEach(function(obj)
			{
				obj.favorite = 'off';
				favoritesArr.forEach(function(favorite) {
					if(favorite.id === obj.id)
					{
						obj.favorite='on';
					}
				})
			});
			return obj;
		}
	};
}]);
/*Controllers*/

Favorites.controller('LoadFav', ['$scope', '$q', '$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Favorites', 'ShareSongs', 'getLocation','Spotify','LocationDataFetch','Wiki','ChunkSongs','deviceDetector',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Favorites, ShareSongs, getLocation, Spotify, LocationDataFetch, Wiki, ChunkSongs, deviceDetector) {
	$rootScope.noGeo=false;
	var removeArr = [];

	$scope.sharer = false;
	$scope.shareBox = false;
	$scope.tooMany=false;

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

var d = new Date();
$scope.spot_str = '';
$scope.spot_arr = [];
$scope.save_arr = [];
$scope.date = `${(d.getMonth()+1)}/${d.getDate()}/${d.getFullYear()}`;

$scope.runApp = function() {
	var location_comp = $routeParams.location,
		chunked_arr = [];
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
};

//Nonfunctional (has side effects)
//Sets up  Favorites Page.
$scope.createSongsFav = function() {
	$scope.songsFav = jQuery.parseJSON(localStorage.getItem('FavoriteArr'));
	if ($scope.songsFav !== null) {
		$scope.spot_arr = $scope.getSongsIds($scope.songsFav) || [];
		if ($scope.songsFav.length > 0) {
			$scope.spot_arr.forEach(function(item) {
				$scope.save_arr.push('spotify:track:' + item);
			})

			$scope.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
			$scope.spot_str = $sce.trustAsResourceUrl($scope.spot_str);

		} else {
			$scope.songsFav = []
			$scope.spot_str = ''
			$scope.getFav = false;
		}
	} else {
		$scope.getFav = false;
	}
};

//*Non Functional (has side effects)
//called on 'star' click event. removes item from favorites array
$scope.switchFavorite = function(song) {
	if (localStorage.getItem('FavoriteArr') !== null && localStorage.getItem('FavoriteArr') !== '') {
		var songFav = jQuery.parseJSON(localStorage.FavoriteArr);

	} else {
		var songFav = [];
	}
	songFav.compareAndRemoveArraysObj([song], 'id')
	localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
	return $scope.createSongsFav();
};

//Helper function returns
$scope.getSongsIds = function(songs) {
	arr = [];
	songs.forEach(function(song) {
		arr.push(song.id);
	});

	return arr;
}

if(!$rootScope.songs)
{
	$scope.runApp();
}
	//$scope.createFavoritesList();
$scope.createSongsFav();

	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

	$scope.moreSongs = function(number, iterator) {
		//var fav = jquery.parseJSON(localStorage.getItem('FavoriteArr'));

		$scope.songs = [];
		$scope.start_number = $scope.start_number;
		$scope.start_number = number;
		if ($scope.start_number - 25 < 0) {
			$scope.start_number = 0;
			var iterator = iterator;
		}
		if (ls_arr.length > 25) {
			if ($scope.start_number > 0) {
				$scope.backHider = false;
			} else {
				$scope.backHider = true;
			}
			$scope.moreHider = false;
		}

		if ($scope.start_number + 25 > ls_arr.length) {
			var iterator = ls_arr.length;
			$scope.moreHider = true;
		} else {
			$scope.start_number = $scope.start_number
		}

		for (var x = $scope.start_number; x < iterator; x++) {
			$scope.songs.push(ls_arr[x]);
		}
		goToByScrollTop('fav_holder');
		//localStorage.setItem('FavoriteArr', fav);
		//Favorites.runFavorites($scope.songs);

	};

	$scope.viewAll = function() {
		$scope.songs = [];
		$scope.viewall = true;
		$scope.moreSongs(0, ls_arr.length);
		$scope.moreHider = true;
		$scope.backHider = true;
		$scope.sharer = true;
	};
	$scope.view25 = function() {
		$scope.songs = [];
		$scope.viewall = false;
		$scope.moreSongs(0, 25);
		$scope.moreHider = false;
		$scope.sharer = false;

	};
	$scope.getSongs = function(songs) {

		ShareSongs.getSongs($scope.songsFav, $routeParams.location).then(function(url){;

				ShareSongs.getLongURL(url).then(function(result) {

					$scope.long_url = result.url;
					if(result.sliced=='yes')
					{
						$scope.tooMany=true;

					}
					ShareSongs.getBitLy($scope.long_url).then(function(result) {

						$scope.short_url = result;
						$scope.shareBox = true;

						$scope.message = 'Check out my playlist from @MusicWhereYouR, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
						$scope.message_link = encodeURIComponent($scope.message);
					},function(error){$scope.errorMessage = true;});

				},function(error){$scope.errorMessage = true;});
			},function(error){$scope.errorMessage = true;});

	};
	$scope.closeShareBox = function() {
		$scope.sharer = false;
		$scope.shareBox = false;
	}

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
$scope.detectDevice = function()
	{
		if(deviceDetector.device=="android" || deviceDetector.device=="ipad" || deviceDetector.device=="iphone" || deviceDetector.device=='kindle')
		{
			$scope.spot_iframe_hider =true;
		}
		else{
			$scope.spot_iframe_hider=false;
		}
	};

	runSymbolChange.changeSymbol();
	if ($routeParams.location == undefined) {
		$rootScope.loading = true;
		$scope.location = 'Finding your location...';
		getLocation.checkGeoLocation()

	} else {
		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
		$scope.location_link = $routeParams.location;
	}

		$scope.detectDevice()
		/*else
		 {
		 $rootScope.new_location = $location.path();
		 //alert($rootScope.new_location);
		 $location.path('country');
		 }	*/


}]);
