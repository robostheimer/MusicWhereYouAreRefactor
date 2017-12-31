var Settings=angular.module('Settings', []);
/*Services*/

Settings.factory("loadGenreCheckData", ['$routeParams','$http',
function($routeParams, $http){
	return {
			getGenre: function() {

			var Genre=[{genre: {checked : false,isSelected : false, state: 'off',  genre: 'avant garde', similarSettings: 'avant garde**avant garde jazz**avant garde metal', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'blues', similarSettings: 'blues**blues guitar**blues revival**blues rock**blues-rock**british blues**chicago blues**classic blues**contemporary blues**country blues**delta blues**electric blues**juke joint blues louisiana blues**memphis blues**modern blues**modern electric blues**new orleans blues**slide guitar blues**soul blues**texas blues', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'classic rock', similarSettings: 'classic rock' , year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre: 'classical', similarSettings: 'classical**classical pop**contemporary classical music**crossover classical**modern classical', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'comedy', similarSettings:'comedy**comedy rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'country', similarSettings: 'country rock**alternative country**country**honky tonk**cowboy punk**classic country**modern country**hillbilly**rockabilly**bluegrass**country pop**outlaw country**pop country**progressive country**texas country', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'drama', similarSettings: 'drama', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'electronic', similarSettings: 'electronic**electro**electro hip hop**electro house**electro rock**electro-funk**electro-industrial**electro jazz**experimental electronic**indie electronic', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre:'folk', similarSettings: 'folk**acid folk**alternative folk**contemporary folk**country folk**electric folk**folk pop**folk revival**folk rock**folk pop**indie folk**neo folk**pop folk**psychedelic folk**stomp and holler**traditional folk**urban folk', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'hip hop', similarSettings:'hip hop**classic hip hop**rap**west coast hip hop**alternative hip hop**east coast hip hop**electro hip hop**experimental hip hop**independent hip hop**indie hip hop**jazz hip hop**old school hip hop**southern hip hop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',   genre: 'holiday', similarSettings: 'holiday', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'indie', similarSettings: 'indie rock**geek rock**lo fi**math rock**indie folk**indie hip hop**indie**indy', year_end:''}}, {genre : {checked : false, isSelected : false, state: 'off',  genre : 'jazz', similarSettings: 'jazz**jazz blues**jazz funk**jazz fusion**jazz hip hop**jazz rock**jazz vocal**latin jazz**modern jazz**new orleans jazz**soul jazz**traditional jazz' , year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: "kid music", similarSettings:'children\'s music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'latin', similarSettings: 'latin**latin jazz**jazz latino**latin alternative**latin folk**latin hip hop**latin pop**latin music**latin rap**latin rock**latin ska', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre : 'new age', similarSettings:'new age**new age music', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'motown', similarSettings: 'motown**classic motown**soul**memphis soul**old school soul**soul music**soul', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'pop', similarSettings:'pop 60s pop**80s pop**acoustic pop**alternative pop**pop rock**dance pop**folk pop**jangle pop**pop country**pop punk**pop rap**pop folk**psychedelic pop', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'punk', similarSettings: 'punk**punk rock**acoustic punk**art punk**anarcho punk**classic punk**cowpunk**dance-punk**cyberpunk**emo punk**folk punk**garage punk**hardcore punk**indie punk**old school punk**political punk**skate punk**street punk', year_end:''}},{genre : {checked : false,isSelected : false, state: 'off',  genre: 'rock', similarSettings: 'rock**punk rock**classic rock**college rock**dance rock**electro rock**folk rock**garage rock**jam band**hard rock**modern rock**psychedelic stoner rock**punk**southern rock**80s rock**90s rock**70s rock**60s rock**alternative rock**acoustic rock**acid rock', year_end:''}}, {genre : {checked : false,isSelected : false, state: 'off',  genre: 'soft rock', similarSettings: 'soft rock**easy listening', year_end:''}}, {genre: {checked : false,isSelected : false, state: 'off',  genre: 'world', similarSettings: 'world world music**world beat**world fusion', year_end:''}}];


	return Genre;
	},
	getEra: function() {
			var d=new Date();
			var Era=[{era: {checked : false,isSelected : false, state: 'off',  era: 'twentyten', year_begin: '2010', year_end: d.getFullYear()}},{era: {checked : false,isSelected : false, state: 'off',  era: 'twenty', year_begin: '2000', year_end:'2009'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenninty', year_begin: '1990', year_end:'1999'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteeneighty', year_begin: '1980', year_end:'1989'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenseventy', year_begin: '1970', year_end:'1979'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteensixty', year_begin: '1960', year_end:'1969'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenfifty', year_begin: '1950', year_end:'1959'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenforty', year_begin: '1940', year_end:'1949'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenthrity', year_begin: '1930', year_end:'1939'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteentwenty', year_begin: '1920', year_end:'1929'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteenten', year_begin: '1910', year_end:'1919'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'nineteen', year_begin: '1900', year_end:'1909'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteenninty', year_begin: '1890', year_end:'1899'}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteeneighty', year_begin: '1880', year_end:'1889'}},{era: {checked : false,isSelected : false, state: 'off',  era: 'eighteenseventy', year_begin: '1870', year_end:''}}, {era: {checked : false,isSelected : false, state: 'off',  era: 'eighteensixty', year_begin: '1860', year_end:'1869'}}];

	return Era;
	},

	getMood: function() {

			var Mood=[{mood: {checked : false,isSelected : false, state: 'off',  mood: 'happy', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'angry', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'sad', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'sexy', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'quiet', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'dark', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'epic', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'party_music', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'intense', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'rowdy', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'cheerful', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'carefree', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'energetic', year_end:''}},{mood: {checked : false,isSelected : false, state: 'off',  mood: 'laid-back', year_end:''}}, {mood: {checked : false,isSelected : false, state: 'off',  mood: 'rebellious', year_end:''}}];

	return Mode;
	},

	loadEchonestStyles:function()
	{
		var url ='json/echonest_genres.json'


     			return $http.get(url).then(function(result)
     			{
     				var genres= result.data.response.terms

     				return genres;
     			});

	}

};
}]);

/*Controllers*/

Settings.controller('GenreController', ['$scope', '$routeParams', 'retrieveLocation', 'LocationDataFetch', 'PlaylistCreate', 'MapCreate', '$location', '$rootScope', '$q', 'loadGenreCheckData', 'runSymbolChange', 'getLocation', 'Spotify', '$sce', 'Wiki','ChunkSongs',
function($scope, $routeParams, retrieveLocation, LocationDataFetch, PlaylistCreate, MapCreate, $location, $rootScope, $q, loadGenreCheckData, runSymbolChange, getLocation, Spotify, $sce, Wiki, ChunkSongs) {
	//
	// $rootScope.noGeo=false;
	// ///////////////////////Fix this; this is a mess.... Turn it into a service that can be called here and in the retrieve location controller/////////////////////////////
	// if(sessionStorage.genre==null || sessionStorage.genre==false)
	// {
	// $scope.showGenreMessage=true;
	// sessionStorage.genre=false;
	// }
	// else
	// {
	// 	$scope.showGenreMessage=false;
	// 	sessionStorage.genre=true;
	// }
	// $scope.buttons = [{
	// 	name : 'genres',
	// 	state : 'shower',
	// 	classy : 'button_on'
	// }, {
	// 	name : 'eras',
	// 	state : 'hider',
	// 	classy : 'button_off'
	// }, {
	// 	name : 'moods',
	// 	state : 'hider',
	// 	classy : 'button_off'
	// }];
	// $scope.noPickedGenre = false;
	// $scope.songs = [];
	// var songs_for_service = []
	// $scope.songs.spot_arr = [];
	// //$scope.songs.songsArr= data.songsArr;
	// $scope.spot_arr = [];
	// $scope.location_arr = [];
	// $scope.final_loc_arr = [];
	// var titleStr = '';
	// var idArr = [];
	// if ($rootScope.genreSans==null) {
	// 			$rootScope.genreSans=[];
	// }
	// $scope.runButtons = function(id) {
	//
	// 	for (var c = 0; c < $scope.buttons.length; c++) {
	// 		if ($scope.buttons[c].name == id) {
	// 			$scope.buttons[c].state = 'shower';
	// 			$scope.buttons[c].classy = 'button_on';
	//
	// 		} else {
	// 			$scope.buttons[c].state = 'hider'
	// 			$scope.buttons[c].classy = 'button_off';
	// 		}
	//
	// 	}
	// };
	//
	// /////////////////////////Move this object to Services and bring it in? -- See TAS Project////////////////////////
	// $scope.Genre = loadGenreCheckData.getGenre();
	// console.log($scope.Genre)
	// $scope.avant_garde = $scope.Genre[0].genre;
	// $scope.blues = $scope.Genre[1].genre;
	// $scope.classic_rock = $scope.Genre[2].genre;
	// $scope.classical = $scope.Genre[3].genre;
	// $scope.comedy = $scope.Genre[4].genre;
	// $scope.country = $scope.Genre[5].genre;
	// $scope.drama = $scope.Genre[6].genre;
	// $scope.electronic = $scope.Genre[7].genre;
	// $scope.folk = $scope.Genre[8].genre;
	// $scope.hip_hop = $scope.Genre[9].genre;
	// $scope.holiday = $scope.Genre[10].genre;
	// $scope.indie = $scope.Genre[11].genre;
	// $scope.jazz = $scope.Genre[12].genre;
	// $scope.kid_music = $scope.Genre[13].genre;
	// $scope.latin = $scope.Genre[14].genre;
	// $scope.new_age = $scope.Genre[15].genre;
	// $scope.motown = $scope.Genre[16].genre;
	// $scope.pop = $scope.Genre[17].genre;
	// $scope.rock = $scope.Genre[18].genre;
	// $scope.soft_rock = $scope.Genre[19].genre;
	// $scope.world = $scope.Genre[20].genre;
	// if ($routeParams.location != undefined) {
	// 	$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
	// } else {
	// 	$scope.location = ''
	// }
	// $scope.genre_hash = '';
	//
	// $scope.Era = loadGenreCheckData.getEra();
	// $scope.Era.twentyten = $scope.Era[0].era;
	// $scope.Era.twenty = $scope.Era[1].era;
	// $scope.Era.nineteenninty = $scope.Era[2].era;
	// $scope.Era.nineteenteighty = $scope.Era[3].era;
	// $scope.Era.nineteenseventy = $scope.Era[4].era;
	// $scope.Era.nineteensixty = $scope.Era[5].era;
	// $scope.Era.nineteenfifty = $scope.Era[6].era;
	// $scope.Era.nineteenforty = $scope.Era[7].era;
	// $scope.Era.nineteenthirty = $scope.Era[8].era;
	// $scope.Era.nineteentwenty = $scope.Era[9].era;
	// $scope.Era.nineteenten = $scope.Era[10].era;
	// $scope.Era.nineteen = $scope.Era[11].era;
	// $scope.Era.eighteenninty = $scope.Era[12].era;
	// $scope.Era.eighteeneighty = $scope.Era[13].era;
	// $scope.Era.eighteenseventy = $scope.Era[14].era;
	// $scope.Era.eighteensixty = $scope.Era[15].era;
	// $scope.range_message = false;
	// $scope.selectera = false;
	// $scope.selectmood = false;
	//
	// var d = new Date();
	// $scope.d = d.getFullYear();
	//
	// if ($rootScope.start_year == '' || $rootScope.start_year == null) {
	// 	$scope.start_year = 1890;
	// }
	// if ($rootScope.end_year == '' || $rootScope.end_year == null) {
	// 	$scope.end_year = $scope.d;
	// } else {
	// 	$scope.end_year = $rootScope.end_year;
	// 	$scope.start_year = $rootScope.start_year;
	// }
	//
	// //$scope.runApp = function(start_number, counter, type, arr, arr2, index1, index2) {
	// 	$rootScope.loading=true;
	// 	$rootScope.infoMessage=false;
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
	// 	//retrieveLocation.runLocation($scope.location.replacePatterns(), 'lat', counter).then(function(data) {
	//
	// 		$scope.latitudeObj = data;
	// 		$rootScope.latitudeObj_root = data;
	//
	// 		//$rootScope.locationdata=$rootScope.latitudeObj_root.location;
	// 		$rootScope.latitude=0;
	// 		$scope.latitude = $scope.latitudeObj.latitude;
	// // 		retrieveLocation.runLocation($scope.location.replacePatterns(), 'long', counter).then(function(data) {
	// // 			$rootScope.longitudeObj_root = {};
	// // 			$scope.longitudeObj = data;
	// // 			$rootScope.longitudeObj_root = data;
	// //
	// // 			$scope.longitude = $scope.longitudeObj.longitude;
	// // 			$scope.geolocation = [$scope.latitudeObj, $scope.longitudeObj];
	// // 			var lat_range =Math.abs($scope.latitudeObj.lat_max - $scope.latitudeObj.lat_min);
	// //
	// // 				var lng_range =Math.abs($scope.longitudeObj.long_max - $scope.longitudeObj.long_max)
	// //
	// // 				if(lat_range>lng_range)
	// // 				{
	// // 					var finalRange=lat_range
	// // 				}
	// // 				else
	// // 				{
	// // 					var finalRange=lng_range;
	// // 				}
	// //
	// // 				$scope.zoom=Spotify.runRange(finalRange)
	// // 				$scope.counter = counter;
	// // 				for(var t=0; t<2; t++)
	// // 					{
	// //
	// // 						var start_number = t*50;
	// //
	// // 						PlaylistCreate.runPlaylist($scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.latitudeObj.lat_min, $scope.latitudeObj.lat_max, $scope.longitudeObj.long_min, $scope.longitudeObj.long_max, $rootScope.genres, $rootScope.era,$scope.start_number).then(function(data){
	// // 							arr = arr.concat(data);
	// //
	// //
	// // 								tmparr.push(t)
	// // 								if(tmparr.length==t)
	// // 								{
	// // 									///////////No songs from this geolocation///////////
	// // 									if(data.songsArr.length==0 && $scope.holder_arr.length>0)
	// // 									{
	// //
	// // 										$rootScope.loading=false;
	// // 										if($scope.btnCount>0)
	// // 										{
	// //
	// // 										$scope.noMoreSongs=true;
	// // 										$scope.moreHider=true;
	// // 										}
	// // 										else{
	// // 										$scope.noMoreSongs=false;
	// // 										$scope.moreHider=false;
	// // 										}
	// //
	// // 										$scope.donesy=true;
	// // 										var index1 = $scope.holder_arr.length-20;
	// // 										var index2 = $scope.holder_arr.length;
	// //
	// //
	// // 										Spotify.createPlaylist($scope.holder_arr).then(function(result) {
	// // 											$scope.songs = result.songs.slice($scope.index1, $scope.index2+20)
	// // 											$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20)
	// // 											$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20)
	// // 											artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20)
	// // 											$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20)
	// //
	// // 											$scope.songs.spot_strFinal =$sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:'+$scope.songs.spot_arr.toString());
	// // 											$rootScope.songs_root = $scope.songs;
	// //
	// // 												Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// // 															LocationDataFetch.count=1;
	// // 															$rootScope.mapdata = data;
	// // 															$scope.stillLooking = false;
	// // 															$rootScope.loading=false;
	// // 															$rootScope.mapOpening=false;
	// // 															$scope.checkForMore=true;
	// //
	// // 															});
	// //
	// // 										},function(error){
	// // 											$scope.errorMessage = true;
	// // 										});
	// //
	// // 									}
	// // 									///////////Number of songs is less than 100 and geolocation needs to be extended and has not yet gone through 5 ratio changes
	// // 									else if (arr.length < 100 && $scope.counter<=5) {
	// //
	// //
	// // 										$scope.counter = $scope.counter + 1;
	// // 										if($rootScope.marked==true) {
	// // 										$scope.moreHider=true;
	// // 										$rootScope.loading=false;
	// // 										$scope.noMoreSongs = true;
	// // 										}
	// //
	// // 										else if ($scope.counter <= 5 && $scope.holder_arr.length<50) {
	// //
	// //
	// // 											if($scope.counter>3)
	// // 											{
	// // 											$scope.stillLooking = true;
	// // 											}
	// // 											$scope.start_number=$scope.start_number+50;
	// // 											LocationDataFetch.count = 0;
	// // 											$scope.runApp($scope.start_number, $scope.counter, '', arr, $scope.holder_arr);
	// //
	// // 										}
	// // 										else if(arr.length==0){
	// // 											$rootScope.noSongs=true;
	// // 										}
	// //
	// // 										else if(arr.length<100 && $scope.counter>=6){
	// // 										ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
	// // 										///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
	// // 										//////////////data returned should obj {songs:[], holder_arr:[]}
	// // 											var tmparr=[];
	// // 											var tmparr2 =[];
	// // 											for(var y=0; y<data.length; y++)
	// // 											{
	// // 												tmparr.push(y);
	// //
	// // 												Spotify.checkSongMarket(data[y].songs).then(function(result) {
	// // 												console.log(result)
	// //
	// // 												for (var x = 0; x < result.length; x++) {
	// //
	// // 													tmparr2.push(x)
	// // 													songs_for_service.push(result[x]);
	// // 													if(tmparr.length==data.length &&tmparr2.length==result.length)
	// // 													{
	// // 													$scope.holder_songs ={};
	// // 													$scope.holder_arr = songs_for_service;
	// // 													$rootScope.holder_arr_root=songs_for_service;
	// // 													Spotify.createPlaylist(songs_for_service).then(function(result) {
	// //
	// // 														$scope.holder_songs.songs = result.songs;
	// // 														$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
	// // 														$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
	// // 														$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
	// // 														artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
	// // 														$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
	// // 														$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
	// // 														$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
	// // 														$rootScope.songs_root = $scope.songs;
	// //
	// // 															Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// // 															LocationDataFetch.count=1;
	// // 															$rootScope.mapdata = data;
	// // 															$scope.stillLooking = false;
	// // 															$rootScope.loading=false;
	// // 															$rootScope.mapOpening=false;
	// // 															$scope.checkForMore=true;
	// //
	// // 															});
	// //
	// // 													},function(error){
	// // 														$scope.errorMessage = true;
	// // 													});
	// // 													}
	// //
	// // 												}
	// // 												});
	// // 											}
	// //
	// //
	// // 										},function(error){
	// // 													$scope.errorMessage = true;
	// // 												});
	// //
	// // 									}
	// //
	// //
	// //
	// // 									}
	// // 									/////////////////Songs are over 50 and required fewer than 5 ratio changes////////////////
	// // 									////////////////This is generally what is used for larger cities//////////////////////////
	// // 									else if(arr.length>100 &&($scope.donesy==false||$scope.donesy==undefined)){
	// // 										ChunkSongs.createChunks(arr, 50, $scope.counter).then(function(data){
	// //
	// // 										///////////////run the rest in a Service to cut down on amount of stuff in the controller////////////
	// // 										//////////////data returned should obj {songs:[], holder_arr:[]}
	// //
	// // 											var tmparr=[];
	// // 											var tmparr2 =[];
	// // 											for(var y=0; y<data.length; y++)
	// // 											{
	// // 												tmparr.push(y);
	// // 												Spotify.checkSongMarket(data[y].songs).then(function(result) {
	// // 												for (var x = 0; x < result.length; x++) {
	// //
	// // 													tmparr2.push(x);
	// // 													songs_for_service.push(result[x]);
	// // 													if(tmparr.length==data.length &&tmparr2.length==result.length)
	// // 													{
	// // 													$scope.holder_songs ={};
	// // 													$scope.holder_arr = songs_for_service;
	// // 													$rootScope.holder_arr_root = songs_for_service;
	// // 														if(result.length>0 && $scope.counter<2 && $scope.holder_arr.length<150)
	// // 														{
	// // 															$scope.counter++;
	// // 															LocationDataFetch.count=0;
	// // 															$scope.runApp($scope.start_number, $scope.counter, '', [], $scope.holder_arr);
	// //
	// //
	// // 														}
	// // 														else{
	// // 															Spotify.createPlaylist(songs_for_service).then(function(result) {
	// //
	// // 															$scope.holder_songs.songs = result.songs;
	// // 															$scope.songs = result.songs.slice($scope.index1, $scope.index2+20);
	// // 															$scope.songs.spot_arr = result.spot_arr.slice($scope.index1, $scope.index2+20);
	// // 															$scope.songs.savSpotArr = result.savSpotArr.slice($scope.index1, $scope.index2+20);
	// // 															artistlocation = result.artistlocation.slice($scope.index1, $scope.index2+20);
	// // 															$scope.songs.location_arr = result.location_arr.slice($scope.index1, $scope.index2+20);
	// // 															$scope.holder_arr = $scope.holder_arr.removeDuplicatesArrObj('name', true);
	// // 															$scope.songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.songs.spot_arr.toString());
	// // 															$rootScope.songs_root = $scope.songs;
	// //
	// // 															Spotify.createLatLng($scope.songs.location_arr, $scope.counter, $scope.zoom, $scope.latitudeObj.latitude, $scope.longitudeObj.longitude, $scope.final_loc_arr, $scope.songs.spot_arr).then(function(data){
	// // 															LocationDataFetch.count=1;
	// // 															$rootScope.mapdata = data;
	// // 															$scope.stillLooking = false;
	// // 															$rootScope.loading=false;
	// // 															$rootScope.mapOpening=false;
	// // 															$scope.checkForMore=true;
	// //
	// // 															});
	// //
	// // 														},function(error){
	// // 															$scope.errorMessage = true;
	// // 														});
	// // 														}
	// //
	// //
	// //
	// // 													}
	// //
	// // 												}
	// //
	// //
	// //
	// // 												});
	// // 											}
	// //
	// //
	// // 										},function(error){
	// // 													$scope.errorMessage = true;
	// // 												});
	// //
	// // 									}
	// //
	// // 							}
	// // 						},function(error){
	// // 							$scope.errorMessage = true;
	// // 						});
	// //
	// // 					}
	// // 		},function(error){$scope.errorMessage = true;});
	// //
	// // 	},function(error){$scope.errorMessage = true;});
	// //
	// // };
	$scope.runApp = function() {
		retrieveLocation.runLocation(location_comp).then(function(data) {
			debugger;
			var city_data = data.join('_');
			PlaylistCreate.runPlaylist(city_data, 0).then(function(data){
					$rootScope.songs = data;
					$scope.loading = false;
					$scope.mapdata.lat=data.spotify_info[0].location.lat;
					$scope.mapdata.lng=data.spotify_info[0].location.lng;
					$scope.mapdata.markers=data.spotify_info;
					$scope.newlocation = false;
					$rootScope.mapOpening = false;
			});
		}
	}

	$scope.checkGenres = function(genres) {
		debugger;
		//run a filter songs array if there is at least one genre;
		if(genres.length > 0) {
			$rootScope.songs.filter(function(song) {
				const song_genres_regex = new RegExp(song.genres.toString());
				const genres_str = genres.toString();

				return song.genres.match(genres_str);
			})
		}
		return songs;
	};

	//$scope.runApp();
// 	//$scope.checkGenre = function(genre) {
// 		alert('checking')
//
// 		$rootScope.noSongs=false;
//
//
// 		for (var x = 0; x < $scope.Genre.length; x++) {
//
//
// 			if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'off') {
// 				$scope.Genre[x].genre.state = 'on';
// 				$scope.Genre[x].genre.isSelected = true;
// 				$scope.Genre[x].genre.checked = true;
// 				console.log($scope.Genre[x].genre)
//
// 				$rootScope.genres += '****' + $scope.Genre[x].genre.similarSettings;
// 				for(var y=0; y<$scope.Genre[x].genre.similarSettings.split('**').length;y++)
// 				{
// 					$rootScope.genreSans.push($scope.Genre[x].genre.similarSettings.split('**')[y])
// 				};
// 			} else if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'on') {
// 				$scope.Genre[x].genre.checked = false;
// 				$scope.Genre[x].genre.isSelected = true;
// 				$scope.Genre[x].genre.state = 'off';
// 				var genreSplitter = $rootScope.genres.split('**');
// 				for(var g=0; g<genreSplitter.length; g++)
// 					{
// 					var index = $rootScope.genreSans.indexOf(genreSplitter[g]);
// 					if (index > -1) {
// 						$rootScope.genreSans.splice(index, 1);
//
// 					}
// 				}
// 				$rootScope.genres = '';
//
// 			} else if ($scope.Genre[x].genre.state == 'on') {
// 				$scope.Genre[x].genre.checked = false;
// 				$scope.Genre[x].genre.isSelected = true;
// 				$rootScope.genres += '****' + $scope.Genre[x].genre.similarSettings;
// 				for(var y=0; y<$scope.Genre[x].genre.similarSettings.split('**').length;y++)
// 				{
// 					$rootScope.genreSans.push($scope.Genre[x].genre.similarSettings.split('**')[y])
// 				};
// 			}
// 		}
// 		if ($rootScope.genres == "") {
// 			$rootScope.genres = '****';
// 		}
// 		$scope.genre_str += $rootScope.genres;
// 		$scope.location = $scope.location.replace(/\*/g, ', ');
// 		if (localStorage.country != undefined) {
// 			$scope.runApp(0, 1, 'button');
//
// 		} else {
// 			$rootScope.new_location = $location.path();
// 			$location.path('country');
// 		}
// 		$scope.genre_hash = $location.path() + '/' + $rootScope.genres;
// 	};
//
// 	$scope.checkEra = function(start_year, end_year) {
// 		$rootScope.noSongs=false;
// 		$scope.start_year = start_year;
// 		$scope.end_year = end_year;
// 		$rootScope.start_year = start_year;
// 		$rootScope.end_year = end_year;
//
// 		var d = new Date();
// 		$scope.d = d.getFullYear()
// 		if (start_year < end_year) {
// 			if (start_year == undefined) {
// 				$rootScope.era = '&aritist_end_year_before=' + end_year;
// 			} else if (end_year == undefined) {
// 				$rootScope.era = '&artist_start_year_after=' + start_year;
// 			} else if (end_year == '') {
//
// 				$rootScope.era = '&artist_start_year_after=' + start_year;
// 			} else if (start_year == '') {
// 				$rootScope.era = '&artist_end_year_before=' + end_year + '&artist_start_year_after=1890';
// 			} else if (end_year == $scope.d) {
// 				$rootScope.era = '&artist_start_year_after=' + start_year;
// 			} else {
// 				$rootScope.era = '&artist_end_year_before=' + end_year + '&artist_start_year_after=' + start_year;
// 			}
// 		} else {
// 			$scope.range_message = true;
// 		}
//
// 		$scope.era_str += $rootScope.era;
// 		$scope.location = $scope.location.replace(/\*/g, ', ');
//
// 		$scope.runApp(0, 1, 'button');
// 		$scope.era_hash = $location.path() + '/' + $rootScope.genres;
// 	};
//
// 	$scope.goBack = function() {
//
// 		$location.path('playlist/' + $scope.location.replace(', ', '*'));
// 		runSymbolChange.changeSymbol();
// 	};
//
// 	$scope.lookUpGenre = function(genre) {
//
// 		$scope.noPickedGenre = false
// 		loadGenreCheckData.loadEchonestStyles().then(function(result) {
// 			var availableSettings = result;
// 			availableSettings.push({
// 				name : 'holiday'
// 			});
// 			var genreArr = [];
//
// 			//$rootScope.genres=''
// 			if (genre.match(', ')) {
// 				var genreArr = genre.split(', ');
// 			} else {
// 				genreArr = [genre];
// 			}
// 			for (var x = 0; x < availableSettings.length; x++) {
// 				for (var u = 0; u < genreArr.length; u++) {
//
// 					if (availableSettings[x].name.toLowerCase() == (genreArr[u].replace().toLowerCase())) {
// 						$rootScope.genres += '**' + genreArr[u];
// 						$rootScope.genreSans.push(genreArr[u])
//
// 						$scope.noPickedGenre = false;
// 						$scope.runApp(0, 1, 'button');
//
// 					}
//
// 				}
// 			}
//
//
// 			if ($rootScope.genres.length == 0) {
// 				$scope.noPickedGenre = true;
// 			}
// 			$scope.genre = '';
// 		});
//
// 	};
//
// 	$scope.toggleGenre = function(genre) {
// 		//$rootScope.genres='';
//
// 		var index = $rootScope.genreSans.indexOf(genre);
// 		if (index > -1) {
// 			$rootScope.genreSans.splice(index, 1);
//
// 		}
// 		/////if a Genre button has been checked and then they toggle all of those selected genre tags, this turns off the button/////
// 		for(var c=0; c<$scope.Genre.length; c++)
// 		{
//
// 			if(!$rootScope.genreSans.toString().match($scope.Genre[c].genre.genre)){
// 				$scope.Genre[c].genre.checked=false;
// 			}
// 		}
// 		if ($rootScope.genreSans.length > 0) {
//
//
// 				$rootScope.genres = '****' + $rootScope.genreSans.toString().replace(/,/g,'**');
//
//
//
// 			$scope.runApp(0, 1, 'button');
// 		} else {
// 			$rootScope.genres = '';
// 			$scope.runApp(0, 1, 'button');
// 		}
//
// 	};
//
//
//
// 	$scope.close = function() {
//
// 		$scope.noCountry = false;
//
//
// 			localStorage.setItem('country', '');
// 			$location.path(localStorage.path);
// 			LocationDataFetch.count=0;
//
// 	};
//
// 	$scope.setCountry = function(country) {
//
// 		localStorage.country = country;
// 		localStorage.setItem('country', country)
// 		$scope.noCountry = false;
// 		$location.path(localStorage.path)
// 		LocationDataFetch.count = 0;
// 	};
//
// 	$scope.showResetMessage = function()
// 	{
//
// 	}
//
// 	$scope.resetCountry = function() {
//
// 		localStorage.removeItem('country')
//
//
// 		$scope.noCountry=true;
//
//
// 	};
// 	$scope.countryForm='';
// 	if(localStorage.country==undefined)
// 	{
// 		$scope.noCountry=true;
// 	}
//
//
// 	for (var x = 0; x < $scope.Genre.length; x++) {
// 		$scope.Genre[x].genre.state = "off";
//
// 		for (var i = 0; i < $rootScope.genres.split('***').length; i++) {
// 			if ($rootScope.genres.split('***')[i].replace('*', '') == $scope.Genre[x].genre.similarSettings) {
// 				$scope.Genre[x].genre.checked = true;
// 				$scope.Genre[x].genre.isSelected = true;
// 				$scope.Genre[x].genre.state = "on";
// 				console.log($scope.Genre[x].genre.isSelected)
//
// 			}
// 		}
// 	}
//
// 	if ($routeParams.genre !== undefined) {
// 		$rootScope.genres = $routeParams.genre;
// 	}
// 	//////////////////////////create Genre Service out of this function - run it in locationHash and here///////////////////
// 	runSymbolChange.changeSymbol();
// 	if ($routeParams.location == undefined) {
// 		$rootScope.loading = true;
// 		$scope.location = 'Finding your location...';
// 		getLocation.checkGeoLocation()
//
// 	} else {
// 		$scope.location = $routeParams.location.replace(/\*/, ', ').replace(/_/g, ' ');
// 		$scope.location_link = $routeParams.location;
// 		if ($rootScope.mapOpening==true ||LocationDataFetch.count==100000000000)
// 			{
//
// 			$scope.runApp(0, 1, $scope.holder_arr);
//
// 		}
//
// 	}
//
// }]);
//
// Settings.controller('addCountry', ['$scope', '$rootScope', 'retrieveLocation', 'LocationDataFetch', '$location', '$routeParams', '$q', 'runSymbolChange', 'PlaylistCreate', 'Wiki', 'MapCreate', 'States', '$sce', 'Favorites', 'ShareSongs', 'getLocation', 'Spotify',
// function($scope, $rootScope, retrieveLocation, LocationDataFetch, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, Wiki, MapCreate, States, $sce, Favorites, ShareSongs, getLocation, Spotify) {
//
// 	/*$scope.location = $location.path().split('/')[2];
//
// 	if ((localStorage.country == '' || localStorage.country == undefined)) {
// 		$rootScope.noCountry = true;
//
//
// 	} else {
// 		$rootScope.noCountry = false;
// 	}
//
// 	$scope.close = function() {
//
// 		$rootScope.noCountry = false;
//
//
// 			localStorage.setItem('country', '');
// 			$location.path(localStorage.path);
// 			LocationDataFetch.count=0;
//
// 	};
//
// 	$scope.setCountry = function(country) {
//
// 		localStorage.country = country;
// 		localStorage.setItem('country', country)
// 		$rootScope.noCountry = false;
// 		$location.path(localStorage.path)
// 		LocationDataFetch.count = 0;
// 	};
//
// 	$scope.resetCountry = function() {
//
// 		localStorage.removeItem('country')
// 		alert('Your country has been reset.');
//
// 	};
// */
//

}]);
