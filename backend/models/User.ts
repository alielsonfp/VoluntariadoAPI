import RocksDB from 'rocksdb';
import { promisify } from 'util';

const db = new RocksDB('./db/users');

// Abrir o banco de dados antes de usá-lo
db.open((err) => {
  if (err) {
    console.error("Erro ao abrir o RocksDB:", err);
    process.exit(1); // Encerra o servidor se não conseguir abrir o DB
  } else {
    console.log("RocksDB aberto com sucesso.");
  }
});

// Promisify RocksDB methods
const putAsync = promisify(db.put.bind(db));
const getAsync = promisify(db.get.bind(db));

interface UserData {
  name: string; // Novo campo: nome do usuário
  email: string;
  password: string;
  role: 'user' | 'admin';
  activities: string[];
}

class User {
  name: string; // Novo campo: nome do usuário
  email: string;
  password: string;
  role: 'user' | 'admin';
  activities: string[];

  constructor(name: string, email: string, password: string, role: 'user' | 'admin' = 'user') {
    this.name = name; // Inicializa o nome do usuário
    this.email = email;
    this.password = password;
    this.role = role;
    this.activities = [];
  }

  async save(): Promise<void> {
    try {
      const userData: UserData = {
        name: this.name, // Inclui o nome no objeto de dados do usuário
        email: this.email,
        password: this.password,
        role: this.role,
        activities: this.activities,
      };
      await putAsync(this.email, JSON.stringify(userData));
    } catch (error) {
      console.error('Erro ao salvar usuário no RocksDB:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<UserData | null> {
    try {
      const userData = await getAsync(email) as string;
      return JSON.parse(userData) as UserData;
    } catch (error: any) {
      if (error.notFound) return null; // Tratar erro quando o usuário não existe
      console.error('Erro ao buscar usuário no RocksDB:', error);
      return null;
    }
  }
}

// Fechar o banco de dados ao encerrar o servidor
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Erro ao fechar o RocksDB:", err);
    } else {
      console.log("RocksDB fechado com sucesso.");
    }
    process.exit(0);
  });
});

export default User;