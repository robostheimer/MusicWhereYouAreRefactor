TAS_Site.factory('HelperFunctions', [function(){
	var Helper={};
		Helper.SortObjAsc=function(property, obj, num_or_str, checkDupProperty)
	 	{
	 	if(num_or_str=='str')
	 	{
	 	var sortable =[];
	 	obj.sort(function(a,b) {return (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0);}) ;
	 	
	 	return obj.reverse();
	 	}
	 	else{
	 		obj.sort(function(a, b){
	 			
	 				 var aprop=parseInt(a[property]);
					 var bprop =parseInt(b[property]);
					 return bprop-aprop;
					});
	 	}
	 		obj=Helper.removeDuplicatesArrObj(obj, checkDupProperty, false);
	 		return obj.reverse();
	 		
	 };
	
	
	Helper.SortObjDsc=function(property, obj, num_or_str, checkDupProperty)
	 {
	 	
	 
	 	if(num_or_str=='str')
	 	{
	 	
	 	var sortable =[];
	 
	 	obj.sort(function(a,b) {return (a[property] > b[property]) ? 1 : ((b[property] > a[property]) ? -1 : 0);}) 
	 	
	 	return obj;
	 	}
	 	else{
	 		obj.sort(function(a, b){
	 			
	 				 var aprop=parseInt(a[property]);
					 var bprop =parseInt(b[property]);
					 return bprop-aprop;
					});
	 	}	
	 		obj=Helper.removeDuplicatesArrObj(obj, checkDupProperty, false);
	 		return obj;
	 		
	 };
	
	 Helper.toTitleCase=function(str)
	 {
	    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	 };
	
	 Helper.Slicer = function(str, number)
	 {
		var slicer = str.slice(0, number);
		var slicer2 = str.slice(number, str.length);
		var slicer2Index = slicer2.indexOf(' ');
		slicer2 = str.slice(0, (number+slicer2Index));
		//alert(slicer2);
		return slicer2;
	 };
	 
	 Helper.removeHTML = function(str)
	{
	         var str =  jQuery('<div />', { html: str }).text();
	        str = 		jQuery('<p />', { html: str }).text();
	        str = jQuery('<i />', { html: str }).text();
			return str;
	};
	
	Helper.DigPatt =function(str, char)
	{
	  var checkDigit = (str.lastIndexOf(char)+1);
	  var digPatt = str.slice(checkDigit, str.length);
       //console.log(digPatt);
       if(digPatt.match(/\d/g))
       {
       	name = str.split('-')[0];
       }
       else
       {
       	name=str;
       }
       return name;
	};
	 
	Helper.goToByScrollTop=function(id) {
		// Remove "link" from the ID
		id = id.replace("link", "");
		// Scroll
		$(id).animate({
			scrollTop : 50
		}, 'slow');
	}; 
	
	
	
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
	var array=array;
	function isUnique ()
	{
		
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
	}
	
	return isUnique(array);
		
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
	        
	        
		});
		dups.finalArr = Helper.removeDuplicatesArrObj(dups.finalArr, property, false);
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
	 	/////Prepping string///////////
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
	 
	 Helper.searchObjProperties=function(arr, str, properties, checkDupProperty, type, checking_prop)
	 {
	 	var filtered=[];
	 	var finalfilter=[];
	 	var str = str.replace(/"/g,'');
	 	arr.forEach(function(item){
	 		properties.forEach(function(property){
	 			
	 			if(item[property]==str)
	 			{
	 				
	 				filtered.push(item);	
	 			}
	 		});
	 	});
	 	if(type=='button')
	 	{
			 	finalfilter=filtered.filter(function(item){
		 		if(item[properties[0]]===checking_prop){
		 			return true;
		 		}
		 	});
	 	
	 	}
	 	else{
	 	finalfilter = Helper.removeDuplicatesArrObj(filtered, checkDupProperty, false);
	 	}
	  	return finalfilter;
	 };
	
	Helper.removeItemsFromArrObj=function(arr, properties, strs, type, checkDupProperty){
		if(properties.length==1)
		{
			var tmpArr=arr.filter(function(item){
			if(strs.toString()!=item[properties.toString()])
				{
					return true;
				}		
			});
		}	
		else if (type!="" || type!=undefined && properties.length>1){
			var tmpArr=[];
			arr.forEach(function(item){
				properties.forEach(function(property){
					var i = properties.indexOf(property);
					
					if(strs[i]!=item[property])
					{
						tmpArr.push(item)
					}
					
				});				
			});	
		}	
		tmpArr = Helper.removeDuplicatesArrObj(tmpArr, checkDupProperty, false)
		return tmpArr;
	};
	
	
	Helper.checkProperty=function(properties, array)
	 {
	 	
	 	var arr=[];
	 	
	 	properties.forEach(function(property, value){
	 		array.forEach(function(item){
		 		
		 		if(item[property.prop]==property.value)
		 		{
		 			arr.push(item);
		 		}
		  	});
	 	});
	  	return arr;
	 };
	 
	 Helper.Toggle = function(arr, indiv, property, value1, value2){
	 		
	 		///add a map?
	 		
	 		
	 		arr.forEach(function(item){
	 			if(indiv.toLowerCase() ==item[property].toLowerCase() &&  item.state!=value1)
	 			{	
	 				item.state=value1
	 			}
	 			else{
	 				item.state=value2;
	 			}
	 			
	 				 		});
	 		return arr;
	 };
	 
	return Helper;
}]);
