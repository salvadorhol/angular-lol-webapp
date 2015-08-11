<?php
include_once("utility.php");

class RiotAPI {
	
	private $data = null;
	public static $errorFlag = false;
	public static $errorResponse = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//your api calls and stufff
	private function getSummoner(){
		$name = $this->data->name;
		$region = $this->data->region;

		//$apiKey
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/" . rawurlencode($name) . "?api_key=" . apiKey;
		$data = @file_get_contents($url);
		//error_log(json_encode($http_response_header));

		//set response code
		$response = parseHeaders($http_response_header);
		self::$errorResponse = $response;

		// //if the API call was successfull (summoner found)
		if($response['response_code'] == 200){
			$data = json_decode($data);
			//Riot returns an object with Keys labeled by the name of who we are search. The name is made lowercase, and all spaces in the name get removed.
			$index = preg_replace('/\s+/', '', $name);
			self::$errorResponse = $response;

			return $data->$index;
		} else {
			//failed return error code instead of $data
			self::$errorFlag = true;
			

			return null;
		}
	}


	public function getLeague(){
		$summoner = $this->getSummoner($this->data->region, $this->data->name);

		//if there was no error getting the ID
		if(self::$errorFlag == false){
			$id = $summoner->id;

			//get League using league-v2.5
			$url = "https://" . $this->data->region . ".api.pvp.net/api/lol/" . $this->data->region . "/v2.5/league/by-summoner/{$id}?api_key=" . apiKey;
			$league = file_get_contents($url);
			$league = json_decode($league);
			$summoner->league = $league;
			
			return $summoner;
		} 
		//Something went wrong :()
		else {

			return null;
		}
	}





}

?>