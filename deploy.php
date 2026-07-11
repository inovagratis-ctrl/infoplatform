<?php
$nodeBin = '/home/nucleovi/nodevenv/app.nucleovip.com.br/19/bin';
putenv("PATH=$nodeBin:" . getenv('PATH'));
// Run prisma migration
$cmd = "cd " . __DIR__ . " && " . $nodeBin . "/npx prisma db push --skip-generate --accept-data-loss 2>&1";
exec($cmd, $output, $exitCode);
echo "Exit: $exitCode\n";
echo implode("\n", $output);
// Touch restart.txt to restart Passenger
touch(__DIR__ . '/tmp/restart.txt');
