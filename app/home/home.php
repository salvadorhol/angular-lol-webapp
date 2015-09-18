<?php
class Home extends RiotAPI {
	private $data = null;

	//loads the above private variable
	public function load($data){
		$this->data = $data;
	}

	//does summoner exist
	public function getExist(){
		return $summoner = $this->getSummoner($this->data->region, $this->data->name);
	}	

}

?>