//'use strict';

/* Services */
/////////////////////////////////HomePage/////////////////////////////////////////////
TAS_Site.factory('Teacher', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions) {
	return{
		createTeacherList :function(item){
			var teachers = {data:[], years:[]};

			var year = $location.path().split('/')[1].split('/')[0];

			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+TeacherLastName%2CTeacherFirstName%2CShipType%2C+Ship%2C+ShipUrl%2C+CruiseURL%2C+Mission%2C+CruiseDates%2C+SubjectsTaught%2C+School%2C+City%2C+State%2C+Image%2C+Grades%2C+SchoolURL%2C+WordPressURL%2C+Year+FROM+1Xh5kWI_ZHd-PZRuPcgrV_oS13HHN6JGtRK4s75Mn+ORDER%20BY+Year%22&&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != undefined) {

					HelperFunctions.forEach (result.data.rows,function(item){
        			var o = result.data.rows.indexOf(item);	
        				teachers.data.push({
							lastname : item[0],
							lastname_forDOM : HelperFunctions.DigPatt(item[0].replace(' ', '')),
							firstname : item[1],
							name : item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', '')),
							headline: item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', ''))+', ' +item[16]+' Teacher at Sea',
							shiptype : item[2],
							ship : item[3],
							shipurl : item[4],
							cruiseurl : item[5],
							mission : item[6],
							dates : item[7],
							subjects : item[8],
							school : item[9],
							city : item[10],
							state : item[11],
							src : item[12].split('?')[0],
							grades : item[13],
							schoolurl : item[14],
							wordpressurl : item[15],
							year : item[16],
							subjects1 : item[8].split('&&')[0],
							subjects2 : item[8].split('&&')[1],
							school1 : item[9].split('&&')[0],
							school2 : item[9].split('&&')[1],
							schoolurl1 : item[14].split('&&')[0],
							schoolurl2 : item[14].split('&&')[1],
							tabIndex : 150 + o,
							checkContents : true,
							classy: 'icon-profile',
							template:'profile',
							color: 'blue',
							colorCode: '4, 146, 206',
							type :'profile',
							id:'teacher'+o,
							randomnumber: Math.floor(Math.random()*51),
							description:item[1]+' '+item[0]+'  of '+ item[10]+', ' +item[11]+ ' teaches '+item[8]+' at ' + item[9]+ 'and  will be aboard' + item[2]+' '+item[3]+ ' '+item[5]+ 'while scientist conduct a'+item[6] +' survey'
							

						});
						teachers.years.push(item[16])

					});
				return teachers;	
				}
				else{
					
					var year = $location.path().split('/')[1].split('/')[0]
					return $http.get('/JSONBackups/TeacherFusionTable.json').then(function(result) {
					HelperFunctions.forEach (result.data.rows,function(item){
        			var o = result.data.rows.indexOf(item);	if (item[16] == year) {
							teachers.push({
								lastname : item[0],
								lastname_forDOM : HelperFunctions.DigPatt(item[0].replace(' ', '')),
								firstname : item[1],
								name : item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', '')),
								headline: item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', ''))+', ' +item[16]+' Teacher at Sea',
								shiptype : item[2],
								ship : item[3],
								shipurl : item[0][4],
								cruiseurl : item[5],
								mission : item[6],
								dates : item[7],
								subjects : item[8],
								school : item[9],
								city : item[10],
								state : item[11],
								src : item[12].split('?')[0],
								grades : item[13],
								schoolurl : item[14],
								wordpressurl : item[15],
								year : item[16],
								subjects1 : item[8].split('&&')[0],
								subjects2 : item[8].split('&&')[1],
								school1 : item[9].split('&&')[0],
								school2 : item[9].split('&&')[1],
								schoolurl1 : item[14].split('&&')[0],
								schoolurl2 : item[14].split('&&')[1],
								tabIndex : 150 + o,
								checkContents : true,
								classy: 'icon-profile',
								template:'profile',
								color: 'blue',
								colorCode: '4, 146, 206',
								type :'profile',
								id:'teacher'+o,
								randomnumber: Math.floor(Math.random()*51),
								description:item[6] +':'+item[11] +':'+item[3]+':'+item[13]+':'+item[8]+':'+item[9]+':'+item.year+':'+item.city+':'+item.state


							});
							teachers.years.push(item[16])

						}
					});
					return teachers;
				});

				}
				
			}, function(error) {
				var teachers = [];
				var year = $location.path().split('/')[1].split('/')[0]
				return $http.get('/JSONBackups/TeacherFusionTable.json').then(function(result) {
					console.log($routeParams.year)
					HelperFunctions.forEach (result.data.rows,function(item){
        			var o = result.data.rows.indexOf(item);	if (item[16] == year) {
							teachers.push({
								lastname : item[0],
								lastname_forDOM : HelperFunctions.DigPatt(item[0].replace(' ', '')),
								firstname : item[1],
								name : item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', '')),
								headline: item[1]+' '+HelperFunctions.DigPatt(item[0].replace(' ', ''))+', ' +item[16]+' Teacher at Sea', 
								shiptype : item[2],
								ship : item[3],
								shipurl : item[0][4],
								cruiseurl : item[5],
								mission : item[6],
								dates : item[7],
								subjects : item[8],
								school : item[9],
								city : item[10],
								state : item[11],
								src : item[12].split('?')[0],
								grades : item[13],
								schoolurl : item[14],
								wordpressurl : item[15],
								year : item[16],
								subjects1 : item[8].split('&&')[0],
								subjects2 : item[8].split('&&')[1],
								school1 : item[9].split('&&')[0],
								school2 : item[9].split('&&')[1],
								schoolurl1 : item[14].split('&&')[0],
								schoolurl2 : item[14].split('&&')[1],
								tabIndex : 150 + o,
								checkContents : true,
								template:'profile',
								color: 'blue',
								colorCode: '4, 146, 206',
								type :'profile',
								id:'teacher'+o,
								randomnumber: Math.floor(Math.random()*51),
								description:item[6] +':'+item[11] +':'+item[3]+':'+item[13]+':'+item[8]+':'+item[9]+':'+item.year+':'+item.city+':'+item.state

							});
							teachers.years.push(item[16])

						}
					});
					return teachers;
				});
			});
		}
	};
}]);
TAS_Site.factory('News', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions) {
	return{
	getNewsData :function(item){
			///////////////////////////////Start Here////////////////////
			var news = [];
			var newsObj = {};
			newsObj.checkContents = false;
			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+ArticleYear%2C+Teacher%2C+MediaOutlet%2C+ArticleTitle%2C+MediaOutletURL%2C+ArticleURL+FROM+1EaTTZDozzJ0k3K2FMoD0O6JAfeiHcc6SB95f0hYv&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != undefined) {
					
					HelperFunctions.forEach (result.data.rows,function(item){ 
					var o =result.data.rows.indexOf(item)
						news.push({
							articleyear : item[0],
							year:item[0],
							teacher : item[1],
							mediaoutlet : item[2],
							headline : item[3],
							medioutleturl : item[4],
							articleurl : item[5],
							checkContents : true,
							classy: 'icon-profile',
							template:'article',
							color: 'dkblue',
							colorCode: '0, 87, 165',
							type:'article',
							randomnumber: Math.floor(Math.random()*51),
							src: 'images/newspaper.png',
							id:'article'+o,
							description:item[0]+':'+item[2]+':'+item[3],
						});

					});
				return news;
				} else {
					
					/////////////if fusion table is empty but doesn't throw an error/////////
					return $http.get('/JSONBackups/NewsFusionTable.json').then(function(result) {
						HelperFunctions.forEach (result.data.rows,function(item){  
							news.push({
								articleyear : item[0],
								year:item[0],
								teacher : item[1],
								mediaoutlet : item[2],
								headline : item[3],
								medioutleturl : item[4],
								articleurl : item[5],
								checkContents : true,
								classy: 'icon-profile',
								template:'article',
								color: 'dkblue',
								colorCode: '0, 87, 165',
								type:'article',
								randomnumber: Math.floor(Math.random()*51),
								src: 'images/newspaper.png',
								id:'article'+o,
								description:item[0]+':'+item[2]+':'+item[3],
							});

						});
					
					
					
				});
				return news;	
				}
				//console.log(news);
				

			}, function(error) {
				var news = [];
				var newsObj = {};
				newsObj.checkContents = false;
				return $http.get('/JSONBackups/NewsFusionTable.json').then(function(result) {
							HelperFunctions.forEach (result.data.rows,function(item){ 
							news.push({
								articleyear : item[0],
								year:item[0],
								teacher : item[1],
								mediaoutlet : item[2],
								headline : item[3],
								medioutleturl : item[4],
								articleurl : item[5],
								checkContents : true,
								classy: 'icon-profile',
								template:'article',
								colorCode: '0, 87, 165',
								color:'dkblue',
								type:'article',
								randomnumber: Math.floor(Math.random()*51),
								src: 'images/newspaper.png',
								id:'article'+o,
								description:item[0]+':'+item[2]+':'+item[3],
							});

						});
					
					return news;
				});
			});
		},
	};	
}]);	

TAS_Site.factory('AlumniSpot', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce,HelperFunctions) {

	return {

		getSpotData : function(region) {
			var spot = [];
			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+FirstName,LastName,ShortBody,LongBody,image,caption,PublishDate,Region+FROM+1z6kUehyfSNqaAGinvARZLYyjb7Dhk2F9rt49xHIV+ORDER%20BY+PublishDate+%22&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != undefined) {
					var d = new Date();
					var td = d.valueOf();
					result.data.rows.reverse();
					HelperFunctions.forEach (result.data.rows,function(item){
       				 var i = result.data.rows.indexOf(item);	
       				 var pd = new Date(item[6]);
						var tpd = pd.valueOf();

						if (item[6] != '#' && td >= tpd) {
							spot.push({
								id : i,
								headline:item[0]+' '+ item[1],
								description : item[2].replace(/"/g, ''). replace(/<p>/g, '').replace(/<\/p>/g, ''),
								longbody : item[3].replace(/"/g, ''),
								src : item[4].split('?')[0],
								caption : item[5],
								date : item[6],
								year: item[6].split('/')[2],					
								region : item[7],
								more_url : item[5].replace(/ /g, '_'),
								hash : '/indiv_spotlight/' + item[0].replace(/ /g, '_') + '_' + item[1].replace(/ /g, '_'),
								dataloaded : true,
								tabIndex : 150 + i,
								classy: 'icon-profile',
								template:'news',
								colorCode: '0, 87, 165',
								color:'dkblue',
								type:'article',
								randomnumber: Math.floor(Math.random()*51),
								id:'spot'+i
								


							});
						}

					});
					
				return spot
				}
				else{
					return $http.get('JSONBackups/AlumniSpotlightTable.json').then(function(result) {
					
						var d = new Date();
						var td = d.valueOf();
						result.data.rows.reverse();
						HelperFunctions.forEach (result.data.rows,function(item){
        					var i = result.data.rows.indexOf(item);		
        					var pd = new Date(item[6]);
							var tpd = pd.valueOf();

							if (item[6] != '#' && td >= tpd) {
								spot.push({
									id : i,
									headline:item[0]+' '+ item[1],
									description : item[2].replace(/"/g, ''),
									longbody : item[3].replace(/"/g, ''),
									src : item[4].split('?')[0],
									caption : item[5],
									date : item[6],
									year: item[6].split('/')[2],
									region : item[7],
									more_url : item[5].replace(/ /g, '_'),
									hash : '/indiv_spotlight/' + item[0].replace(/ /g, '_') + '_' + item[1].replace(/ /g, '_'),
									dataloaded : true,
									tabIndex : 150 + i,
									classy: 'icon-profile',
									template:'news',
									colorCode: '0, 87, 165',
									color:'dkblue',
									type:'article',
									randomnumber: Math.floor(Math.random()*51),
									id:'spot'+i


								});
							}

					

					});

					return spot
				});
				
				

			}
			},function(error){ 
				return $http.get('JSONBackups/AlumniSpotlightTable.json').then(function(result) {
					
						var d = new Date();
						var td = d.valueOf();
						result.data.rows.reverse();
						HelperFunctions.forEach (result.data.rows,function(item){
        					var i = result.data.rows.indexOf(item);		
        					var pd = new Date(item[6]);
							var tpd = pd.valueOf();

							if (item[6] != '#' && td >= tpd) {
								spot.push({
									id : i,
									headline:item[0]+' '+ item[1],
									description : item[2].replace(/"/g, ''),
									longbody : item[3].replace(/"/g, ''),
									src : item[4].split('?')[0],
									caption : item[5],
									date : item[6],
									year: item[6].split('/')[2],
									region : item[7],
									more_url : item[5].replace(/ /g, '_'),
									hash : '/indiv_spotlight/' + item[0].replace(/ /g, '_') + '_' + item[1].replace(/ /g, '_'),
									dataloaded : true,
									tabIndex : 150 + i,
									classy: 'icon-profile',
									template:'news',
									colorCode: '0, 87, 165',
									color:'dkblue',
									type:'article',
									randomnumber: Math.floor(Math.random()*51),
									id:'spot'+i

								});
							}

					

					});

					return spot;
				});
				
				});
		}
	};	
			
}]);

TAS_Site.factory('PhotosofWeek', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions) {

	return {
		getPOW :function(item){
			var pow = [];
			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+PhotoURL,PhotoCaption,Facebook,ShortDescription,BlogURL,PhotoCredit,BlogTitle,PublishDate,Keywords,Tweet+FROM+19WBCSYuVJh1O2KaThKQJpLLn0VF6w3rHhbKtZMVf+ORDER%20BY+PublishDate+%22&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != null) {
					var d = new Date();
					var td = d.valueOf();
					result.data.rows.reverse();
					HelperFunctions.forEach (result.data.rows,function(item){
        			var i = result.data.rows.indexOf(item);	var pd = new Date(item[7]);
						var tpd = pd.valueOf();
						
						if (item[7] != '#' && td >= tpd) {
							pow.push({
								id : i,
								src : item[0],
								headline : item[1].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								description : item[2].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								shortdescription : item[3].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								parent : item[4],
								credit : item[5],
								post_title : item[6],
								date : item[7],
								year: item[7].split('/')[2],
								keywords : item[8],
								dataloaded : true,
								tabIndex : (150 + (i + 7)),
								classy:'icon-images',
								template:'pow',
								colorCode:'235, 189, 30',
								color:'yellow',
								type:'image',
								randomnumber: Math.floor(Math.random()*51),
								id:'image'+i
							});
						}

					});
				return pow;
				}
				else{
					return $http.get('/JSONBackups/POWFusionTable.json').then(function(result)
					{
					var d = new Date();
						var td = d.valueOf();
						result.data.rows.reverse();
						HelperFunctions.forEach (result.data.rows,function(item){
       						var i = result.data.rows.indexOf(item);		
       						var pd = new Date(item[7]);
							var tpd = pd.valueOf()

							if (item[7] != '#' && td >= tpd) {
								pow.push({
									id : i,
									src : item[0],
									headline : item[1].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									description : item[2].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									shortdescription : item[3].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									parent : item[4],
									credit : item[5],
									post_title : item[6],
									date : item[7],
									year: item[7].split('/')[2],
									keywords : item[8],
									dataloaded : true,
									tabIndex : (150 + (i + 7)),
									classy:'icon-images',
									template:'pow',
									colorCode:'235, 189, 30',
									color:'yellow',
									type:'image',
									randomnumber: Math.floor(Math.random()*51),
									id:'image'+i

								});
							}

						});
						return pow;
					});
				}

				
			}, function(error){
				return $http.get('/JSONBAckups/POWFusionTable.json').then(function(result)
					{
					var d = new Date();
						var td = d.valueOf();
						result.data.rows.reverse();
						HelperFunctions.forEach (result.data.rows,function(item){
        				var i = result.data.rows.indexOf(item);		var pd = new Date(item[7]);
							var tpd = pd.valueOf()

							if (item[7] != '#' && td >= tpd) {
								pow.push({
									id : i,
									src : item[0],
									headline : item[1].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									description : item[2].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									shortdescription : item[3].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
									parent : item[4],
									credit : item[5],
									post_title : item[6],
									date : item[7],
									year: item[7].split('/')[2],
									keywords : item[8],
									dataloaded : true,
									tabIndex : (150 + (i + 7)),
									classy:'icon-images',
									template:'pow',
									colorCode:'235, 189, 30',
									color:'yellow',
									type:'image',
									randomnumber: Math.floor(Math.random()*51),
									id:'image'+i

								});
							}

						});
						return pow;
					});
			});
		},
		getNonPOW: function()
		{
			var nonpow = [];
			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+ShortDescription,PhotoURL,PhotoCredit,BlogURL,BlogTitle,BlogExcerpt,PhotoCaption,Year+FROM+1kdK3LUF2jyyI0GCnoE3TihNmzJnr7azWtMNRdHuw&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != null) {
				
					
					HelperFunctions.forEach (result.data.rows,function(item){
       				 var i = result.data.rows.indexOf(item);
							nonpow.push({
								src : item[1],
								headline : item[6].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								description : item[0].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								parent : item[3],
								credit : item[2],
								post_title : item[4],
								description:item[5],
								year:item[7],
								dataloaded : true,
								tabIndex : (150 + (i + 7)),
								classy:'icon-images',
								template:'pow',
								colorCode:'235, 189, 30',
								color:'yellow',
								type:'image',
								randomnumber: Math.floor(Math.random()*51),
								id:'nonpow'+i

							});
					});

					
				return nonpow
				}
				else{
					return $http.get('/JSONBAckups/POWFusionTable.json').then(function(result)
					{
						HelperFunctions.forEach (result.data.rows,function(item){
        var i = result.data.rows.indexOf(item);
							nonpow.push({
								src : item[1],
								headline : item[6].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								description : item[0].replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/"/g, ''),
								parent : item[3],
								credit : item[2],
								post_title : item[4],
								description:item[5],
								year:item[7],
								dataloaded : true,
								tabIndex : (150 + (i + 7)),
								classy:'icon-images',
								template:'pow',
								colorCode:'235, 189, 30',
								color:'yellow',
								type:'image',
								randomnumber: Math.floor(Math.random()*51),
								id:'nonpow'+i

							});
						});
						return nonpow
					});
				}	
					
			}, function(error){
				return $http.get('/JSONBackups/POWFusionTable.json').then(function(result)
					{
						HelperFunctions.forEach (result.data.rows,function(item){
        					var i = result.data.rows.indexOf(item);
							nonpow.push({
								src : item[1],
								headline : item[6].replace(/<p>/g, '').replace(/<\/p>/g, ''),
								description : item[0].replace(/<p>/g, '').replace(/<\/p>/g, ''),
								parent : item[3],
								credit : item[2],
								post_title : item[4],
								description:item[5],
								year:item[7],
								dataloaded : true,
								tabIndex : (150 + (i + 7)),
								classy:'icon-images',
								template:'pow',
								colorCode:'235, 189, 30',
								color:'yellow',
								type:'image',
								randomnumber: Math.floor(Math.random()*51),
								id:'nonpow'+i

							});
						});
						return nonpow
					});
				});
		}
	};
}]);

TAS_Site.factory('Quotes', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions){
return{
	getQuotesData :function(item){
			var quotes = [];
			return $http.jsonp('https://spreadsheets.google.com/feeds/list/0Ak_vKEBczgcYdHczblprYk9WalhQTzhnY0h5Sm10Z3c/1/public/values?alt=json&callback=JSON_CALLBACK').then(function(result) {
				if(result!=undefined)
				{
				quotes = result.data.feed.entry;
				HelperFunctions.forEach(quotes,function(quote) {
					var i=quotes.indexOf(quote);
					quote.id = 'quote'+i;
					quote.gsx$tn.$t = quotes[i].gsx$tn.$t;
					quote.tabIndex = i + 200;
					//quote.headline=quote[0]+' '+ quote.item[1];
					quote.classy= 'icon-bubble';
					quote.template= 'quotes';
					quote.colorCode= '25, 142, 129';
					quote.year = quote.gsx$year.$t;
					quote.color='green';
					quote.type='quote';
					quote.description = quote.gsx$quote.$t;
					randomnumber= Math.floor(Math.random()*51)
				});

				return quotes;
				}
				else{
					return $http.get('/JSONBackups/Quotes.json').then(function(result) {
					quotes = result.data.feed.entry;
					HelperFunctions.forEach(quotes,function(quote) {
						var i=quotes.indexOf(quote);
						quote.id = 'quote'+i;
						quote.gsx$tn.$t = quotes[i].gsx$tn.$t;
						quote.tabIndex = i + 200;
						//quote.headline=item[0]+' '+ item[1];
						quote.classy= 'icon-bubble';
						quote.template= 'quotes';
						quote.colorCode= '25, 142, 129';
						quote.year = quote.gsx$year.$t;
						quote.color='green';
						quote.type='quote';
						quote.description = quote.gsx$quote.$t;
						randomnumber= Math.floor(Math.random()*51)
					});

					return quotes;

				});
				}
			}, function(error) {
				
				return $http.get('JSONBackups/Quotes.json').then(function(result) {
					quotes = result.data.feed.entry;
					HelperFunctions.forEach(quotes,function(quote) {
					var i=quotes.indexOf(quote);
						quote.id = 'quote'+i;
						quote.gsx$tn.$t = quotes[i].gsx$tn.$t;
						quote.tabIndex = i + 200;
						//quote.headline=item[0]+' '+ item[1];
						quote.classy= 'icon-bubble';
						quote.template= 'quotes';
						quote.colorCode= '25, 142, 129';
						quote.year = quote.gsx$year.$t;
						quote.color='green';
						quote.type='quote';
						quote.description = quote.gsx$quote.$t;
						randomnumber= Math.floor(Math.random()*51)
					});

					return quotes;

				});
			});
		}
	};		
}]);	

TAS_Site.factory('Lessons', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions){
return{
	getLessonData : function(teachername) {
			
			

			return $http.jsonp('https://www.googleapis.com/fusiontables/v1/query?sql=SELECT+LastName%2CFirstName%2CState%2C+YearSailed%2C+GradeLevel%2C+Size%2C+Title%2C+Keywords%2C+Objective%2C+Description%2C+URL%2c+Topics+FROM+17OXuyYjiIvxjr1Yd3DZ-SI-dzp-soOuTDNOHoSOA&key=AIzaSyBBcCEirvYGEa2QoGas7w2uaWQweDF2pi0&callback=JSON_CALLBACK').then(function(result) {
				if (result.data.rows != undefined) {
					var lesson = [];
					
					HelperFunctions.forEach(result.data.rows,function(item){
						var o = result.data.rows.indexOf(item);
						lesson.push({
							lastname : item[0],
							firstname : item[1],
							state : item[2],
							year : item[3],
							grades : item[4],
							gradesArr : item[4].split(','),
							size : item[5],
							headline : item[6],
							keywords : item[7],
							keywordArr : item[7].split(','),
							objective : item[8],
							description : item[9],
							url : item[10],
							topics : item[11],
							checkContents : true,
							id : 'lesson'+o,
							favorite : 'off',
							classy: 'icon-chalkboard2' ,
							template: 'lesson',
							colorCode:'0, 51, 80',
							color:'dkstblue',
							type:'lesson',
							src: 'images/chalkboard.png',
							randomnumber: Math.floor(Math.random()*51)
						});
						
					});
					
					return lesson;
				}
				else{
					var lesson = [];
					return $http.get('/JSONBackups/LessonsTable.json').then(function(result) {
					
					HelperFunctions.forEach(data.rows.length,function(item){
						var o = result.data.rows.indexOf(item);
						var name_comp = item[1] + ' ' + item[0]

						if (name.toLowerCase() == name_comp.toLowerCase()) {
							lesson.push({
								lastname : item[0],
								firstname : item[1],
								state : item[2],
								year : item[3],
								grades : item[4],
								gradesArr : item[4].split(','),
								size : item[5],
								headline : item[6],
								keywords : item[7],
								keywordArr : item[7].split(','),
								objective : item[8],
								description : item[9],
								url : item[10],
								topics : item[11],
								checkContents : true,
								id :'lesson'+ o,
								favorite : 'off',
								classy: 'icon-chalkboard2',
								template: 'lesson',
								colorCode:'0, 51, 80',
								color:'dkstblue',
								type:'lesson',
								src: 'images/chalkboard.png',
								randomnumber: Math.floor(Math.random()*51)

							});
						}
					});

					return lesson;
					});
					}

				

			}, function(error) {

				var lesson = [];
				return $http.get('/JSONBackups/LessonsTable.json').then(function(result) {
					var name = $routeParams.teachername.replace('*', ' ')

					HelperFunctions.forEach(data.rows.length,function(item){
						var o = result.data.rows.indexOf(item);
						var name_comp = item[1] + ' ' + item[0]

						if (name.toLowerCase() == name_comp.toLowerCase()) {
							lesson.push({
								lastname : item[0],
								firstname : item[1],
								state : item[2],
								year : item[3],
								grades : item[4],
								gradesArr : item[4].split(','),
								size : item[5],
								headline : item[6],
								keywords : item[7],
								keywordArr : item[7].split(','),
								objective : item[8],
								description : item[9],
								url : item[10],
								topics : item[11],
								checkContents : true,
								id :'lesson'+ o,
								favorite : 'off', 
								classy: 'icon-chalkboard2',
								template: 'lesson',
								colorCode:'0, 51, 80',
								color:'dkstblue',
								type:'lesson',
								src: 'images/chalkboard.png',
								randomnumber: Math.floor(Math.random()*51)


							});
						}
					});

					return lesson;
				});
			});
		},
	};
}]);



TAS_Site.factory('Timeline', ['$http', '$routeParams', '$location', '$rootScope', '$sce','HelperFunctions',
function($http, $routeParams, $location, $rootScope, $sce, HelperFunctions) {
	return{
		getTimelineData:function()
		{
		return $http.get('https://spreadsheets.google.com/feeds/list/17kGcCx_HQPgUd4_QWFOlc1-HTaF2_rJJZ_CVoUjwCdU/1/public/values?alt=json').then(function(data){
				var items= (data.data.feed.entry);
				/*var td = new Date();
				var bd = {};
				bd.utcDate =new Date(data.data.feed.entry[0].date.$t);
				bd.year = bd.utcDate.getFullYear();
				bd.years = td.getFullYear() -bd.year;
				var number = 0;
				var month=0;
				var year = bd.year;
				
				var months = 12*bd.years;*/
				
				items.years=[];
				var tmpTxt=''
				
				HelperFunctions.forEach(items, function(item)
				{
					if(!tmpTxt.match(item.gsx$year.$t))
					{
						items.years.push(
							{'year':item.gsx$year.$t, 'state': 'notselected', color:item.gsx$color.$t, classy:'hider',noSubnav:true,
								subNav :[
								{type:"article", state:'notselected', checked:'notselected', color:'dkblue', 'year':item.gsx$year.$t, on_off:'off','classy':'icon-newspaper dkblue' }, 
								{type:"image",state:'notselected', checked:'notselected', color:'yellow', 'year':item.gsx$year.$t, on_off:'off','classy':'icon-images yellow' },
								{type:'dates', state:'notselected', checked:'notselected', color:'foam', 'year':item.gsx$year.$t, on_off:'off', 'classy':'icon-calendar foam' }, 
								{type:'profile', state:'notselected', checked:'notselected', color:'blue', 'year':item.gsx$year.$t, on_off:'off', 'classy':'icon-profile blue' },
								{type:"quote", state:'notselected', checked:'notselected', color:'green', 'year':item.gsx$year.$t, on_off:'off', 'classy':'icon-bubble green' },  
								{type:"lesson", state:'notselected', checked:'notselected', color:'dkstblue', 'year':item.gsx$year.$t, on_off:'off', 'classy':'icon-chalkboard2 dkstblue' }, 
								{type:"stat", state:'notselected', checked:'notselected', color:'ltgreen', 'year':item.gsx$year.$t, on_off:'off', 'classy':'icon-stats ltgreen' }, 
								]
						});
					}
					tmpTxt+=item.gsx$year.$t+',';
				});
				
				return items;
		});	
		
		}
	};
}]);	

TAS_Site.factory('BrowseSearch', ['HelperFunctions','$q', function(HelperFunctions, $q){
	return{
		
		SearchData :function(arr, query, properties, checkDupProperty)
		{
		var deferred = $q.defer();
		var searchArr={arr:[], fullArr:[]};
		var searchArr=HelperFunctions.searchDataMatch(arr,query, properties, checkDupProperty);
		deferred.resolve(searchArr);
		return deferred.promise;
		},
		
		FilterData: function(arr, query, properties, checkDupProperty,type, checking_prop)
		{
		var deferred = $q.defer();
		var filteredArr={arr:[], fullArr:[]};
		filteredArr=HelperFunctions.searchObjProperties(arr,query, properties, checkDupProperty, type, checking_prop);
		deferred.resolve(filteredArr);
		return deferred.promise;	
		}
	};	
}]);
