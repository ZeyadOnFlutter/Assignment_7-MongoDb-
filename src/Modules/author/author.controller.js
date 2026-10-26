import { Router } from 'express';
import * as authorService from './author.service.js';

const router = Router();

router.post('/collection/authors', authorService.createAuthorsCollection);

export default router;
