import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import {
  createPokemon,
  deletePokemon,
  getAllPokemon,
  getPokemonById,
  updatePokemon,
} from '../controllers/pokemon.js';

const router = Router();

const UPLOAD_DIR = './data/uploads';
await mkdir(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOAD_DIR),
  filename: (_req, file, callback) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${unique}-${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    // approx 2mb
    fileSize: 2 * 1024 * 1024,
  },
});

router.post('/', upload.single('image'), createPokemon);
router.get('/', getAllPokemon);
router.get('/:id', getPokemonById);
router.put('/:id', updatePokemon);
router.delete('/:id', deletePokemon);

export default router;
