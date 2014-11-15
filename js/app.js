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
 
 
 
]);

MusicWhereYouAreApp.config(['$compileProvider',
function($compileProvider)
{
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|uri|spotify):/);
}]);


MusicWhereYouAreApp.config(['$routeProvider',
  
  function($routeProvider) {
    $routeProvider.
    
       when('/favorites', {
        templateUrl: 'partials/favorites.html',
        controller: 'LoadFav'
      }).
        when('/genres', {
        templateUrl: 'partials/genres.html',
        //controller: 'PlaylistData'
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
      
   
    when('/genres/:location/:genre',
    {
    	templateUrl:'partials/genres.html',
    	controller:'GenreController',
    	animation: 'from-left'
    }).
      otherwise({
        redirectTo: '/map'
      });
  }]);


