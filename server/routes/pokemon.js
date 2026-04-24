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
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${unique}-${path.basename(file.originalname)}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post('/', upload.single('image'), createPokemon);
router.get('/', getAllPokemon);
router.get('/:id', getPokemonById);
router.put('/:id', updatePokemon);
router.delete('/:id', deletePokemon);

export default router;
