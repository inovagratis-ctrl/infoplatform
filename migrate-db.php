<?php
$dbPath = __DIR__ . '/prisma/dev.db';
$db = new SQLite3($dbPath);

// Add pixKey and pixKeyType to User
$db->exec("ALTER TABLE User ADD COLUMN pixKey TEXT");
$db->exec("ALTER TABLE User ADD COLUMN pixKeyType TEXT");

// Add paidAt to AffiliateSale (check if column exists first)
$cols = $db->query("PRAGMA table_info(AffiliateSale)");
$hasPaidAt = false;
while ($col = $cols->fetchArray(SQLITE3_ASSOC)) {
    if ($col['name'] === 'paidAt') $hasPaidAt = true;
}
if (!$hasPaidAt) {
    $db->exec("ALTER TABLE AffiliateSale ADD COLUMN paidAt DATETIME");
}

// Create Withdrawal table
$db->exec("CREATE TABLE IF NOT EXISTS Withdrawal (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    amount REAL NOT NULL,
    fee REAL DEFAULT 3.19,
    grossAmount REAL,
    type TEXT DEFAULT 'producer',
    pixKey TEXT,
    pixKeyType TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    processedAt DATETIME,
    processedById TEXT,
    FOREIGN KEY (userId) REFERENCES User(id),
    FOREIGN KEY (processedById) REFERENCES User(id)
)");

echo "Migration OK\n";
