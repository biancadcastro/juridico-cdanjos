// Tipos para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Simulação de banco de dados em memória
// Em produção, use um banco de dados real (PostgreSQL, MongoDB, etc.)
const users: User[] = [];

export const db = {
  user: {
    async findByEmail(email: string): Promise<User | null> {
      return users.find(user => user.email === email) || null;
    },
    
    async create(data: Omit<User, 'id'>): Promise<User> {
      const newUser: User = {
        id: crypto.randomUUID(),
        ...data
      };
      users.push(newUser);
      return newUser;
    },
    
    async findById(id: string): Promise<User | null> {
      return users.find(user => user.id === id) || null;
    }
  }
};
