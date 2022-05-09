<?php
	$servername = "localhost";
	$dbname = "pathfinder";
	$username = get_cfg_var('user');
	$password = get_cfg_var('passwd');

	$x = $_GET["x"];
	$y = $_GET["y"];
	$name = $_GET["name"];
	$type = $_GET["type"];

	$conn = new mysqli($servername, $username, $password, $dbname);
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	}

	$sql = "INSERT INTO updates (x, y, name, type)
		VALUES ('$x', '$y', '$name', $type)";

	if (!($conn->query($sql) === TRUE)) {
	    echo "-1";
	}
	
	$conn->close();
?>