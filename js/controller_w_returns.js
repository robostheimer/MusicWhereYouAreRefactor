/* Controllers */

angular.module('UI-Loader', []).controller('Geolocate', ['$scope', '$window', '$http', '$sce', 'getLocation', '$rootScope', '$q',
function($scope, $window, $http, $sce, getLocation, $q, $rootScope) {

	if ($('#map-canvas').html().match('loading.gif"') || window.location.hash.split('/') < 2) {
		getLocation.checkGeoLocation();

	}
}])
.controller('Hider', function() {

	$('#geolocation_alert').show();
	$('#map-canvas').hide();
	$('#spot_holder').hide();

});

angular.module('Forms', []).controller('formController', ['$scope', '$rootScope', 'retrieveLocation', 'getLocation', '$q', 'HashCreate', '$location',
function($scope, $rootScope, retrieveLocation, getLocation, $q, HashCreate, $location) {
	$scope.controlForm = function(location) {
		$scope.location = location;
		$scope.genres = '';
		if ($scope.location == null || $scope.location == "") {
			var deferred_loc = $q.defer();
			getLocation.checkGeoLocation();
		} else {
			retrieveLocation.runLocation(replacePatterns($scope.location), $scope.genres);
		}

	};

}]).controller('hashedLocation', ['$scope', '$rootScope', 'retrieveLocation', '$location', '$routeParams', '$q', 'runSymbolChange','PlaylistCreate','$sce',
function($scope, $rootScope, retrieveLocation, $location, $routeParams, $q, runSymbolChange, PlaylistCreate, $sce) {
	
	$scope.location = $routeParams.location;
	$scope.leaveOut=[];
	$scope.location = $scope.location.replace(/\*/g, ', ');
	$scope.$$phase || $scope.$apply();
	if($routeParams.location.split('*')>1)
	{
		$scope.zoom = 11;
	}
	else
	{
		$scope.zoom=6;
	}
	

	retrieveLocation.runLocation(replacePatterns($scope.location), $rootScope.genres)
		
			
	
	
	
	$scope.icons = $rootScope.icons;
	runSymbolChange.changeSymbol();
	$scope.song_str='';
	
	$scope.removeSong = function(id)
	{
		$scope.spot_arr=[];
		for (var i=0; i<$rootScope.songs.length; i++)
		{
			if(id==$rootScope.songs[i].id)
			{
				$rootScope.songs[i].closeButton=true;
				$scope.leaveOut.push($rootScope.songs[i].num_id);
				
			}
			else
			{
				$scope.spot_arr.push($rootScope.songs[i].tracks[0].foreign_id.split(':')[2])
				
			}	
		}
		$rootScope.songs.spot_str = 'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:' + $scope.spot_arr.toString();
		$rootScope.songs.spot_str = $sce.trustAsResourceUrl($rootScope.songs.spot_str);
		
	};
	
}]);

angular.module('Symbol', []).controller('controlSymbol', ['$scope', '$location', '$rootScope', 'runSymbolChange',
function($scope, $location, $rootScope, runSymbolChange) {

	$scope.location = $location.path().split('/')[2]

	$scope.genre_class = {}
	$scope.playlist_class = {};
	$scope.favorite_class = {};

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

	$scope.icons = [$scope.genre_class, $scope.playlist_class, $scope.favorite_class];
	$rootScope.icons = $scope.icons;
	runSymbolChange.changeSymbol();

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

}]);

angular.module('Info', []).controller('loadInfo', ['$scope', '$location', '$rootScope', 'runSymbolChange', '$routeParams', 'retrieveInfo','retrieveLocation',
function($scope, $location, $rootScope, runSymbolChange, $routeParams, retrieveInfo, retrieveLocation) {
	$scope.buttons =retrieveInfo.createObjects();
	$scope.buttonsArr = [$scope.buttons.bio, $scope.buttons.photos, $scope.buttons.videos, $scope.buttons.topsongs, $scope.buttons.news,$scope.buttons.related];
	$scope.location = $routeParams.location.replace(/\*/, ', ');
	
	$scope.name = removeSpecialChar($routeParams.artist);
	$scope.artistdata = false;
	
	$scope.tabs = retrieveInfo.createObjects();
		
	retrieveInfo.infoRetrieve($scope.name).then(function(data) {

		$scope.artistinfo = data;
		
		$scope.artistinfo.bioCheck=true;
		$scope.artistinfo.photosCheck=true;
		$scope.artistinfo.newsCheck=true;
		$scope.artistinfo.videoCheck=true;
		if($scope.artistinfo.bio.length==0)
			{
			$scope.artistinfo.bioCheck = false;
			}
		if($scope.artistinfo.video.length==0)
			{
				$scope.artistinfo.videoCheck = false;
			}	
		if($scope.artistinfo.news.length==0)
			{
				$scope.artistinfo.newsCheck = false;
			}	
		if($scope.artistinfo.images.length<1)
			{
				$scope.artistinfo.photosCheck = false;
			}	
			
	retrieveInfo.relatedRetrieve($scope.name).then(function(data)
	{
		$scope.relatedartists =data.data.response.artists;
		console.log($scope.relatedartists);
		
		
	});
		
		
		
		$scope.artistdata = true;
		retrieveLocation.runLocation(replacePatterns($scope.location), $rootScope.genres);
		retrieveInfo.spotifyRetrieve($scope.name).then(function(data)
		{
			$scope.spotify = data.data;
			console.log($scope.spotify);
		});
	
		
	});
	//retrieveInfo.imagesRetrieve($scope.name).then(function(data) {
		//$scope.artistimages = data.data.responseData.results;
	//});
	

	$scope.changeClass = function(state, obj) {
		//$scope.location = $location.path().split('/')[2];
		
		for (var i = 0; i < $scope.buttonsArr.length; i++) {
		
				
			if($scope.buttonsArr[i].name == obj.name)
			{
			$scope.buttonsArr[i].state = 'on';
			$scope.buttonsArr[i].classy='shower'
			}
			else{
				
				$scope.buttonsArr[i].state = 'off';
				$scope.buttonsArr[i].classy='hider';
			}
		}
		
		
	};
		


	$scope.goBack = function() {

		$location.path('playlist/' + $scope.location.replace(', ','*'));
	};

}]);

angular.module('Genre', []).controller('GenreController', ['$scope', '$routeParams', 'retrieveLocation', '$location', '$rootScope', '$q', 'loadGenreCheckData', 'runSymbolChange',
function($scope, $routeParams, retrieveLocation, $location, $rootScope, $q, loadGenreCheckData, runSymbolChange) {
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
	$scope.location = $routeParams.location;
	$scope.genre_hash = '';
	$scope.genre_str = $rootScope.genres;
	$scope.genre_str_split = $scope.genre_str.split('***');

	for (var x = 0; x < $scope.Genre.length; x++) {
		$scope.Genre[x].genre.state = "off";
		for (var i = 0; i < $scope.genre_str_split.length; i++) {
			if ($scope.genre_str_split[i].replace('*', '') == $scope.Genre[x].genre.similarGenres) {
				console.log($scope.Genre[x].genre.genre);
				$scope.Genre[x].genre.checked = true;
				$scope.Genre[x].genre.isSelected = true;
				$scope.Genre[x].genre.state = "on";
			}
		}
	}

	$scope.genre_hash = $location.path() + '/' + $rootScope.genres;
	retrieveLocation.runLocation(replacePatterns($scope.location.replace('*', ', ')), $rootScope.genres);

	if ($routeParams.genre !== undefined) {
		$rootScope.genres = $routeParams.genre;
	}

	$scope.checkGenre = function(genre) {
		$rootScope.genres = "";

		for (var x = 0; x < $scope.Genre.length; x++) {

			if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'off') {
				$scope.Genre[x].genre.state = 'on';
			} else if (genre == $scope.Genre[x].genre.genre && $scope.Genre[x].genre.state == 'on') {
				$scope.Genre[x].genre.state = 'off';
			}
			if ($scope.Genre[x].genre.state == 'on') {
				$rootScope.genres += '****' + $scope.Genre[x].genre.similarGenres;
			}
		}
		if ($rootScope.genres == "") {
			$rootScope.genres = '****';
		}
		$scope.location = $scope.location.replace(/\*/g, ', ');

		retrieveLocation.runLocation(replacePatterns($scope.location), $rootScope.genres);

		$scope.genre_hash = $location.path() + '/' + $rootScope.genres;
	};
	runSymbolChange.changeSymbol();

}]);

var InfoControllers = angular.module('FavoritesControllers', []);
InfoControllers.controller('loadExtraInfo', ['$scope', '$http', 'runSymbolChange',
function($scope, $http, runSymbolChange) {
	runSymbolChange.changeSymbol();
	alert('info');
}]);

var FavoritesControllers = angular.module('FavoritesControllers', [])
FavoritesControllers.controller('LoadFav', ['$scope', '$http', 'runSymbolChange',
function($scope, $http, runSymbolChange) {
	runSymbolChange.changeSymbol();
}]);

var LinerNotesControllers = angular.module('LinerNotesControllers', [])
LinerNotesControllers.controller('WriteLinerNotes', ['$scope', '$http',
function($scope, $http) {
	alert('liner notes')
}]);

var GenreControllers = angular.module('InfoControllers', [])
InfoControllers.controller('LoadGenre', ['$scope', '$http',
function($scope, $http) {
	alert('genre')
}]);

/////////////////Helper Functions////////////////////


function removeHTML(str)
{
        return jQuery('<div />', { html: str }).text();
}

function replacePatterns(str) {
	str = str.replace('#/map/', '')
	str = str.replace('#/playlist/', '');
	str = str.replace(/_/g, ' ');
	str = str.replace(/St. /i, 'Saint ');
	str = str.replace(/St /i, 'Saint ');
	str = str.replace('New York, ', 'New York City, ');

	return str;
}

function locationReplace(str) {
	str = str.replace(', ', '*');
	str = str.replace(',', '*');
	str = str.replace(/ /g, '_');
	return str;
}

function removeSpecialChar(str)
{
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
