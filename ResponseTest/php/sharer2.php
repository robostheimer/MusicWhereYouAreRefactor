
<?php
echo 'test';
$songs=$_GET['q'];

$songsArr = explode('***', $songs);
$songsHolder=Array();
echo '[';
	

for($i=0; $i<(count($songsArr)-1); $i++)
{//
	$songtitleArr=explode('$$$', $songsArr[$i]);
	$songtitle=$songtitleArr[0];
	
	$songidArr=explode('@@@', $songtitleArr[1]);
	$songid=$songidArr[0];
	
	$songartistArr = explode('@@@', $songsArr[$i]);
	$songartistArr = explode('!!!',$songartistArr[1]);
	$songartist= $songartistArr[0];
	$artistlocation = $songartistArr[1];
	
	////"tracks": [{"foreign_release_id": "spotify:album:3iJKYjQBQzgkVnqQEqsrDd", "catalog": "spotify", "foreign_id": "spotify:track:09mEc1rkLImT06fqapeLMb", "id": "TRVEXGG1473594391C"}],
	$songsFinal=array('title'=>$songtitle[0], 'id'=> $songid, 'artist_name'=>$songartist, 'artist_location'=>$artistlocation);
	
	//echo $songtitle[0].'-'.$songid[0].'-'.$songartist.'<br>';
		echo json_encode(array('title'=>$songtitle, 'id'=> $songid, 'artist_name'=>$songartist, 'artist_location'=>$artistlocation)).',';
	if($i==count($songsArr)-2)
	{
		echo json_encode(array('title'=>$songtitle, 'id'=> $songid[0], 'artist_name'=>$songartist, 'artist_location'=>$artistlocation));	
	}
}

//echo count($songsArr);	

echo']';

?>




