<?php
	$servername = "localhost";
	$dbname = "pathfinder";
	$username = get_cfg_var('user');
	$password = get_cfg_var('passwd');

	$last_id = $_GET["last_id"];

	$pgs = array();

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
	    die("{}");
	}

	$sql = "SELECT id, x, y, name, type FROM updates WHERE id > $last_id";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
	    while($row = $result->fetch_assoc()) {
	        array_push($pgs, $row);
	    }
	}

	$response = json_encode($pgs);
	if ($response && $pgs) echo $response;
	else echo "{}";

	$conn->close();
?>