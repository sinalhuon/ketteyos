<?php
// Simple SSE test endpoint
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Cache-Control');

error_log("SSE Test: Connection started");

// Send a test message every 3 seconds
$counter = 0;
while (true) {
    $counter++;
    error_log("SSE Test: Sending message #$counter");
    
    echo "data: {\"type\": \"test\", \"message\": \"Test message #$counter\", \"timestamp\": " . time() . "}\n\n";
    flush();
    
    // Check if client disconnected
    if (connection_aborted()) {
        error_log("SSE Test: Client disconnected after $counter messages");
        break;
    }
    
    sleep(3);
    
    // Stop after 10 messages for testing
    if ($counter >= 10) {
        error_log("SSE Test: Completed 10 messages, stopping");
        break;
    }
}

error_log("SSE Test: Connection ended");
?>
