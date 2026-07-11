<?php
$db = new SQLite3(__DIR__ . '/prisma/dev.db');
$email = 'inovagratis.com.br';
$password = password_hash('@@@Shaina150501@@@', PASSWORD_BCRYPT);
$name = 'Admin';
$role = 'admin';
$now = date('c');

// Check if exists
$existing = $db->querySingle("SELECT id FROM user WHERE email = '$email'");
if ($existing) {
    $db->exec("UPDATE user SET role = 'admin', password = '$password', name = '$name' WHERE email = '$email'");
    echo "Admin updated: $existing\n";
} else {
    $db->exec("INSERT INTO user (id, email, password, name, role, createdAt, updatedAt) VALUES (
        '" . uniqid() . "',
        '$email',
        '$password',
        '$name',
        '$role',
        '$now',
        '$now'
    )");
    echo "Admin created\n";
}
