<?php

$headers = array();
foreach($_SERVER as $key => $value) {
	if (strpos($key, 'HTTP_') === 0) {
		$headers[strtolower(str_replace('_', '-', substr($key, 5)))] = $value;
	}
}

header('Content-Type: application/json');
echo json_encode($headers);
