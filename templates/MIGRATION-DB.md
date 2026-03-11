# Template Editor — Migration von localStorage zu MySQL

## Aktuelle Architektur (localStorage)

Jede Template-Instanz speichert Änderungen im Browser:
```
Key: te_{templateId}_{clientId}
Value: JSON mit allen bearbeiteten Elementen
```

Beispiel:
```json
{
  "hero-title": { "text": "Mein Restaurant", "color": "#ffffff", "fontSize": "72px", "fontFamily": "'Playfair Display', serif" },
  "hero-bg": { "src": "https://..." },
  "menu1-name": { "text": "Bruschetta", "color": "#2c2c2c", "fontSize": "16px" }
}
```

## MySQL-Datenbank Schema

```sql
CREATE DATABASE templateslweb;

CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id VARCHAR(50) NOT NULL,      -- z.B. 'restaurant', 'coiffeur'
    client_id VARCHAR(100) NOT NULL,        -- z.B. 'mario', 'salon-anna'
    data JSON NOT NULL,                     -- alle Änderungen als JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_template_client (template_id, client_id)
);
```

## API Endpoint Struktur

Base URL (in `.env`): `https://web.lweb.ch/templateslweb/api/`

### Endpoints pro Template/Client

```
GET  /api/{template_id}/{client_id}/load.php   → Lädt gespeicherte Daten
POST /api/{template_id}/{client_id}/save.php   → Speichert Änderungen
```

### Ordnerstruktur auf Server

```
/templateslweb/api/
├── .env                    # DB credentials
├── db.php                  # DB-Verbindung
├── restaurant/
│   └── mario/
│       ├── load.php
│       └── save.php
├── coiffeur/
│   └── salon-anna/
│       ├── load.php
│       └── save.php
└── handwerker/
    └── mueller/
        ├── load.php
        └── save.php
```

## PHP-Dateien

### `.env`
```
DB_HOST=localhost
DB_NAME=templateslweb
DB_USER=your_user
DB_PASS=your_password
API_BASE=https://web.lweb.ch/templateslweb/api/
```

### `db.php` (Shared DB Connection)
```php
<?php
// Load .env
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            putenv(trim($line));
        }
    }
}

$host = getenv('DB_HOST') ?: 'localhost';
$dbname = getenv('DB_NAME') ?: 'templateslweb';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'DB connection failed']);
    exit;
}
```

### `load.php` (Template)
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Template und Client aus Pfad ableiten
$path = explode('/', trim(str_replace('/api/', '', $_SERVER['REQUEST_URI']), '/'));
$templateId = $path[0] ?? '';
$clientId = $path[1] ?? '';

require_once __DIR__ . '/../../db.php';

$stmt = $pdo->prepare("SELECT data FROM templates WHERE template_id = ? AND client_id = ?");
$stmt->execute([$templateId, $clientId]);
$row = $stmt->fetch();

if ($row) {
    echo $row['data'];
} else {
    echo '{}';
}
```

### `save.php` (Template)
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

$path = explode('/', trim(str_replace('/api/', '', $_SERVER['REQUEST_URI']), '/'));
$templateId = $path[0] ?? '';
$clientId = $path[1] ?? '';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

require_once __DIR__ . '/../../db.php';

$stmt = $pdo->prepare("
    INSERT INTO templates (template_id, client_id, data)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()
");
$json = json_encode($data);
$stmt->execute([$templateId, $clientId, $json, $json]);

echo json_encode(['success' => true]);
```

## Migration Schritte

1. **MySQL einrichten**: Schema erstellen (SQL oben)
2. **`.env` erstellen** auf dem Server mit DB-Credentials
3. **PHP-Dateien hochladen** in die richtige Ordnerstruktur
4. **Im Template-Editor `init()` den `apiEndpoint` setzen**:
   ```js
   TemplateEditor.init({
       templateId: 'restaurant',
       clientId: 'mario',
       apiEndpoint: 'https://web.lweb.ch/templateslweb/api/'
   });
   ```
5. **Bestehende localStorage-Daten migrieren**: Der Editor speichert automatisch auch lokal als Cache — beim ersten Speichern mit API gehen die Daten in die DB.

## Für jeden neuen Kunden

1. Ordner erstellen: `/api/{template}/{clientId}/`
2. `load.php` und `save.php` reinkopieren (oder Routing nutzen)
3. `TemplateEditor.init()` mit dem `clientId` anpassen
4. Template-HTML an den Kunden ausliefern

## Alternativ: Zentrales Routing (kein Kopieren)

Statt für jeden Client eigene PHP-Dateien, ein zentraler Router:

```
/api/index.php  → Routing für alle Templates/Clients
```

Mit `.htaccess`:
```apache
RewriteEngine On
RewriteRule ^api/([^/]+)/([^/]+)/load$ api/index.php?action=load&template=$1&client=$2 [L,QSA]
RewriteRule ^api/([^/]+)/([^/]+)/save$ api/index.php?action=save&template=$1&client=$2 [L,QSA]
```
