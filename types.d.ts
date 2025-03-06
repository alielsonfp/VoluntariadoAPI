// src/types/express/index.d.ts ou @types/express/index.d.ts

import { Request } from 'express';

// Estendendo a interface Request do Express para incluir a propriedade 'user'
declare global {
  namespace Express {
    interface Request {
      user?: { email: string; role: string }; // Definindo o tipo do usuário
    }
  }
}
