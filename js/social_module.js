var Social = angular.module('Social', []);
/*Services*/
Social.factory("ShareSongs", ['$q', '$rootScope', '$http', '$sce', '$location','States','$routeParams','retrieveLocation',
function($q, $rootScope, $http, $sce, $location, States, $routeParams, retrieveLocation) {
	return{
			
		getSongs: function(songs, location)
		{
		
		
			var deferred = $q.defer();	
			var str='';	
			
			songs.forEach(function(song)
			{
				
				str+=song.name.replace(/&/g, 'and').replace('?', 'q*m')+'{'+song.id+'~'+song.artists[0].name.replace(/&/g, 'and')+'}'+song.favorite+']'+song.artist_location.latitude+','+song.artist_location.longitude+'**';
			});
			//str = encodeURI(str);
			var url = location.replace(/ /g, '_')+'/'+str.replace(/%20/g, '_').replace(/\//g, '--');
			url = '/playlist/'+url.replace(/ /g, '_').replace(/%20/g, '_').replace(/\//g, '--');
			deferred.resolve(url)
			return deferred.promise;
			
		},
		createSongsList: function()
		{
			var deferred = $q.defer();
			var songs_str = $routeParams.qs;
			var songs=[]
			var location_str = '';
			var tmpArr=songs_str.split('**');
			var tmpIdArr=[]
			var tmpTitleArr=[];
			var tmpFavArr=[];
			var tmpLat=[];
			var tmpLong=[];
			var tmpArtistsArr=[]
			songs.spot_arr=[];
			songs.savSpotArr=[];
			songs.songsArr=[];
			songs.spot_str='';
			songs.location_arr=[];
			songs.final_loc_arr=[];
			songs.spot_arr=[];
			songs.song_arr=[];
			//tmpArr=tmpArr.slice(1,21);
					//console.log(tmpArr);
			tmpArr.pop();		
			for(var x=0; x<tmpArr.length;x++)
			{
				tmpTitleArr.push(tmpArr[x].split('{')[0].replace(/_/g, ' ').replace('q*m', '?'))
				tmpIdArr.push(tmpArr[x].split('{')[1].split('~')[0]);
				tmpArtistsArr.push(tmpArr[x].split('~')[1].split('}')[0].replace(/_/g, ' '));
				tmpFavArr.push(tmpArr[x].split('}')[1].split(']')[0]);
				tmpLat.push(parseFloat(tmpArr[x].split(']')[1].split(',')[0]));
				tmpLong.push(parseFloat(tmpArr[x].split(']')[1].split(',')[1]));
				songs.push({name:tmpTitleArr[x],tracks:{foreign_id:{spotify:{track:tmpIdArr[x]}}},favorite:tmpFavArr[x], artists:{0:{name:tmpArtistsArr[x]}},artist_location:{latitude: tmpLat[x], longitude: tmpLong[x], location:$location.path().split('/')[2].split('/')[0].replace('*', ', ').replace(/_/g, ' ')}});
				//tmpTitleArr[x]}{tracks:{foreign_id:{spotify:{track:tmpIdArr[x]}}}}
				songs.location_arr.push($location.path().split('/')[2].split('/')[0].replace('*', ', ')+'@@'+tmpLat[x] + ':' + tmpLong[x]+'&&<h5>'+tmpTitleArr[x]+'</h5><p>'+tmpArtistsArr[x]+'</p><a href="spotify:track:'+tmpIdArr[x]+'" ><div class="spot_link"  aria-hidden="true" data-icon="c" id="infobox_spot_link"+x></div></a><a><a a href="#/info/'+$location.path().split('/')[2].split('/')[0]+'/'+tmpArtistsArr[x].replace('The ', '')+'" ><div style="font-size:20px" class="spot_link information" id="infobox_info"+x  aria-hidden="true" data-icon="*"></div></a><div style="clear:both"></div>');
				songs.spot_str +=tmpIdArr[x]+',';
				songs.songsArr.push(songs[x]);
				songs.song_arr.push(tmpIdArr[x]);
				songs[x].id=tmpIdArr[x];
				songs.savSpotArr.push("spotify:track:"+tmpIdArr[x].id);
			}	
			songs.spot_strFinal = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE'+songs.spot_str);
				
				songs.location_arr.sort();
				
				songs.location_arr.forEach(function(location)
				{
					if(!location_str.match(location.split('@@')[0]))
					{
					songs.final_loc_arr.push('%%'+location);
					location_str += location.split('@@')[0];
					}
					else
					{
						songs.final_loc_arr.push(location.split('@@')[1].split('&&')[1]);
					}
				});	
				
			
			
				deferred.resolve(songs);
				return deferred.promise;
			
		},
		
		getLongURL:function(url)
		{
			
			var deferred = $q.defer();
			if(url.length>2000)
			{
				
				var url= url.slice(0, 2000);
				var index =url.lastIndexOf('**');
				url = url.slice(0, index);
				var urlObj = {'url': url.replace('--', '/'), 'sliced':'yes'}
				
			}
			else{
			
			var url = (url);
			var urlObj = {'url': url.replace('--', '/'), 'sliced':'no'}
			}
			
			
			url =url.replace('--', '/');
			deferred.resolve(urlObj);
			return deferred.promise;
			
		},
		getBitLy:function(url)
		{
			var bitly = 'http://api.bitly.com/v3/shorten?format=json&apiKey=R_06ae3d8226a246f2a0bb68afe44c8379&login=robostheimer&longUrl=http://musicwhereyour.com/%23'+encodeURIComponent(url);
				return $http.get(bitly).then(
				function(result){
					return result.data.data.url;
					
				});
		},	
	};
	


}]);

Social.factory('Twitter', ['$resource', '$http','$base64', function ($resource, $http, $base64) {
 	return{
 		getOAuth:function(){
            var consumerKey = encodeURIComponent('H3aaSwXzaaxG6aousz7n89vWz')
            var consumerSecret = encodeURIComponent('5ryizVky6YL9BYhFhMp83s6OOj6X2Dq6vWtCC7gfxYRGJNXPTO')
            var credentials = $base64.encode(consumerKey + ':' + consumerSecret)
            console.log(credentials);
            // Twitters OAuth service endpoint
            var twitterOauthEndpoint = $http.post(
               'https://api.twitter.com/oauth2/token'
                , "grant_type=client_credentials"
                , {headers: {'Authorization': 'Basic ' + credentials, 'Content-Type': 'application/x-www-form-urlencoded'}}
            );
            twitterOauthEndpoint.success(function (response) {
            	console.log(response);
                // a successful response will return
                // the "bearer" token which is registered
                // to the $httpProvider
                MusicWhereYouAreApp.$httpProvider.defaults.headers.common['Authorization'] = "Bearer " + response.access_token;
            }).error(function (response) {
                  // error handling to some meaningful extent
               });
 
           var r = $resource('https://api.twitter.com/1.1/search/:action',
                {action: 'tweets.json',
                    count: 10,
              });
               /* {
<span style="line-height: 1.5;">                    paginate: {method: 'GET'}</span>
                })
 
            return r;
        }

        .config(function ($httpProvider) {
           serviceModule.$httpProvider = $httpProvider;
        });*/
       }
	};
}]);	

