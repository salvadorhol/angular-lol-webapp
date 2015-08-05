<?php

class RiotAPI {
	
	public $data = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//your api calls and stufff
	private function getSummoner($region, $name){

		//$apiKey
		$url = "https://{$region}.api.pvp.net/api/lol/{$region}/v1.4/summoner/by-name/{$name}?api_key=" . apiKey;
		$data = file_get_contents($url);
		$data = json_decode($data);
		return $data->$name->id;
	}


	public function getLeague(){
		$id = $this->getSummoner($this->data->region, $this->data->name);
		//https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/525738?api_key=1de1adeb-dcc7-4d7a-be8f-d276b78f4b9a
		$url = "https://" . $this->data->region . ".api.pvp.net/api/lol/" . $this->data->region . "/v2.5/league/by-summoner/{$id}?api_key=" . apiKey;
		$data = file_get_contents($url);
		$data = json_decode($data);
		return $data;
	}





}

?>