// adminMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Supondo que o e-mail do usuário esteja no objeto `req.user` após a autenticação
    const userEmail = (req as any).user.email; // Ajuste conforme sua implementação do JWT

    // Buscar o usuário no banco de dados pelo e-mail
    const user = await User.findByEmail(userEmail);

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
      return; // Adicione return para evitar execução adicional
    }

    // Verificar se o usuário é um administrador
    if (user.role !== 'admin') {
      res.status(403).json({ message: 'Acesso negado. Somente administradores podem realizar esta ação.' });
      return; // Adicione return para evitar execução adicional
    }

    // Se o usuário for um administrador, permitir o acesso
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    res.status(500).json({ message: 'Erro ao verificar permissões.' });
  }
};