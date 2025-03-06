import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Verifica se o usuário está autenticado e se o objeto `req.user` existe
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado.' });
      return; // Encerra a execução do middleware
    }

    // Extrai a role do usuário do objeto `req.user`
    const userRole = (req as any).user.role;

    // Verifica se o usuário é um administrador
    if (userRole !== 'admin') {
      res.status(403).json({ message: 'Acesso negado. Somente administradores podem realizar esta ação.' });
      return; // Encerra a execução do middleware
    }

    // Se o usuário for um administrador, permitir o acesso
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    res.status(500).json({ message: 'Erro ao verificar permissões.' });
  }
};