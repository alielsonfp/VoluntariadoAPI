// main.js - Lógica da interface e manipulação do DOM
import {
  getActivities,
  joinActivity,
  leaveActivity,
  createActivity,
  deleteActivity,
} from './api.js';
import { getCurrentUserEmail } from './auth.js';

// Função para carregar as atividades
const loadActivities = async () => {
  try {
    const activities = await getActivities();
    displayActivities(activities);
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    alert('Erro ao carregar atividades. Tente novamente mais tarde.');
  }
};

// Função para exibir as atividades na tela
const displayActivities = async (activities) => {
  const todasAtividadesSection = document.getElementById('todas-atividades');
  todasAtividadesSection.innerHTML = '<h2>Todas as Atividades</h2>';

  const userEmail = await getCurrentUserEmail();
  if (!userEmail) return;

  const atividadesHTML = activities.map((activity) => {
    const isUserInscrito = activity.participants.includes(userEmail);

    return `
      <div class="atividade">
        <h3>${activity.title}</h3>
        <p>${activity.description}</p>
        <p>Data: ${activity.date}</p>
        <p>Local: ${activity.location}</p>
        <p>Participantes: <span class="participantes">${activity.participants.length}/${activity.maxParticipants}</span></p>
        <button class="${isUserInscrito ? 'desinscrever' : 'inscrever'}" 
                data-activity-id="${activity.id}" 
                ${activity.participants.length >= activity.maxParticipants && !isUserInscrito ? 'disabled' : ''}>
          ${isUserInscrito ? 'Desinscrever-se' : 'Inscrever-se'}
        </button>
        <div class="atividade-actions">
          <button class="editar" data-activity-id="${activity.id}">Editar</button>
          <button class="excluir" data-activity-id="${activity.id}">Excluir</button>
        </div>
      </div>
    `;
  }).join('');

  todasAtividadesSection.innerHTML += atividadesHTML;

  // Adiciona eventos aos botões
  document.querySelectorAll('button.inscrever').forEach((button) => {
    button.addEventListener('click', () => handleSubscribe(button.dataset.activityId));
  });

  document.querySelectorAll('button.desinscrever').forEach((button) => {
    button.addEventListener('click', () => handleLeave(button.dataset.activityId));
  });

  document.querySelectorAll('button.excluir').forEach((button) => {
    button.addEventListener('click', () => handleDelete(button.dataset.activityId));
  });
};

// Função para lidar com a inscrição
const handleSubscribe = async (activityId) => {
  try {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) return;

    await joinActivity(activityId, userEmail);
    alert('Inscrição realizada com sucesso!');
    loadActivities();
  } catch (error) {
    console.error('Erro ao se inscrever:', error);
    alert('Erro ao se inscrever. Tente novamente mais tarde.');
  }
};

// Função para lidar com a desinscrição
const handleLeave = async (activityId) => {
  try {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) return;

    await leaveActivity(activityId, userEmail);
    alert('Desinscrição realizada com sucesso!');
    loadActivities();
  } catch (error) {
    console.error('Erro ao se desinscrever:', error);
    alert('Erro ao se desinscrever. Tente novamente mais tarde.');
  }
};

// Função para lidar com a exclusão
const handleDelete = async (activityId) => {
  try {
    await deleteActivity(activityId);
    alert('Atividade excluída com sucesso!');
    loadActivities();
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
    alert('Erro ao excluir atividade. Tente novamente mais tarde.');
  }
};

// Função para abrir o modal de criação de atividade
const openCreateActivityModal = () => {
  const modal = document.getElementById('createActivityModal');
  if (modal) modal.style.display = 'block';
};

// Função para fechar o modal de criação de atividade
const closeCreateActivityModal = () => {
  const modal = document.getElementById('createActivityModal');
  if (modal) modal.style.display = 'none';
};

// Função para criar uma nova atividade
const handleCreateActivity = async (activityData) => {
  try {
    await createActivity(activityData);
    alert('Atividade criada com sucesso!');
    closeCreateActivityModal();
    loadActivities();
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    alert('Erro ao criar atividade. Tente novamente mais tarde.');
  }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadActivities();

  const criarAtividadeButton = document.getElementById('criar-atividade');
  if (criarAtividadeButton) {
    criarAtividadeButton.addEventListener('click', (e) => {
      e.preventDefault();
      openCreateActivityModal();
    });
  }

  const createActivityForm = document.getElementById('createActivityForm');
  if (createActivityForm) {
    createActivityForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const activityData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value,
        maxParticipants: parseInt(document.getElementById('maxParticipants').value),
      };

      await handleCreateActivity(activityData);
    });
  }

  const closeModalButton = document.querySelector('.close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeCreateActivityModal);
  }

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('createActivityModal');
    if (e.target === modal) closeCreateActivityModal();
  });
});