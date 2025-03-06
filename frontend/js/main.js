// Função para carregar as atividades do backend
const loadActivities = async () => {
  try {
    const response = await fetch('/api/activities', {
      method: 'GET',
      credentials: 'include', // Inclui cookies na requisição
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar atividades');
    }

    const activities = await response.json();
    displayActivities(activities);
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao carregar atividades. Tente novamente mais tarde.');
  }
};

// Função para exibir as atividades na seção "Todas as Atividades"
const displayActivities = (activities) => {
  const todasAtividadesSection = document.getElementById('todas-atividades');

  // Limpa o conteúdo anterior e adiciona o título
  todasAtividadesSection.innerHTML = '<h2>Todas as Atividades</h2>';

  // Cria uma string HTML para todas as atividades
  const atividadesHTML = activities.map((activity) => `
    <div class="atividade">
      <h3>${activity.title}</h3>
      <p>${activity.description}</p>
      <p>Data: ${activity.date}</p>
      <p>Local: ${activity.location}</p>
      <p>Participantes: <span class="participantes">${activity.participants.length}/${activity.maxParticipants}</span></p>
      <button ${activity.participants.length >= activity.maxParticipants ? 'disabled' : ''}>
        Inscrever-se
      </button>
    </div>
  `).join(''); // Junta todas as strings em uma única string HTML

  // Adiciona as atividades ao HTML
  todasAtividadesSection.innerHTML += atividadesHTML;

  // Adiciona os event listeners aos botões de inscrição
  const inscreverButtons = todasAtividadesSection.querySelectorAll('button');
  inscreverButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      handleSubscribe(activities[index].id); // Passa o ID da atividade correspondente
    });
  });
};

// Função para lidar com a inscrição em uma atividade
const handleSubscribe = async (activityId) => {
  try {
    // Obter informações do usuário autenticado
    const userResponse = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include', // Inclui cookies na requisição
    });

    console.log('Resposta do /api/me:', userResponse); // Log para depuração

    if (!userResponse.ok) {
      alert('Usuário não autenticado. Faça login para se inscrever.');
      window.location.href = '/login.html'; // Redireciona para a página de login
      return;
    }

    const userData = await userResponse.json();
    console.log('Dados do usuário:', userData); // Log para depuração

    const userEmail = userData.email; // Extrai o email do usuário

    // Continuar com a inscrição na atividade
    const response = await fetch(`/api/activities/${activityId}/join`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail }), // Envia o email no corpo da requisição
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

// Carrega as atividades ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  loadActivities();
});