<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$gstin = isset($_GET['gstin']) ? strtoupper(trim($_GET['gstin'])) : '';

if ($gstin === '') {
  http_response_code(400);
  echo json_encode(['error' => 'GSTIN is required.']);
  exit;
}

$apiUrl = 'https://api.primeserve.in/commonapi/v1.1/search?gstin=' . urlencode($gstin) . '&action=TP';
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

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Apikey: ' . $apiKey]);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($response === false || $error) {
  http_response_code(502);
  echo json_encode(['error' => 'Unable to connect to GSTIN validation service.', 'details' => $error]);
  exit;
}

http_response_code($statusCode ?: 200);
echo $response;
