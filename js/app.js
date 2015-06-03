//'use strict';

/* App Module */

var MusicWhereYouAreApp = angular.module('MusicWhereYouAreApp', [
  'ngRoute',
  'Settings',
  'UI',
   'Playlist',
  'Info',
  'Favorites',
  'ui.utils',
 'sidebarAnimate',
 
 'ngTouch',
 'angulartics', 
 'angulartics.google.analytics',
 'Events',
  'Location', 
  'Geolocation',
 
  'Social',

 //'infinite-scroll',
 'ng.deviceDetector',
'ngResource', 
'base64'
]);

MusicWhereYouAreApp.config(['$compileProvider',
function($compileProvider)
{
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|uri|spotify|json):/);
}])

.config(['$httpProvider', function($httpProvider){
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}])

.config(function($sceDelegateProvider) {
 $sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:**']);
 })

.config(['$routeProvider',
  
  function($routeProvider) {
    $routeProvider.
    
       /*when('/country', {
        templateUrl: 'partials/country.html',
        controller: 'addCountry'
      }).*/
       when('/favorites', {
        templateUrl: 'partials/map.html',
        controller: 'Geolocate'
      }).
        when('/genres', {
        templateUrl: 'partials/map.html',
        controller:'Geolocate',
      }).
       
       when('/info', {
        templateUrl: 'partials/map.html',
        controller: 'Geolocate',
         //animation: 'from-right'
      }).
      when('/liner_notes', {
        templateUrl: 'partials/liner_notes.html',
        controller: 'WriteLinerNotes'
      }).
     
      when('/map', {
      	 templateUrl: 'partials/map.html',
      	controller: 'Geolocate'
      
      }).
    when('/map/:location',
    {
    	templateUrl:'partials/map.html',
    	controller:'hashedLocation'
    	
    }).
    when('/jukebox/:location',
    {
    	templateUrl:'partials/jukebox.html',
    	controller:'hashedLocation',
    	 animation: 'from-left'
    }).
     when('/roadsoda/:location',
    {
    	templateUrl:'partials/roadsoda.html',
    	controller:'hashedLocation',
    	 animation: 'from-left'
    }).
     when('/playlist/',
    {
    	templateUrl:'partials/map.html',
    	controller:'Geolocate',
    	//controller:'hashedLocation',
    	// animation: 'from-left'
    }).
   
     when('/playlist/:location',
    {
    	templateUrl:'partials/playlist.html',
    	controller:'hashedLocation',
    	 animation: 'from-left'
    }).
     when('/genres/:location',
    {
    	templateUrl:'partials/genres.html',
    	controller:'GenreController',
    	 animation: 'from-left'
    }).
  
    when('/favorites/:location', {
        templateUrl: 'partials/favorites.html',
        controller: 'LoadFav',
        animation: 'from-left'
      }).
    
   /* when('/info/:location', {
        templateUrl: 'partials/info.html',
        controller: 'loadInfo',
        animation: 'from-right'
      }).*/
     when('/info/:location/:artist', 
     {
        templateUrl: 'partials/info.html',
        controller: 'loadInfo',
        animation: 'from-top'
      }).  
      
      when('/calendar/:location', 
     {
        templateUrl: 'partials/calendar.html',
        controller: 'LoadEvents',
        animation: 'from-left'
      }).  
   
     when('/calendar/', 
     {
        templateUrl: 'partials/map.html',
       controller: 'Geolocate',
        animation: 'from-left'
      }).  
      
     when('/events/:location/:artist', 
     {
        templateUrl: 'partials/events.html',
        controller: 'LoadBandEvents',
        animation: 'from-left'
      }). 
       when('/events/:location/', 
     {
        templateUrl: 'partials/events.html',
        controller: 'LoadBandEvents',
        animation: 'from-left'
      }).  
   
     when('/events/', 
     {
        templateUrl: 'partials/map.html',
       controller: 'Geolocate',
        animation: 'from-left'
      }).   
    when('/genres/:location/:genre',
    {
    	templateUrl:'partials/genres.html',
    	controller:'GenreController',
    	animation: 'from-left'
    }).
    when('/playlist/:location/:qs',
    {
    	
    	templateUrl:'partials/playlist.html',
    	controller:'hashedLocation',
    	animation: 'from-left'
    }).
     when('/songs_about',
    {
    	
    	templateUrl:'partials/songs_about.html',
    	controller:'findSongsAbout',
    	//animation: 'from-left'
    }).
     when('/error',
    {
    	templateUrl:'partials/map.html',
    	
    }).
    
      otherwise({
        redirectTo: '/playlist'
      });
  }]);


