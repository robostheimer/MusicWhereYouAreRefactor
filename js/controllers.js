/* Controllers */

angular.module('UI-Loader', []).controller('Geolocate', ['$scope', '$window', '$http', '$sce', 'getLocation', '$rootScope', '$q', '$routeParams',
function($scope, $window, $http, $sce, getLocation, $q, $rootScope, $routeParams) {
		getLocation.checkGeoLocation()
		$scope.location=""
}]);

angular.module('Forms', []).controller('formController', ['$scope', '$rootScope', 'retrieveLocation', 'getLocation', '$q', 'HashCreate', '$location', 'HintShower', '$timeout', 'States', '$routeParams',
function($scope, $rootScope, retrieveLocation, getLocation, $q, HashCreate, $location, HintShower, $timeout, States, $routeParams) {
	$rootScope.showHint = false;

	var count = 0;
	count2 = 0;
	$scope.hintShower = function(location) {
		count = count + 1;

		$timeout(function() {
			

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
			
		}, 300);
		$scope.location_ = location;
		if ($scope.location_.toTitleCase().match('St.')) {
			$scope.location_ = $scope.location_.replace('St.', 'Saint');
		}
		if ($scope.location_.toTitleCase().match('New York,')) {
			$scope.location_ = $scope.location_.replace('New York,', 'New York City,');
		}
	
		$scope.type_location = $scope.location_.split(', ');

	};

	$scope.controlForm = function(location) {
		var states = States.createStateObj();
		
		$scope.genres = '';
		if ($scope.location == undefined || $scope.location == "") {
			var deferred_loc = $q.defer();
			getLocation.checkGeoLocation();
		} else {
			$scope.location = location.replace(' ', '_');
			if($scope.location.length==2)
				{
					var ab = location.toUpperCase();
					
					
					states.forEach(function(item){
						if(item.abbreviation==ab)
						{
							$scope.location =(states[x].name);
						}
						
					});
					
				}
			$location.path('playlist/' + $scope.location.replace(', ', '*'));
		};

	};
	$scope.closeHint = function() {

		$rootScope.showHint = false;
		
		$scope.location = ''
	};

}]).controller('hashedLocation', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'Wiki', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs', 'getLocation', 'Spotify','HashCreate','ChunkSongs','deviceDetector','Twitter',function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, Wiki, MapCreate, States, $sce, Favorites, ShareSongs, getLocation, Spotify, HashCreate, ChunkSongs, deviceDetector, Twitter) {
	
	var lookup_counter = 0;
	$rootScope.loading = true;
	$scope.sharer = false;
	$scope.shareBox = false;
	$rootScope.tags = [];
	$scope.aboutShower=false;
	$scope.fromShower=true;
	songs_for_service = [];
	$scope.tooMany==true;
	$rootScope.marked=false;
	$rootScope.aboutMarked =false;
	$scope.btnCount=0;
	$scope.collector_arr=[];
	$scope.finalcollector = [];
	$scope.finalcollector.idStr='';
	$scope.finalcollector.idArr=[];
	$scope.finalcollector.savSpotArr=[];
	$scope.finalcollector.location_arr=[];
	$scope.finalcollector.artistlocation='';
	$scope.finalcollector.artistlocations ={latitude:[], longitude:[]};
	$scope.number =0;
	$scope.countRunUserSearch=0;
	$scope.nearBy=0;
	$scope.citySearch=0;
	$scope.lengthy=0;
	$scope.showCityMessage=false;
	$rootScope.moreLookUp=false;
	$rootScope.prevLookUp=false;
	$scope.counter = 0;
	//Twitter.getOAuth();
	
	$scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {		
		$rootScope.loading=true;
		var arr=[];
		var holder_arr=[];
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
		
		$scope.songs = [];
		$scope.songs.spot_arr = [];
		$scope.spot_arr = [];
		$scope.savSpotArr = [];
		$scope.location_arr = [];
		$scope.final_loc_arr = [];
		
		
		$scope.shareBox = false;
		
		if(type=='button')
		{
		}
		$rootScope.trackStorage = localStorage.country;
		$scope.start_number = start_number;
		$scope.ratio = .05 * counter;
		
		$scope.counter = counter;
		if (LocationDataFetch.count == 0 || $rootScope.songs_root == undefined ||$rootScope.noSongs==true ) {
			$rootScope.mapOpening = true;
			$scope.lookUpSongs = [];
			$rootScope.holder=[];
			$rootScope.loading=true;
			$scope.lookupSongs=[];
			$rootScope.aboutMarked=false;
			retrieveLocation.runLocation(location_comp.replacePatterns(), 'lat', counter).then(function(data) {
				
				$scope.latitudeObj = data;
				$rootScope.latitudeObj_root = data;
				$scope.latitude = $scope.latitudeObj.latitude;
				retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
					if(data.longitude==undefined)
					{
						LocationDataFetch.count=0;
					}
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
					
					if ($routeParams.qs == undefined) {
						var tmparr=[];
						$scope.sharer = false;
						$scope.shareBox = false;
						//////////Work with preloading 500+  songs
						//console.log( $scope.latitudeObj.latitude);
						
						for(var t=0; t<5; t++)
						{
						
							$scope.start_number = t*50;
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
														if(result.length==0)
														{
															$scope.noSongs=true;
														}
													
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
													});
												}
												
												
											},function(error){
												$scope.errorMessage = true;
											});		
														
										}	
										
										else if($scope.counter==6)
											{
													$scope.noSongs=true;
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
					}  else {
						
						ShareSongs.createSongsList().then(function(result) {
							$scope.sharer = true;
							$scope.shareBox = false;
							$scope.songs = result;
							$scope.songs.pop();
							$scope.spot_arr = $scope.songs.spot_arr;
							$scope.savSpotArr = $scope.songs.savSpotArr;
							$rootScope.loading = false;
							if ($routeParams.location.split('*').length > 1) {
								$scope.zoom = 10;
					
							} else {
								$scope.zoom = 6;
							}
							$scope.counter=0;
							
							for (var b = 0; b < $scope.songs.length; b++) {
								$scope.songs[b].num_id = b;
								$scope.songs[b].favorite = 'off'
								Favorites.checkFavorites($scope.songs[b]);
							}

							$rootScope.songs_root = $scope.songs;
							$scope.moreHider=true;
							Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
							LocationDataFetch.count=1;
							$rootScope.mapdata = data;
							$scope.stillLooking = false;
							$rootScope.loading=false;
							$rootScope.mapOpening=false;
							$scope.checkForMore=true;
								
							});

										
							LocationDataFetch.count = 0;
							//Favorites.runFavorites($scope.songs);
					
						});
					}

				});

			},function(error){
				
				$scope.errorMessage = true;
			});

		} else if (($rootScope.longitudeObj_root.location != undefined && location_comp.replace('*', ', ').replace(/_/g, ' ').toLowerCase() != $rootScope.longitudeObj_root.location.replace(/_/g, ' ').toLowerCase() && locationdatacount != 0)||$rootScope.songs_root.length==0) {
			
			LocationDataFetch.count = 0;
			$rootScope.latitudeObj_root.location = $routeParams.location.replace('*', ' ');
			$rootScope.era = '';
			$rootScope.start_year = '';
			$rootScope.end_year = '';
			$rootScope.loading=true;
			$scope.runApp(0, 1, '', [], []);

		} else if (LocationDataFetch.count > 0) {
			
			$scope.shareBox = false;
			$scope.latitudeObj = {};
			$scope.longitudeObj = {};
			$scope.songs = {};

			$scope.latitudeObj = $rootScope.latitudeObj_root;
			$scope.longitudeObj = $rootScope.longitudeObj_root;
			$scope.songs = $rootScope.songs_root;
		
			$scope.songs.forEach(function(song){
				Favorites.checkFavorites(song);
			});
			$scope.holder_arr=$rootScope.holder_arr_root;
			if($rootScope.finalcollector_arr!=null)
			{
			$scope.finalcollector = $rootScope.finalcollector_arr;
			$scope.lookUpSongs = $rootScope.lookUpSongs_arr;
			$scope.lookUpSongs.idStr=$rootScope.lookUpSongs_arr.idStr;
			//$scope.finalcollector.idStr='';
			
			
			}
			else{
				$scope.finalcollector= [];
				$scope.lookUpSongs=[];
				$scope.lookUpSongs.idStr='';
			}
			
			
			if($scope.finalcollector.length>15)
			{
				$scope.moreLookUp=true;
			}
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
					
			$scope.stillLooking = false;						
			$rootScope.loading = false;		
			$rootScope.aboutMarked =true;
			//alert(LocationDataFetch.count)
			if(LocationDataFetch.count>=100000000000)
			{
			Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
				LocationDataFetch.count=1;
				$rootScope.mapdata = data;
				$scope.stillLooking = false;
				$rootScope.loading=false;
				$rootScope.mapOpening=false;
				$scope.checkForMore=true;
					
				});
	
				for (var zz = 0; zz < $scope.songs.length; zz++) {
				$scope.songs[zz].favorite = 'off';
		
				Favorites.checkFavorites($scope.songs[zz]);
				}
			}

		}
		locationdatacount = LocationDataFetch.count += 1;

	};

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
		$rootScope.loading_tags=true;
		
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
		
		LocationDataFetch.count=100000000000;
		
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
		
	
		if($rootScope.aboutMarked==false || LocationDataFetch.count<100000000000 ||$scope.finalcollector.length<50 && $scope.lookUpSongs.length==0)
		{
				$scope.finalcollector.idArr=[];
				$scope.finalcollector.savSpotArr=[];
				$scope.finalcollector.location_arr=[];
				$scope.location_arr=[];
				$scope.finalcollector.artistlocation='';
				$scope.finalcollector.artistlocations ={latitude:[], longitude:[]};
				var ft_length=0;
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
										
											/*if(scope.countRunUserSearch<2)
												{*/
												//$scope.runNearbySearch($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude,searchterm);
												$scope.runCityStateSearch(searchterm);
												
												$scope.countRunUserSearch++;
												//}
			
								
									});
									
									
								}
								else if(data.length>400)	
								{
											$scope.collector_arr=$scope.collector_arr.concat(data);
											$scope.countRunUserSearch=2;
											$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true)
								
											$scope.parseSongData($scope.collector_arr.reverse(), 'yes')	
								}
								
							else if(data.length==0 )
								{
									
									$scope.runNearbySearch($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude,searchterm);
									//$scope.runCitySearch(searchterm);
									$scope.countRunUserSearch++;
									
								}
						
						}
						else if(auto_or_user=="user"){
							
							
							Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
										
										$scope.collector_arr = result.concat($scope.collector_arr);
											$scope.countRunUserSearch=2;	
																			
											if(result.length==0 && form!=undefined)
											{
												$scope.userGenMessage =true;
											}
											else{
												$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true)
								
												$scope.parseSongData($scope.collector_arr,'yes')		
											}
								
							});
							}
						else if(typeof(auto_or_user) ==='number' ){
							console.log('test')
							
							Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
											
											$scope.collector_arr=result.concat($scope.collector_arr)
										//	$scope.parseSongData(result, 'yes', 'no')	;
											$scope.countRunUserSearch=2;
											if($scope.pass_length-1== auto_or_user)
											{
											$scope.collector_arr =$scope.collector_arr.removeDuplicatesArrObj('name', true)
									
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
					$scope.loading_tags=false;	
					//$scope.parseSongData($scope.finalcollector, 'no')
				
					
									
				}
				
	
	};
	$scope.parseSongData=function(result, usergen)
	{
		var collector=[];
		var arr=[];
		var songStr='';
		
		if(result.length==0)
		{
		$scope.showCityMessage=true;	
		}
		else{
		$scope.lengthy = $scope.lengthy+result.length;
		var deferred = $q.defer();
		
			if(usergen=='yes')

			{
				var resultNoDups=$scope.finalcollector.preventDuplicates(result, 'name', 'push');
				
			}	
			else{
				var resultNoDups=result;
			}	
			
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
							
;							$scope.createMapAbout($scope.finalcollector, 0);
						}
						
						
			
						});
						}
						
					songStr+=resultNoDups[t].name;
					$scope.loading_tags=false;
					$scope.aboutShower=true;
				
				}
				
				
		}
		
	
	};
	
	$scope.createMapAbout=function(arr, start_index)
	{
			
			$scope.finalcollector = arr;
			
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
				$scope.loading_tags=false;	
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
			for (var i = 0; i < $scope.songs.length; i++) {

				if (id == $scope.songs[i].id) {

					$scope.songs[i].closeButton = true;
					$scope.leaveOut.push($scope.songs[i].id);
					var existingLeaveOut = JSON.parse(localStorage.getItem("leaveOutArr"));
					if (existingLeaveOut == null)
						existingLeaveOut = [];
						var item = {
						title : $scope.songs[i].name,
						id : $scope.songs[i].id
						
					};

					localStorage.setItem("leaveOut", JSON.stringify(item));
					// Save allEntries back to local storage
					existingLeaveOut.push(item);
					localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));

				} else if (!$scope.leaveOut.toString().replace(/\W/g, '').match($scope.songs[i].id.replace(/\W/g, ''))) {

					$scope.spot_arr.push($scope.songs[i].id);

				}

				$scope.runApp(0, 1,'', [], $scope.holder_arr);

			}
		} else {
			$scope.lookUpSongs.idArr=[];
			for (var i = 0; i < $scope.lookUpSongs.length; i++) {

				if (id == $scope.lookUpSongs[i].id) {
					$scope.lookUpSongs[i].closeButton = true;
					$scope.leaveOut.push($scope.lookUpSongs[i].id);

					var existingLeaveOut = JSON.parse(localStorage.getItem("leaveOutArr"));
					if (existingLeaveOut == null)
						existingLeaveOut = [];
					var item = {
						song : $scope.lookUpSongs[i].name,
						id : $scope.lookUpSongs[i].id
					};

					localStorage.setItem("leaveOut", JSON.stringify(item));
					// Save allEntries back to local storage
					existingLeaveOut.push(item);
					localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));

				} else {
					//$scope.spot_arr.push($scope.lookUpSongs[i].id);
					$scope.lookUpSongs.idArr.push($scope.lookUpSongs[i].id)

				}
				
				

			}
			
			////$scope.parseSongData($scope.finalcollector, 'no', 'no')
		}
		$scope.lookUpSongs.idStr = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.lookUpSongs.idArr.toString();
		$scope.lookUpSongs.idStr = $sce.trustAsResourceUrl($scope.lookUpSongs.idStr);

	};

	$scope.switchFavorite = function(id, num_id, about_or_from) {
		//$scope.favoritesArr=[];
		
		var songId = [];
		if (localStorage.getItem('FavoriteArr') != null && localStorage.getItem('FavoriteArr') != '') {
			var songFav = jQuery.parseJSON(localStorage.FavoriteArr);

		} else {
			var songFav = [];
		}

		if (about_or_from == 'from') {
			
;			if ($scope.songs[num_id].favorite == 'off') {
				$scope.songs[num_id].favorite = 'on';
				songFav.push($scope.songs[num_id]);
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				$scope.favorites = Favorites.addFavorites();
			}
			else {
					for (var x = 0; x < songFav.length; x++) {
						songId.push(songFav[x].id);
					}
				var index = songId.indexOf($scope.songs[num_id].id);
				songFav.splice(index, 1);
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				$scope.songs[num_id].favorite = 'off';
			}
		}
		else if(about_or_from=='about')
		{
			
			if ($scope.lookUpSongs[num_id].favorite == 'off') {
				if(id= $scope.lookUpSongs[num_id].id)
				$scope.lookUpSongs[num_id].favorite = 'on';
				songFav.push($scope.lookUpSongs[num_id]);
	
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				$scope.favorites = Favorites.addFavorites();
			}
			else {
				console.log(songFav);
				for (var x = 0; x < songFav.length; x++) {
					songId.push(songFav[x].id);
				}
			var index = songId.indexOf($scope.songs[num_id].id);
			
			songFav.splice(index, 1);
			localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
			$scope.lookUpSongs[num_id].favorite = 'off';
			}		



		}

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
		
	
		else if($scope.checkForMore==true&&$scope.btnCount<20)
		{
			LocationDataFetch.count=0;
			$rootScope.loading=true;
			$scope.runApp($scope.start_number, 0, 'button', [], $scope.holder_arr, index1, index2);
			
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
	$scope.getSongs = function(songs) {
		var deferred = $q.defer();
		if(songs[0].artist_location==undefined)
			{
			var location = $routeParams.location;
			var str='';
			songs[0].artist_location = {};
			
			retrieveLocation.runLocation(location.replace(/_/g,' '), 'lat', counter).then(function(result){
				
				songs[0].artist_location.latitude = result.latitude;
				retrieveLocation.runLocation(location.replace(/_/g,' '), 'long', counter).then(function(result)
					{
												
						songs[0].artist_location.longitude = result.longitude;
						
						
						for(var x=1; x<songs.length; x++)
						{
							songs[x].artist_location={};
							songs[x].artist_location.latitude = songs[0].artist_location.latitude;
							songs[x].artist_location.longitude = songs[0].artist_location.longitude;
						}
						
						
						ShareSongs.getSongs(songs, $routeParams.location).then(function(url){
							ShareSongs.getLongURL(url).then(function(result) {
								$scope.long_url = result;
								ShareSongs.getBitLy($scope.long_url).then(function(result) {
					
									$scope.short_url = result;
									
									$scope.shareBox = true;
									
									$scope.message = 'Check out my playlist from @MusicWhereYouR, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
									$scope.message_link = encodeURIComponent($scope.message);
								},function(error){
								$scope.errorMessage = true;
								});
									
							},function(error){
							$scope.errorMessage = true;
							});
						},function(error){
						$scope.errorMessage = true;
						});	
					},function(error){
					$scope.errorMessage = true;
					});
				},function(error){
				$scope.errorMessage = true;
				});
			}
			else
			{
			ShareSongs.getSongs(songs, $routeParams.location).then(function(url){;
				
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
					},function(error){
					$scope.errorMessage = true;
					});
		
				},function(error){
				$scope.errorMessage = true;
				});
			},function(error){
				$scope.errorMessage = true;
			});
		}
	};

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
		}
		else{
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
		$scope.location = $routeParams.location.replace(/\*/g, ', ');
		$scope.location_link = $routeParams.location;

		/////compare a $rootScope location variable to routeParams.location + $rootScope.genres - if locations don't equal and genres do equal re-run retrieve, else nothing/
		var locationdatacount = LocationDataFetch.count;
		//$rootScope.locationdata = $rootScope.latitudeObj_root.location;
		var location_comp = $routeParams.location;
		var location_str = $routeParams.location;
		$scope.runApp(0, 1,'',[], $scope.holder_arr);
		Favorites.addFavorites();
	
			
		
	}
	$scope.detectDevice();

}]).controller('PostController',['$scope', '$http', function($scope, $http){
	
	$scope.runPost=function(data)
	{
		$http.post('php/result.php', data.holder_arr).success(function(response) {
			$scope.response = response;
			console.log($scope.response)
		 });
	}
	
}])
.controller('Spotify', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams',
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
			client_id = '70521c59988a4ff4afa24aabc182b94a';
			redirect_uri = 'http://musicwhereyour.com/callback.html';
		}

		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id + '&response_type=token' + '&scope=playlist-modify-private' + '&redirect_uri=' + encodeURIComponent(redirect_uri);

		localStorage.setItem('createplaylist-tracks', JSON.stringify(arr));
		localStorage.setItem('createplaylist-name', title);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	}
}]);
angular.module('Symbol', []).controller('controlSymbol', ['$scope', '$location', '$rootScope', 'runSymbolChange',
function($scope, $location, $rootScope, runSymbolChange) {

	$scope.location = $location.path().split('/')[2];
	if ($scope.location == undefined) {
		$scope.location = '';
	}
	$scope.hideIcons = false;
	//$scope.icons=runSymbolChange.addButtons()
	$scope.genre_class = {}
	$scope.playlist_class = {};
	$scope.favorite_class = {};
	$scope.map_class = {};
	$scope.jukebox_class = {};
	$scope.roadsoda_class = {};
	$scope.calendar_class = {}
	//$scope.menuPos=true;

	$scope.playlist_class.name = 'playlist';
	$scope.playlist_class.classy = "icon-song";
	$scope.playlist_class.state = 'off';
	$scope.playlist_class.href = '#/playlist/' + $scope.location;

	$scope.genre_class.name = 'genre';
	$scope.genre_class.classy = "iconequalizer12";
	$scope.genre_class.state = 'off';
	$scope.genre_class.href = '#/genres/' + $scope.location;

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
	$scope.toggleIcons = function() {

		if ($scope.hideIcons == true) {
			$scope.hideIcons = false;

		} else {
			$scope.hideIcons = true;
		}

	};
}])


angular.module('Info', []).controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo', 'retrieveLocation', 'LocationDataFetch','PlaylistCreate', 'Spotify', 'Wiki','ChunkSongs','$sce', 'deviceDetector',
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

angular.module('Genre', []).controller('GenreController', ['$scope', '$routeParams', 'retrieveLocation', 'LocationDataFetch', 'PlaylistCreate', 'MapCreate', '$location', '$rootScope', '$q', 'loadGenreCheckData', 'runSymbolChange', 'getLocation', 'Spotify', '$sce', 'Wiki','ChunkSongs',
function($scope, $routeParams, retrieveLocation, LocationDataFetch, PlaylistCreate, MapCreate, $location, $rootScope, $q, loadGenreCheckData, runSymbolChange, getLocation, Spotify, $sce, Wiki, ChunkSongs) {
	
	$rootScope.noGeo=false;
	///////////////////////Fix this; this is a mess.... Turn it into a service that can be called here and in the retrieve location controller/////////////////////////////
	if(sessionStorage.genre==null || sessionStorage.genre==false)
	{
	$scope.showGenreMessage=true;
	sessionStorage.genre=false;
	}
	else
	{
		$scope.showGenreMessage=false;
		sessionStorage.genre=true;
	}
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
	}];
	$scope.noPickedGenre = false;
	$scope.songs = [];
	var songs_for_service = []
	$scope.songs.spot_arr = [];
	//$scope.songs.songsArr= data.songsArr;
	$scope.spot_arr = [];
	$scope.location_arr = [];
	$scope.final_loc_arr = [];
	var titleStr = '';
	var idArr = [];
	if($rootScope.genreSans==null)
			{
				$rootScope.genreSans=[];
			}
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
	console.log($scope.Genre)
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
	if ($routeParams.location != undefined) {
		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	} else {
		$scope.location = ''
	}
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

	$scope.checkGenre = function(genre) {

		$rootScope.noSongs=false;
	
		
		for (var x = 0; x < $scope.Genre.length; x++) {
			

			if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'off') {
				$scope.Genre[x].genre.state = 'on';
				$scope.Genre[x].genre.isSelected = true;
				$scope.Genre[x].genre.checked = true;
				console.log($scope.Genre[x].genre)
				
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
				for(var y=0; y<$scope.Genre[x].genre.similarGenres.split('**').length;y++)
				{
					$rootScope.genreSans.push($scope.Genre[x].genre.similarGenres.split('**')[y])
				};
			} else if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'on') {
				$scope.Genre[x].genre.state = 'off';
				var genreSplitter = $rootScope.genres.split('**');
				for(var g=0; g<genreSplitter.length; g++)
					{
					var index = $rootScope.genreSans.indexOf(genreSplitter[g]);
					if (index > -1) {
						$rootScope.genreSans.splice(index, 1);
							
					}
				}
				$rootScope.genres = '';
				
			} else if ($scope.Genre[x].genre.state == 'on') {
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
				for(var y=0; y<$scope.Genre[x].genre.similarGenres.split('**').length;y++)
				{
					$rootScope.genreSans.push($scope.Genre[x].genre.similarGenres.split('**')[y])
				};
			}
		}
		if ($rootScope.genres == "") {
			$rootScope.genres = '****';
		}
		$scope.genre_str += $rootScope.genres;
		$scope.location = $scope.location.replace(/\*/g, ', ');
		if (localStorage.country != undefined) {
			$scope.runApp(0, 1, 'button');

		} else {
			$rootScope.new_location = $location.path();
			$location.path('country');
		}
		$scope.genre_hash = $location.path() + '/' + $rootScope.genres;
	};

	$scope.checkEra = function(start_year, end_year) {
		$rootScope.noSongs=false;
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
		
		$scope.era_str += $rootScope.era;
		$scope.location = $scope.location.replace(/\*/g, ', ');

		$scope.runApp(0, 1, 'button');
		$scope.era_hash = $location.path() + '/' + $rootScope.genres;
	};

	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

	$scope.lookUpGenre = function(genre) {

		$scope.noPickedGenre = false
		loadGenreCheckData.loadEchonestStyles().then(function(result) {
			var availableGenres = result;
			availableGenres.push({
				name : 'holiday'
			});
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
						$rootScope.genres += '**' + genreArr[u];
						$rootScope.genreSans.push(genreArr[u])
						
						$scope.noPickedGenre = false;
						$scope.runApp(0, 1, 'button');
						
					}

				}
			}
			
			
			if ($rootScope.genres.length == 0) {
				$scope.noPickedGenre = true;
			}
			$scope.genre = '';
		});

	};

	$scope.toggleGenre = function(genre) {
		//$rootScope.genres='';
		
		var index = $rootScope.genreSans.indexOf(genre);
		if (index > -1) {
			$rootScope.genreSans.splice(index, 1);
				
		}
		/////if a Genre button has been checked and then they toggle all of those selected genre tags, this turns off the button/////
		for(var c=0; c<$scope.Genre.length; c++)
		{
			
			if(!$rootScope.genreSans.toString().match($scope.Genre[c].genre.genre)){
				$scope.Genre[c].genre.checked=false;
			}
		}
		if ($rootScope.genreSans.length > 0) {
			

				$rootScope.genres = '****' + $rootScope.genreSans.toString().replace(/,/g,'**');
				
			
			
			$scope.runApp(0, 1, 'button');
		} else {
			$rootScope.genres = '';
			$scope.runApp(0, 1, 'button');
		}

	};
	
	

	$scope.close = function() {

		$scope.noCountry = false;

	
			localStorage.setItem('country', '');
			$location.path(localStorage.path);
			LocationDataFetch.count=0;
		
	};

	$scope.setCountry = function(country) {

		localStorage.country = country;
		localStorage.setItem('country', country)
		$scope.noCountry = false;
		$location.path(localStorage.path)
		LocationDataFetch.count = 0;
	};
	
	$scope.showResetMessage = function()
	{
		
	}
	
	$scope.resetCountry = function() {

		localStorage.removeItem('country')
		
		
		$scope.noCountry=true;
		

	};
	$scope.countryForm='';
	if(localStorage.country==undefined)
	{
		$scope.noCountry=true;
	}
	

	for (var x = 0; x < $scope.Genre.length; x++) {
		$scope.Genre[x].genre.state = "off";

		for (var i = 0; i < $rootScope.genres.split('***').length; i++) {
			if ($rootScope.genres.split('***')[i].replace('*', '') == $scope.Genre[x].genre.similarGenres) {
				$scope.Genre[x].genre.checked = true;
				$scope.Genre[x].genre.isSelected = true;
				$scope.Genre[x].genre.state = "on";
				console.log($scope.Genre[x].genre.isSelected)
				
			}
		}
	}

	if ($routeParams.genre !== undefined) {
		$rootScope.genres = $routeParams.genre;
	}
	//////////////////////////create Genre Service out of this function - run it in locationHash and here///////////////////
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

}]);

var FavoritesControllers = angular.module('FavoritesControllers', [])
FavoritesControllers.controller('LoadFav', ['$scope', '$q', '$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Favorites', 'ShareSongs', 'getLocation','Spotify','LocationDataFetch','Wiki','ChunkSongs','deviceDetector',
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

var Events = angular.module('Events', [])
Events.controller('LoadEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','getLocation','Spotify', 'LocationDataFetch','Wiki','ChunkSongs',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, getLocation, Spotify, LocationDataFetch, Wiki, ChunkSongs){
		$rootScope.noGeo=false;
		var songs_for_service=[];
		
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
																$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)		
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
																$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)		
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
																$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude)	
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

		
		///$scope.runEvents($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude);	
			$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};
	
	
	//$scope.location ='Finding your location...'
	
	if($routeParams.location==undefined)
	{
	$routeParams.location ='Finding your location'
	$scope.location = 'Finding your location...';
	getLocation.checkGeoLocation()
	}
	else{
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	if ($rootScope.loading==true) {
	$scope.runApp(0,1);	
	}
	}
	
	$scope.runEvents = function(lat, lng)
	{
	$scope.eventData=false;
	$scope.loadingEvents=true;
	
	 Events.getGeoEvents(lat,lng).then(function(result){
		//$scope.events =[];
		if(JSON.stringify(result).match('We could not find any upcoming events based on your specified location'))
		{	
			$scope.noShows =true;
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
		
				
				
			}
		}
		$scope.eventData=true;
		$scope.loadingEvents=false;
	 },function(error){$scope.errorMessage = true;});
	
		};	
	
	if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{
			
			$scope.runApp(0, 1);
			
		}
	else
	{
		$scope.loadingEvents=true
		$scope.runEvents($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude);
		
	}
}]);

Events.controller('LoadBandEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','LocationDataFetch','Spotify','Wiki','ChunkSongs',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, LocationDataFetch, Spotify, Wiki, ChunkSongs){
	$rootScope.noGeo=false;
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

		if(result.data.events.event==undefined)
		{	
			$scope.noEvents =true;
		}
		else{
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
		$rootScope.loading=false;
		
		
	 });
	
			
	
	
}]);


var Country = angular.module('Country', []);
Country.controller('addCountry', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'Wiki', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs', 'getLocation', 'Spotify',
function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, Wiki, MapCreate, States, $sce, Favorites, ShareSongs, getLocation, Spotify) {

	/*$scope.location = $location.path().split('/')[2];
	
	if ((localStorage.country == '' || localStorage.country == undefined)) {
		$rootScope.noCountry = true;
		

	} else {
		$rootScope.noCountry = false;
	}

	$scope.close = function() {

		$rootScope.noCountry = false;

	
			localStorage.setItem('country', '');
			$location.path(localStorage.path);
			LocationDataFetch.count=0;
		
	};

	$scope.setCountry = function(country) {

		localStorage.country = country;
		localStorage.setItem('country', country)
		$rootScope.noCountry = false;
		$location.path(localStorage.path)
		LocationDataFetch.count = 0;
	};

	$scope.resetCountry = function() {

		localStorage.removeItem('country')
		alert('Your country has been reset.');

	};
*/


}]);


var SongsAbout = angular.module('SongsAbout', []);
SongsAbout.controller('findSongsAbout', ['Spotify','$scope',
	function(Spotify, $scope) {
		$scope.songs=[];
		Spotify.runFusionTableJSON(38.35, -77.0, .75).then(function(data){
			$scope.data=data;
			});	
	
}]);
		/*Spotify.runLocationJSON().then(function(data){
			//console.log(data)
			
			$scope.songs=[];
			$scope.obj={};
			for(var x=46; x<47; x++)
			{
				
				var songs = data[x].gsx$songs.$t.replace(/\n/g, '@@');
				
				var splitter =songs.split('@@')
			
				
				for(var y=0; y<500; y++)
				{
					//console.log(data[x]);
					/*var artist=splitter[y].split('$$$$$$')[1];
				
				
					
					var i = artist.indexOf('[')	;
					var j = artist.indexOf(']')+1;*/
					/*var song = splitter[y].split('$$$$$$')[0];
					var k = song.indexOf('[');
					var l = song.indexOf(']')+1;
					
					
					//var slice1= artist.slice(i, j);
					var slice2 = song.slice(k, l);
					
					//artist =artist.replace(slice2, '')
					song = song.replace(slice2, '')
				$scope.song={song:song.replace(/"/g, ''), city: data[x].gsx$city.$t.split(', ')[0], geolocation:  data[x].gsx$geolocation.$t};
				
				console.log(song+':'+ $scope.song.city)	
				//console.log($scope.song.artist+':'+$scope.song.city);
					Spotify.runSongsAbout($scope.song, 25).then(function(data){
				
					
					$scope.songs.push(data);
					
					
				});
				
				}
					/*$scope.obj.song = $scope.songs[y];
					$scope.obj.artist = $scope.artists[y];
					$scope.obj.city = data[x].gsx$city.$t;
					$scope.obj.geolocation = data[x].gsx$geolocation;
					console.log($scope.obj)
				
				
				
			}
			
		});
		//SpotifyCitiesSearch.runSongsAbout(location).then(function(data){
		//	$scope.data=data;
		//});

}]);*/



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