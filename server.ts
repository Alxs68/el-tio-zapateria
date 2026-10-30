import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Zapatería El Tío',
    timestamp: new Date().toISOString(),
  });
});

// Serve Vite build static assets
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback: All unknown routes return index.html
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Zapatería El Tío] Servidor corriendo en puerto ${PORT}`);
  console.log(`URL local: http://localhost:${PORT}`);
});
