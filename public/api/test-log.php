<?php
// Test PHP error logging
error_log("TEST: This is a test log message");
echo "Log test completed. Check your PHP error log for: 'TEST: This is a test log message'";

// Also try different log levels
error_log("TEST: ERROR level message");
error_log("TEST: WARNING level message"); 
error_log("TEST: INFO level message");

// Show PHP configuration
echo "<br>PHP Error Log: " . ini_get('error_log');
echo "<br>Log Errors: " . ini_get('log_errors');
echo "<br>Error Reporting: " . ini_get('error_reporting');
?>
