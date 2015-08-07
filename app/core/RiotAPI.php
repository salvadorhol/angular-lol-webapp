<?php

class RiotAPI {
	
	private $data = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//your api calls and stufff
	private function getSummoner($region, $name){

		//$apiKey
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/" . rawurlencode($name) . "?api_key=" . apiKey;
		$data = file_get_contents($url);
		$data = json_decode($data);
		//Riot returns an object with Keys labeled by the name of who we are search. The name is made lowercase, and all spaces in the name get removed.
		$index = preg_replace('/\s+/', '', $name);
		return $data->$index;
		//return $url;
	}


	public function getLeague(){
		$summoner = $this->getSummoner($this->data->region, $this->data->name);
		$id = $summoner->id;

		//get League using league-v2.5
		$url = "https://" . $this->data->region . ".api.pvp.net/api/lol/" . $this->data->region . "/v2.5/league/by-summoner/{$id}?api_key=" . apiKey;
		$league = file_get_contents($url);
		$league = json_decode($league);
		$summoner->league = $league;

		return $summoner;
	}





}

?>