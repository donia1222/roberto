<?php
// bot_respuestas.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }
header('Content-Type: application/json');

// 1) Incluir el config.php que está FUERA de www
//    Ajusta la ruta según tu estructura
require_once __DIR__ . '/../../secure_config/config.php';

// 2) Recoger el POST que mande tu app (React Native)
$rawPostData = file_get_contents('php://input');
$data = json_decode($rawPostData, true);

// Variables que envíe tu app
$conversationHistory = $data['conversationHistory'] ?? [];
$userMessage = $data['userMessage'] ?? '';
$prompt = $data['prompt'] ?? 'Responde de forma concisa y directa';
$imageBase64 = $data['imageBase64'] ?? null; // Nueva variable para imagen
$imageMimeType = $data['imageMimeType'] ?? 'image/jpeg'; // Tipo de imagen

// 3) Aquí pones TODA la lógica necesaria:
//    - armar el JSON que la API Gemini requiere
//    - llamar a la API con cURL
//    - procesar la respuesta
//    - O si quieres más cosas, las pones aquí

// EJEMPLO de petición a Gemini
// Usar modelo con visión si hay imagen
$geminiModel = $imageBase64 ? "gemini-2.0-flash-lite" : "gemini-2.0-flash-lite";
$geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$geminiModel}:generateContent?key=".API_KEY_GEMINI;

// Preparar las partes del mensaje del usuario
$userParts = [];

// Si hay imagen, agregarla primero
if ($imageBase64) {
  // Limpiar el base64 si viene con el prefijo data:image
  $cleanBase64 = $imageBase64;
  if (strpos($imageBase64, 'base64,') !== false) {
    $cleanBase64 = explode('base64,', $imageBase64)[1];
  }

  $userParts[] = [
    "inline_data" => [
      "mime_type" => $imageMimeType,
      "data" => $cleanBase64
    ]
  ];

  // Mensaje predeterminado para análisis de imagen si no hay texto
  if (empty($userMessage)) {
    $userMessage = "Analiza esta imagen. Si es un perro, identifica la raza y dame información sobre ella. Si no es un perro, describe lo que ves en la imagen relacionado con mascotas o perros.";
  }
}

// Agregar el texto del mensaje
$userParts[] = ["text" => $userMessage];

// Prepara contenido para enviar a Gemini
$postBody = [
  "contents" => [
    // Añado un primer "role: user" con el prompt "inicial"
    [
      "role" => "user",
      "parts" => [ ["text" => $prompt] ]
    ],
    // Historial de la conversación (sin imágenes para no sobrecargar)
    ...array_map(function($item) {
      return [
        "role"  => $item['role'],
        "parts" => $item['parts']
      ];
    }, $conversationHistory),
    // El mensaje recién enviado por el usuario (con imagen si existe)
    [
      "role" => "user",
      "parts" => $userParts
    ],
  ],
];
$postJson = json_encode($postBody);

// Usamos cURL para hacer la petición
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $geminiUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Content-Length: '.strlen($postJson),
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postJson);

$response = curl_exec($ch);
if (curl_errno($ch)) {
  // Si cURL falla
  echo json_encode([
    "status" => "error",
    "message" => curl_error($ch)
  ]);
  curl_close($ch);
  exit;
}

curl_close($ch);

// Decodificamos la respuesta de Gemini
$geminiData = json_decode($response, true);

// Extraemos el texto
if (
    isset($geminiData['candidates'][0]) &&
    isset($geminiData['candidates'][0]['content']['parts'][0]['text'])
) {
  $botReply = $geminiData['candidates'][0]['content']['parts'][0]['text'];
} else {
  $botReply = "Lo siento, no pude obtener una respuesta de Gemini.";
}

// 4) Devolvemos la respuesta
echo json_encode([
  "status" => "success",
  "botReply" => $botReply,
  // Si quieres devolver el conversationHistory actualizado
  // o algo más, lo añades aquí
]);
exit;
