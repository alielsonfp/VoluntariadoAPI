// Função para carregar as atividades do backend
const loadActivities = async () => {
  try {
    console.log('Carregando atividades...'); // Log de depuração

    const response = await fetch('/api/activities', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro ao carregar atividades:', errorText);
      throw new Error(`Erro ao carregar atividades: ${response.status} - ${errorText}`);
    }

    const activities = await response.json();
    console.log('Atividades carregadas:', activities); // Log de depuração

    displayActivities(activities); // Exibe as atividades na tela
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    alert('Erro ao carregar atividades. Tente novamente mais tarde.');
  }
};

// Função para obter o email do usuário logado
const getCurrentUserEmail = async () => {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Inclui cookies na requisição
    });

    if (!response.ok) {
      throw new Error('Erro ao obter informações do usuário');
    }

    const userData = await response.json();
    return userData.email; // Retorna o email do usuário
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao obter informações do usuário. Faça login novamente.');
    window.location.href = '/login.html'; // Redireciona para a página de login
    return null;
  }
};

// Função para exibir as atividades na seção "Todas as Atividades"
const displayActivities = async (activities) => {
  const todasAtividadesSection = document.getElementById('todas-atividades');
  todasAtividadesSection.innerHTML = '<h2>Todas as Atividades</h2>';

  // Obtém o email do usuário logado
  const userEmail = await getCurrentUserEmail();
  if (!userEmail) {
    return; // Se não houver email, interrompe a execução
  }

  // Cria uma string HTML para todas as atividades
  const atividadesHTML = activities.map((activity) => {
    const isUserInscrito = activity.participants.includes(userEmail); // Verifica se o usuário está inscrito

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
  }).join(''); // Junta todas as strings em uma única string HTML

  // Adiciona as atividades ao HTML
  todasAtividadesSection.innerHTML += atividadesHTML;

  // Adiciona os event listeners aos botões de inscrição/desinscrição
  const inscreverButtons = todasAtividadesSection.querySelectorAll('button.inscrever');
  const desinscreverButtons = todasAtividadesSection.querySelectorAll('button.desinscrever');

  inscreverButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activityId = button.getAttribute('data-activity-id'); // Recupera o ID da atividade
      handleSubscribe(activityId); // Passa o ID da atividade correspondente
    });
  });

  desinscreverButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activityId = button.getAttribute('data-activity-id'); // Recupera o ID da atividade
      handleLeave(activityId); // Passa o ID da atividade correspondente
    });
  });

  // Adiciona os event listeners aos botões de edição
  const editarButtons = todasAtividadesSection.querySelectorAll('button.editar');
  editarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activityId = button.getAttribute('data-activity-id'); // Recupera o ID da atividade
      alert('Editar atividade: ' + activityId); // Placeholder para a funcionalidade de editar
    });
  });

  // Adiciona os event listeners aos botões de exclusão
  const excluirButtons = todasAtividadesSection.querySelectorAll('button.excluir');
  excluirButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const activityId = button.getAttribute('data-activity-id'); // Recupera o ID da atividade
      handleDelete(activityId); // Chama a função de exclusão
    });
  });
};

// Função para lidar com a inscrição em uma atividade
const handleSubscribe = async (activityId) => {
  try {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) {
      return;
    }

    const response = await fetch(`/api/activities/${activityId}/join`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error('Erro ao se inscrever na atividade');
    }

    alert('Inscrição realizada com sucesso!');
    loadActivities(); // Recarrega as atividades após a inscrição
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao se inscrever na atividade. Tente novamente mais tarde.');
  }
};

// Função para lidar com a desinscrição de uma atividade
const handleLeave = async (activityId) => {
  try {
    const userEmail = await getCurrentUserEmail();
    if (!userEmail) {
      return;
    }

    const response = await fetch(`/api/activities/${activityId}/leave`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }),
    });

    if (!response.ok) {
      throw new Error('Erro ao se desinscrever da atividade');
    }

    alert('Desinscrição realizada com sucesso!');
    loadActivities(); // Recarrega as atividades após a desinscrição
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao se desinscrever da atividade. Tente novamente mais tarde.');
  }
};

// Função para lidar com a exclusão de uma atividade
const handleDelete = async (activityId) => {
  try {
    console.log(`Tentando excluir a atividade ID: ${activityId}`); // Log de depuração

    const response = await fetch(`/api/activities/${activityId}`, {
      method: 'DELETE',
      credentials: 'include', // Inclui cookies na requisição
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', errorText);
      throw new Error(`Erro ao excluir atividade: ${response.status} - ${errorText}`);
    }

    alert('Atividade excluída com sucesso!');
    loadActivities(); // Recarrega as atividades após a exclusão
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
    alert('Erro ao excluir atividade. Tente novamente mais tarde.');
  }
};

// Função para abrir o modal
const openCreateActivityModal = () => {
  const modal = document.getElementById('createActivityModal');
  if (modal) {
    modal.style.display = 'block';
  } else {
    console.error('Modal não encontrado.');
  }
};

// Função para fechar o modal
const closeCreateActivityModal = () => {
  const modal = document.getElementById('createActivityModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Função para criar uma nova atividade
const createActivity = async (activityData) => {
  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      credentials: 'include', // Inclui cookies na requisição
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar atividade');
    }

    const newActivity = await response.json();
    alert('Atividade criada com sucesso!');
    closeCreateActivityModal(); // Fecha o modal após a criação
    loadActivities(); // Recarrega as atividades para exibir a nova atividade
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao criar atividade. Tente novamente mais tarde.');
  }
};

// Adicionar event listener para o botão "Criar Atividade"
document.addEventListener('DOMContentLoaded', () => {
  const criarAtividadeButton = document.getElementById('criar-atividade');
  if (criarAtividadeButton) {
    criarAtividadeButton.addEventListener('click', (e) => {
      e.preventDefault(); // Evita o comportamento padrão do link
      openCreateActivityModal(); // Abre o modal
    });
  }

  // Adicionar event listener para o formulário de criação de atividade
  const createActivityForm = document.getElementById('createActivityForm');
  if (createActivityForm) {
    createActivityForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Evita o envio padrão do formulário

      // Coletar os dados do formulário
      const activityData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        location: document.getElementById('location').value,
        maxParticipants: parseInt(document.getElementById('maxParticipants').value),
      };

      // Criar a atividade
      await createActivity(activityData);
    });
  }

  // Adicionar event listener para o botão de fechar o modal
  const closeModalButton = document.querySelector('.close-modal');
  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeCreateActivityModal);
  }

  // Fechar modal ao clicar fora do conteúdo do modal
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('createActivityModal');
    if (e.target === modal) {
      closeCreateActivityModal();
    }
  });

  // Carrega as atividades ao carregar a página
  loadActivities();
});