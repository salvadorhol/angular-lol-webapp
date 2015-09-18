<?php

class RiotAPI {
	//sal's ID: 525738
	private $data = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//Credit to Sponz :D
	private function getPlatform($region){
		$platformList = array(
			 "NA" => "NA1",
            "EUW" => "EUW1",
            "EUNE" => "EUN1",
            "KR" => "KR",
            "OCE" => "OC1",
            "BR" => "BR1",
            "LAN" => "LA1",
            "LAS" => "LA2",
            "RU" => "RU",
            "TR" => "TR1"
			);

		return $platformList[strtoupper($region)];
	}

	//get latest CDN version
	public function getLatestCDNVersion(){
		$url = "https://ddragon.leagueoflegends.com/api/versions.json";
		$versions = @file_get_contents($url);
		$versions = json_decode($versions);

		return $versions[0];
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

	//get item json object
	public function getItemList(){
		$version = self::getLatestCDNVersion();

		$url = "http://ddragon.leagueoflegends.com/cdn/{$version}/data/en_US/item.json";
		$items = @file_get_contents($url);
		$items = json_decode($items);

		return $items;
	}

	//get champion json object
	public function getChampionList(){
		$version = self::getLatestCDNVersion();

		$url = "http://ddragon.leagueoflegends.com/cdn/{$version}/data/en_US/champion.json";
		$champs = @file_get_contents($url);
		$champs = json_decode($champs);

		return $champs;
	}

	//get summoner json object 
	public function getSpellList(){
		$version = self::getLatestCDNVersion();

		$url = "http://ddragon.leagueoflegends.com/cdn/{$version}/data/en_US/summoner.json";
		$spells = @file_get_contents($url);
		$spells = json_decode($spells);

		return $spells;
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

	//get match history using matchlist2.2
	public function getMatchList($region, $id, $beginIndex, $endIndex){
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v2.2/matchlist/by-summoner/{$id}?beginIndex={$beginIndex}&endIndex={$endIndex}&api_key=" . apiKey;
		$matchlist = @file_get_contents($url);
		$matchlist = json_decode($matchlist);
		return $matchlist;
	}

	//set match 2.2. Note expects $arr to represent $array of games
	public function setMatchForArray($arr, $region){

		//loop through each game
		foreach($arr as &$game){
			$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v2.2/match/" . $game->gameId . "?api_key=" . apiKey;
			$gameDetails = @file_get_contents($url);
			$gameDetails = json_decode($gameDetails);
			$game->gamev22 = $gameDetails;
		}
	}

	//current game v1.0
	public function currentGame($region, $id){

		$url = "https://{$region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/" . $this->getPlatform($region) ."/{$id}?api_key=" . apiKey;
		$currentMatch = @file_get_contents($url);
		$currentMatch = json_decode($currentMatch);

		if($currentMatch != null){
			foreach($currentMatch->participants as &$participant){
				$url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $participant->spell1Id . "?spellData=image&api_key=" . apiKey;
                $spellDetails1 = @file_get_contents($url);
                $spellDetails1 = json_decode($spellDetails1);

             	$participant->spellDetails1 = $spellDetails1;
                
                $url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $participant->spell2Id . "?spellData=image&api_key=" . apiKey;
                $spellDetails2 = @file_get_contents($url);
                $spellDetails2 = json_decode($spellDetails2);
               
                $participant->spellDetails2 = $spellDetails2;
			}
		}

		return $currentMatch;
	}

	//set static spell data for match array
	// public function setSpellsForArray($arr, $region){
	// 	foreach($arr as &$game){
	// 		// $url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $game->spell1 . "?version=" . self::getLatestCDNVersion() . "&spellData=all&api_key=" . apiKey;
	// 		// error_log($url);
	// 		// $spellDetails1 = @file_get_contents($url);
	// 		// $spellDetails1 = json_decode($spellDetails1);

	// 		$url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $game->spell2 . "?version=" . self::getLatestCDNVersion() . "&spellData=all&api_key=" . apiKey;
	// 		$spellDetails2 = @file_get_contents($url);
	// 		$spellDetails2 = json_decode($spellDetails2);

	// 		//$game->spellDetails1 = $spellDetails1;
	// 		$game->spellDetails2 = $spellDetails2;
	// 	}
	// }

	public function setSpellsForArray($arr, $region){
            foreach($arr as &$game){

                $url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $game->spell1 . "?spellData=image&api_key=" . apiKey;
                $spellDetails1 = @file_get_contents($url);
                $spellDetails1 = json_decode($spellDetails1);

             	$game->spellDetails1 = $spellDetails1;
                
                $url = "https://global.api.pvp.net/api/lol/static-data/{$region}/v1.2/summoner-spell/" . $game->spell2 . "?spellData=image&api_key=" . apiKey;
                $spellDetails2 = @file_get_contents($url);
                $spellDetails2 = json_decode($spellDetails2);
               
                $game->spellDetails2 = $spellDetails2;
            }
    }
}

?>