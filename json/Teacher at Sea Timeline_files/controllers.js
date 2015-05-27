'use strict';

/* Controllers */

angular.module('Story', ['infinite-scroll'])
.controller('CardController', ['AlumniSpot','PhotosofWeek','Teacher','News','Lessons', 'Quotes','$scope','$sce','HelperFunctions','BrowseSearch','$rootScope','Timeline','$location', '$routeParams',
function(AlumniSpot, PhotosofWeek, Teacher, News, Lessons, Quotes, $scope, $sce, HelperFunctions, BrowseSearch, $rootScope, Timeline, $location, $routeParams)
{
	$scope.noSubNav=true;
	var alldata={};
	alldata.fullArr=[];
	$scope.alldata={arr:[],fullArr:[], years:[]};
	$scope.alldata_all=[];
	alldata.years=[];
	$scope.iterator=50;
	$scope.start_index=-100;
	$scope.end_index = -50;
	$scope.loading =true;
	$scope.filteredArr={arr:[], fullArr:[]};
	$scope.filteredBtnArr={arr:[], fullArr:[]};
	$scope.on_off='off';
	$scope.arr=[];
	$scope.showCards=true;
	$scope.showList=false;
	var nameStr='';	
	var arr=[];
	$scope.allchecked='notselected';
	$scope.viewButtons = [{name:'boxes', state:'on'}, {name:'list', state:'off'}];
	$scope.orderButtons = [{name:'Year (Dsc)', state:'off', order: 'dsc', type:'number', prop:'year'}, {name:'Year (Asc)', state:'off', order:'asc', type: 'number', prop:'year'}, {name: 'Type', state:'off', order:'dsc', type:'str', prop: 'type'}];
	
	$scope.template = $location.path().split('/')[1].split('/')[0];
	console.log($scope.template);
	
	$scope.runApp=function()
	{
			
			Timeline.getTimelineData().then(function(data){
			$scope.items = data;
			$scope.yearsWidth = $scope.items.years.length*75;
			$scope.navWidth = $('.navigation').width();
			$scope.windowHeight=$(window).height();
		});
		/*if(sessionStorage.arr==null)
		{*/
			Teacher.createTeacherList().then(function(data){
			var teachers = data.data.reverse();
				alldata.years = data.years
				alldata.fullArr=alldata.fullArr.concat(teachers);
				
				PhotosofWeek.getPOW().then(function(data){
				var pow = data;
				
					PhotosofWeek.getNonPOW().then(function(data){
						var nonpow=data;
						
						pow = pow.concat(nonpow); 
						alldata.fullArr=alldata.fullArr.concat(pow);
						pow.forEach(function(pow){
						if(pow.headline.length>220)
						{
							pow.powSlice = HelperFunctions.Slicer(pow.headline, 220)+'...';
						}
						else{
							pow.powSlice =pow.headline;
						}
						});	
						AlumniSpot.getSpotData().then(function(data){
							
							var spot = data;
							alldata.fullArr=alldata.fullArr.concat(spot);
								News.getNewsData().then(function(data){
								var news = data;
								alldata.fullArr=alldata.fullArr.concat(news);
								Lessons.getLessonData().then(function(data){
									var lessons = data;
									lessons.forEach(function(lesson){
										if(lesson.description.length>180)
										{
											lesson.lessonSlice = HelperFunctions.Slicer(lesson.description, 180)+'...';
										}
										else{
											lesson.lessonSlice=lesson.description;
										}
									});
									
									alldata.fullArr=alldata.fullArr.concat(lessons);
										Quotes.getQuotesData().then(function(data){
										var quotes = data;
										alldata.fullArr=alldata.fullArr.concat($scope.quotes);
										alldata.fullArr.pop();
										alldata.fullArr = HelperFunctions.SortObjDsc('year', alldata.fullArr, 'num', 'headline');
										$scope.alldata_all = alldata.fullArr;
										alldata.fullArr = alldata.fullArr;
										alldata.arr=alldata.fullArr.slice($scope.start_index,$scope.end_index);									
										alldata.years=HelperFunctions.removeDuplicatesArr(alldata.years);
										$scope.alldata = alldata;
										$scope.loading=false;
										
										
									});
				
								});
							});
						});
					});
					
				});
			});
		//}
		/*else{
			$scope.alldata.arr = jQuery.parseJSON(sessionStorage.arr);
			$scope.alldata.fullArr=jQuery.parseJSON(sessionStorage.fullArr);
			$scope.sessionStorage.clear();
			$scope.loading=false;
		}*/
		
		
	};
	
	$scope.savState = function()
	{
		sessionStorage.arr = JSON.stringify($scope.alldata.arr);
		sessionStorage.fullArr = JSON.stringify($scope.alldata.fullArr);
		sessionStorage.buttonsOn = JSON.stringify($scope.buttonsOn);
	};
	
	$scope.filterData =function(query){
		
		
		$scope.query=query;
		if(query.length==0  )
		{
			$scope.filteredArr=[];
			
			//$scope.nofilter=true;
			//$scope.filtered=false;
			//$scope.filteredBtn=false;
			$scope.alldata.arr= $scope.alldata_all.slice(0, 50);
			$scope.alldata.fullArr=$scope.alldata_all
		}
		else{
			BrowseSearch.SearchData($scope.alldata_all, query, ['headline', 'year', 'type'], 'headline').then(function(data){
			//$scope.nofilter=false;
			//$scope.filtered=true;
			//$scope.filteredBtn=false;
			$scope.alldata.arr = data.arr;
			$scope.alldata.fullArr = data.fullArr;
			$scope.turnOffNav();
		});
		}
	};
	$scope.filterDataBtn =function(query, properties, type, checking_prop){
		
		if(sessionStorage.buttonsOn!=null)
		{
			
			$scope.buttonsOn=jQuery.parseJSON(sessionStorage.buttonsOn);
		}
		else{
			$scope.buttonsOn={years:[], subnav:[]};
		};
		
		
		
		$scope.buttonsOn.years.push(checking_prop);
		console.log(query.replace(/""/g, ''))
		$scope.buttonsOn.subnav.push(query.replace(/""/g,''));
		$scope.buttonsOn.years=HelperFunctions.removeDuplicatesArr($scope.buttonsOn.years);
		$scope.buttonsOn.subnav= HelperFunctions.removeDuplicatesArr($scope.buttonsOn.subnav);
		console.log($scope.buttonsOn);
	
		$scope.savState();
		if(query.length==0  )
		{
			//$scope.filteredArr=[];
			//$scope.nofilter=true;
			//$scope.filtered=false;
			//$scope.filteredBtn=false;
			$scope.alldata.arr= $scope.alldata_all.slice(0, 50);
			$scope.alldata.fullArr=$scope.alldata_all;
			$scope.loading=false;
		}
		else{
			/////////////Create Filter Data function and change from SearchData to FilterData
			BrowseSearch.FilterData($scope.alldata_all, query, properties, 'headline', type, checking_prop).then(function(data){
			$scope.alldata.arr=[];	
				
			$scope.filteredBtnArr.fullArr = $scope.filteredBtnArr.fullArr.concat(data);
			$scope.alldata.fullArr = $scope.filteredBtnArr.fullArr;
			$scope.alldata.arr = $scope.filteredBtnArr.fullArr.slice(0, 50);
			$scope.loading=false;
			
		});
		}
	};
	$scope.removeDataFromUI = function(properties,  strs, type)
	{
		var tmpArr=[];
		var tmpArr= HelperFunctions.removeItemsFromArrObj($scope.alldata.fullArr, properties, strs, type, 'headline');
		
		if(tmpArr.length!=0)
		{
			$scope.alldata.fullArr=tmpArr;
			$scope.alldata.arr = tmpArr;
			$scope.loading=false;
		}
		else{
			$scope.filteredBtnArr.fullArr=[];
			$scope.filteredBtnArr.arr=[]
			$scope.alldata.arr= $scope.alldata_all.slice(0, 50);
			$scope.alldata.fullArr=$scope.alldata_all;
			$scope.loading=false;
		}
		
	};	
	
	$scope.removeCheckedUI =function(property){
		alert('removing')
		$scope.alldata.fullArr=$scope.alldata.fullArr.filter(function(item){
			if(item.type.indexOf(property)<0)
			{
				
				return true;
			}
			
		});
		$scope.alldata.arr= $scope.alldata.fullArr.slice(0, 50);
		if($scope.alldata.arr.length==0){
			$scope.alldata.fullArr= $scope.alldata_all;
			$scope.alldata.arr= $scope.alldata.fullArr.slice(0, 50);
			
		}
	};
	
	$scope.addMore=function()	
	{
		$scope.loading_more=true;
		if($scope.alldata.arr.length<=$scope.alldata.fullArr.length){
		$scope.start_index =$scope.start_index+50;
		$scope.end_index = $scope.end_index+50
		////////////ensures the the start_index equals the length of the fullArr to 
		
			if($scope.start_index>$scope.alldata.fullArr.length){
				$scope.start_index =$scope.alldata.arr.length;
				$scope.end_index = $scope.start_index+50
				
			}
			else{
				$scope.start_index=$scope.start_index;
				$scope.end_index = $scope.start_index+50
			}
					$scope.alldata.arr=$scope.alldata.arr.concat($scope.alldata.fullArr.slice($scope.start_index, $scope.end_index));
		$scope.alldata.arr=  HelperFunctions.removeDuplicatesArrObj($scope.alldata.arr, 'headline', false);
		$scope.loading_more=false;
		
		
		}
		else{
			$scope.alldata.arr=$scope.alldata_arr;
			$scope.start_index=$scope.alldata.fullArr.length;
			$scope.end_index=$scope.alldata.fullArr.length+50;
			console.log($scope.start_index)
		}
		
		
	};
	
	$scope.addMoreFiltered=function()	
	{

		if($scope.filteredArr.arr.length>=$scope.iterator)
		{
		$scope.index_start =$scope.index_start+50
		$scope.index_end = $scope.index_start+50
		
			if($scope.end_index<$scope.filteredArr.arr.length){
				$scope.end_index=$scope.index_end;
			}else{
				$scope.index_end=$scope.filteredArr.arr.length;
			}
		$scope.filteredArr.arr=$scope.filteredArr.arr.concat($scope.filteredArr.fullArr.slice($scope.start_index, ($scope.end_index+50)));
				}
		
	};

	$scope.addMoreFilteredBtn=function()	
	{

		if($scope.filteredBtnArr.arr.length>=$scope.iterator)
		{
			$scope.index_start =$scope.index_start+$scope.iterator;
			$scope.index_end = $scope.index_start+$scope.iterator;
			
			if($scope.end_index<$scope.filteredBtnArr.arr.length){
				$scope.end_index=$scope.index_end;
			}else{
				$scope.index_end=$scope.filteredBtnArr.arr.length;
			}
			$scope.filteredBtnArr.arr=$scope.filteredBtnArr.arr.concat($scope.filteredBtnArr.fullArr.slice($scope.index_start, ($scope.index_start+50)));
		
		}
		
	};	
	////////////////////////Buttons///////////////////////////	$scope.noSubnav=true;
	
	$scope.controlViews = function(type){
		console.log(type);
		console.log($scope.viewButtons)
		
		$scope.viewButtons =HelperFunctions.Toggle($scope.viewButtons, type,'name' ,'on', 'off');
		
	};
	
	$scope.controlSubNav=function()
	{
		if($scope.noSubNav==false)
		{
			$scope.noSubNav=true;
		}
		else{
			$scope.noSubNav=false;
		}
	};
		
	$scope.changeNavClass=function(obj1, obj2 )
	{
		$scope.orderButtons = [{name:'Year (Dsc)', state:'off', order: 'dsc', type:'number', prop:'year'}, {name:'Year (Asc)', state:'off', order:'asc', type: 'number', prop:'year'}, {name: 'Type', state:'off', order:'dsc', type:'str', prop: 'type'}];
	
		$scope.query="";
		$scope.loading=true;
		/////////////Toggles when MainNav/Years buttons pressed////////////
		if(obj2 ==undefined)
		{
						/////////Button active
			if(obj1.state=='selected')
			{
				
				$scope.allchecked = 'notselected';
				
				obj1.state='notselected';
				
				///////////on unselecting a button, this removes item from $scope.arr which is usedin changeNavCheck Function
				//////////to make sure that the year navigation lights up correctly when an checkbox is deactivated//////////////
				
				var index = $scope.arr.indexOf(obj1);
				$scope.arr.splice(index, 1);
				obj1.subNav.forEach(function(subNav){
					subNav.state='notselected';
					
				});
				
				//////////Makes sure that if not all main nav items are selected, that no checkboxes light up
				$scope.items.years.forEach(function(year){
					year.subNav.forEach(function(item){

						item.checked='notselected';
						item.on_off='off';
					});
					
				});
				$scope.removeDataFromUI(['year'], [ obj1.year],'');
			}/////////////Button Not Active
			else
			{
				var holder_arr=[];
				obj1.state='selected';
				$scope.allchecked='notselected';
				
				obj1.subNav.forEach(function(subNav){
					subNav.state='selected';
				});
				/////////////Loops through the items to see if all years buttons are lit up; if so this makes sure that the checkbox is also filled in
				$scope.items.years.forEach(function(year){
					
					if(year.state=='selected'){
						holder_arr.push(year);
						
						if(holder_arr.length==$scope.items.years.length)
						{
							year.subNav.forEach(function(item){
								
							if(item.state=='selected')
								{
									$scope.changeNavCheck(item.name, item.checked, 'off');
								}
							});
						}
					}	
				});
				$scope.filterDataBtn('"'+obj1.year+'"', ['year'], '', '');
				
			}
			
		}
		//////////////controls SubNav Toggle///////////
		else{
			$scope.allchecked='notselected';
				if(obj2.state=='selected')
				{
					
					obj2.state='notselected';
					obj2.checked='notselected';
					obj2.checked='notselected';
					$scope.removeDataFromUI(['year', 'type'], [obj1.year, obj2.type],'button');
					$scope.items.years.forEach(function(year){							
						year.state="notselected";
						year.subNav.forEach(function(item){
							if(year.state=='selected' && item.state=="selected"  && !nameStr.match(year.year))
							{
							 $scope.arr.push(item.year);	
							 nameStr+=item.year;
							}
							if(obj2.name==item.name)
								{
									
									item.checked='notselected';
									item.on_off='off';
									
								}
							if(item.state=="selected")
							{
								year.state='selected';
							}				
								
							
						});
					});
					}
				else if(obj2.state=='notselected'){
					var holder_arr=[];
					
					obj2.state='selected';
					obj1.state='selected';
					//console.log(obj2)
					/////////////Loops through the items to see if all icon buttons are lit up; if so this makes sure that the checkbox is  filled in
					$scope.items.years.forEach(function(year){
						year.subNav.forEach(function(item){
						var y=year.subNav.indexOf(item);	
						//console.log(obj2.name+':'+item.name+':'+item.state)
						if(obj2.name==item.name && item.state=='selected')
								{	
									holder_arr.push(item);
									$scope.filterDataBtn('"'+item.type+'"', ['year', 'type'] ,'button', year.year);	
									
								}
								if(holder_arr.length==$scope.items.years.length && y== year.subNav.length-1){
									$scope.changeNavCheck(obj2.name, item.checked, 'off');
								}
								
						});
					});
					
					
					
			}
			
		}
		
	};
	
	$scope.changeNavCheck = function(type, allselected,on_off)
	{
		$scope.orderButtons = [{name:'Year (Dsc)', state:'off', order: 'dsc', type:'number', prop:'year'}, {name:'Year (Asc)', state:'off', order:'asc', type: 'number', prop:'year'}, {name: 'Type', state:'off', order:'dsc', type:'str', prop: 'type'}];
	
		$scope.loading=true;
		/////////////If gray top check box is activated, all boxes and check boxes are given a fill///////////////
		if(type == "all")
		{
			
				if(allselected == 'notselected')
				{
					$scope.alldata.fullArr = $scope.alldata_all;
					$scope.alldata.arr = $scope.alldata.arr.slice(0, 50);
					$scope.allchecked='selected';
					$scope.items.years.forEach(function(year){
						year.state = 'selected';
						year.subNav.forEach(function(item){
							item.checked='selected';
							item.state ='selected';
							});
						});
						$scope.loading=false;
				}
				else {
						
					$scope.allchecked='notselected';
					$scope.items.years.forEach(function(year){
						year.state = 'notselected';
						year.subNav.forEach(function(item){
							item.checked='notselected';
							item.state ='notselected';
							item.on_off='off';
							
						});
					});
					$scope.loading=false;
			}	
			
		}
		
		/////////////////If a single checkbox is pushed, this activates or deactivates that box based on the checked property of the 
		////////////////subNav properties of the years array	
		else
		{
///////////////If checkbox is clicked, this lights up the proper row and adds items to the $scope.arr variable
				//////////////Which is used in the else conditional to light up the proper icons when all checkboxes are unclicked.
				$scope.loading=true;
				if(on_off=='off')
				{
					
					HelperFunctions.forEach($scope.items.years, function(year){
						HelperFunctions.forEach(year.subNav, function(item){							
							
							if(year.state=='selected' && item.state=="selected"  && !nameStr.match(year.year))
							{
							 $scope.arr.push(year);	
							 nameStr+=year.year;
							}
							
							if(item.type==type){	
								
								year.state="selected";
								
								if(item.checked=='notselected')
								{
									//$scope.allchecked='selected';	
									
									item.state='selected';
									item.checked='selected';
									item.on_off='on';
									$scope.filterDataBtn('"'+item.type+'"', ['year', 'type'] ,'button', year.year);	
										
								}
								else
								{
									//$scope.allchecked='notselected';	
									item.state='notselected';
									item.checked='notselected';
									item.on_off='on';
									
								}
								
							}
							
						});	
						
					});
					$scope.loading=false;
					
				}else				
				{
					$scope.removeCheckedUI(type);
					$scope.allchecked='notselected';
					var count=0;
					$scope.items.years.forEach(function(year){
								
								year.state='notselected';	
								/////////////Turns off all subnavigation icons for particular checkbox////////////////
								year.subNav.forEach(function(item){
									count = count+1;
									item.on_off='off';
									if(item.state=='selected' && item.type==type)
									{
										item.checked ='notselected';
										item.on_off='off'
										item.state ='notselected';
										
										//
																				

									}
									else if(item.state=='selected'&& item.type!=type){
										item.checked='selected';
										item.on_off='on'
										item.state ='selected';
										year.state='selected';
										//$scope.filterDataBtn('"'+item.type+'"', ['year', 'type'] ,'button', year.year);	
										//$scope.removeDataFromUI(['year', 'type'], [obj1.year, obj2.type],'button');
									}	
									else{
										item.checked ='notselected';
										item.on_off='off'
										item.state ='notselected';
										//$scope.removeDataFromUI(['year', 'type'], [item.year, item.type],'button');
										
									}
									
								});
					});
					$scope.loading=false;
				}
		}
	};
	
	$scope.turnOffNav = function(){
		
		$scope.items.years.forEach(function(item){
			item.state='notselected';
				item.subNav.forEach(function(item2){
					item2.checked='notselected';
					item2.selected ='notselected';
					item2.state='notselected';
				});
				
			});
	};
	///////////////////Search//////////////////////////
	///////////////////Features/////////////////////
	
	$scope.orderData=function(parameter, name,	 asc_or_dsc, str_or_num)
	{
		//$scope.turnOffNav();
		
		if(asc_or_dsc == 'asc')
		{
			//$scope.alldata.fullArr=$scope.alldata_all
			$scope.alldata.fullArr=HelperFunctions.SortObjAsc(parameter.toLowerCase(),$scope.alldata.fullArr, str_or_num, 'headline');
			
			$scope.alldata.arr = $scope.alldata.fullArr.slice(0,50);
		}else{
			//$scope.alldata.fullArr=$scope.alldata_all
			$scope.alldata.fullArr=HelperFunctions.SortObjDsc(parameter.toLowerCase(), $scope.alldata.fullArr, str_or_num, 'headline');
			$scope.alldata.arr = $scope.alldata.fullArr.slice(0,50);	
		}
		$scope.orderButtons =HelperFunctions.Toggle($scope.orderButtons, name,'name' ,'on', 'off');	
		};
	
	$scope.openFeature=function(id)
	{
		
	};

	$scope.SkipValidation = function(value) {
			return $sce.trustAsHtml(value);
	};

	$scope.runApp();
	
	
}]).controller('FeatureController', ['AlumniSpot','PhotosofWeek','Teacher','News','Lessons', 'Quotes','$scope','$sce','HelperFunctions','BrowseSearch','$rootScope','Timeline','$location', '$routeParams',
function(AlumniSpot, PhotosofWeek, Teacher, News, Lessons, Quotes, $scope, $sce, HelperFunctions, BrowseSearch, $rootScope, Timeline, $location, $routeParams){
	
}]);
