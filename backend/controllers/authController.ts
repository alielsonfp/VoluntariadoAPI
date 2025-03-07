import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body; // Recebe o nome do usuário

      // Verifica se o usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Usuário já existe' });
        return;
      }

      // Define a role como "admin" se o e-mail for "admin@email.com"
      const role = email === 'admin@email.com' ? 'admin' : 'user';
      // Cria um novo usuário com o nome
      const newUser = new User(name, email, password, role);
      await newUser.save();

      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Verifica se o usuário existe
      const user = await User.findByEmail(email);
      if (!user || user.password !== password) {
        res.status(401).json({ message: 'Credenciais inválidas' });
        return;
      }

      // Gera o token JWT
      const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Envia o token como um cookie seguro
      res.cookie('token', token, {
        httpOnly: true, // Impede acesso via JavaScript
        secure: false, // Só envia o cookie em conexões HTTPS
        sameSite: 'strict', // Protege contra ataques CSRF
        maxAge: 3600000, // Tempo de expiração do cookie (1 hora)
      });

      // Retorna uma resposta de sucesso
      res.status(200).json({ message: 'Login realizado com sucesso' });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
  // Endpoint para obter informações do usuário autenticado
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      // O middleware authMiddleware já adicionou o payload do token ao objeto `req`
      const userEmail = req.user?.email; // Extrai o email do payload do token
      if (!userEmail) {
        res.status(401).json({ message: 'Usuário não autenticado' });
        return;
      }

      // Busca o usuário no banco de dados (ou onde as informações estiverem armazenadas)
      const user = await User.findByEmail(userEmail); // Supondo que você tenha um método para buscar o usuário pelo email
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }

      // Retorna o email e a role do usuário
      res.status(200).json({
        email: user.email,
        role: user.role, // Certifique-se de que a role está sendo retornada
      });
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
};






export default authController;