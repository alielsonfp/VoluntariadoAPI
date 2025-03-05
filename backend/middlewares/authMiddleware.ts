// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    return; // Adicione return para evitar execução adicional
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };
    req.user = decoded;
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

export default authMiddleware;