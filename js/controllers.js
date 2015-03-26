/* Controllers */

angular.module('UI-Loader', []).controller('Geolocate', ['$scope', '$window', '$http', '$sce', 'getLocation', '$rootScope', '$q', '$routeParams',
function($scope, $window, $http, $sce, getLocation, $q, $rootScope, $routeParams) {

	if ($('#map-canvas').html().match('loading.gif"') || window.location.hash.split('/') < 2 || localStorage.country != undefined) {
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
		if (toTitleCase($scope.location_).match('New York,')) {
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
			if($scope.location.length==2)
				{
					var ab = location.toUpperCase();
					
					
					for(var x=0; x<states.length; x++)
					{
						
						if(states[x].abbreviation==ab)
						{
							$scope.location =(states[x].name);
							
							
						}
					}
				}
			$location.path('playlist/' + $scope.location.replace(', ', '*'));
		};

	};
	$scope.closeHint = function() {

		$rootScope.showHint = false;
		$scope.location = ''
	};

}]).controller('hashedLocation', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'Wiki', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs', 'getLocation', 'Spotify','SongLength','HashCreate',
function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, Wiki, MapCreate, States, $sce, Favorites, ShareSongs, getLocation, Spotify, SongLength, HashCreate) {
	localStorage.path=$location.path();
	var lookup_counter = 0;
	$rootScope.loading = true;
	$scope.sharer = false;
	$scope.shareBox = false;
	$rootScope.tags = [];
	$scope.aboutShower=false;
	$scope.fromShower=true;
	songs_for_service = [];
	$scope.tooMany==true;
	$scope.holder_arr=[];
	$rootScope.marked=false;
	$rootScope.aboutMarked =false;
	$scope.btnCount=0;
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
	
	$rootScope.moreLookUp=false;
	$rootScope.prevLookUp=false;
	//$scope.errorMessage=true;
	
	$scope.runApp = function(start_number, counter, type) {				
		
		$scope.songs = [];
		$scope.songs.spot_arr = [];
		$scope.spot_arr = [];
		$scope.savSpotArr = [];
		$scope.location_arr = [];
		$scope.final_loc_arr = [];
		
		
		$scope.shareBox = false;
		
		if(type=='button')
		{
			songs_for_service=[];
		}
		$rootScope.trackStorage = localStorage.country;
		$scope.start_number = start_number;
		$scope.ratio = .15 * counter;
		
		$scope.counter = counter;
		
		if (LocationDataFetch.count == 0 || $rootScope.songs_root == undefined ||$rootScope.noSongs==true ) {
			$rootScope.mapOpening = true;
			$scope.lookUpSongs = [];
			$rootScope.holder=[];
			
			$scope.lookupSongs=[];
			$rootScope.aboutMarked=false;
			
			
			retrieveLocation.runLocation(replacePatterns(location_comp), 'lat', $scope.ratio).then(function(data) {
				
				$scope.latitudeObj = data;
				$rootScope.latitudeObj_root = data;
				$scope.latitude = $scope.latitudeObj.latitude;
				retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
					
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
						
						$scope.sharer = false;
						$scope.shareBox = false;

						PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era, $scope.start_number).then(function(data) {
							var location_str = '';
							if (data.data.response.songs.songsArr.length < 5) {
								$scope.counter = $scope.counter + 1;
								if($rootScope.marked==true) {
								$scope.moreHider=true;	
								$scope.loading=false;
								$scope.noMoreSongs = true;
								}								
								else if ($scope.counter <= 5) {
									$scope.stillLooking = true;
									LocationDataFetch.count = 0;
									$scope.runApp(0, $scope.counter, '');
									
								}
								else if ($scope.songs.length == 0 && $scope.counter>5) {
									
									$rootScope.noSongs = true;
								}
							}
							else
							{
								
							Spotify.checkSongMarket(data.data.response.songs.songsArr).then(function(result) {
								for (var x = 0; x < result.length; x++) {
									songs_for_service.push(result[x]);
									$scope.holder_arr.push(result[x]);
								}
							
								Spotify.createPlaylist(songs_for_service).then(function(result) {
									var allsongs = result.songs
									$scope.songs = result.songs.slice(0,20);
									$scope.songs.spot_arr = result.spot_arr.slice(0,20);
									$scope.songs.savSpotArr = result.savSpotArr.slice(0,20);
									artistlocation = result.artistlocation.slice(0,20);
									$scope.songs.location_arr = result.location_arr.slice(0,20);
									$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
									$rootScope.songs_root = $scope.songs;
									if ($scope.songs.length<20) {
										$scope.start_number = $scope.start_number+50;
										$scope.loading==true;
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										LocationDataFetch.count = 0;
										$scope.runApp($scope.start_number,1);
																				
									} else {
										$scope.loading = false;		
										$rootScope.marked =true;								
										$rootScope.noSongs = false;
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr);
										$scope.stillLooking = false;
										$rootScope.loading=false;
									}
								},function(error){
									$scope.errorMessage = true;
								});

							},function(error){
							$scope.errorMessage = true;
							});
							}

						},function(error){
							$scope.errorMessage = true;
						});

					} else {
						
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

							Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, lat_avg, lng_avg, $scope.spot_arr);
										$scope.stillLooking = false;
										$rootScope.loading=false;
										$rootScope.idStr = '';
										$rootScope.idArr = [];
										$rootScope.savIdArr = [];
										$rootScope.titleArr = [];

										
							LocationDataFetch.count = 0;
							//Favorites.runFavorites($scope.songs);
						},function(error){
							$scope.errorMessage = true;
						});
					}

				},function(error){
							$scope.errorMessage = true;
				});

			},function(error){
				$scope.errorMessage = true;
			});

		} else if ($rootScope.longitudeObj_root.location != undefined && location_comp.replace('*', ', ').replace(/_/g, ' ').toLowerCase() != $rootScope.longitudeObj_root.location.replace(/_/g, ' ').toLowerCase() && locationdatacount != 0) {
			
			LocationDataFetch.count = 0;
			$rootScope.latitudeObj_root.location = $routeParams.location.replace('*', ' ');
			$rootScope.era = '';
			$rootScope.start_year = '';
			$rootScope.end_year = '';
			$scope.runApp(0, 1, '');

		} else if (LocationDataFetch.count > 0) {
			
			$scope.shareBox = false;
			$scope.latitudeObj = {};
			$scope.longitudeObj = {};
			$scope.songs = {};

			$scope.latitudeObj = $rootScope.latitudeObj_root;
			$scope.longitudeObj = $rootScope.longitudeObj_root;
			$scope.songs = $rootScope.songs_root;
			$scope.holder_arr=$scope.songs;
			if($rootScope.finalcollector_arr!=null)
			{
			$scope.finalcollector = $rootScope.finalcollector_arr;
			$scope.lookUpSongs = $rootScope.finalcollector_arr.slice($scope.start_index,$scope.iterator);
			$scope.lookUpSongs.idStr=$rootScope.lookUpSongs_arr.idStr;
			$scope.finalcollector.idStr='';
			
			}
			else{
				$scope.finalcollector=[];
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
			Spotify.createLatLng($scope.songs.location_arr, 0, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.spot_arr);
			
			$rootScope.idStr = '';
			$rootScope.idArr = [];
			$rootScope.savIdArr = [];
			$rootScope.titleArr = [];
	
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
		
		
		$scope.number = number;
		
		var location_arr=[];
		$scope.start_index=number;
		$scope.iterator=15;

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
					console.log(location_ab)
					}
					
				}
				$scope.runUserSearch(location_ab, 30, 'no', 'auto')	;	
				$scope.countRunUserSearch = $scope.countRunUserSearch+1;
					
			}

				
			/////////////no songs/////////////
			else
			{
					
				$scope.runUserSearch(location_stringy, 30, 'no', 'auto')
			}	
		
		LocationDataFetch.count=100000000000;
		
		//}
		
	};
	$scope.runUserSearch=function(searchterm, number, usergen, auto_or_user)
	{
	console.log(auto_or_user);
	///////////////////////////Create JSON for all of the Cities over 100K (see google Spreadsheet) run against spotify.  
	//////////////////////////Add those to lists that already exist and put in fusion table to avoid having to hit Echonest 	
	//////////////////////////and spotify over and over again for Songs About.  Just do one big data dump///////////////////////////
	///////////Run the following code to get songs from Songs About DB///////////////
	/*Spotify.runFusionTableJSON(38.35, -77.0, .75).then(function(data){
			$scope.data=data;
			
		});	*/
	
		
		var searchterm = searchterm.replace('*', ', ');
		console.log(searchterm);
		if($scope.finalcollector==null)
		{
			$scope.finalcollector=[];	
			
		}
		
		if($rootScope.aboutMarked==false || LocationDataFetch.count<100000000000 ||$scope.finalcollector.length<50)
		{
				$scope.finalcollector.idArr=[];
				$scope.finalcollector.savSpotArr=[];
				$scope.finalcollector.location_arr=[];
				$scope.location_arr=[];
				$scope.finalcollector.artistlocation='';
				$scope.finalcollector.artistlocations ={latitude:[], longitude:[]};
					
				Spotify.runFusionTableJSON($rootScope.latitudeObj_root.latitude, $rootScope.longitudeObj_root.longitude, .5).then(function(data){
				if(auto_or_user=="auto")
				{		
					if(data.length>0)
						{
							
						$scope.parseSongData(data, 'no', 'no')
						
						}
						if(data.length<50)
						{
						
							
						Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
									
									var lengthy = result.length;
									if(result.length>0)
									{
									$scope.parseSongData(result, 'yes', usergen)	;
									}
									if($scope.countRunUserSearch<2 && result.length<30)
										{
											
											$scope.runCitySearch(searchterm);
											$scope.runNearbySearch(searchterm);
											$scope.countRunUserSearch++;
										}
	
						
					});
					}
				}
				else{
					Spotify.runSpotifySearch(searchterm, number, usergen).then(function(result) {
									
									var lengthy = result.length;
									if(result.length>0)
									{
									$scope.parseSongData(result, 'yes', 'yes')	;
									}
									if($scope.countRunUserSearch<2 && result.length<30)
										{
											
											$scope.runCitySearch(searchterm);
											$scope.runNearbySearch(searchterm);
											$scope.countRunUserSearch++;
										}
	
						
					});
					}
				
				
				
				
			},function(error){
				$scope.errorMessage = true;
			});
				
			
			
		}
		

		else{
					
					$rootScope.loading_tags=true;	
					var lat_range =Math.abs($scope.finalcollector.artistlocations.latitude[$scope.finalcollector.artistlocations.latitude.length-1]-$scope.finalcollector.artistlocations.latitude[0]);
					var lng_range = Math.abs($scope.finalcollector.artistlocations.longitude[$scope.finalcollector.artistlocations.longitude.length-1]-$scope.finalcollector.artistlocations.longitude[0]);
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
					$rootScope.aboutMarked =true;
					$scope.zoom=Spotify.runRange(finalRange)
					Spotify.createLatLng( $scope.finalcollector.location_arr,0, zoom,lat_avg, lng_avg,  $scope.lookUpSongs);
					LocationDataFetch.count=100000000000;
					$rootScope.loading_tags=false;								
				}
				
	
	};
	$scope.parseSongData=function(result, echonest, usergen)
	{
		
		var collector=[];
		var arr=[];
		var songStr='';
		var lengthy = result.length;
		$scope.lengthy = $scope.lengthy+result.length;
			if(echonest=='yes')
			{
				
					for(var t=0; t<result.length; t++)
					{
						result[t].favorite='off'
						if((localStorage.country!="" || localStorage.country!=undefined) && result[t].available_markets.toString().match(localStorage.country))
						{
							
						Spotify.lookUpEchonest(result[t]).then(function(result){
							result.num_id=$scope.finalcollector.length;
							collector.push(result);
							if(usergen=='yes')
							{
								$scope.finalcollector.splice(0, 0, result)
								$scope.finalcollector.idArr.splice(0,0, result.id);
								$scope.finalcollector.savSpotArr.splice(0,0,'spotify:track:'+result.id)
								$scope.location_arr.splice(0,0,result.artist_location.location +'@@'+result.artist_location.latitude + ':' + result.artist_location.longitude+'&&<h5>'+result.name+'</h5><p>'+result.artists[0].name+'</p><a href="spotify:track:'+result.id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+result.artist_location.location.replace(', ' , '*').split(',')[0]+'/'+result.artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
							}
							else{
								$scope.finalcollector.push(result);
								$scope.finalcollector.idArr.push(result.id);
								$scope.finalcollector.savSpotArr.push('spotify:track:'+result.id);
								$scope.location_arr.push(result.artist_location.location +'@@'+result.artist_location.latitude + ':' + result.artist_location.longitude+'&&<h5>'+result.name+'</h5><p>'+result.artists[0].name+'</p><a href="spotify:track:'+result.id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+result.artist_location.location.replace(', ' , '*').split(',')[0]+'/'+result.artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
							}
							
							Favorites.checkFavorites(result);
							$scope.finalcollector.artistlocation =result.artist_location.location;
							$scope.finalcollector.artistlocations.latitude.push(result.artist_location.latitude);	
							$scope.finalcollector.artistlocations.longitude.push(result.artist_location.longitude);
							$scope.finalcollector.artistlocations.latitude.sort();
							$scope.finalcollector.artistlocations.longitude.sort();
			
						if(lengthy==collector.length)
						{
			
								
									if($scope.finalcollector.length>15)
										{
										
										$scope.lookUpSongs=$scope.finalcollector.slice($scope.start_index,$scope.iterator);
										$rootScope.lookUpSongs_arr = $scope.finalcollector.slice($scope.start_index,$scope.iterator);
										$rootScope.finalcollector_arr = $scope.finalcollector;
										$scope.idArr=$scope.finalcollector.idArr.slice($scope.start_index,$scope.iterator);
										$scope.finalcollector.location_arr=$scope.location_arr
										$rootScope.idArr_arr = $scope.idArr.slice(0, $scope.iterator)
										//$scope.finalcollector.idStr=$scope.finalcollector.idArr.toString();
										$rootScope.moreLookUp=true;
									
										}
										else{
										$scope.lookUpSongs=$scope.finalcollector;
										$rootScope.lookUpSongs_arr = $scope.lookUpSongs;
									
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
									var lat_range =Math.abs($scope.finalcollector.artistlocations.latitude[$scope.finalcollector.artistlocations.latitude.length-1]-$scope.finalcollector.artistlocations.latitude[0]);
									var lng_range = Math.abs($scope.finalcollector.artistlocations.longitude[$scope.finalcollector.artistlocations.longitude.length-1]-$scope.finalcollector.artistlocations.longitude[0]);
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
									
									
									Spotify.createLatLng( $scope.finalcollector.location_arr,0, $scope.zoom,lat_avg, lng_avg, $scope.lookUpSongs);
									LocationDataFetch.count=200000000000;
									$rootScope.loading_tags=false;		
									$scope.showCityMessage=false;						
							}
						
			
						});
						}
					songStr+=result[t].name;
				}
				
		}
		else{
			
			for(var x=0; x<result.length; x++)
			{
				collector.push(result[x]);
				
				
				
				$scope.finalcollector.push(result[x]);
				$scope.finalcollector.idArr.push(result[x].id);
				$scope.finalcollector.savSpotArr.push('spotify:track:'+result[x].id);
				$scope.location_arr.push(result[x].artist_location.location +'@@'+result[x].artist_location.latitude + ':' + result[x].artist_location.longitude+'&&<h5>'+result[x].name+'</h5><p>'+result[x].artists[0].name+'</p><a href="spotify:track:'+result[x].id+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+result[x].artist_location.location.replace(', ' , '*').split(',')[0]+'/'+result[x].artists[0].name.replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
			
			
			Favorites.checkFavorites(result[x]);
			$scope.finalcollector.artistlocation =result[x].artist_location.location;
			$scope.finalcollector.artistlocations.latitude.push(parseFloat(result[x].artist_location.latitude));	
			$scope.finalcollector.artistlocations.longitude.push(parseFloat(result[x].artist_location.longitude));
			$scope.finalcollector.artistlocations.latitude.sort();
			$scope.finalcollector.artistlocations.longitude.sort();

			if(lengthy==collector.length)
			{

					
						
						if($scope.finalcollector.length>15)
							{
							
							$scope.lookUpSongs=$scope.finalcollector.slice($scope.start_index,$scope.iterator);
							$rootScope.lookUpSongs_arr = $scope.finalcollector.slice($scope.start_index,$scope.iterator);
							$rootScope.finalcollector_arr = $scope.finalcollector;
							$scope.idArr=$scope.finalcollector.idArr.slice($scope.start_index,$scope.iterator);
							$scope.finalcollector.location_arr=$scope.location_arr;
							$rootScope.idArr_arr = $scope.idArr.slice(0, $scope.iterator)
							//$scope.finalcollector.idStr=$scope.finalcollector.idArr.toString();
							$rootScope.moreLookUp=true;
						
							}
							else{
							$scope.lookUpSongs=$scope.finalcollector;
							$rootScope.lookUpSongs_arr = $scope.lookUpSongs;
						
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
						console.log(($scope.finalcollector.artistlocations.longitude));
						
						var lat_range =Math.abs($scope.finalcollector.artistlocations.latitude[($scope.finalcollector.artistlocations.latitude.length/2)-2]-$scope.finalcollector.artistlocations.latitude[0]);
						var lng_range = Math.abs($scope.finalcollector.artistlocations.longitude[($scope.finalcollector.artistlocations.longitude.length/2)-2]-$scope.finalcollector.artistlocations.longitude[0]);
						var lat_avg = ($scope.finalcollector.artistlocations.latitude[($scope.finalcollector.artistlocations.latitude.length/2)-2]+$scope.finalcollector.artistlocations.latitude[0])/2;
						var lng_avg=($scope.finalcollector.artistlocations.longitude[($scope.finalcollector.artistlocations.longitude.length/2)-2]+$scope.finalcollector.artistlocations.longitude[0])/2
						if(lat_range>lng_range)
						{
							var finalRange=lat_range					
						}
						else
						{
							var finalRange=lng_range;
						}
						$scope.zoom=Spotify.runRange(finalRange);
						
						Spotify.createLatLng( $scope.finalcollector.location_arr,0, $scope.zoom,lat_avg, lng_avg, $scope.lookUpSongs);
						LocationDataFetch.count=200000000000;
						$rootScope.loading_tags=false;		
						$scope.showCityMessage=false;
					}	
				}
			
		}
	};
	$scope.runNearbySearch=function(searchterm)
	{
		$scope.nearBy++;
		
		
		$scope.showCityMessage=true;
					
					//console.log($scope.countRunUserSearch);
					if($scope.nearBy<=1)
					{
					
					Spotify.createCities($rootScope.latitudeObj_root.latitude,$rootScope.longitudeObj_root.longitude).then(function(data){
								
								if(data.length>0)
								{
									if(data.length<2)
									{
										var lengthy=data.length;
									}
									else{
										var lengthy=3;
									}
												
									for(var y=0; y<lengthy; y++)
			   						{
				
			   						HashCreate.runHash(parseFloat(data[y].lat), parseFloat(data[y].long), false, .02).then(function(result){
	
			   							console.log(result);	
	   							
										$scope.runUserSearch(result.city, 15, 'no', 'auto')	;
	
				   					});
				   					
									}
							}
						else{
							$scope.countRunUserSearch++;
							$scope.runUserSearch(searchterm, 30, 'yes', 'user')	;	
						}	
					});
					}
						
	};
	$scope.runCitySearch = function(searchterm)
	{
		console.log(searchterm)
		$scope.countRunUserSearch++;
		console.log('citysearching')
		$scope.runUserSearch(searchterm.split(',')[0], 30, 'yes', 'user')	;
	};
	$scope.runCityStateSearch = function(searchterm)
	{
		$scope.countRunUserSearch++;
		$scope.runUserSearch(searchterm, 30, 'no', 'auto')
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
						song : $scope.songs[i].name,
						id : $scope.songs[i].id
					};

					localStorage.setItem("leaveOut", JSON.stringify(item));
					// Save allEntries back to local storage
					existingLeaveOut.push(item);
					localStorage.setItem("leaveOutArr", JSON.stringify(existingLeaveOut));

				} else if (!$scope.leaveOut.toString().replace(/\W/g, '').match($scope.songs[i].id.replace(/\W/g, ''))) {

					$scope.spot_arr.push($scope.songs[i].id);

				}

				$scope.runApp(0, 1,'');

			}
		} else {
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

				} else if (!$scope.leaveOut.toString().replace(/\W/g, '').match($scope.lookUpSongs[i].id.replace(/\W/g, ''))) {

					$scope.spot_arr.push($scope.lookUpSongs[i].id);

				}
				
				$scope.runApp(0, 1,'');

			}
		}
		$scope.songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
		$scope.songs.spot_str = $sce.trustAsResourceUrl($scope.songs.spot_str);

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
			if ($scope.songs[num_id].favorite == 'off') {
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
					for (var x = 0; x < songFav.length; x++) {
						songId.push(songFav[x].id);
					}
				var index = songId.indexOf($scope.songs[num_id].id);
				songFav.splice(index, 1);
				localStorage.setItem('FavoriteArr', JSON.stringify(songFav));
				$scope.songs[num_id].favorite = 'off';
			}		



		}

	};

	$scope.goBack = function() {

		$location.path('map/' + $scope.location.replace(', ', '*'));
		runSymbolChange.changeSymbol();
	};

	$scope.moreSongs = function() {
		$scope.start_number=$scope.start_number+50;
		
		$scope.btnCount=$scope.btnCount+1;
		if(($scope.holder_arr.length-$scope.btnCount*20)>20 )
		{
			var index1 = ($scope.btnCount*20);
			var index2 = ($scope.btnCount*20)+20;
			$scope.songs = $scope.songs = $scope.holder_arr.slice(index1, index2);
			if($scope.start_number>550)
			{
				$scope.moreHider=true;
				$scope.noMoreSongs = true;
			}
			
		} if($scope.start_number<601){
			
			LocationDataFetch.count = 0;
			$scope.songs = [];
			$scope.loading=true;
			$scope.runApp(($scope.btnCount*50)+1, 1, 'button');
			
						
		
		}
		else{
			$scope.moreHider=true;
			$scope.noMoreSongs = true;
		}
		
		goToByScrollTop('spot_holder');
	};
	$scope.backSongs = function()
	{
		$scope.noMoreSongs = false;
		$scope.start_number=$scope.start_number-50;
	
		
		var index1 = ($scope.btnCount*20)-20;
		var index2 = ($scope.btnCount*20);
		$scope.btnCount= $scope.btnCount-1;
		$scope.songs = $scope.holder_arr.slice(index1, index2);
		$scope.moreHider=false;
	};
	
	
	//////////////////////NEEDS WORK - ///////////////////////////
	
	
	
	$scope.moreSongsAbout=function(iterator)
	{
		
		
		$scope.number=$scope.number+1;
		if(($scope.number*iterator)+iterator<$scope.finalcollector.length)
		{
		$scope.prevLookUp=true;
		$scope.end_index = ($scope.number*iterator)+iterator;
		$scope.start_index = $scope.start_index+iterator;
		$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index);
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
		$scope.lookUpSongs = $scope.finalcollector.slice($scope.start_index, $scope.end_index)
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
			
			retrieveLocation.runLocation(location.replace(/_/g,' '), 'lat', .05).then(function(result){
				
				songs[0].artist_location.latitude = result.latitude;
				retrieveLocation.runLocation(location.replace(/_/g,' '), 'long', .05).then(function(result)
					{
												
						songs[0].artist_location.longitude = result.longitude;
						
						
						for(var x=1; x<songs.length; x++)
						{
							songs[x].artist_location={};
							songs[x].artist_location.latitude = songs[0].artist_location.latitude;
							songs[x].artist_location.longitude = songs[0].artist_location.longitude;
						}
						
						
						ShareSongs.getSongs(songs, $routeParams.location).then(function(url){
							//console.log(url)
							
							ShareSongs.getLongURL(url).then(function(result) {
								$scope.long_url = result;
								ShareSongs.getBitLy($scope.long_url).then(function(result) {
					
									$scope.short_url = result;
									
									$scope.shareBox = true;
									
									$scope.message = 'Check out my playlist from %23MusicWhereYouAre, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
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
				//console.log(url)
				
				ShareSongs.getLongURL(url).then(function(result) {
					
					$scope.long_url = result.url;
					if(result.sliced=='yes')
					{
						$scope.tooMany=true;
						
					}
					//console.log($scope.long_url)
					//console.log($scope.long_url)
					ShareSongs.getBitLy($scope.long_url).then(function(result) {
		
						$scope.short_url = result;
						
						$scope.shareBox = true;
						
						$scope.message = 'Check out my playlist from %23MusicWhereYouAre, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
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

	$scope.noPickedGenre = false;
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

	if ($routeParams.location == undefined) {
		$rootScope.loading = true;
		$scope.location = 'Finding your location...';
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
		if (location_comp.length == 2) {
			var states = States.createStateObj();
			for (var i = 0; i < states.length; i++) {
				if (location_comp.toLowerCase() == states[i].abbreviation.toLowerCase()) {
					location_comp = states[i].name;
				}
			}
		}

		if (localStorage.country != undefined) {

			$scope.wikiTags.push({
				'title' : location_str.split(',')[0],
				'classy' : 'off'
			});

			$scope.tagShower = true;
			$scope.runApp(0, 1,'');
			Favorites.addFavorites();
		} else {
			//alert($rootScope.new_location);
			$location.path('country');
		}
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
			client_id = '70521c59988a4ff4afa24aabc182b94a';
			redirect_uri = 'http://musicwhereyour.com/callback.html';
		}

		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id + '&response_type=token' + '&scope=playlist-modify-private' + '&redirect_uri=' + encodeURIComponent(redirect_uri);

		localStorage.setItem('createplaylist-tracks', JSON.stringify(arr));
		localStorage.setItem('createplaylist-name', title);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	};
	//https://accounts.spotify.com/authorize?client_id=59a6ff9db9a642c6adfd2ee2fd33a30f&response_type=token&scope=playlist-modify-private&redirect_uri=http%3A%2F%2Fcityblinking.com%2FMusicWhereYouAre%2Fapp%2Fcallback.html
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
}]);

angular.module('Info', []).controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo', 'retrieveLocation', 'LocationDataFetch','PlaylistCreate', 'Spotify', 'Wiki',
function($scope, $location, $rootScope, runSymbolChange, $routeParams, retrieveInfo, retrieveLocation, LocationDataFetch, PlaylistCreate, Spotify, Wiki) {
	localStorage.path=$location.path();
	$rootScope.loading = true;
	$scope.buttons = retrieveInfo.createObjects();
	$scope.buttonsArr = [$scope.buttons.bio, $scope.buttons.photos, $scope.buttons.videos, $scope.buttons.topsongs, $scope.buttons.news, $scope.buttons.related];
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	$scope.location_link = $routeParams.location;
	$scope.name = removeSpecialChar($routeParams.artist);
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
		
		retrieveLocation.runLocation(replacePatterns($scope.location), $rootScope.genres);
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
	$scope.runApp = function(start_number, counter) {
		
			
			$rootScope.mapOpening = true;
			
			$scope.songs = [];
			$scope.songs.spot_arr = [];
			$scope.spot_arr = [];
			$scope.savSpotArr = [];
			$scope.location_arr = [];
			$scope.final_loc_arr = [];
			var location_comp = $routeParams.location;
			$scope.ratio = .15 * counter;
			$scope.start_number= start_number;
			$scope.holder_arr=[];
			
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
					
					PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era, $scope.start_number).then(function(data) {
							//////////////Show or hide MoreButton/////////////////////
						

							var location_str = '';
						
							if (data.data.response.songs.songsArr.length < 5) {
								
								$scope.counter = $scope.counter + 1;
								
								/////For bigger cities checks to see if there have already been at least 20 songs from a locality and 
								//thus tells app not to extend the lat and long ranges  Adds message to UI letting users know
								/////that there are no more songs for this locality//////
								if($rootScope.marked==true) {
								
								$scope.moreHider=true;	
								$scope.loading=false;
								$scope.noMoreSongs = true;
								
									
								}								
								else if ($scope.counter <= 5) {
									$scope.stillLooking = true;
									LocationDataFetch.count = 0;
									
									$scope.runApp(0, $scope.counter, '');
									
									//$rootScope.loading = false;
								}
								else if ($scope.songs.length == 0 && $scope.counter>5) {
									
									$rootScope.noSongs = true;
									
									//$scope.stilllooking=false
								}
							}
							else
							{
								
							Spotify.checkSongMarket(data.data.response.songs.songsArr).then(function(result) {
								for (var x = 0; x < result.length; x++) {
									
									songs_for_service.push(result[x]);
									$scope.holder_arr.push(result[x]);
								
									//console.log(songs_for_service);
									
								}
								
								//console.log(songs_for_service)
								Spotify.createPlaylist(songs_for_service).then(function(result) {
									var allsongs = result.songs
									
									$scope.songs = result.songs.slice(0,20);
									$scope.songs.spot_arr = result.spot_arr.slice(0,20);
									//$scope.songs.savSpotArr = result.savSpotArr.slice(0,20);
									artistlocation = result.artistlocation.slice(0,20);
									$scope.songs.location_arr = result.location_arr.slice(0,20);
									//$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
									
									$rootScope.songs_root = $scope.songs;
									
									if ($scope.songs.length<20) {
										
										$scope.start_number = $scope.start_number+50;
										$scope.loading==true;
										
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										LocationDataFetch.count = 0;
										$scope.runApp($scope.start_number,1);
																				
									} else {
										$scope.loading = false;		
										/////////code marker that is used above to make sure that the cycle of going back to echonest ends/////////////
										$rootScope.marked =true;								
										$rootScope.noSongs = false;
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										//console.log($scope.songs.location_arr);
										Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr);
										$scope.stillLooking = false;
										$rootScope.loading=false;
									}
								},function(error){
									$scope.errorMessage = true;
								});

							},function(error){
							$scope.errorMessage = true;
							});
							}

						},function(error){
							$scope.errorMessage = true;
						});

				},function(error){$scope.errorMessage = true;});

			},function(error){$scope.errorMessage = true;});
	
	};

		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
		$scope.location_link = $routeParams.location;
		if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
			{
			$scope.runApp(0, 1);
			
		}
		
	

}]);

angular.module('Genre', []).controller('GenreController', ['$scope', '$routeParams', 'retrieveLocation', 'LocationDataFetch', 'PlaylistCreate', 'MapCreate', '$location', '$rootScope', '$q', 'loadGenreCheckData', 'runSymbolChange', 'getLocation', 'Spotify', '$sce', 'Wiki',
function($scope, $routeParams, retrieveLocation, LocationDataFetch, PlaylistCreate, MapCreate, $location, $rootScope, $q, loadGenreCheckData, runSymbolChange, getLocation, Spotify, $sce, Wiki) {
	localStorage.path=$location.path();
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
	}];
	$scope.noPickedGenre = false;
	$scope.songs = [];
	var songs_for_service = []
	$scope.songs.spot_arr = [];
	//$scope.songs.songsArr= data.data.response.songs.songsArr;
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
	$scope.runApp = function(start_number, counter, type) {
		if(type=='button')
		{
			songs_for_service=[];
		}
		
		LocationDataFetch.count = 1;
		$rootScope.mapOpening = true;
		
		$scope.start_number = start_number;

		$scope.counter = counter;
		$scope.ratio = .05 * counter;
		$rootScope.holder=[];
		$rootScope.count_about =0;
		$rootScope.moreLookUp=false;
		
		retrieveLocation.runLocation(replacePatterns($scope.location), 'lat', $scope.ratio).then(function(data) {

			$scope.latitudeObj = data;
			$rootScope.latitudeObj_root = data;

			//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
			$rootScope.latitude=0;
			$scope.latitude = $scope.latitudeObj.latitude;
			retrieveLocation.runLocation(replacePatterns($scope.location), 'long', $scope.ratio).then(function(data) {
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
					PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era, start_number).then(function(data) {
						
							//////////////Show or hide MoreButton/////////////////////
							if (data.data.response.songs.length < 20) {
								$scope.moreHider = true;
							} else {
								$scope.moreHider = false
							}

							var location_str = '';
							if (data.data.response.songs.songsArr.length < 5) {
								$scope.stillLooking = true;
								$scope.counter = $scope.counter + 1;
								

								if ($scope.counter <= 5) {

									LocationDataFetch.count = 0;
									$scope.runApp(0, $scope.counter);
									//$rootScope.loading = false;
								}
								if ($scope.songs.length == 0 && $scope.counter>5) {
									$rootScope.noSongs = true;
									//$scope.stilllooking=false
								}
							}
							else
							{
							Spotify.checkSongMarket(data.data.response.songs.songsArr).then(function(result) {
								for (var x = 0; x < result.length; x++) {
									songs_for_service.push(result[x]);
									

								}
								Spotify.createPlaylist(songs_for_service).then(function(result) {
									$scope.songs = result.songs;
									$scope.songs.spot_arr = result.spot_arr;
									$scope.songs.savSpotArr = result.savSpotArr;
									artistlocation = result.artistlocation;
									$scope.songs.location_arr = result.location_arr;
									$scope.songs.spot_strFinal = result.spot_strFinal;
									
									$rootScope.songs_root = $scope.songs;
									
									if ($scope.songs.length < 20) {
										$scope.start_number = $scope.start_number + 20;
										LocationDataFetch.count = 0;
										$scope.runApp($scope.start_number, 1);
										
									} else {
										$rootScope.loading = false;

										
										if ($scope.songs.length < 2) {
											$scope.moreHider = true;
										}
										$rootScope.noSongs = false;
										
										Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.spot_arr);
										LocationDataFetch.count=10000;
										$scope.stillLooking = false;
										$rootScope.loading=false;
										
										
									}
								},function(error){$scope.errorMessage = true;});

							},function(error){$scope.errorMessage = true;});
							}

						},function(error){$scope.errorMessage = true;});

			},function(error){$scope.errorMessage = true;});

		},function(error){$scope.errorMessage = true;});

	};

	$scope.checkGenre = function(genre) {

		for (var x = 0; x < $scope.Genre.length; x++) {
			

			if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'off') {
				$scope.Genre[x].genre.state = 'on';
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
				for(var y=0; y<$scope.Genre[x].genre.similarGenres.split('**').length;y++)
				{
					$rootScope.genreSans.push($scope.Genre[x].genre.similarGenres.split('**')[y])
				};
			} else if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'on') {
				$scope.Genre[x].genre.state = 'off';
				//console.log($rootScope.genres)
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

		$location.path('map/' + $scope.location.replace(', ', '*'));
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
			
			$scope.runApp(0, 1);
			
		}
	
	}

}]);

var FavoritesControllers = angular.module('FavoritesControllers', [])
FavoritesControllers.controller('LoadFav', ['$scope', '$q', '$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Favorites', 'ShareSongs', 'getLocation','Spotify','LocationDataFetch','Wiki',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Favorites, ShareSongs, getLocation, Spotify, LocationDataFetch, Wiki) {
	localStorage.path=$location.path();
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

	$scope.runApp = function(start_number, counter) {
		
			
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
			//console.log($scope.songsFav);
		
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
				
					//console.log($scope.songsFav[x].artist_location.location_link)		
					
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
							
							
							
							Spotify.createLatLng($scope.location_arr, 0, $scope.zoom, latitude, longitude, $scope.songsFav.spot_arr);
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
						//console.log($scope.tooMany)
						
					}
					ShareSongs.getBitLy($scope.long_url).then(function(result) {
		
						$scope.short_url = result;
						$scope.shareBox = true;
						
						$scope.message = 'Check out my playlist from %23MusicWhereYouAre, a geolocation-based music discovery app. Hows the music where you are? ' + $scope.short_url
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


	if ($routeParams.location == undefined) {
		$rootScope.loading = true;
		$scope.location = 'Finding your location...';
		getLocation.checkGeoLocation()

	} else {
		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
		$scope.location_link = $routeParams.location;
		
			$rootScope.loading = true;
			$scope.runApp(0, 1);
			
	}
			
		
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
Events.controller('LoadEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','getLocation','Spotify', 'LocationDataFetch','Wiki',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, getLocation, Spotify, LocationDataFetch, Wiki){
		localStorage.path=$location.path();
		var songs_for_service=[];
		
		$scope.runApp = function(start_number, counter) {
		
			
			$rootScope.mapOpening = true;
			
			$scope.songs = [];
			$scope.songs.spot_arr = [];
			$scope.spot_arr = [];
			$scope.savSpotArr = [];
			$scope.location_arr = [];
			$scope.final_loc_arr = [];
			var location_comp = $routeParams.location;
			$scope.ratio = .15 * counter;
			$scope.start_number= start_number;
			$scope.holder_arr=[];
			
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
					
					PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era, $scope.start_number).then(function(data) {
							//////////////Show or hide MoreButton/////////////////////
						

							var location_str = '';
						
							if (data.data.response.songs.songsArr.length < 5) {
								
								$scope.counter = $scope.counter + 1;
								
								/////For bigger cities checks to see if there have already been at least 20 songs from a locality and 
								//thus tells app not to extend the lat and long ranges  Adds message to UI letting users know
								/////that there are no more songs for this locality//////
								if($rootScope.marked==true) {
								
								$scope.moreHider=true;	
								$scope.loading=false;
								$scope.noMoreSongs = true;
								
									
								}								
								else if ($scope.counter <= 5) {
									$scope.stillLooking = true;
									LocationDataFetch.count = 0;
									
									$scope.runApp(0, $scope.counter, '');
									
									//$rootScope.loading = false;
								}
								else if ($scope.songs.length == 0 && $scope.counter>5) {
									
									$rootScope.noSongs = true;
									
									//$scope.stilllooking=false
								}
							}
							else
							{
								
							Spotify.checkSongMarket(data.data.response.songs.songsArr).then(function(result) {
								for (var x = 0; x < result.length; x++) {
									
									songs_for_service.push(result[x]);
									$scope.holder_arr.push(result[x]);
								
									
								}
								
								Spotify.createPlaylist(songs_for_service).then(function(result) {
									var allsongs = result.songs
									
									$scope.songs = result.songs.slice(0,20);
									$scope.songs.spot_arr = result.spot_arr.slice(0,20);
									//$scope.songs.savSpotArr = result.savSpotArr.slice(0,20);
									artistlocation = result.artistlocation.slice(0,20);
									$scope.songs.location_arr = result.location_arr.slice(0,20);
									//$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
									
									$rootScope.songs_root = $scope.songs;
									
									if ($scope.songs.length<20) {
										
										$scope.start_number = $scope.start_number+50;
										$scope.loading==true;
										
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										LocationDataFetch.count = 0;
										$scope.runApp($scope.start_number,1);
																				
									} else {
										$scope.loading = false;		
										/////////code marker that is used above to make sure that the cycle of going back to echonest ends/////////////
										$rootScope.marked =true;								
										$rootScope.noSongs = false;
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr);
										$scope.runEvents($scope.latitudeObj.latitude, $scope.longitudeObj.longitude)
										$scope.stillLooking = false;
										$rootScope.loading=false;
									}
								},function(error){
									$scope.errorMessage = true;
								});

							},function(error){
							$scope.errorMessage = true;
							});
							}

						},function(error){
							$scope.errorMessage = true;
						});

				},function(error){$scope.errorMessage = true;});

			},function(error){$scope.errorMessage = true;});
		
	};
		
		
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

Events.controller('LoadBandEvents', ['$scope', '$q','$http', 'runSymbolChange', '$routeParams', '$location', '$sce', 'retrieveLocation', 'PlaylistCreate', 'MapCreate', '$rootScope', 'Events','LocationDataFetch','Spotify','Wiki',
function($scope, $q, $http, runSymbolChange, $routeParams, $location, $sce, retrieveLocation, PlaylistCreate, MapCreate, $rootScope, Events, LocationDataFetch, Spotify, Wiki){
	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	$scope.location_link = $routeParams.location;
	$scope.artist = $location.path().split('/')[3];
	$rootScope.loading = true;
	var songs_for_service=[];
	$scope.songs={};
			$scope.runApp = function(start_number, counter) {
		
			$scope.songs = [];
			$scope.songs.spot_arr = [];
			$scope.spot_arr = [];
			$scope.savSpotArr = [];
			$scope.location_arr = [];
			$scope.final_loc_arr = [];
			var location_comp = $routeParams.location;
			$scope.ratio = .15 * counter;
			$scope.start_number= start_number;
			$scope.holder_arr=[];
			
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
					
					PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era, $scope.start_number).then(function(data) {
							//////////////Show or hide MoreButton/////////////////////
						

							var location_str = '';
						
							if (data.data.response.songs.songsArr.length < 5) {
								
								$scope.counter = $scope.counter + 1;
								
								/////For bigger cities checks to see if there have already been at least 20 songs from a locality and 
								//thus tells app not to extend the lat and long ranges  Adds message to UI letting users know
								/////that there are no more songs for this locality//////
								if($rootScope.marked==true) {
								
								$scope.moreHider=true;	
								$scope.loading=false;
								$scope.noMoreSongs = true;
								
									
								}								
								else if ($scope.counter <= 5) {
									$scope.stillLooking = true;
									LocationDataFetch.count = 0;
									
									$scope.runApp(0, $scope.counter, '');
									
									//$rootScope.loading = false;
								}
								else if ($scope.songs.length == 0 && $scope.counter>5) {
									
									$rootScope.noSongs = true;
									
									//$scope.stilllooking=false
								}
							}
							else
							{
								
							Spotify.checkSongMarket(data.data.response.songs.songsArr).then(function(result) {
								for (var x = 0; x < result.length; x++) {
									
									songs_for_service.push(result[x]);
									$scope.holder_arr.push(result[x]);
								
									
								}
								
								Spotify.createPlaylist(songs_for_service).then(function(result) {
									var allsongs = result.songs
									
									$scope.songs = result.songs.slice(0,20);
									$scope.songs.spot_arr = result.spot_arr.slice(0,20);
									//$scope.songs.savSpotArr = result.savSpotArr.slice(0,20);
									artistlocation = result.artistlocation.slice(0,20);
									$scope.songs.location_arr = result.location_arr.slice(0,20);
									//$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
									
									$rootScope.songs_root = $scope.songs;
									
									if ($scope.songs.length<20) {
										
										$scope.start_number = $scope.start_number+50;
										$scope.loading==true;
										
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										LocationDataFetch.count = 0;
										$scope.runApp($scope.start_number,1);
																				
									} else {
										$scope.loading = false;		
										/////////code marker that is used above to make sure that the cycle of going back to echonest ends/////////////
										$rootScope.marked =true;								
										$rootScope.noSongs = false;
										if($scope.start_number>550)
										{
											$scope.moreHider=true;
											$scope.noMoreSongs=true;
										}
										Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr);
										$scope.runEvents($scope.latitudeObj.latitude, $scope.longitudeObj.longitude)
										$scope.stillLooking = false;
										$rootScope.loading=false;
									}
								},function(error){
									$scope.errorMessage = true;
								});

							},function(error){
							$scope.errorMessage = true;
							});
							}

						},function(error){
							$scope.errorMessage = true;
						});

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

	$scope.location = $location.path().split('/')[2];
	
	if ((localStorage.country == '' || localStorage.country == null)) {
		$rootScope.noCountry = true;
		

	} else {
		$rootScope.noCountry = false;
	}

	$scope.close = function() {

		$rootScope.noCountry = false;

	
			localStorage.setItem('country', '');
			$location.path(localStorage.path);
			LocationDAtaFetch.count=0;
		
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



}]);


var SongsAbout = angular.module('SongsAbout', []);
SongsAbout.controller('findSongsAbout', ['Spotify','$scope',
	function(Spotify, $scope) {
		$scope.songs=[];
		Spotify.runFusionTableJSON(38.35, -77.0, .75).then(function(data){
			$scope.data=data;
			/*console.log($scope.data.length);
			//4,241///
			for(var x=0;x<120; x++)
			{
		
				Spotify.lookUpEchonest($scope.data[x]).then(function(data){
				$scope.songs.push(data);
			});
			}*/
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
function findThe(str)
{
	var strSlice = str.slice(3, str.length);
	strSlice = strSlice.replace('The', 'the');
	str = str.slice(0, 3)+strSlice;
	return str;
}
function sortNumber(a,b) {
    return a - b;
}