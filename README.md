# API de Atividades de Voluntariado

Este projeto é uma API REST desenvolvida em Node.js para o gerenciamento de atividades de voluntariado. A API permite que usuários se cadastrem, visualizem atividades e registrem sua participação. O sistema inclui autenticação baseada em JWT (JSON Web Tokens) e utiliza o banco de dados RocksDB para armazenamento. Além disso, há um frontend simples em JavaScript puro (sem frameworks) para interação com a API.

## 🎯 Objetivo
Desenvolver uma API REST para gerenciar atividades de voluntariado, com autenticação via JWT e um frontend básico para interação. O sistema deve permitir que usuários comuns se inscrevam em atividades e que administradores gerenciem essas atividades.

## 🚀 Funcionalidades Principais
### Autenticação e Controle de Acesso
- **Cadastro e Login:** Usuários podem se cadastrar e fazer login usando e-mail e senha.
- **Token JWT:** Após o login, um token JWT é gerado para autenticação em requisições protegidas.
- **Middleware de Autenticação:** Garante que apenas usuários autenticados acessem rotas protegidas.
- **Expiração de Token:** O token expira após um período e pode ser renovado com um novo login.

### Tipos de Usuários e Permissões
#### Usuário Comum:
- Criar conta e fazer login.
- Consultar a lista de atividades disponíveis.
- Inscrever-se em atividades com vagas disponíveis.
- Cancelar inscrição em atividades antes do início.
- Visualizar atividades em que está inscrito.

#### Administrador:
- Todas as permissões do usuário comum.
- Criar, editar e excluir atividades.
- Visualizar lista de participantes de cada atividade.

### Gerenciamento de Atividades
- Cada atividade contém: título, descrição, data, local e número máximo de participantes.
- Listagem de todas as atividades disponíveis para inscrição.
- Inscrição apenas em atividades com vagas disponíveis.
- Cancelamento de inscrição antes do início da atividade.
- Administradores podem editar ou remover qualquer atividade.
- Quando uma atividade atinge o número máximo de participantes, novas inscrições são bloqueadas.

### Validação de Dados
- **Validação manual:** Sem uso de bibliotecas externas.
- **Verificação de:**
  - E-mail válido no cadastro.
  - Senha com nível mínimo de segurança.
  - Dados das atividades preenchidos corretamente.
  - Impedir que um usuário se inscreva duas vezes na mesma atividade.

## 🛠️ Tecnologias Utilizadas
### Backend
- **Node.js:** Ambiente de execução JavaScript.
- **Express.js:** Framework para construção da API.
- **JWT (JSON Web Tokens):** Autenticação baseada em tokens.
- **RocksDB:** Banco de dados embutido para armazenamento.
- **TypeScript:** Adiciona tipagem estática ao JavaScript (opcional, conforme estrutura do projeto).

### Frontend
- **HTML:** Estrutura das páginas.
- **CSS:** Estilização das páginas.
- **JavaScript (ES6+):** Lógica e interação com a API.
- **Fetch API:** Requisições HTTP para o backend.

## 📂 Estrutura do Projeto
### Backend
```
/projeto-api-voluntariado
├── /backend
│   ├── /controllers
│   │   ├── authController.ts         # Lógica de autenticação (login, registro)
│   │   └── activityController.ts     # Lógica de atividades (CRUD, inscrições)
│   ├── /middlewares
│   │   ├── authMiddleware.ts         # Middleware de autenticação JWT
│   │   └── adminMiddleware.ts        # Middleware de administrador
│   ├── /models
│   │   ├── User.ts                   # Modelo de usuário
│   │   └── Activity.ts               # Modelo de atividade
│   ├── /routes
│   │   ├── authRoutes.ts             # Rotas de autenticação
│   │   └── activityRoutes.ts         # Rotas de atividades
│   ├── app.ts                        # Configuração do Express e middlewares globais
│   └── server.ts                     # Inicialização do servidor
```

### Frontend
```
/projeto-api-voluntariado
├── /frontend
│   ├── /pages
│   │   ├── login.html                # Página de login
│   │   ├── main.html                 # Página principal
│   │   └── register.html             # Página de registro
│   ├── /css
│   │   ├── login.css                 # Estilos da página de login
│   │   ├── register.css              # Estilos da página de registro
│   │   └── main.css                  # Estilos da página principal
│   ├── /js
│   │   ├── api.js                    # Funções para interagir com a API
│   │   ├── auth.js                   # Lógica de autenticação no frontend
│   │   └── main.js                   # Lógica da página principal
```

