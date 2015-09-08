<?php

header("HTTP/1.1 200 OK");
header("Expires: " . gmdate("D, d M Y H:i:s") . "GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Content-type: text/plain");

echo $_SERVER["CONTENT_TYPE"]

?>
