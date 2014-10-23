<?php 
	define('VOTES_tbl', 'votes'); 
	define('VARIANTS_tbl', 'votes_variants'); 
	define('DB_HOST', 'mysql.hostinger.com.ua');
	define('DB_USER', 'u990181625_crb');
	define('DB_PASS', 'a1b1c1');
	define('DB_NAME', 'u990181625_votes');
	
	include 'AltoRouter.php';
	$router = new AltoRouter();
	//$router->setBasePath('/progportfolio.esy.es');
	/* Setup the URL routing. This is production ready. */
	 
	// Main routes that non-customers see
	//$router->map('GET','/', 'home.php', 'home');
	
	$router->map('GET','/', 'home');
	$router->map('GET','/ajax_votes', 'getVotes');
	$router->map('POST','/ajax_votes', 'createVote');
	$router->map('POST','/ajax_votes', 'createVote');
	$router->map('GET','/ajax_votes/variant', 'votesVariants');
	$router->map('POST','/ajax_votes/variant', 'saveVote');
	
	$match = $router->match();
	
	if($match['target'] == 'home') {
		include 'home.php';
		return;
	}
	if($match['target'] == 'getVotes') {
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($mysqli->connect_errno) {
		    echo "Не удалось подключиться к MySQL: " . $mysqli->connect_error;
		}

		$query = "SELECT * FROM votes";
		$res = $mysqli->query($query);

		$counter = 0;
		while ($row = $res->fetch_assoc()) {
		    $response_data[$counter]['id'] = (int)$row['id'];
		    $response_data[$counter]['name'] = $row['name'];
		    $response_data[$counter]['question'] = $row['question'];
		    $response_data[$counter]['allowed_votes'] = (int)$row['allowed_votes'];
		    $counter++;
		}

		$response_data = json_encode($response_data);
		header( 'Content-Type: text/json' );
		echo $response_data;
		return;
	}
	if($match['target'] == 'createVote') {
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($mysqli->connect_errno) {
		    echo "Не удалось подключиться к MySQL: " . $mysqli->connect_error;
		}
		// insert in votes table
		$query = "INSERT INTO `".VOTES_tbl."` (`name`, `question`, `allowed_votes`) VALUES('".$_POST['name']."','".$_POST['question']."','".$_POST['allowed_votes']."')";
		
		$res = $mysqli->query($query);
		$id['id'] = $mysqli->insert_id;

		//inser in votes_variants table
    	foreach ($_POST['variants'] as $variant) {
			$query = "INSERT INTO `".VARIANTS_tbl."` (`text`, `color`, `parent_id`) VALUES('".$variant['text']."', '".$variant['color']."', '".$id['id']."')";
			$res = $mysqli->query($query);
    	}

		$response_data = json_encode($id);
		header('Content-Type: text/json');
		echo $response_data; //retrun last id
		return;

	}
	if($match['target'] == 'votesVariants') {
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($mysqli->connect_errno) {
		    echo "Не удалось подключиться к MySQL: " . $mysqli->connect_error;
		}
		$parent_id = (int) $_GET['parent_id'];
		$query = "SELECT * FROM ".VARIANTS_tbl." WHERE parent_id = ".$parent_id."";
		$res = $mysqli->query($query);

		$counter = 0;
		while ($row = $res->fetch_assoc()) {
		    $response_data[$counter]['id'] = (int) $row['id'];
		    $response_data[$counter]['text'] = $row['text'];
		    $response_data[$counter]['color'] = $row['color'];
		    $response_data[$counter]['voted'] = (int) $row['voted'];
		    $counter++;
		}

		$response_data = json_encode($response_data);
		header('Content-Type: text/json');
		echo $response_data; //retrun last id
		return;
	}
	if($match['target'] == 'saveVote') {
		$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
		if ($mysqli->connect_errno) {
		    echo "Не удалось подключиться к MySQL: " . $mysqli->connect_error;
		}
		$variants_id = $_POST['variants_id'];


		foreach ($variants_id as $id) {
			$query = "SELECT voted FROM ".VARIANTS_tbl." WHERE id = ".$id."";
			$res = $mysqli->query($query);
			$row = $res->fetch_assoc();

			$voted =  $row['voted'] + 1;
			$query = "UPDATE ".VARIANTS_tbl." SET voted='".$voted."' WHERE id=".$id."";
			$res = $mysqli->query($query);
			var_dump($row);
			return;

		}
	}

 ?>
