<?php
$lt=$_GET['lat'];

/*$long = $_GET['long'];
$city = $_GET['city'];
$country = $_GET['country'];
$countryAB = $_GET['countryAB'];
$region = $_GET['Region'];
 
 */
 
 $lt = round($lt, 3);
 
$url ='Geolocation.txt';
$csv = file_get_contents($url);
$CountryID = '';
$Country = '';
$Region = '';
$City = '';
$Lat = '';
$Long = '';
$csvArr = explode('#', $csv);
$GeolocationFinalArr=Array();
for($i=2; $i<count($csvArr); $i++)
{
	
	$csvItems = explode(',', $csvArr[$i]);
	
	for($x=0; $x<count($csvItems); $x++)
	{
		
		if($x==0)
		{
			$CountryID= $csvItems[0];
		}
		if($x==1)
		{
			$Country=$csvItems[1];
		}
		if($x==2)
		{
			$Region= $csvItems[2];
		}
		if($x==3)
		{
			$City =$csvItems[3];
		}
		if($x==4)
		{
				
			$Lat= round($csvItems[4], 3);
		}
		if($x==5)
		{
			$Long =round($csvItems[5], 3);
		}
		
	}
	
	if(strcmp($lt, $Lat) == 0)
		{
		
		$GeolocationArr = array('CountryID'=>$CountryID, 'Country'=>$Country, 'Region'=>$Region, 'City'=>$City, 'Lat'=>$Lat, 'Long'=>$Long );
		array_push($GeolocationFinalArr, $GeolocationArr);
		}
	
}

//echo $url;
//echo $csv;
echo json_encode($GeolocationFinalArr);
?>