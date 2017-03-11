var Info = angular.module('Info', [])

/*Services*/
Info.factory("retrieveInfo", ['$q', '$rootScope', '$http', '$sce', '$location', '$routeParams',
function($q, $rootScope, $http, $sce, $location, $routeParams) {
return{

     		infoRetrieve: function(artistname){
     			var artistinfo = {};
     			var artistname_echo = artistname.replace(/\*/g, ' ');
					var img;
					var images;

					//cache this (see playlist_module)
     			var url =`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistname}&api_key=1f91c93293d618de5c30f8cfe2e9f5e9&format=json&callback=JSON_CALLBACK`


     			return $http.jsonp(url).then(function(result)
     			{

     			artistinfo =result.data.artist;

       		artistinfo.spot_url=[];

					img = artistinfo.image.find(function(item) {
						return item.size === "extralarge"
					});
					artistinfo.similar.artist.forEach(function(artist) {
						artist.href = `#/info/${$routeParams.location}/${artist.name}`
						artist.image.forEach(function(img) {
							if (img.size === 'large') {
								artist.img = img['#text'];
							};
						});
					});

					artistinfo.img = img["#text"];
					artistinfo.bio=`<img class="gallery" src="${artistinfo.img}" alt="{{artistinfo.name}}" ng-hide="artistinfo.photosCheck==false"/>${artistinfo.bio.summary}`;
     			return artistinfo;
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
	     				artistsongs.spot_url_button.push(`spotify:track:${track.id}`);

	     			});
     			artistsongs.spot_url_str = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+artistsongs.spot_url.toString());
     			return artistsongs;
     			});
			},

		};
}]);


/*Controllers*/


Info.controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo', 'retrieveLocation', 'LocationDataFetch','PlaylistCreate', 'Spotify', 'Wiki','ChunkSongs','$sce', 'deviceDetector',
function($scope, $location, $rootScope, runSymbolChange, $routeParams, retrieveInfo, retrieveLocation, LocationDataFetch, PlaylistCreate, Spotify, Wiki, ChunkSongs, $sce, deviceDetector) {
	$rootScope.noGeo=false;
	localStorage.path=$location.path();
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	$scope.location_link = $routeParams.location;
	$scope.name = $routeParams.artist.replace(/&/g, 'and').replace(/\+/g, 'and');
	console.log($scope.name)
	$scope.artistdata = false;
	var songs_for_service=[];
	retrieveInfo.infoRetrieve($scope.name).then(function(data) {
		$scope.loading_artist = false;
		$scope.artistinfo = data;


		$scope.artistdata = true;

		retrieveLocation.runLocation($scope.location.replacePatterns(), $rootScope.genres);
		retrieveInfo.lookUpArtist($scope.name).then(function(data) {


			if(data!=undefined)
			{
				$scope.artist_lookup = data.data.artists.items[0].id;
				retrieveInfo.spotifyRetrieve($scope.artist_lookup).then(function(data) {
				$scope.spotify = data.data;

				$scope.noArtist =false;

			});
			}
			else{
					$scope.noArtist =true;

				}

		},function(error){$scope.ErrorMessage=true;});

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

		//LocationDataFetch.count=0;
		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	$scope.lookUpArtist = function(artist) {
		var location = $routeParams.location
		$location.path('info/' +location+'/'+artist);
	};

$scope.runApp = function() {
	var location_comp = $routeParams.location,
		chunked_arr = [];
	retrieveLocation.runLocation(location_comp).then(function(data) {
		var city_data = data.join('_');
		PlaylistCreate.runPlaylist(city_data, 0).then(function(data){
			$rootScope.songs = data;
			Spotify.runGenres(data.chunked_arr[0]).then(function(data) {
				$rootScope.songs.spotify_info = data.spotify_info;
				$scope.loading = false;
				$rootScope.mapdata.lat=data.spotify_info[0].location.lat;
				$rootScope.mapdata.lng=data.spotify_info[0].location.lng;
				$rootScope.mapdata.markers=data.spotify_info;
				$scope.newlocation = false;
				$rootScope.mapOpening = false;
			});
		});
	});
};

$scope.SkipValidation = function(value) {
		return $sce.trustAsHtml(value);
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


	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
		{
		$scope.runApp(0, 1);

	}
	$scope.detectDevice();



}]);
