<?php
$output = [];
$cmd = 'cd ' . __DIR__ . ' && npx prisma db push --skip-generate 2>&1';
exec($cmd, $output, $exitCode);
echo "Exit: $exitCode\n";
echo implode("\n", $output);
