import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'GapiNo', message: 'GapiNo is running' });
});

app.get('/api/feed', (_req, res) => {
  res.json([
    { id: 1, user: 'gapino', name: 'GapiNo', avatar: 'G', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', caption: 'به GapiNo خوش آمدید 🚀', likes: 128, comments: 14 },
    { id: 2, user: 'explorer', name: 'Explorer', avatar: 'E', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80', caption: 'Discover something beautiful.', likes: 84, comments: 9 }
  ]);
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`GapiNo running on port ${PORT}`));
