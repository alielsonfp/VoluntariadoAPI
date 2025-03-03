import RocksDB from 'rocksdb';
import { promisify } from 'util';

const db = new RocksDB('./db/activities');

// Abrir o banco de dados antes de usá-lo
db.open((err: Error | undefined) => {
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
const delAsync = promisify(db.del.bind(db));

interface ActivityData {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants: string[]; // Lista de e-mails dos participantes
}

class Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  participants: string[];

  constructor(
    id: string,
    title: string,
    description: string,
    date: string,
    location: string,
    maxParticipants: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.maxParticipants = maxParticipants;
    this.participants = [];
  }

  async save(): Promise<void> {
    try {
      const activityData: ActivityData = {
        id: this.id,
        title: this.title,
        description: this.description,
        date: this.date,
        location: this.location,
        maxParticipants: this.maxParticipants,
        participants: this.participants,
      };
      await putAsync(this.id, JSON.stringify(activityData));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao salvar atividade no RocksDB:', error.message);
      } else {
        console.error('Erro desconhecido ao salvar atividade no RocksDB:', error);
      }
      throw error;
    }
  }

  static async findById(id: string): Promise<ActivityData | null> {
    try {
      const activityData = await getAsync(id) as string;
      return JSON.parse(activityData) as ActivityData;
    } catch (error: unknown) {
      if (error instanceof Error && (error as any).notFound) {
        return null; // Tratar erro quando a atividade não existe
      }
      console.error('Erro ao buscar atividade no RocksDB:', error);
      return null;
    }
  }

  static async deleteById(id: string): Promise<void> {
    try {
      await delAsync(id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao deletar atividade no RocksDB:', error.message);
      } else {
        console.error('Erro desconhecido ao deletar atividade no RocksDB:', error);
      }
      throw error;
    }
  }

  static async update(activity: ActivityData): Promise<void> {
    try {
      await putAsync(activity.id, JSON.stringify(activity));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao atualizar atividade no RocksDB:', error.message);
      } else {
        console.error('Erro desconhecido ao atualizar atividade no RocksDB:', error);
      }
      throw error;
    }
  }

  static async listAll(): Promise<ActivityData[]> {
    return new Promise((resolve, reject) => {
      const activities: ActivityData[] = [];
      db.createReadStream()
        .on('data', (data: { key: Buffer; value: Buffer }) => {
          activities.push(JSON.parse(data.value.toString()));
        })
        .on('error', (error: Error) => {
          console.error('Erro ao listar atividades no RocksDB:', error.message);
          reject(error);
        })
        .on('end', () => {
          resolve(activities);
        });
    });
  }
}

// Fechar o banco de dados ao encerrar o servidor
process.on("SIGINT", () => {
  db.close((err: Error | undefined) => {
    if (err) {
      console.error("Erro ao fechar o RocksDB:", err.message);
    } else {
      console.log("RocksDB fechado com sucesso.");
    }
    process.exit(0);
  });
});

export default Activity;