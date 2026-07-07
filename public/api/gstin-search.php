<?php
header('Content-Type: application/json');

$gstin = isset($_GET['gstin']) ? strtoupper(trim($_GET['gstin'])) : '';
if (!preg_match('/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/', $gstin)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide a valid 15-character GSTIN.']);
    exit;
}

$apiKey = getenv('PRIMESERVE_GSTIN_API_KEY');
$keyFile = __DIR__ . '/.gstin-key.php';
if (!$apiKey && is_readable($keyFile)) {
    $storedKey = include $keyFile;
    if (is_string($storedKey)) {
        $apiKey = $storedKey;
    }
}
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'GSTIN API key is not configured on the server.']);
    exit;
}

$url = 'https://api.primeserve.in/commonapi/v1.1/search?gstin=' . urlencode($gstin) . '&action=TP';
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTPHEADER => ['Apikey: ' . $apiKey],
]);

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false || $status >= 400) {
    http_response_code($status >= 400 ? $status : 502);
    echo json_encode(['error' => $error ?: 'GSTIN API request failed.']);
    exit;
}

echo $response;
