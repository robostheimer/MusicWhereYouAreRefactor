MusicWhereYouAreApp.factory('HelperFunctions', [function(){
	var Helper={};
		Helper.forEach=function(array, action) 
		{ 
			
			for (var i = 0; i < array.length; i++)
			{
			 action(array[i]); 
			}
		};

///////For Loop for  Array of Objects/////////////
	Helper.forEachIn= function( object, action) { 
		for (var property in object) 
		{ 
			if (Object.prototype.hasOwnProperty.call( object, property))
				 action( property, object[ property]); 
		}
 	};
		Helper.SortObjAsc=function(property, obj, num_or_str)
	 	{
	 	if(num_or_str=='str')
	 	{
	 	var sortable =[];
	 	obj.sort(
	 		function(a, b){
	 			
	 				 var aprop=a[property]
					 var bprop =b[property]
					 return bprop-aprop
					});
	 	
	 	return obj.reverse();
	 	}
	 	else{
	 		obj.sort(function(a, b){
	 			
	 				 var aprop=parseInt(a[property]);
					 var bprop =parseInt(b[property]);
					 return bprop-aprop;
					});
	 	}
	 		return obj.reverse();
	 };
	
	
	 Helper.SortObjDsc=function(property, obj, num_or_str)
	 {
	 
	 	if(num_or_str=='str')
	 	{
	 	var sortable =[];
	 	obj.sort(
	 		function(a, b){
	 			
	 				 var aprop=a[property]
					 var bprop =b[property]
					 return bprop-aprop
					});
	 	
	 	return obj
	 	}
	 	else{
	 		obj.sort(function(a, b){
	 			
	 				 var aprop=parseInt(a[property]);
					 var bprop =parseInt(b[property]);
					 return bprop-aprop;
					});
	 	}
	 		return obj;
	 };
	
	Helper.removeHTML=function(str) {
		return jQuery('<div />', {
			html : str
		}).text();
	};

	Helper.replacePatterns=function(str) {
	str = str.replace('#/map/', '')
	str = str.replace('#/playlist/', '');
	str = str.replace(/_/g, ' ');
	//str = str.replace(/St. /i, 'Saint ');
	//str = str.replace(/St /i, 'Saint ');
	str = str.replace('New York, ', 'New York City, ');

	return str;
};

	Helper.locationReplace=function(str) {
		str = str.replace(', ', '*');
		str = str.replace(',', '*');
		str = str.replace(/ /g, '_');
		return str;
	};
	
	 Helper.removeSpecialChar=function(str) {
		str = str.replace('&', 'and');
		str = str.replace(/[^a-zA-Z, ^1-9 ]/g, "");
		return str;
	};
	
	Helper.toTitleCase=function(str) {
		return str.replace(/\w\S*/g, function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	};
	
	Helper.textSlicer=function(text, numchar) {
		var slice_text = text.slice(numchar, text.length);
	
		var text_index = slice_text.indexOf('.');
		var final_text = text.slice(0, (numchar + text_index + 1));
		return final_text;
	
	};
	Helper.goToByScrollTop=function(id) {
		// Remove "link" from the ID
	
		id = id.replace("link", "");
		// Scroll
		$('#' + id).animate({
			scrollTop : 0
		}, 'slow');
	
	};
	
	
	
	Helper.createTitleFromURL=function(str)
	{
		var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		
		var str = str.replace('https://teacheratsea.wordpress.com','');
		str = str.replace('http://teacheratsea.wordpress.com','');
		str = str.split('/')[4];
		str = toTitleCase(str.replace(/-/g, ' '));
		
		
		var strSplitter = str.split(' ');
		var substr = strSplitter[1];
		var str = str.replace(substr, substr+',');
		
		str = str.replace(' 20', ', 20');
		
		monthArr.forEach(function(){
			if(str.replace(/\W/g,'').match(monthArr[z].replace(/\W/g,'')))
			{
				str = str.replace(monthArr[z], ', '+monthArr[z]).replace(' , ', ', ');
				return str;
			}
			else
			{
				return str;
			}
		});	
		
	};
	Helper.removeDuplicatesArr = function(array){
		var unique = [];
  		array.forEach(function(item) {
	        var current = item
	        if (unique.indexOf(current) < 0)
	        {
	        	 unique.push(current);
	        }
		   });
	    return unique;
	};
	
	Helper.removeDuplicatesArrObj=function(array, property, checkmatch){
	var unique={title:[], finalArr:[], notunique:[]};
	var notunique=[];
	if(checkmatch==true)
	{
		array.forEach(function(item){
			
			if (!unique.title.toString().replace(/\W/g, '').match(item[property].replace(/\W/g,'')))
	        {
	        	 unique.title.push(item[property]);
	        	 unique.finalArr.push(item);
	        }
	        else{
	        	unique.notunique.push(item);
	        }
		});
		}
		else{
			array.forEach(function(item){
			
			if (unique.title.indexOf(item[property]) < 0)
	        {
	        	 unique.title.push(item[property]);
	        	 unique.finalArr.push(item);
	        }
	        else{
	        	unique.notunique.push(item);
	        }
		});	
		}
		return unique.finalArr;
	};

	Helper.savArrayDups=function(array, property, checkmatch){
		var dups={title:[], finalArr:[], };
			array.forEach(function(item){
				
			if (dups.title.indexOf(item[property]) < 0)
	        {
	        	 dups.title.push(item[property]);
	        	
	        }
	        else{
	        	
	        	dups.finalArr.push(item);
	        }
	        
	        dups.finalArr = Helper.removeDuplicatesArrObj(dups.finalArr, property, false);
		});
	
		return dups.finalArr;
	};
	
	Helper.preventDuplicates=function(comparer, array, property, type)
	 {
	 	var tmpArr=[];
	 	///////////Adds to  the Beginning
		if(type = 'splice'){
		 	comparer.forEach(function(compare)
			{
				tmpArr =Helper.removeDuplicatesArrObj(comparer, property, true);
				array.splice(0, 0, compare)	
			});
		}
		//////////Adds to end///////////
		else{
			comparer.forEach(function(compare)
				{
					tmpArr =Helper.removeDuplicatesArrObj(comparer, property, true);
					array.push(compare)	
				});
		}	
	 	array = Helper.removeDuplicatesArrObj(array, property, true)
	 		
	 	return array;
		
	 };
	
	Helper.compareArraysObj =function(array1, array2, property)
	 {
	 	array1.forEach(function(item){
	 		var x=array1.indexOf(item);
	 		array2.forEach(function(item2){
	
	 			if(item[property]==item2[property])
	 			{
	 				array1.splice(x, 1);
	 			}
	 		});
	 	});
		return array1;
	 };
	
	
	Helper.strSplitter = function(str, splitter)
	{
		
		var strObj ={arr:[], orig: str};
		var start_index = str.indexOf(splitter) 
		var end_index=str.lastIndexOf(splitter)+1;
		var quotes = str.slice(start_index,end_index);
		
		if(quotes.length<str.length)
		{
			strObj.regStr=true;
			if(start_index==0)
			{
				noquote = str.slice(end_index, str.length);
			}
			else if(start_index>0 && end_index==str.length-1){
				noquote = str.slice(0, startindex);
			}
			else{
				noquote = str.slice(0, start_index)+str.slice(end_index, str.length);
			}
			noSplitter = noquote.split(' ');
			noSplitter.forEach(function(item){
 				var x= noSplitter.indexOf(item);
 				if(item=="" || item==" "){
 					noSplitter.splice(x, 1);
 				}
	 		});
		}
		else{
			strObj.regStr=false;
		}
		
		
		if(quotes.split('"').length>2)
	 		{
	 			strQuoteSplit =quotes.split(splitter) || quotes.split(splitter);
	 			console.log(strQuoteSplit);
	 			
	 			strQuoteSplit.forEach(function(item){
	 				var i= strQuoteSplit.indexOf(item);
	 				if(item=="" || item==" "){
	 					strQuoteSplit.splice(i, 1);
	 				}
	 					
	 				
	 			});
	 			strQuoteSplit.forEach(function(item){
	 			
	 				strObj.arr.push(item);
	 			});

	 		}
	 		if(strObj.regStr!=false)
	 		{
	 		strObj.arr =strObj.arr.concat(noSplitter)
	 		}
	 		return strObj;
	 		
	 		
	};
	
	
	Helper.searchDataMatch = function(array1, str, properties, checkDupProperty)
	 { 
	 ////////Prepping string///////////
	 	str=str.replace(/[&\/\\#,+()$~%.:*?<>{}]/g,'_');
	 	str = str.replace(/ or /g,'');
		str = str.replace(/ and /g,'');
		str=str.replace(/ the /g,'');
		str =str.replace(/ the/g,'');
		str = str.replace(/ and/g,'');
		str = str.replace(/ or/g,'');
		str=str.replace(/and /g,'');
		str=str.replace(/the /g, '');
		str = str.replace(/or /g,'');
		str = str.replace(/,/g,'');
		str = str.replace(/,/g,'');
		str = str.replace(/ a /g, ' ');
		str = str.replace(/ an /g, ' ');
		str = str.replace(/a /g, '');
		str = str.replace(/an /g, '');
		str=str.replace(/'/g, '"');
	 	
	 	if(str.indexOf('"')>=0|| str.indexOf("'")>=0)
	 	{
	 		
	 		
	 		strObj = Helper.strSplitter(str, '"');
	 		
	 		
	 	}
	 	else{
	 	str = str.replace(/ /g, '_');
	 	strSplitter = str.split('_');
	 	strObj = {arr: strSplitter, noArr: true}
	 	}
	 	
	 	
	 	
	 	var newArr=[];
	 	if(array1.length==0)
	 	{
	 		newArr=[];
	 	}
	 	else if(strObj.arr.length==1)
		 	{	
		 		if(str[str.length-1]=='s')
			 	{
			 		str = str.slice(0,str.length-1);
			 	}
			 	
			 	array1.forEach(function(item){
			 		
			 		if(item!=undefined){
			 			if(JSON.stringify(item).toLowerCase().match(str.toLowerCase()))
			 			{
			 				newArr.push(item);
			 			}
			 		}
			 		
			 	});
			
		 	}
		 else{
		 		
		 		
		 		strObj.arr.forEach(function(str){
		 			
		 			if(str[str.length-1]=='s')
				 	{
				 		str = str.slice(0,str.length-1);
				 	}
		 			array1.forEach(function(item){
			 		if(item!=undefined){
			 		
			 					if(JSON.stringify(item).toLowerCase().match(str.toLowerCase()))
				 				{
				 					
					 				newArr.push(item);
					 			}
			 		
			 		}
				 	});
			 	});
		 	}
	 	
	 	
	 	newArr = Helper.removeDuplicatesArrObj(newArr, checkDupProperty, false);
	 	obj = {arr:newArr.slice(0,50), fullArr: newArr}
	 	
	 	return obj;
	 	
	 };
	
	Helper.checkProperty=function(properties, array)
	 {
	 	var arr=[];
	 	console.log(array)
	 	properties.forEach(function(property, value){
	 		console.log(property.prop+':'+property.value)
		 	array.forEach(function(item){
		 		
		 		if(item[property.prop]==property.value)
		 		{
		 			arr.push(item);
		 		}
		  	});
	 	});
	  	return arr;
	 };
	 
	Helper.distance=function(lat1, lon1, lat2, lon2, unit) {

    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist

};

Helper.distance_to_degrees_lat=function(miles){
	
	var earth_radius = 3960.0;
	var degrees_to_radians = Math.PI/180.0;
	var radians_to_degrees = 180.0/Math.PI;
	return (miles/earth_radius)*radians_to_degrees
	
};

 Helper.distance_to_degrees_lon=function(lat, miles){
	var earth_radius = 3960.0
	var degrees_to_radians = Math.PI/180.0
	var radians_to_degrees = 180.0/Math.PI
	
	var  r = earth_radius*Math.cos(lat*degrees_to_radians)
    return (miles/r)*radians_to_degrees
};

Helper.findThe=function(str)
{
	var strSlice = str.slice(3, str.length);
	strSlice = strSlice.replace('The', 'the');
	str = str.slice(0, 3)+strSlice;
	return str;
};

Helper.Correlation = function(no_no, yes_no,  no_yes, yes_yes)
{
	return (yes_yes * no_no - no_yes*yes_no)/Math.sqrt((no_yes+yes_yes)*(no_no+yes_no)*(yes_no+yes_yes)*(no_no+no_yes));
	
};	 


	return Helper;
}]);
