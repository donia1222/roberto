<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$BOOKINGS_FILE = __DIR__ . '/bookings.json';

// ── GET → devolver slots reservados ──────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($BOOKINGS_FILE)) {
        echo json_encode(['reserved' => []]);
    } else {
        echo file_get_contents($BOOKINGS_FILE);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = file_get_contents('php://input');
$data  = json_decode($input, true);
if (!$data) $data = $_POST;

function clean($val) {
    return htmlspecialchars(strip_tags(trim((string)$val)), ENT_QUOTES, 'UTF-8');
}

// ── Callback / Rückruf ───────────────────────────────────────────────────────
if (($data['type'] ?? '') === 'callback') {
    $cbName  = clean($data['name']          ?? '—');
    $cbPhone = clean($data['phone']         ?? '—');
    $cbDay   = clean($data['preferredDay']  ?? '—');
    $cbTime  = clean($data['preferredTime'] ?? '—');

    if (!$cbName || !$cbPhone) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Name und Telefon erforderlich']);
        exit;
    }

    $logo = 'https://web.lweb.ch/remail/logolweb.png';
    $cbRows = [
        'Name'          => $cbName,
        'Telefon'       => $cbPhone,
        'Wunschtag'     => $cbDay,
        'Wunschuhrzeit' => $cbTime,
    ];
    $cbHtml = buildHtml(
        'Rückrufanfrage — Lweb',
        '📞 Rückrufanfrage',
        $cbName . ' möchte zurückgerufen werden.',
        $cbRows,
        'Ruf den Kunden so bald wie möglich zurück: <a href="tel:' . $cbPhone . '" style="color:#fe6c75;text-decoration:none;">' . $cbPhone . '</a>',
        $logo,
        '#fe6c75'
    );
    sendHtml('info@lweb.ch', 'Rückrufanfrage von ' . $cbName . ' — Lweb', $cbHtml);
    echo json_encode(['ok' => true]);
    exit;
}

$name    = clean($data['name']    ?? '');
$email   = clean($data['email']   ?? '');
$phone   = clean($data['phone']   ?? '—');
$service = clean($data['service'] ?? '—');
$date    = clean($data['date']    ?? '—');
$time    = clean($data['time']    ?? '—');
$msg     = clean($data['message'] ?? '—');

if (!$name || !$email || !filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Ungültige Eingabe']);
    exit;
}

$logo = 'https://web.lweb.ch/remail/logolweb.png';

// ── HTML template ──────────────────────────────────────────────────────────
function buildHtml($title, $headline, $subline, $rows, $footer, $logo, $accentColor = '#fe6c75') {
    $rowsHtml = '';
    foreach ($rows as $label => $value) {
        $rowsHtml .= "
        <tr>
          <td style=\"padding:10px 16px;font-size:13px;color:#6b7280;font-weight:600;white-space:nowrap;border-bottom:1px solid #f1f5f9;width:120px;\">$label</td>
          <td style=\"padding:10px 16px;font-size:14px;color:#0f1d2c;border-bottom:1px solid #f1f5f9;\">$value</td>
        </tr>";
    }
    return "<!DOCTYPE html>
<html lang='de'>
<head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>$title</title></head>
<body style='margin:0;padding:0;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif;'>
  <table width='100%' cellpadding='0' cellspacing='0' style='background:#f4f6f9;padding:40px 16px;'>
    <tr><td align='center'>
      <table width='100%' cellpadding='0' cellspacing='0' style='max-width:560px;'>

        <!-- Header -->
        <tr><td style='background:linear-gradient(135deg,#0f1d2c 0%,#1a2d42 100%);border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;'>
          <img src='$logo' alt='Lweb' width='56' height='56' style='border-radius:50%;border:3px solid rgba(255,255,255,0.15);margin-bottom:16px;display:block;margin-left:auto;margin-right:auto;'>
          <p style='margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:$accentColor;'>Lweb Schweiz</p>
          <h1 style='margin:0;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.02em;line-height:1.2;'>$headline</h1>
          <p style='margin:10px 0 0;font-size:14px;color:rgba(255,255,255,.6);'>$subline</p>
        </td></tr>

        <!-- Body -->
        <tr><td style='background:#fff;padding:28px 36px;'>
          <table width='100%' cellpadding='0' cellspacing='0' style='border:1px solid #e8ecf0;border-radius:12px;overflow:hidden;'>
            $rowsHtml
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style='background:#fff;border-top:1px solid #f1f5f9;border-radius:0 0 16px 16px;padding:20px 36px 28px;text-align:center;'>
          <p style='margin:0;font-size:13px;color:#6b7280;line-height:1.6;'>$footer</p>
          <p style='margin:16px 0 0;font-size:11px;color:#c4cdd8;'>© 2026 Lweb · Sevelen / Buchs SG · <a href='https://lweb.ch' style='color:#c4cdd8;text-decoration:none;'>lweb.ch</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>";
}

function sendHtml($to, $subjectRaw, $html, $replyTo = '') {
    $subject = '=?UTF-8?B?' . base64_encode($subjectRaw) . '?=';
    $boundary = md5(uniqid());
    $headers  = "From: Lweb Booking <noreply@lweb.ch>\r\n";
    if ($replyTo) $headers .= "Reply-To: $replyTo\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    return mail($to, $subject, $html, $headers);
}

// ── Email 1 → info@lweb.ch ────────────────────────────────────────────────
$adminRows = [
    'Service'   => $service,
    'Datum'     => $date,
    'Uhrzeit'   => $time,
    'Name'      => $name,
    'E-Mail'    => "<a href='mailto:$email' style='color:#fe6c75;text-decoration:none;'>$email</a>",
    'Telefon'   => $phone,
    'Nachricht' => $msg,
];
$adminHtml = buildHtml(
    'Neue Terminanfrage',
    'Neue Terminanfrage',
    'Ein Kunde hat einen Termin angefragt.',
    $adminRows,
    "Antworte direkt auf diese E-Mail, um den Kunden zu kontaktieren.",
    $logo
);
sendHtml('info@lweb.ch', 'Terminanfrage von ' . $name . ' — Lweb', $adminHtml, $email);

// ── Email 2 → Kunde ───────────────────────────────────────────────────────
$clientRows = [
    'Service' => $service,
    'Datum'   => $date,
    'Uhrzeit' => $time,
    'Name'    => $name,
];
if ($phone !== '—') $clientRows['Telefon'] = $phone;

$clientHtml = buildHtml(
    'Terminbestätigung — Lweb',
    'Termin angefragt! 🎉',
    'Vielen Dank, ' . $name . '. Wir melden uns innerhalb von 24 Stunden.',
    $clientRows,
    "Bei Fragen erreichst du uns jederzeit unter <a href='mailto:info@lweb.ch' style='color:#fe6c75;text-decoration:none;'>info@lweb.ch</a> oder <a href='tel:+41765608645' style='color:#fe6c75;text-decoration:none;'>+41 76 560 86 45</a>.",
    $logo
);
sendHtml($email, 'Terminbestätigung — Lweb', $clientHtml);

// ── Guardar slot reservado en bookings.json ───────────────────────────────
$bookings = ['reserved' => []];
if (file_exists($BOOKINGS_FILE)) {
    $existing = json_decode(file_get_contents($BOOKINGS_FILE), true);
    if (isset($existing['reserved'])) $bookings = $existing;
}
// Guardar la fecha en formato YYYY-MM-DD a partir del texto formateado
// El JS envía date como texto formateado ("Di, 31. März 2026"), pero también
// necesitamos guardar el valor raw. Lo añadimos como campo extra desde el JS.
$rawDate = clean($data['rawDate'] ?? $date);
$bookings['reserved'][] = ['date' => $rawDate, 'time' => $time];
file_put_contents($BOOKINGS_FILE, json_encode($bookings, JSON_PRETTY_PRINT));

echo json_encode(['ok' => true]);
