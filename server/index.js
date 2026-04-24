import express from 'express';
import cors from 'cors';
import { mkdir } from 'node:fs/promises';
import seedDatabaseIfEmpty from './utils/seedDatabaseIfEmpty.js';
import pokemonRoutes from './routes/pokemon.js';

const app = express();

const PORT = 9443;
const DATA_DIR = './data';
const DATA_FILE = `${DATA_DIR}/pokemonList.json`;
const UPLOAD_DIR = `${DATA_DIR}/uploads`;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:8443' }));
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/pokemon', pokemonRoutes);

async function startServer() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  await seedDatabaseIfEmpty(DATA_DIR, DATA_FILE);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
