import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const authController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Verifica se o usuário já existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        res.status(400).json({ message: 'Usuário já existe' });
        return;
      }

      // Cria um novo usuário
      const newUser = new User(email, password);
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

      res.json({ token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  },
};

export default authController;