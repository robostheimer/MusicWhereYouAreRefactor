//'use strict';

/* App Module */

var MusicWhereYouAreApp = angular.module('MusicWhereYouAreApp', [
  'ngRoute',
  'Genre',
  'UI-Loader',
  'Info',
  'FavoritesControllers',
  'LinerNotesControllers',
  'ui.utils',
  'Forms',
 'sidebarAnimate',
 'Symbol' ,
 'ngTouch',
 'angulartics', 
 'angulartics.google.analytics',
 'Events',
 'Country',
 'SongsAbout'
 
]);

MusicWhereYouAreApp.config(['$compileProvider',
function($compileProvider)
{
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|uri|spotify|json):/);
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
        templateUrl: 'partials/favorites.html',
        controller: 'LoadFav'
      }).
        when('/genres', {
        templateUrl: 'partials/genres.html',
        controller:'GenreController',
      }).
       
       when('/info', {
        templateUrl: 'partials/info.html',
        //controller: 'loadInfo',
         animation: 'from-right'
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
    	templateUrl:'partials/playlist.html',
    	controller:'hashedLocation',
    	 animation: 'from-left'
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
        templateUrl: 'partials/calendar.html',
       controller: 'LoadEvents',
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
        templateUrl: 'partials/events.html',
       controller: 'LoadBandEvents',
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
    
      otherwise({
        redirectTo: '/playlist'
      });
  }]);


