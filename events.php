<?php
	$mapID = "15";
	$post = $_GET;
	if ($post && $post["mapID"]) {
		$mapID = $post["mapID"];
	}
	echo "{";
	if ($post["dataType"] == "event") {

		// Event Data
		echo "\"eventData\": " . file_get_contents("http://api.guildwars2.com/v1/events.json?world_id=1011&map_id=" . $mapID);
	}
	if ($post["dataType"] == "eventName") {

		// Event Names
		echo "\"eventNames\": " . file_get_contents("https://api.guildwars2.com/v1/event_names.json");
	}
	if ($post["dataType"] == "mapName") {

		// Event Data
		echo "\"mapNames\": " . file_get_contents("https://api.guildwars2.com/v1/map_names.json");
	}
	echo "}";
?>