<?php

class Summoner extends RiotAPI {
	private $data = null;

	public function load($data){
		$this->data = $data;
	}

	public function getProfile(){
		$summoner = (property_exists($this->data->summoner, 'id')) ? $this->data->summoner : $this->getSummoner($this->data->region, $this->data->name);

		//if there was no error getting the ID
		if(Engine::$errorFlag == false){
			$id = $summoner->id;
			$region = $this->data->region;

			//cdn version
			$summoner->cdn = self::getLatestCDNVersion();

			//get League using leaguev2.5
			$summoner->league = self::getLeague($region, $id);

			//using game1.3 - replacing will be deprecated 
			$summoner->match = self::getGame($region, $id);

			//using matchlist2.2 - replacing match1.3
			//$summoner->matchlist = self::getMatchList($region, $id, 0, 14);

			//get champion data if flag says to do so
			$summoner->championList = ($this->data->getChampionList) ? self::getChampionList() : null;

			//get item data if flag says to do so 
			$summoner->itemList = ($this->data->getItemList) ? self::getItemList() : null;

			//get match details after getting match history ^
			//self::setMatchForArray($summoner->match->games, $this->data->region);

			//set spell details for each game
			self::setSpellsForArray($summoner->match->games, $this->data->region);

			return $summoner;
		} 
		//Something went wrong :()
		else {

			return null;
		}
	} 
}

?>
