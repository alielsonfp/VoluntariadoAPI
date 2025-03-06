/// <reference path="../../types.d.ts" /> // Caminho relativo para o types.d.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Obtém o token do cookie ou do cabeçalho Authorization
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  console.log('🔍 Token recebido:', token); // Log para depuração

  if (!token) {
    res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
    return; // Encerra a execução do middleware
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string };
    req.user = decoded;
    next(); // Passa para o próximo middleware ou rota
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expirado.' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Token inválido.' });
    } else {
      res.status(500).json({ message: 'Erro na autenticação.' });
    }
  }
};

export default authMiddleware;