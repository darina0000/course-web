const http = require('http');
const fs = require('fs');
const path = require('path');

// Корневая папка проекта и порт, на котором открывается статический сайт.
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT) || 8080;

// Таблица MIME-типов нужна, чтобы браузер правильно понимал CSS, JS, картинки и HTML.
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function sendFile(res, filePath, statusCode = 200) {
  // Отправляем найденный файл пользователю и отключаем кэш для удобства разработки.
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(statusCode, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(filePath).pipe(res);
}

function resolveRequestPath(url) {
  // Превращаем адрес запроса в безопасный путь внутри проекта.
  const requestUrl = new URL(url, `http://localhost:${port}`);
  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const normalizedPath = decodedPath === '/' ? '/index.html' : decodedPath;
  const candidate = path.resolve(root, `.${normalizedPath}`);

  if (!candidate.startsWith(root)) {
    return null;
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  const htmlFallback = path.resolve(root, `.${normalizedPath}.html`);
  if (htmlFallback.startsWith(root) && fs.existsSync(htmlFallback) && fs.statSync(htmlFallback).isFile()) {
    return htmlFallback;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // Если файл найден, отдаем его; если нет, показываем страницу 404.
  const filePath = resolveRequestPath(req.url || '/');

  if (filePath) {
    sendFile(res, filePath);
    return;
  }

  const notFoundPath = path.join(root, '404.html');
  if (fs.existsSync(notFoundPath)) {
    sendFile(res, notFoundPath, 404);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
