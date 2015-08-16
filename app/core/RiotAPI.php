<?php

class RiotAPI {
	
	private $data = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//your api calls and stufff
	public function getSummoner($region, $name){
		
		//$apiKey
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/" . rawurlencode($name) . "?api_key=" . apiKey;
		$data = @file_get_contents($url);

		//set response code
		Engine::$response = parseHeaders($http_response_header);

		// //if the API call was successfull (summoner found)
		if(Engine::$response['response_code'] == 200){
			$data = json_decode($data);
			//Riot returns an object with Keys labeled by the name of who we are search. The name is made lowercase, and all spaces in the name get removed.
			$index = preg_replace('/\s+/', '', $name);

			return $data->$index;
		} else {
			//failed return error code instead of $data
			Engine::$errorFlag = true;
			

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

	//using leaguev2.5
	public function getLeague($region, $id){
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v2.5/league/by-summoner/{$id}?api_key=" . apiKey;
		$league = @file_get_contents($url);
		$league = json_decode($league);
		return $league;
	}

	//get match history using game1.3. Please update in the future
	public function getGame($region, $id){
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.3/game/by-summoner/{$id}/recent?api_key=" . apiKey;
		$match = @file_get_contents($url);
		$match = json_decode($match);
		return $match;
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


	



}

?>