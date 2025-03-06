/// <reference path="../../types.d.ts" /> // Caminho relativo para o types.d.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    return; // Adicione return para evitar execução adicional
  }

  try {
    // Verifica o token e decodifica os dados
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };

    // Adiciona os dados do usuário ao objeto `req`
    req.user = decoded;

    // Passa para o próximo middleware ou rota
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

export default authMiddleware;