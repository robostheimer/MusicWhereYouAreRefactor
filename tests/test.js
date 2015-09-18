
 describe('products service tests', function () {
   
    
	beforeEach(angular.mock.module('Playlist', 'Location', 'ngRoute'));
	 beforeEach(module("Playlist"));

  beforeEach(inject(function ($httpBackend) {
   
    httpBackend = $httpBackend;
  }));

  it('checks length of songs array', function () {
    var service;

    // Get the service from the injector
    var redditService, httpBackend;

 
	angular.mock.inject(function ($httpBackend) {
   
    httpBackend = $httpBackend;
  });
   angular.mock.inject(function GetDependencies(PlaylistCreate){
      service = PlaylistCreate;
   
	});
	httpBackend.when('GET',"http://developer.echonest.com/api/v4/song/search?api_key=3KFREGLKBDFLWSIEC&format=json&results=50&min_latitude=37.523732581668796&max_latitude=37.73177041833121&min_longitude=-122.55895628106364&max_longitude=-122.28319971893636&bucket=artist_location&bucket=id:spotify-WW&bucket=tracks&limit=true&&song_type=studio&rank_type=familiarity&song_min_hotttnesss=.3&start=0").respond(200,'test' );

    service.runPlaylist(9, 37.6277515, -122.42107800000002, 37.118610908343975, 38.13689209165603, -123.07047740531819, -121.77167859468182, "", "", 0).then(function(songs)
    	{
    		alert(songs)
   	expect(songs).toEqual('test');
    });
  
  httpBackend.flush();
   
  });
});
   

