<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed.']);
  exit;
}

$serverSecret = getenv('PRIMESERVE_ADMIN_API_SECRET');
if (!$serverSecret) {
  http_response_code(500);
  echo json_encode(['error' => 'Admin API secret is not configured on the server.']);
  exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$providedSecret = isset($body['adminSecret']) ? trim($body['adminSecret']) : '';
$apiKey = isset($body['apiKey']) ? trim($body['apiKey']) : '';

if (!hash_equals($serverSecret, $providedSecret)) {
  http_response_code(403);
  echo json_encode(['error' => 'Invalid admin update secret.']);
  exit;
}

if ($apiKey === '' || strlen($apiKey) < 16) {
  http_response_code(400);
  echo json_encode(['error' => 'Please provide a valid GSTIN API key.']);
  exit;
}

$keyFile = __DIR__ . '/.gstin-key.php';
$content = "<?php\nreturn " . var_export($apiKey, true) . ";\n";
if (file_put_contents($keyFile, $content, LOCK_EX) === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Unable to save GSTIN API key on the server.']);
  exit;
}

echo json_encode(['success' => true, 'message' => 'GSTIN API key updated securely.']);
