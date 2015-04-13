function removeHTML(str) {
	return jQuery('<div />', {
		html : str
	}).text();
}

function replacePatterns(str) {
	str = str.replace('#/map/', '')
	str = str.replace('#/playlist/', '');
	str = str.replace(/_/g, ' ');
	//str = str.replace(/St. /i, 'Saint ');
	//str = str.replace(/St /i, 'Saint ');
	str = str.replace('New York, ', 'New York City, ');

	return str;
}

function locationReplace(str) {
	str = str.replace(', ', '*');
	str = str.replace(',', '*');
	str = str.replace(/ /g, '_');
	return str;
}

function removeSpecialChar(str) {
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
function goToByScrollTop(id) {
	// Remove "link" from the ID

	id = id.replace("link", "");
	// Scroll
	$('#' + id).animate({
		scrollTop : 0
	}, 'slow');

}
////////////Removesduplicate items from an array of Strings or Numbers///////////////////
function removeDuplicatesArr(array){
	var unique = [];
    for ( i = 0; i < array.length; i++ ) {
        var current = array[i];
        if (unique.indexOf(current) < 0)
        {
        	 unique.push(current);
        }
    }

    return unique;
}
////////////////Checks for a specific property in an array of objects and makes sure that the value of that property is not duplicated	
function removeDuplicatesArrObj(array, property, checkmatch){
	var unique={title:[], finalArr:[]};
	if(checkmatch==true)
	{
		
	forEach(array, function(item){
		
		if (!unique.title.toString().replace(/\W/g, '').match(item[property].replace(/\W/g,'')))
        {
        	 unique.title.push(item[property]);
        	 unique.finalArr.push(item);
        }
	});
	}
	else{
		forEach(array, function(item){
		
		if (unique.title.indexOf(item[property]) < 0)
        {
        	 unique.title.push(item[property]);
        	 unique.finalArr.push(item);
        }
	});
		
	}
	return unique.finalArr;
}
 
 function preventDuplicates(comparer, array, property, type)
 {
 	var tmpArr=[];
 	///////////Adds to  the Beginning
	if(type = 'splice'){
	 	forEach(comparer, function(compare)
		{
			tmpArr =removeDuplicatesArrObj(comparer, property, true);
			array.splice(0, 0, compare)	
		});
	}
	//////////Adds to end///////////
	else{
		forEach(comparer, function(compare)
			{
				tmpArr =removeDuplicatesArrObj(comparer, property, true);
				array.push(compare)	
			});
	}	
 	array = removeDuplicatesArrObj(array, property, true)
 		
 	return array;
	
 };
 
 function compareArraysObj(array1, array2, property)
 {
 	forEach(array1, function(item){
 		var x=array1.indexOf(item);
 		forEach(array2, function(item2){

 			if(item[property]==item2[property])
 			{
 				array1.splice(x, 1);
 			}
 		});
 	});
	return array1;
 }

/////////For LoopArray of Strings and Numbers (not objects)///////////////
function forEach(array, action) 
{ 
	
	for (var i = 0; i < array.length; i++)
	{
	 action(array[i]); 
	}
}

///////For Loop for  Array of Objects/////////////
function forEachIn( object, action) { 
	for (var property in object) 
	{ 
		if (Object.prototype.hasOwnProperty.call( object, property))
			 action( property, object[ property]); 
	 }
 }
function goToByScrollLeft(id) {
	// Remove "link" from the ID

	id = id.replace("link", "");
	// Scroll
	$('#' + id).animate({
		scrollLeft : 0
	}, 'slow');

}


function findThe(str)
{
	var strSlice = str.slice(3, str.length);
	strSlice = strSlice.replace('The', 'the');
	str = str.slice(0, 3)+strSlice;
	return str;
}
function sortNumber(a,b) {
    return a - b;
}

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {

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

}

function distance_to_degrees_lat(miles){
	
	var earth_radius = 3960.0;
	var degrees_to_radians = Math.PI/180.0;
	var radians_to_degrees = 180.0/Math.PI;
	return (miles/earth_radius)*radians_to_degrees
	
}

function distance_to_degrees_lon(lat, miles){
	var earth_radius = 3960.0
	var degrees_to_radians = Math.PI/180.0
	var radians_to_degrees = 180.0/Math.PI
	
	var  r = earth_radius*Math.cos(lat*degrees_to_radians)
    return (miles/r)*radians_to_degrees
}
