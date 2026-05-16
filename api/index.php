/**
 * Vercel Bridge for Laravel with Debug Mode
 */

// Enable error reporting to catch the 500 error cause
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Verify autoloader exists
if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
    http_response_code(500);
    die('Vercel Error: The "vendor" directory is missing. Please ensure your vercel-php builder is running composer install or that composer.json is in the root.');
}

require __DIR__ . '/../public/index.php';
