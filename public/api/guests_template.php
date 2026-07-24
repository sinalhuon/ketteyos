<?php
// public/api/guests_template.php
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="guest_template.csv"');

$output = fopen('php://output', 'w');
// Add UTF-8 BOM for Excel compatibility
fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

// Header Row
fputcsv($output, ['Name', 'PhoneNumber']);

// Example Rows
fputcsv($output, ['Sok Dara', '012345678']);
fputcsv($output, ['Meas Sothea', '098765432']);

fclose($output);
?>