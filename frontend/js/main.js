// main.js - Lógica da interface e manipulação do DOM
import {
  getActivities,
  joinActivity,
  leaveActivity,
  createActivity,
  deleteActivity,
  updateActivity,
} from './api.js';
import { getCurrentUserEmail } from './auth.js';



let currentActivityId = null; // Armazena o ID da atividade sendo editada

// Função para verificar se a data do evento é igual à data atual
const isEventDateToday = (eventDateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Define a hora de hoje para 00:00:00

  // Parseia a data do evento manualmente para evitar problemas de fuso horário
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day); // Mês é baseado em zero (janeiro = 0)
  eventDate.setHours(0, 0, 0, 0); // Define a hora do evento para 00:00:00

  // Logs para depuração
  console.log('Data de hoje:', today.toISOString());
  console.log('Data do evento:', eventDate.toISOString());
  console.log('São iguais?', today.getTime() === eventDate.getTime());

  return today.getTime() === eventDate.getTime();
};


// Função para carregar as atividades
const loadActivities = async () => {
  try {
    const activities = await getActivities();
    const userEmail = await getCurrentUserEmail();

    if (!userEmail) return;

    // Filtra as atividades em que o usuário está inscrito
    const userActivities = activities.filter(activity => activity.participants.includes(userEmail));

    // Exibe todas as atividades
    displayActivitiesInSection(activities, 'todas-atividades', userEmail);

    // Exibe as atividades do usuário
    displayActivitiesInSection(userActivities, 'minhas-atividades', userEmail, true);
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    alert('Erro ao carregar atividades. Tente novamente mais tarde.');
  }
};

// Função para exibir as atividades em uma seção específica
const displayActivitiesInSection = (activities, sectionId, userEmail, isUserActivities = false) => {
  const section = document.getElementById(sectionId);
  if (!section) return;

  section.innerHTML = `<h2>${isUserActivities ? 'Minhas Atividades' : 'Todas as Atividades'}</h2>`;

  if (activities.length === 0) {
    section.innerHTML += '<p>Nenhuma atividade encontrada.</p>';
    return;
  }

  const atividadesHTML = activities.map((activity) => {
    const isUserInscrito = activity.participants.includes(userEmail);
    const isEventToday = isEventDateToday(activity.date); // Verifica se a data do evento é hoje
    const isEventFull = activity.participants.length >= activity.maxParticipants;

    return `
      <div class="atividade">
        <h3>${activity.title}</h3>
        <p>${activity.description}</p>
        <p>Data: ${activity.date}</p>
        <p>Local: ${activity.location}</p>
        <p>Participantes: <span class="participantes">${activity.participants.length}/${activity.maxParticipants}</span></p>
        <button class="${isUserInscrito ? 'desinscrever' : 'inscrever'}" 
                data-activity-id="${activity.id}" 
                ${(isEventFull && !isUserInscrito) || isEventToday ? 'disabled' : ''}>
          ${isUserInscrito ? 'Desinscrever-se' : 'Inscrever-se'}
        </button>
        <div class="atividade-actions">
          <button class="editar" data-activity-id="${activity.id}">Editar</button>
          <button class="excluir" data-activity-id="${activity.id}">Excluir</button>
        </div>
      </div>
    `;
  }).join('');

  section.innerHTML += atividadesHTML;

  // Adiciona eventos aos botões
  section.querySelectorAll('button.inscrever').forEach((button) => {
    button.addEventListener('click', () => handleSubscribe(button.dataset.activityId));
  });

  section.querySelectorAll('button.desinscrever').forEach((button) => {
    button.addEventListener('click', () => handleLeave(button.dataset.activityId));
  });

  section.querySelectorAll('button.excluir').forEach((button) => {
    button.addEventListener('click', () => handleDelete(button.dataset.activityId));
  });

  section.querySelectorAll('button.editar').forEach((button) => {
    button.addEventListener('click', async () => {
      const activityId = button.dataset.activityId;
      try {
        const activities = await getActivities();
        const activity = activities.find(a => a.id === activityId);

        if (activity) {
          openCreateActivityModal(activity); // Abre o modal com os dados da atividade
        } else {
          alert('Atividade não encontrada.');
        }
      } catch (error) {
        console.error('Erro ao carregar atividade:', error);
        alert('Erro ao carregar atividade. Tente novamente mais tarde.');
      }
    });
  });
};

// Função para abrir o modal de criação/edição de atividade
const openCreateActivityModal = (activity = null) => {
  const modal = document.getElementById('createActivityModal');
  if (!modal) return;

  // Preenche o modal com os dados da atividade (se for edição)
  if (activity) {
    document.getElementById('title').value = activity.title;
    document.getElementById('description').value = activity.description;
    document.getElementById('date').value = activity.date;
    document.getElementById('location').value = activity.location;
    document.getElementById('maxParticipants').value = activity.maxParticipants;
    currentActivityId = activity.id; // Armazena o ID da atividade
  } else {
    // Limpa o modal para criação de nova atividade
    document.getElementById('createActivityForm').reset();
    currentActivityId = null;
  }

  modal.style.display = 'block';
};

// Função para fechar o modal de criação de atividade
const closeCreateActivityModal = () => {
  const modal = document.getElementById('createActivityModal');
  if (modal) modal.style.display = 'none';
};

// Função para lidar com a criação/edição de atividade
const handleCreateOrUpdateActivity = async (activityData) => {
  try {
    if (currentActivityId) {
      // Se houver um ID, estamos editando
      await updateActivity(currentActivityId, activityData);
      alert('Atividade atualizada com sucesso!');
    } else {
      // Caso contrário, estamos criando
      await createActivity(activityData);
      alert('Atividade criada com sucesso!');
    }

    closeCreateActivityModal();
    loadActivities(); // Recarrega as atividades
  } catch (error) {
    console.error('Erro ao salvar atividade:', error);
    alert('Erro ao salvar atividade. Tente novamente mais tarde.');
  }
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

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  loadActivities();

  const criarAtividadeButton = document.getElementById('criar-atividade');
  if (criarAtividadeButton) {
    criarAtividadeButton.addEventListener('click', (e) => {
      e.preventDefault();
      openCreateActivityModal(); // Abre o modal para criação
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

      await handleCreateOrUpdateActivity(activityData);
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