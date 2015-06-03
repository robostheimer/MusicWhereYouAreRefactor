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
	$scope.location = $routeParams.location;
	$scope.leaveOut = [];
	$scope.d = new Date();
	$scope.date = 
	$scope.date = ($scope.d.getMonth()+1) + '/' + $scope.d.getDate() + '/' + $scope.d.getFullYear();
	$scope.start_number = 0;
	var ls_arr = jQuery.parseJSON(localStorage.FavoriteArr);
	$scope.moreHider = true;
	$scope.backHider = true;
	$scope.viewall = false;
	var songs_for_service=[];
	$scope.songs=[];
	Favorites.addFavorites();

	/*$scope.runApp = function(start_number, counter) {
		
			
			$rootScope.mapOpening = true;
			
			$scope.start_number = start_number;
			$scope.counter = counter;
			$scope.ratio = .05 * counter;
			$rootScope.holder=[];
			$rootScope.count_about =0;
			$rootScope.moreLookUp=false;
			if(localStorage.FavoriteArr!=null)
			{
				$scope.songsFav= jQuery.parseJSON(localStorage.FavoriteArr);
			}
			else
			{
				$scope.songsFav=[];
			}
			
			$scope.songsFav.spot_arr=[];
			$scope.songsFav.savSpotArr=[];
			
			var artistlocation = '';
			var artistlocations ={latitude:[], longitude:[]};
			$scope.location_arr = [];
			
				if($scope.songsFav.length>0)
				{					
					for(var x=0; x<$scope.songsFav.length; x++)
					{
					$scope.songsFav.spot_arr.push($scope.songsFav[x].id);
					$scope.songsFav.savSpotArr.push('spotify:track:'+$scope.songsFav[x].id);
					$scope.songsFav[x].artist_location.location_link=$scope.songsFav[x].artist_location.location.replace(/,/g, '*')	
				
					
					Spotify.lookUpEchonest($scope.songsFav[x]).then(function(data){
						
						
						artistlocation =data.artist_location.location;
						artistlocations.latitude.push(data.artist_location.latitude);	
						artistlocations.longitude.push(data.artist_location.longitude);
						artistlocations.latitude.sort();
						artistlocations.longitude.sort();
						

						
						$scope.location_arr.push(data.artist_location.location +'@@'+data.artist_location.latitude + ':' + data.artist_location.longitude+'&&<h5>'+data.name+'</h5><p>'+data.artists[0].name+'</p><a href="spotify:track:'+data.id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+data.location+'/'+data.artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
						
						if(artistlocations.longitude.length==$scope.songsFav.length)
						{
							var lat_range =Math.abs(artistlocations.latitude[artistlocations.latitude.length-1]-artistlocations.latitude[0]);
							var lng_range = Math.abs(artistlocations.longitude[artistlocations.longitude.length-1]-artistlocations.longitude[0]);
							var latitude =(artistlocations.latitude[artistlocations.latitude.length-1]+artistlocations.latitude[0])/2;
							var longitude = (artistlocations.longitude[artistlocations.longitude.length-1]+artistlocations.longitude[0])/2
							if(lat_range>lng_range)
							{
								var finalRange=lat_range					
							}
							else
							{
								var finalRange=lng_range;
							}
							$scope.zoom=Spotify.runRange(finalRange);
							
							
							
							Spotify.createLatLng($scope.location_arr, 0, $scope.zoom, latitude, longitude, $scope.songsFav.spot_arr).then(function(data){
								$rootScope.mapdata=data;
								console.log($rootScope.mapdata)
							});
							LocationDataFetch.count=100000000000;
						}
						},function(error){$scope.errorMessage = true;});
				
			}
			
		}
		else if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{
			
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
						MapCreate.runMap(12, $scope.latitude,$scope.longitude, 0,[],[]);
						$rootScope.loading=false;
					},function(error){$scope.errorMessage = true;});
				},function(error){$scope.errorMessage = true;});		
			
		}
		else{
			$rootScope.loading=false;
		}	
			
		
	};*/
	
		$scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {		
		
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
		
			
			$rootScope.mapOpening = true;
			var arr=[];
			$scope.songs = [];
			$scope.songs.spot_arr = [];
			$scope.spot_arr = [];
			$scope.savSpotArr = [];
			$scope.location_arr = [];
			$scope.final_loc_arr = [];
			var location_comp = $routeParams.location;
			$scope.ratio = .15* counter;
			$scope.start_number= start_number;
			$scope.holder_arr=[];
			var tmparr=[];
			retrieveLocation.runLocation($scope.location.replacePatterns(), 'lat', counter).then(function(data) {
				
				$scope.latitudeObj = data;
				$rootScope.latitudeObj_root = data;
				$scope.latitude = $scope.latitudeObj.latitude;
				retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
					
					$rootScope.longitudeObj_root = {};
					$scope.longitudeObj = data;
					$rootScope.longitudeObj_root = data;
					$scope.longitude = $scope.longitudeObj.longitude;
					$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
					
					
					var lat_range =Math.abs($scope.latitudeObj.lat_max - $scope.latitudeObj.lat_min);
					var lng_range =Math.abs($scope.longitudeObj.long_max - $scope.longitudeObj.long_min)
					var lat_avg =  ($scope.latitudeObj.lat_max + $scope.latitudeObj.lat_min)/2;
					var lng_avg = ($scope.longitudeObj.long_max + $scope.longitudeObj.long_min)/2;
					
					if(lat_range>lng_range)
					{
						var finalRange=lat_range					
					}
					else
					{
						var finalRange=lng_range;
					}
					
					if($routeParams.location.split('*').length>1)
					{
						
					$scope.zoom=Spotify.runRange(finalRange)
										}
					else{
						$scope.zoom=6;
					}
					$rootScope.mapOpening=true;
					$scope.counter = counter;
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
															$scope.holder_arr =$scope.holder_arr.removeDuplicatesArrObj('name', true);
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
	
			});
	});
};	
	$scope.switchFavorite = function(id, num_id) {
		var songId = [];
		if (localStorage.getItem('FavoriteArr') != null && localStorage.getItem('FavoriteArr') != '') {
			var songFav = jQuery.parseJSON(localStorage.FavoriteArr);

		} else {
			var songFav = [];
		}
		
		
	
			for (var x = 0; x < songFav.length; x++) {

				songId.push($scope.songsFav[num_id].id);
			}
			var index =num_id
			
			songFav.splice(index, 1);
			
			localStorage.setItem('FavoriteArr', JSON.stringify(songFav));

			$scope.songsFav[num_id].favorite = 'off';
			$scope.songsFav[num_id].closeButton = true;
			if ($scope.songsFav.length < 1) {
				$scope.getFav = false;
			}

		

	};
	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
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
		if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{
			
			$scope.runApp(0, 1, $scope.holder_arr);
			
		}
	
	}
			
		$scope.detectDevice()
		/*else
		 {
		 $rootScope.new_location = $location.path();
		 //alert($rootScope.new_location);
		 $location.path('country');
		 }	*/
	

	$scope.songsFav = [];
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

			if (!txt.replace(/\W/g, '').match($scope.songs_repeater[x].id.replace(/\W/g, ''))) {
				$scope.songsFav.push($scope.songs_repeater[x]);
			}
			txt += $scope.songs_repeater[x].id;
		}
	}
	$scope.spot_arr = [];
	//$scope.songs.spot_str='';
	if ($scope.songsFav != null) {
		$scope.songsFav.spot_str = '';
		for (var x = 0; x < $scope.songsFav.length; x++) {
			$scope.spot_arr.push($scope.songsFav[x].id);
			$scope.save_arr.push('spotify:track:' + $scope.songsFav[x].id);
			$scope.songsFav[x].favorite = 'on';
		}

		$scope.songsFav.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
		$scope.songsFav.spot_str = $sce.trustAsResourceUrl($scope.songsFav.spot_str);

	} else {
		$scope.songsFav = []
		$scope.songsFav.spot_str = ''
	}
	
	$scope.location_link = $routeParams.location;

}]);