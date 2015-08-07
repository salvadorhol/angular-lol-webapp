<?php

$files = scandir(getcwd());

function toRoman($num){
	if($num == 1) return "I";
	else if ($num == 2) return "II";
	else if ($num == 3) return "III";
	else if ($num == 4) return "IV";
	else if ($num == 5) return "V";
}

foreach($files as &$e){
	if($e != "" && $e != "." && $e != ".."){
		$filename = $e;
		// $e = str_split($e, strlen($e)-4)[0];
		// $e = str_split($e, strlen($e)-1);

		rename(getcwd() . "/" . $filename, $filename . ".png");
	} 
}
echo json_encode($files);


?>