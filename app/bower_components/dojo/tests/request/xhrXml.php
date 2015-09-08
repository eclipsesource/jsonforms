<?php
header("HTTP/1.1 200 OK");
header("Expires: " . gmdate("D, d M Y H:i:s") . "GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");
header("Content-type: application/xml");
?><?php echo '<?xml version="1.0" encoding="UTF-8" ?>'; ?>
<foo><bar baz='thonk'>blarg</bar><bar>blah</bar></foo>
