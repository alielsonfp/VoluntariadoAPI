// activityRoutes.ts

import express from 'express';
import {
  createActivity,
  listActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  joinActivity,
  listActivityParticipants,
  leaveActivity
} from '../controllers/activityController';
import authMiddleware from '../middlewares/authMiddleware'; // Importação correta
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = express.Router();

// Rotas públicas (não requerem autenticação)
router.get('/', listActivities); // Listar todas as atividades
router.get('/:id', getActivityById); // Obter detalhes de uma atividade específica


// Rotas protegidas (requerem autenticação)
router.post('/', authMiddleware, adminMiddleware, createActivity); // Criar uma nova atividade (apenas admin)
router.put('/:id', authMiddleware, adminMiddleware, updateActivity); // Atualizar uma atividade existente (apenas admin)
router.delete('/:id', authMiddleware, adminMiddleware, deleteActivity); // Deletar uma atividade (apenas admin)
router.get('/:id/participants', authMiddleware, adminMiddleware, listActivityParticipants);

router.post('/:id/join', authMiddleware, joinActivity); // Inscrever um usuário em uma atividade (qualquer usuário autenticado)
router.post('/:id/leave', authMiddleware, leaveActivity);

// Rota para listar participantes de uma atividade (apenas admin)

export default router;