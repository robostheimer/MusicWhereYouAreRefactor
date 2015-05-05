<?php
$qs=$_GET['q'];
$qs=urlencode($qs);
$url ='https://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=small|medium|large|xlarge&restrict=cc_attribute&rsz=8&safe=active&q='.$qs;

$json = file_get_contents($url);
//$json = str_replace( '"responseData"', 'responseData',$json);
//$json = str_replace( '"results"', 'results',$json);
//$json = str_replace('"GsearchResultClass"', 'GsearchResultClass', $json);

echo $json;
?>