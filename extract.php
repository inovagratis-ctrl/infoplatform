<?php
$zip = new ZipArchive;
$res = $zip->open('.next-standalone.zip');
if ($res === TRUE) {
    $zip->extractTo('.');
    $zip->close();
    echo 'OK';
} else {
    echo 'FAILED';
}
