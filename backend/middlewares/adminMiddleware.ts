import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verifica se o usuário está autenticado e se o objeto `req.user` existe
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    // Extrai a role do usuário do objeto `req.user`
    const userRole = (req as any).user.role;

    // Verifica se o usuário é um administrador
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado. Somente administradores podem realizar esta ação.' });
    }

    // Se o usuário for um administrador, permitir o acesso
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    res.status(500).json({ message: 'Erro ao verificar permissões.' });
  }
};