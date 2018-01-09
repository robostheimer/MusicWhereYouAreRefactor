var Events = angular.module('Events', []);

/*Services*/

Events.factory("Events", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams',
function($q, $rootScope, $http, $sce, $location, States, $routeParams) {
	return{
			getGeoEvents: function(lat, lng, date1, date2)
			{
				console.log(lat, lng)
				var url = `https://api.seatgeek.com/2/events?client_id=NDQ0MzUxNHwxNDkwMDY0MDc4LjYy&lon=${lng}&lat=${lat}&type=concert&format=json`
				console.log(url)
				return $http.get(url).then(function(results)
				{
					console.log(results.data.events)
					return results.data.events;
				},function(error) {
					$rootScope.showLastFMError=true;
				});
			},

			getArtistEvents: function(artist)
			{	
				return $http.get('https://rest.bandsintown.com/artists/'+artist+'/events?app_id=MusicWhereYouAre').then(function(results){
	
					return results.data;
				},function(error) {
					$rootScope.showLastFMError=true;
				});
			}
	};
}]);


/*Controllers*/


Events.controller('LoadEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','getLocation','Spotify', 'LocationDataFetch','Wiki','ChunkSongs',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, getLocation, Spotify, LocationDataFetch, Wiki, ChunkSongs){
		$rootScope.noGeo=false;
		$rootScope.infoMessage=false;
		var songs_for_service=[],
		date = new Date();
		date2 = new Date(+date + 12096e4),
		date1_fmt ={
			year: date.getFullYear().toString(),
			month:(date.getMonth()+1).toString(),
			day:date.getDate().toString()
		};
		date2_fmt ={
			year: date2.getFullYear().toString(),
			month:(date2.getMonth()+1).toString(),
			day:date2.getDate().toString()
		};
		if(date1_fmt.month.length<2){
			date1_fmt.month = 0+date1_fmt.month;
		}

		if(date1_fmt.day.length<2){
			date1_fmt.day = 0+date1_fmt.day;
		}
		if(date2_fmt.month.length<2){
			date2_fmt.month = 0+date2_fmt.month;
		}

		if(date2_fmt.day.length<2){
			date2_fmt.day = 0+date2_fmt.day;
		}


		$scope.date1 = date1_fmt.year+'-'+date1_fmt.month+'-'+date1_fmt.day;
		$scope.date2 = date2_fmt.year+'-'+date2_fmt.month+'-'+date2_fmt.day;

	// $scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {
	// 	$rootScope.loading=true;
	// 	if(arr==undefined)
	// 	{
	// 		 var arr=[];
	// 	}
	// 	else{
	// 		var arr=arr;
	// 	}
	// 		if(arr2==undefined)
	// 	{
	// 		$scope.holder_arr=[];
	//
	// 	}
	// 	else{
	// 		$scope.holder_arr=arr2;
	//
	// 	}
	// 	if(index1==undefined){
	// 		 $scope.index1 = 0;
	// 	}
	// 	else{
	// 		$scope.index1 = index1;
	// 	}
	//
	// 	if(index2==undefined){
	// 		$scope.index2 = 20;
	// 	}
	// 	else{
	// 		$scope.index2 = index2;
	// 	}
	// 	if(type=='button')
	// 	{
	// 		songs_for_service=[];
	// 	}
	// 	var tmparr=[];
	// 	LocationDataFetch.count = 1;
	// 	$rootScope.mapOpening = true;
	//
	// 	$scope.start_number = start_number;
	//
	// 	$scope.counter = counter;
	// 	$scope.ratio = .15 * counter;
	// 	$rootScope.holder=[];
	// 	$rootScope.count_about =0;
	// 	$rootScope.moreLookUp=false;
	// 	$scope.songs=[];
	// 	$rootScope.songs_root=[];
	// 	retrieveLocation.runLocation($scope.location.replacePatterns(), 'lat', counter).then(function(data) {
	//
	// 		$scope.latitudeObj = data;
	// 		$rootScope.latitudeObj_root = data;
	//
	// 		//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
	// 		$rootScope.latitude=0;
	// 		$scope.latitude = $scope.latitudeObj.latitude;
	// 		retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
	// 			$rootScope.longitudeObj_root = {};
	// 			$scope.longitudeObj = data;
	// 			$rootScope.longitudeObj_root = data;
	//
	// 			$scope.longitude = $scope.longitudeObj.longitude;
	// 			$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
	// 			var lat_range =Math.abs($scope.latitudeObj.lat_max - $scope.latitudeObj.lat_min);
	//
	// 				var lng_range =Math.abs($scope.longitudeObj.long_max - $scope.longitudeObj.long_max)
	//
	// 				if(lat_range>lng_range)
	// 				{
	// 					var finalRange=lat_range
	// 				}
	// 				else
	// 				{
	// 					var finalRange=lng_range;
	// 				}
	//
	// 				$scope.zoom=Spotify.runRange(finalRange)
	// 				$scope.counter = counter;
	// 				for(var t=0; t<2; t++)
	// 					{
	//
	// 						var start_number = t*50;
	//
	// 						PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era,$scope.start_number).then(function(data){
	// 							arr = arr.concat(data);
	//
	//
	// 								tmparr.push(t)
	// 								if(tmparr.length==t)
	// 								{
	// 									///////////No songs from this geolocation///////////
	// 									if(data.songsArr.length==0 && $scope.holder_arr.length>0)
	// 									{
	//
	// 										$rootScope.loading=false;
	// 										if($scope.btnCount>0)
	// 										{
	//
	// 										$scope.noMoreSongs=true;
	// 										$scope.moreHider=true;
	// 										}
	// 										else{
	// 										$scope.noMoreSongs=false;
	// 										$scope.moreHider=false;
	// 										}
	//
	// 										$scope.donesy=true;
	// 										var index1 = $scope.holder_arr.length-20;
	// 										var index2 = $scope.holder_arr.length;
	//
	//
	// 										Spotify.createPlaylist($scope.holder_arr).then(function(result) {
	// 											$scope.songs = result.songs.slice($scope.index1, $scope.index2+20)
	// 											$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20)
	// 											$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20)
	// 											artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20)
	// 											$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20)
	//
	// 											$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
	// 											$rootScope.songs_root = $scope.songs;
	//
	// 												Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// 															LocationDataFetch.count=1;
	// 															$rootScope.mapdata = data;
	// 															$scope.stillLooking = false;
	// 															$rootScope.loading=false;
	// 															$rootScope.mapOpening=false;
	// 															$scope.checkForMore=true;
	// 															$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)
	// 															});
	//
	// 										},function(error){
	// 											$scope.errorMessage = true;
	// 										});
	//
	// 									}
	// 									///////////Number of songs is less than 100 and geolocation needs to be extended and has not yet gone through 5 ratio changes
	// 									else if (arr.length < 100 && $scope.counter<=5) {
	//
	//
	// 										$scope.counter = $scope.counter + 1;
	// 										if($rootScope.marked==true) {
	// 										$scope.moreHider=true;
	// 										$rootScope.loading=false;
	// 										$scope.noMoreSongs = true;
	// 										}
	//
	// 										else if ($scope.counter <= 5 && $scope.holder_arr.length<50) {
	//
	//
	// 											if($scope.counter>3)
	// 											{
	// 											$scope.stillLooking = true;
	// 											}
	// 											$scope.start_number=$scope.start_number+50;
	// 											LocationDataFetch.count = 0;
	// 											$scope.runApp($scope.start_number, $scope.counter, '', arr, $scope.holder_arr);
	//
	// 										}
	// 										else if(arr.length==0){
	// 											$rootScope.noSongs=true;
	// 										}
	//
	// 										else if(arr.length<100 && $scope.counter>=6){
	// 										ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
	// 										///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
	// 										//////////////data returned should obj {songs:[], holder_arr:[]}
	// 											var tmparr=[];
	// 											var tmparr2 =[];
	// 											for(var y=0; y<data.length; y++)
	// 											{
	// 												tmparr.push(y);
	//
	// 												Spotify.checkSongMarket(data[y].songs).then(function(result) {
	// 												console.log(result)
	//
	// 												for (var x = 0; x < result.length; x++) {
	//
	// 													tmparr2.push(x)
	// 													songs_for_service.push(result[x]);
	// 													if(tmparr.length==data.length &&tmparr2.length==result.length)
	// 													{
	// 													$scope.holder_songs ={};
	// 													$scope.holder_arr = songs_for_service;
	// 													$rootScope.holder_arr_root=songs_for_service;
	// 													Spotify.createPlaylist(songs_for_service).then(function(result) {
	//
	// 														$scope.holder_songs.songs = result.songs;
	// 														$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
	// 														$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
	// 														$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
	// 														artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
	// 														$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
	// 														$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
	// 														$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
	// 														$rootScope.songs_root = $scope.songs;
	//
	// 															Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// 															LocationDataFetch.count=1;
	// 															$rootScope.mapdata = data;
	// 															$scope.stillLooking = false;
	// 															$rootScope.loading=false;
	// 															$rootScope.mapOpening=false;
	// 															$scope.checkForMore=true;
	// 															$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)
	// 															});
	//
	// 													},function(error){
	// 														$scope.errorMessage = true;
	// 													});
	// 													}
	//
	// 												}
	// 												});
	// 											}
	//
	//
	// 										},function(error){
	// 													$scope.errorMessage = true;
	// 												});
	//
	// 									}
	//
	//
	//
	// 									}
	// 									/////////////////Songs are over 50 and required fewer than 5 ratio changes////////////////
	// 									////////////////This is generally what is used for larger cities//////////////////////////
	// 									else if(arr.length>100 &&($scope.donesy==false||$scope.donesy==undefined)){
	// 										ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
	//
	// 										///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
	// 										//////////////data returned should obj {songs:[], holder_arr:[]}
	//
	// 											var tmparr=[];
	// 											var tmparr2 =[];
	// 											for(var y=0; y<data.length; y++)
	// 											{
	// 												tmparr.push(y);
	// 												Spotify.checkSongMarket(data[y].songs).then(function(result) {
	// 												for (var x = 0; x < result.length; x++) {
	//
	// 													tmparr2.push(x);
	// 													songs_for_service.push(result[x]);
	// 													if(tmparr.length==data.length &&tmparr2.length==result.length)
	// 													{
	// 													$scope.holder_songs ={};
	// 													$scope.holder_arr = songs_for_service;
	// 													$rootScope.holder_arr_root = songs_for_service;
	// 														if(result.length>0 && $scope.counter<2 && $scope.holder_arr.length<150)
	// 														{
	// 															$scope.counter++;
	// 															LocationDataFetch.count=0;
	// 															$scope.runApp($scope.start_number, $scope.counter, '', [], $scope.holder_arr);
	//
	//
	// 														}
	// 														else{
	// 															Spotify.createPlaylist(songs_for_service).then(function(result) {
	//
	// 															$scope.holder_songs.songs = result.songs;
	// 															$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
	// 															$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
	// 															$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
	// 															artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
	// 															$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
	// 															$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
	// 															$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
	// 															$rootScope.songs_root = $scope.songs;
	//
	// 															Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// 															LocationDataFetch.count=1;
	// 															$rootScope.mapdata = data;
	// 															$scope.stillLooking = false;
	// 															$rootScope.loading=false;
	// 															$rootScope.mapOpening=false;
	// 															$scope.checkForMore=true;
	// 															$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)
	// 															});
	//
	// 														},function(error){
	// 															$scope.errorMessage = true;
	// 														});
	// 														}
	//
	//
	//
	// 													}
	//
	// 												}
	//
	//
	//
	// 												});
	// 											}
	//
	//
	// 										},function(error){
	// 													$scope.errorMessage = true;
	// 												});
	//
	// 									}
	//
	// 							}
	// 						},function(error){
	// 							$scope.errorMessage = true;
	// 						});
	//
	// 					}
	// 		},function(error){$scope.errorMessage = true;});
	//
	// 	},function(error){$scope.errorMessage = true;});
	//
	// };

	$scope.runApp = function() {
			var location_comp = $routeParams.location;
		//if (LocationDataFetch.count == 0 || $rootScope.songs_root == undefined ||$rootScope.noSongs==true ) {
			$rootScope.mapOpening = true;
			// $rootScope.holder=[];
			// $rootScope.loading=true;
			// $scope.lookupSongs=[];
			// $rootScope.aboutMarked=false;
			// $scope.newlocation = true;
			retrieveLocation.runLocation(location_comp).then(function(data) {
				var city_data = data.join('_');
				PlaylistCreate.runPlaylist(city_data).then(function(data){
					$rootScope.songs = data;
						Spotify.runGenres(data.chunked_arr[0]).then(function(data) {
							$rootScope.songs.spotify_info = data.spotify_info;
							$scope.loading = false;
							$scope.mapdata.lat=data.spotify_info[0].location.lat;
							$scope.mapdata.lng=data.spotify_info[0].location.lng;
							$scope.mapdata.markers=data.spotify_info;
							$scope.newlocation = false;
							$rootScope.mapOpening = false;
							Events.getGeoEvents($scope.mapdata.lat, $scope.mapdata.lng).then(function(result){
								$scope.events = result;
						 });
						})
				});
			},function(error){
				$scope.errorMessage = true;
			});
		}

		///$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude);
			$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};


	//$scope.location ='Finding your location...'

	// if($routeParams.location==undefined)
	// {
	// $routeParams.location ='Finding your location'
	// $scope.location = 'Finding your location...';
	// getLocation.checkGeoLocation()
	// }
	// else{
	// $scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	// $scope.location_link = $routeParams.location;
	// if ($rootScope.loading==true) {
	// $scope.runApp(0,1);
	// }
	// }
	// $scope.lookUpDates = function(){
	// 	$scope.runEvents($scope.lat, $scope.lng, $scope.date1, $scope.date2)
	// }
	// $scope.runEvents = function(lat, lng)
	// {
	// $scope.lat= lat;
	// $scope.lng = lng;
	// $scope.eventData=false;
	// $rootScope.loadingEvents=true;

	$scope.runApp();
	//  Events.getGeoEvents($rootScope.mapdata.lat, $rootScope.mapdata.lng).then(function(result){
	//  	//$scope.events =[];
	//  	if(JSON.stringify(result).match('error'))
	// 	{
	// 		$scope.noShows =true;
	// 	}
	// 	else{
	// 		$scope.noShows =false;
	// 		$scope.events=result;
	// 		for(var t=0; t<$scope.events.length; t++)
	// 		{
	 //
	 //
	// 			$scope.date=new Date($scope.events[t].datetime);
	// 			$scope.hours =$scope.date.getHours();
	// 			if($scope.hours<23)
	// 			{
	// 			$scope.fin_hours = $scope.hours+2;
	// 			}
	// 			else{
	// 				$scope.fin_hours = 0+2
	// 			}
	// 			$scope.month = ($scope.date.getMonth()+1);
	// 			if($scope.events[t].tags!=undefined&&$scope.events[t].tags.tag!=undefined)
	// 			{
	// 				$scope.events[t].tagsStr = $scope.events[t].tags.tag.toString().replace(/,/g, ', ')
	 //
	// 			}
	// 			if($scope.hours.toString().length<2)
	// 			{
	// 				$scope.hours =0+''+$scope.hours
	// 			}
	// 			if($scope.fin_hours.toString().length<2)
	// 			{
	// 				$scope.fin_hours =0+''+$scope.fin_hours;
	// 			}
	 //
	// 			if($scope.month.toString().length<2)
	// 			{
	// 				$scope.month =0+''+$scope.month;
	// 			}
	 //
	// 			$scope.events[t].date =($scope.month)+'/'+$scope.date.getDate()+'/'+$scope.date.getFullYear()+', '+$scope.hours+':00 - '+$scope.fin_hours+':00';
	// 	//	console.log($scope.events[t].date)
	 //
	 //
	// 		}
	// 	}
	// 	$scope.eventData=true;
	// 	$rootScope.loadingEvents=false;
	//  },function(error){$scope.errorMessage = true;});



	if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{

			$scope.runApp(0, 1);

		}
	else
	{
		$rootScope.loadingEvents=true
		$scope.runEvents($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude);

	}
}]);




Events.controller('LoadBandEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','LocationDataFetch','Spotify','Wiki','ChunkSongs',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, LocationDataFetch, Spotify, Wiki, ChunkSongs){
	$rootScope.noGeo=false;
	$rootScope.infoMessage=false;
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	$scope.artist = $location.path().split('/')[3];
	$rootScope.loading = true;
	var songs_for_service=[];
	$scope.songs={};
	$scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {
		$rootScope.loading=true;
		if(arr==undefined)
		{
			 var arr=[];
		}
		else{
			var arr=arr;
		}
			if(arr2==undefined)
		{
			$scope.holder_arr=[];

		}
		else{
			$scope.holder_arr=arr2;

		}
		if(index1==undefined){
			 $scope.index1 = 0;
		}
		else{
			$scope.index1 = index1;
		}

		if(index2==undefined){
			$scope.index2 = 20;
		}
		else{
			$scope.index2 = index2;
		}
		if(type=='button')
		{
			songs_for_service=[];
		}
		var tmparr=[];
		LocationDataFetch.count = 1;
		$rootScope.mapOpening = true;

		$scope.start_number = start_number;

		$scope.counter = counter;
		$scope.ratio = .15 * counter;
		$rootScope.holder=[];
		$rootScope.count_about =0;
		$rootScope.moreLookUp=false;
		$scope.songs=[];
		$rootScope.songs_root=[];
		retrieveLocation.runLocation($scope.location.replacePatterns(), 'lat', counter).then(function(data) {

			$scope.latitudeObj = data;
			$rootScope.latitudeObj_root = data;

			//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
			$rootScope.latitude=0;
			$scope.latitude = $scope.latitudeObj.latitude;
			retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
				$rootScope.longitudeObj_root = {};
				$scope.longitudeObj = data;
				$rootScope.longitudeObj_root = data;

				$scope.longitude = $scope.longitudeObj.longitude;
				$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
				var lat_range =Math.abs($scope.latitudeObj.lat_max - $scope.latitudeObj.lat_min);

					var lng_range =Math.abs($scope.longitudeObj.long_max - $scope.longitudeObj.long_max)

					if(lat_range>lng_range)
					{
						var finalRange=lat_range
					}
					else
					{
						var finalRange=lng_range;
					}

					$scope.zoom=Spotify.runRange(finalRange)
					$scope.counter = counter;
					for(var t=0; t<2; t++)
						{

							var start_number = t*50;

							PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era,$scope.start_number).then(function(data){
								arr = arr.concat(data);


									tmparr.push(t)
									if(tmparr.length==t)
									{
										///////////No songs from this geolocation///////////
										if(data.songsArr.length==0 && $scope.holder_arr.length>0)
										{

											$rootScope.loading=false;
											if($scope.btnCount>0)
											{

											$scope.noMoreSongs=true;
											$scope.moreHider=true;
											}
											else{
											$scope.noMoreSongs=false;
											$scope.moreHider=false;
											}

											$scope.donesy=true;
											var index1 = $scope.holder_arr.length-20;
											var index2 = $scope.holder_arr.length;


											Spotify.createPlaylist($scope.holder_arr).then(function(result) {
												$scope.songs = result.songs.slice($scope.index1, $scope.index2+20)
												$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20)
												$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20)
												artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20)
												$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20)

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
										///////////Number of songs is less than 100 and geolocation needs to be extended and has not yet gone through 5 ratio changes
										else if (arr.length < 100 && $scope.counter<=5) {


											$scope.counter = $scope.counter + 1;
											if($rootScope.marked==true) {
											$scope.moreHider=true;
											$rootScope.loading=false;
											$scope.noMoreSongs = true;
											}

											else if ($scope.counter <= 5 && $scope.holder_arr.length<50) {


												if($scope.counter>3)
												{
												$scope.stillLooking = true;
												}
												$scope.start_number=$scope.start_number+50;
												LocationDataFetch.count = 0;
												$scope.runApp($scope.start_number, $scope.counter, '', arr, $scope.holder_arr);

											}
											else if(arr.length==0){
												$rootScope.noSongs=true;
											}

											else if(arr.length<100 && $scope.counter>=6){
											ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
											///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
											//////////////data returned should obj {songs:[], holder_arr:[]}
												var tmparr=[];
												var tmparr2 =[];
												for(var y=0; y<data.length; y++)
												{
													tmparr.push(y);

													Spotify.checkSongMarket(data[y].songs).then(function(result) {
													console.log(result)

													for (var x = 0; x < result.length; x++) {

														tmparr2.push(x)
														songs_for_service.push(result[x]);
														if(tmparr.length==data.length &&tmparr2.length==result.length)
														{
														$scope.holder_songs ={};
														$scope.holder_arr = songs_for_service;
														$rootScope.holder_arr_root=songs_for_service;
														Spotify.createPlaylist(songs_for_service).then(function(result) {

															$scope.holder_songs.songs = result.songs;
															$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
															$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
															$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
															artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
															$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
															$scope.holder_arr = ($scope.holder_arr.removeDuplicatesArrObj, 'name', true);
															$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
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

													}
													});
												}


											},function(error){
														$scope.errorMessage = true;
													});

										}



										}
										/////////////////Songs are over 50 and required fewer than 5 ratio changes////////////////
										////////////////This is generally what is used for larger cities//////////////////////////
										else if(arr.length>100 &&($scope.donesy==false||$scope.donesy==undefined)){
											ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){

											///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
											//////////////data returned should obj {songs:[], holder_arr:[]}

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
														$scope.holder_songs ={};
														$scope.holder_arr = songs_for_service;
														$rootScope.holder_arr_root = songs_for_service;
															if(result.length>0 && $scope.counter<2 && $scope.holder_arr.length<150)
															{
																$scope.counter++;
																LocationDataFetch.count=0;
																$scope.runApp($scope.start_number, $scope.counter, '', [], $scope.holder_arr);


															}
															else{
																Spotify.createPlaylist(songs_for_service).then(function(result) {

																$scope.holder_songs.songs = result.songs;
																$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
																$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
																$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
																artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
																$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
																$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
																$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
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
														}
													}
												});
											}


										},function(error){
													$scope.errorMessage = true;
												});
										}

								}
							},function(error){
								$scope.errorMessage = true;
							});

						}
			},function(error){$scope.errorMessage = true;});

		},function(error){$scope.errorMessage = true;});

	};
	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));

		runSymbolChange.changeSymbol();
	};
	if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{

			$scope.runApp(0, 1);

		}

	$scope.eventBandData=false;
	$rootScope.loading=true;

	 Events.getArtistEvents($scope.artist).then(function(result){
			//$scope.shows=[];

		if(JSON.stringify(result).match('error'))
		{
			$scope.noEvents =true;
		}
		else{

			$scope.shows=result;
			if($scope.shows.length==0){
				$scope.noEvents =true;
			}
			else{
			$scope.noEvents =false;
			$scope.shows.performers=[]
			for(var t=0; t<$scope.shows.length; t++)
			{


			for(var t=0; t<$scope.shows.length; t++)
			{


				$scope.date=new Date($scope.shows[t].datetime);
				$scope.hours =$scope.date.getHours();
				if($scope.hours<23)
				{
				$scope.fin_hours = $scope.hours+2;
				}
				else{
					$scope.fin_hours = 0+2
				}
				$scope.month = ($scope.date.getMonth()+1);
				if($scope.shows[t].tags!=undefined&&$scope.shows[t].tags.tag!=undefined)
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

				$scope.shows[t].date =($scope.month)+'/'+$scope.date.getDate()+'/'+$scope.date.getFullYear()+', '+$scope.hours+':00 - '+$scope.fin_hours+':00';
		//	console.log($scope.events[t].date)


			}
		}

		$scope.eventBandData=true;
		$rootScope.loading=false;
		}
		}
	 },function(error){$scope.errorMessage = true;});

}]);
