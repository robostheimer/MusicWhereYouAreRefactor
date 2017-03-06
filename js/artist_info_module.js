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
					artistinfo.bio=artistinfo.bio.summary;
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
	$rootScope.loading = true;
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	$scope.location_link = $routeParams.location;
	$scope.name = $routeParams.artist.removeSpecialChar();
	$scope.artistdata = false;
	var songs_for_service=[];

	retrieveInfo.infoRetrieve($scope.name).then(function(data) {
		$scope.artistinfo = data;


		$scope.artistdata = true;

		retrieveLocation.runLocation($scope.location.replacePatterns(), $rootScope.genres);
		retrieveInfo.lookUpArtist($scope.name).then(function(data) {


			if(data!=undefined)
			{
				$scope.artist_lookup = data.data.artists.items[0].id;
				retrieveInfo.spotifyRetrieve($scope.artist_lookup).then(function(data) {
				$scope.spotify = data.data;
				$rootScope.loading = false;
				$scope.noArtist =false;

			});
			}
			else{
					$scope.noArtist =true;
					$rootScope.loading = false;

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
	};
// 	$scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {
//
// 		if(arr==undefined)
// 		{
// 			 var arr=[];
// 		}
// 		else{
// 			var arr=arr;
// 		}
// 		if(arr2==undefined)
// 		{
// 			$scope.holder_arr=[];
//
// 		}
// 		else{
// 			$scope.holder_arr=arr2;
//
// 		}
// 		if(index1==undefined){
// 			 $scope.index1 = 0;
// 		}
// 		else{
// 			$scope.index1 = index1;
// 		}
//
// 		if(index2==undefined){
// 			$scope.index2 = 20;
// 		}
// 		else{
// 			$scope.index2 = index2;
// 		}
//
//
// 			$rootScope.mapOpening = true;
// 			var arr=[];
// 			$scope.songs = [];
// 			$scope.songs.spot_arr = [];
// 			$scope.spot_arr = [];
// 			$scope.savSpotArr = [];
// 			$scope.location_arr = [];
// 			$scope.final_loc_arr = [];
// 			var location_comp = $routeParams.location;
// 			$scope.ratio = .15* counter;
// 			$scope.start_number= start_number;
// 			$scope.holder_arr=[];
// 			var tmparr=[];
// 			retrieveLocation.runLocation($scope.location.replacePatterns(), 'lat', counter).then(function(data) {
//
// 				$scope.latitudeObj = data;
// 				$rootScope.latitudeObj_root = data;
// 				$scope.latitude = $scope.latitudeObj.latitude;
// 				retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
//
// 					$rootScope.longitudeObj_root = {};
// 					$scope.longitudeObj = data;
// 					$rootScope.longitudeObj_root = data;
// 					$scope.longitude = $scope.longitudeObj.longitude;
// 					$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
//
//
// 					var lat_range =Math.abs($scope.latitudeObj.lat_max - $scope.latitudeObj.lat_min);
// 					var lng_range =Math.abs($scope.longitudeObj.long_max - $scope.longitudeObj.long_min)
// 					var lat_avg =  ($scope.latitudeObj.lat_max + $scope.latitudeObj.lat_min)/2;
// 					var lng_avg = ($scope.longitudeObj.long_max + $scope.longitudeObj.long_min)/2;
//
// 					if(lat_range>lng_range)
// 					{
// 						var finalRange=lat_range
// 					}
// 					else
// 					{
// 						var finalRange=lng_range;
// 					}
//
// 					if($routeParams.location.split('*').length>1)
// 					{
//
// 					$scope.zoom=Spotify.runRange(finalRange)
// 										}
// 					else{
// 						$scope.zoom=6;
// 					}
// 					$rootScope.mapOpening=true;
// 					$scope.counter = counter;
// 						$scope.counter = counter;
// 					for(var t=0; t<2; t++)
// 						{
//
// 							var start_number = t*50;
//
// 							PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era,$scope.start_number).then(function(data){
// 								arr = arr.concat(data);
//
//
// 									tmparr.push(t)
// 									if(tmparr.length==t)
// 									{
// 										///////////No songs from this geolocation///////////
// 										if(data.songsArr.length==0 && $scope.holder_arr.length>0)
// 										{
//
// 											$rootScope.loading=false;
// 											if($scope.btnCount>0)
// 											{
//
// 											$scope.noMoreSongs=true;
// 											$scope.moreHider=true;
// 											}
// 											else{
// 											$scope.noMoreSongs=false;
// 											$scope.moreHider=false;
// 											}
//
// 											$scope.donesy=true;
// 											var index1 = $scope.holder_arr.length-20;
// 											var index2 = $scope.holder_arr.length;
//
//
// 											Spotify.createPlaylist($scope.holder_arr).then(function(result) {
// 												$scope.songs = result.songs.slice($scope.index1, $scope.index2+20)
// 												$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20)
// 												$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20)
// 												artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20)
// 												$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20)
//
// 												$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
// 												$rootScope.songs_root = $scope.songs;
//
// 													Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
// 																LocationDataFetch.count=1;
// 																$rootScope.mapdata = data;
// 																$scope.stillLooking = false;
// 																$rootScope.loading=false;
// 																$rootScope.mapOpening=false;
// 																$scope.checkForMore=true;
//
// 																});
//
// 											},function(error){
// 												$scope.errorMessage = true;
// 											});
//
// 										}
// 										///////////Number of songs is less than 100 and geolocation needs to be extended and has not yet gone through 5 ratio changes
// 										else if (arr.length < 100 && $scope.counter<=5) {
//
//
// 											$scope.counter = $scope.counter + 1;
// 											if($rootScope.marked==true) {
// 											$scope.moreHider=true;
// 											$rootScope.loading=false;
// 											$scope.noMoreSongs = true;
// 											}
//
// 											else if ($scope.counter <= 5 && $scope.holder_arr.length<50) {
//
//
// 												if($scope.counter>3)
// 												{
// 												$scope.stillLooking = true;
// 												}
// 												$scope.start_number=$scope.start_number+50;
// 												LocationDataFetch.count = 0;
// 												$scope.runApp($scope.start_number, $scope.counter, '', arr, $scope.holder_arr);
//
// 											}
// 											else if(arr.length==0){
// 												$rootScope.noSongs=true;
// 											}
//
// 											else if(arr.length<100 && $scope.counter>=6){
// 											ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
// 											///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
// 											//////////////data returned should obj {songs:[], holder_arr:[]}
// 												var tmparr=[];
// 												var tmparr2 =[];
// 												for(var y=0; y<data.length; y++)
// 												{
// 													tmparr.push(y);
//
// 													Spotify.checkSongMarket(data[y].songs).then(function(result) {
// 													console.log(result)
//
// 													for (var x = 0; x < result.length; x++) {
//
// 														tmparr2.push(x)
// 														songs_for_service.push(result[x]);
// 														if(tmparr.length==data.length &&tmparr2.length==result.length)
// 														{
// 														$scope.holder_songs ={};
// 														$scope.holder_arr = songs_for_service;
// 														$rootScope.holder_arr_root=songs_for_service;
// 														Spotify.createPlaylist(songs_for_service).then(function(result) {
//
// 															$scope.holder_songs.songs = result.songs;
// 															$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
// 															$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
// 															$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
// 															artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
// 															$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
// 															$scope.holder_arr =$scope.holder_arr.removeDuplicatesArrObj('name', true);
// 															$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
// 															$rootScope.songs_root = $scope.songs;
//
// 																Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
// 																LocationDataFetch.count=1;
// 																$rootScope.mapdata = data;
// 																$scope.stillLooking = false;
// 																$rootScope.loading=false;
// 																$rootScope.mapOpening=false;
// 																$scope.checkForMore=true;
//
// 																});
//
// 														},function(error){
// 															$scope.errorMessage = true;
// 														});
// 														}
//
// 													}
// 													});
// 												}
//
//
// 											},function(error){
// 														$scope.errorMessage = true;
// 													});
//
// 										}
//
//
//
// 										}
// 										/////////////////Songs are over 50 and required fewer than 5 ratio changes////////////////
// 										////////////////This is generally what is used for larger cities//////////////////////////
// 										else if(arr.length>100 &&($scope.donesy==false||$scope.donesy==undefined)){
// 											ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
//
// 											///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
// 											//////////////data returned should obj {songs:[], holder_arr:[]}
//
// 												var tmparr=[];
// 												var tmparr2 =[];
// 												for(var y=0; y<data.length; y++)
// 												{
// 													tmparr.push(y);
// 													Spotify.checkSongMarket(data[y].songs).then(function(result) {
// 													for (var x = 0; x < result.length; x++) {
//
// 														tmparr2.push(x);
// 														songs_for_service.push(result[x]);
// 														if(tmparr.length==data.length &&tmparr2.length==result.length)
// 														{
// 														$scope.holder_songs ={};
// 														$scope.holder_arr = songs_for_service;
// 														$rootScope.holder_arr_root = songs_for_service;
// 															if(result.length>0 && $scope.counter<2 && $scope.holder_arr.length<150)
// 															{
// 																$scope.counter++;
// 																LocationDataFetch.count=0;
// 																$scope.runApp($scope.start_number, $scope.counter, '', [], $scope.holder_arr);
//
//
// 															}
// 															else{
// 																Spotify.createPlaylist(songs_for_service).then(function(result) {
//
// 																$scope.holder_songs.songs = result.songs;
// 																$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
// 																$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
// 																$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
// 																artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
// 																$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
// 																$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
// 																$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
// 																$rootScope.songs_root = $scope.songs;
//
// 																Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
// 																LocationDataFetch.count=1;
// 																$rootScope.mapdata = data;
// 																$scope.stillLooking = false;
// 																$rootScope.loading=false;
// 																$rootScope.mapOpening=false;
// 																$scope.checkForMore=true;
//
// 																});
//
// 															},function(error){
// 																$scope.errorMessage = true;
// 															});
// 															}
//
//
//
// 														}
//
// 													}
//
//
//
// 													});
// 												}
//
//
// 											},function(error){
// 														$scope.errorMessage = true;
// 													});
//
// 										}
//
// 								}
// 							},function(error){
// 								$scope.errorMessage = true;
// 							});
// 						}
//
// 			});
// 	});
// };

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
