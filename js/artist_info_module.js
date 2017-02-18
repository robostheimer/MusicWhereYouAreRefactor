var Info = angular.module('Info', [])

/*Services*/
Info.factory("retrieveInfo", ['$q', '$rootScope', '$http', '$sce', '$location',
function($q, $rootScope, $http, $sce, $location) {
return{

     		infoRetrieve: function(artistname){
     			var artistinfo = {};
     			var artistname_echo = artistname.replace(/\*/g, ' ');

     			//var feed = 'http://teacheratsea.wordpress.com/category/'+$routeParams.teachername.split('*')[0].toLowerCase()+'-'+$routeParams.teachername.split('*')[1].toLowerCase()+'/feed';

     			var url =`http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistname}&api_key=1f91c93293d618de5c30f8cfe2e9f5e9&format=json&callback=JSON_CALLBACK`


     			return $http.jsonp(url).then(function(result)
     			{
						debugger;
     			artistinfo =result.data.artist;
       		artistinfo.spot_url=[];
					console.log(artistinfo.bio)
     			artistinfo.bio=artistinfo.bio.summary;
     			//artistinfo.bio.text='';
     		// 	artistinfo.ytArr=[];
     		// 	artistinfo.videoArr=[];
     		// 	artistinfo.lastfm_imgs=[];
					//
	     	// 		artistinfo.video.forEach(function(video){
					//
	     	// 		if(video.url.match('youtube'))
		     // 			{
		     // 			artistinfo.ytArr.push(video.url);
		     // 			}
	     	// 		});
					//
	     	// 		artistinfo.news.forEach(function(news){
		     // 			news.news_summary=news.summary.removeHTML();
	     	// 		});
					//
     		// 	if(artistinfo.ytArr.length<7)
     		// 	{
     		// 	var yt_length = artistinfo.ytArr.length;
     		// 	}
     		// 	else{
     		// 	var yt_length = 7;
     		// 	}
     		// 	for (var g=0; g<yt_length; g++)
	     	// 		{
	     	// 			artistinfo.videoArr.push($sce.trustAsResourceUrl('http://www.youtube.com/embed/'+artistinfo.ytArr[g].slice(artistinfo.ytArr[g].indexOf('?v='),artistinfo.ytArr[g].indexOf('&feature')).replace('?v=','')));
	     	// 		};
					//
					//
	     	// 		for(var i=0; i<artistinfo.biographies.length; i++)
	     	// 		{
					//
	     	// 			if(artistinfo.biographies[i].site.match('last.fm'))
	     	// 			{
	     	// 				artistinfo.bio=result.data.response.artists[0].biographies[i];
	     	// 				if(artistinfo.bio.text.length>2700)
	     	// 				{
	     	// 					artistinfo.bio.text = artistinfo.bio.text.Slicer(2700) +'... ';
					// 			artistinfo.bio_site = 'Read More at ' +artistinfo.bio.site;
	     	// 				}
	     	// 				else
		     // 				{
		     // 					artistinfo.bio_site = 'Courtesy of ' +artistinfo.bio.site;
		     // 				}
	     	// 			}
					//
					//
	     	// 		}
					//
     		// 	if(artistinfo.bio.text=='')
     		// 	{
     		// 		artistinfo.bio.text='No published biography exists for this band.';
     		// 	}
					//
     		// 	for(var h=0; h<artistinfo.images.length; h++)
     		// 	{
     		// 		if(artistinfo.images[h].url.match('last.fm'))
	     	// 				{
	     	// 					if(artistinfo.images[h].url.match('serve'))
	     	// 					{
	     	// 					var img_id = artistinfo.images[h].url.split('serve/')[1]
	     	// 					img_id=img_id.slice(artistinfo.images[h].url.split('serve/')[1].indexOf('/'),artistinfo.images[h].url.split('serve/')[1].length);
					//
	     	// 					artistinfo.images[h].src ='http://userserve-ak.last.fm/serve/126s'+img_id;
					//
					//
	     	// 					artistinfo.lastfm_imgs.push(artistinfo.images[h]);
	     	// 					 }
	     	// 				}
	     	// 			}
	     	// 			if(artistinfo.images.length==0)
	     	// 			{
	     	// 				for (var y=0; y<5; y++)
	     	// 				{
	     	// 				artistinfo.images.push('logo4_sm.png');
	     	// 				}
	     	// 			}

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


/*Controllers*/


Info.controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo', 'retrieveLocation', 'LocationDataFetch','PlaylistCreate', 'Spotify', 'Wiki','ChunkSongs','$sce', 'deviceDetector',
function($scope, $location, $rootScope, runSymbolChange, $routeParams, retrieveInfo, retrieveLocation, LocationDataFetch, PlaylistCreate, Spotify, Wiki, ChunkSongs, $sce, deviceDetector) {
	$rootScope.noGeo=false;
	localStorage.path=$location.path();
	$rootScope.loading = true;
	$scope.buttons = retrieveInfo.createObjects();
	$scope.buttonsArr = [$scope.buttons.bio, $scope.buttons.photos, $scope.buttons.videos, $scope.buttons.topsongs, $scope.buttons.news, $scope.buttons.related];
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	$scope.location_link = $routeParams.location;
	$scope.name = $routeParams.artist.removeSpecialChar();
	$scope.artistdata = false;
	var songs_for_service=[];

	$scope.tabs = retrieveInfo.createObjects();
	retrieveInfo.infoRetrieve($scope.name).then(function(data) {
		$scope.artistinfo = data;
		console.log($scope.artistinfo)
		$scope.artistinfo.bioCheck = true;
		$scope.artistinfo.photosCheck = true;
		$scope.artistinfo.newsCheck = true;
		$scope.artistinfo.videoCheck = true;
		if ($scope.artistinfo.bio.length == 0) {
			$scope.artistinfo.bioCheck = false;
		}
		// if ($scope.artistinfo.video.length == 0) {
		// 	$scope.artistinfo.videoCheck = false;
		// }
		// if ($scope.artistinfo.news.length == 0) {
		// 	$scope.artistinfo.newsCheck = false;
		// }
		// if ($scope.artistinfo.images.length < 1) {
		// 	$scope.artistinfo.photosCheck = false;
		// }

		retrieveInfo.relatedRetrieve($scope.name).then(function(data) {
			$scope.relatedartists = data.data.response.artists;

		});

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


			$location.path('info/' +location+'/'+artist.replace('The ', ''));
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


$scope.detectDevice = function()
	{
		if(deviceDetector.device=="android" || deviceDetector.device=="ipad" || deviceDetector.device=="iphone" || deviceDetector.device=='kindle')
		{
			$scope.spot_iframe_hider =true;
		}
		else{
			$scope.spot_iframe_hider=false;
		}
		console.log(deviceDetector)
	};
		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
		$scope.location_link = $routeParams.location;
		if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{
			$scope.runApp(0, 1);

		}
		$scope.detectDevice();



}]);
