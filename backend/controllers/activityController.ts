// activityController.ts

import { Request, Response } from 'express';
import Activity from '../models/Activity';

// Criar uma nova atividade
export const createActivity = async (req: Request, res: Response) => {
  const { title, description, date, location, maxParticipants } = req.body;

  // Validação básica dos dados
  if (!title || !description || !date || !location || !maxParticipants) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Gerar um ID único para a atividade (pode ser melhorado com UUID ou outra lógica)
    const id = Date.now().toString();

    // Criar uma nova instância de Activity
    const newActivity = new Activity(
      id,
      title,
      description,
      date,
      location,
      maxParticipants
    );

    // Salvar a atividade no banco de dados
    await newActivity.save();

    // Retornar a atividade criada
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({ message: 'Erro ao criar atividade.' });
  }
};

// Listar todas as atividades
export const listActivities = async (req: Request, res: Response) => {
  try {
    // Buscar todas as atividades no banco de dados
    const activities = await Activity.listAll();

    // Retornar a lista de atividades
    res.status(200).json(activities);
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({ message: 'Erro ao listar atividades.' });
  }
};

// Obter detalhes de uma atividade específica
export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Buscar a atividade pelo ID
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: 'Atividade não encontrada.' });
    }

    // Retornar os detalhes da atividade
    res.status(200).json(activity);
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    res.status(500).json({ message: 'Erro ao buscar atividade.' });
  }
};

// Atualizar uma atividade existente
export const updateActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, location, maxParticipants } = req.body;

  try {
    // Buscar a atividade pelo ID
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: 'Atividade não encontrada.' });
    }

    // Atualizar os campos da atividade
    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.location = location || activity.location;
    activity.maxParticipants = maxParticipants || activity.maxParticipants;

    // Salvar as alterações no banco de dados
    await Activity.update(activity);

    // Retornar a atividade atualizada
    res.status(200).json(activity);
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({ message: 'Erro ao atualizar atividade.' });
  }
};

// Deletar uma atividade
export const deleteActivity = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar se a atividade existe
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: 'Atividade não encontrada.' });
    }

    // Deletar a atividade
    await Activity.deleteById(id);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Atividade deletada com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar atividade:', error);
    res.status(500).json({ message: 'Erro ao deletar atividade.' });
  }
};

// Inscrever um usuário em uma atividade
export const joinActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body; // Supondo que o ID do usuário seja passado no corpo da requisição

  try {
    // Buscar a atividade pelo ID
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: 'Atividade não encontrada.' });
    }

    // Verificar se o usuário já está inscrito
    if (activity.participants.includes(userId)) {
      return res.status(400).json({ message: 'Usuário já está inscrito nesta atividade.' });
    }

    // Verificar se há vagas disponíveis
    if (activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ message: 'Não há vagas disponíveis.' });
    }

    // Adicionar o usuário à lista de participantes
    activity.participants.push(userId);

    // Salvar as alterações no banco de dados
    await Activity.update(activity);

    // Retornar uma mensagem de sucesso
    res.status(200).json({ message: 'Inscrição realizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao inscrever usuário na atividade:', error);
    res.status(500).json({ message: 'Erro ao inscrever usuário na atividade.' });
  }
};