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
	public function getSummoner(){
		$name = $this->data->name;
		$region = $this->data->region;

		//$apiKey
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/" . rawurlencode($name) . "?api_key=" . apiKey;
		$data = @file_get_contents($url);

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

	//get champion json object
	public function getChampionList(){
		$url = "http://ddragon.leagueoflegends.com/cdn/5.2.1/data/en_US/champion.json";
		$champs = @file_get_contents($url);
		$champs = json_decode($champs);

		return $champs;
	}

	//set match 2.2
	public function setMatchForArray($arr, $region){

		//loop through each game
		foreach($arr as &$game){
			$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v2.2/match/" . $game->gameId . "?api_key=" . apiKey;
			error_log($url);
			$gameDetails = @file_get_contents($url);
			$gameDetails = json_decode($gameDetails);
			$game->gamev22 = $gameDetails;
		}
	}

	public function getProfile(){
		$summoner = (property_exists($this->data->summoner, 'id')) ? $this->data->summoner : $this->getSummoner();

		//if there was no error getting the ID
		if(self::$errorFlag == false){
			$id = $summoner->id;

			//get League using league-v2.5
			$url = "https://" . $this->data->region . ".api.pvp.net/api/lol/" . $this->data->region . "/v2.5/league/by-summoner/{$id}?api_key=" . apiKey;
			$league = @file_get_contents($url);
			$league = json_decode($league);
			$summoner->league = $league;

			//get match history https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/525738/recent?api_key=
			$url = "https://" . $this->data->region . ".api.pvp.net/api/lol/" . $this->data->region . "/v1.3/game/by-summoner/{$id}/recent?api_key=" . apiKey;
			$match = @file_get_contents($url);
			$match = json_decode($match);
			$summoner->match = $match;

			//get champion data if flag says to do so
			$summoner->championList = ($this->data->getChampionList) ? self::getChampionList() : null;

			//get match details after getting match history ^
			//self::setMatchForArray($summoner->match->games, $this->data->region);

			return $summoner;
		} 
		//Something went wrong :()
		else {

			return null;
		}
	}

	//does summoner exist
	public function getExist(){
		return $summoner = $this->getSummoner();
	}	

}

?>