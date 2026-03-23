/**
 * User Service (Prompt B - CreateApiService)
 * CRUD service for User entity
 */

import axios, { AxiosInstance } from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, 'password'>> {}

/**
 * UserService - User management operations
 * @example
 * const users = await UserService.getAll();
 * const user = await UserService.getById('123');
 */
class UserService {
  private client: AxiosInstance;

  constructor(baseURL = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getAll(): Promise<User[]> {
    try {
      const response = await this.client.get<User[]>('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const response = await this.client.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateUserDTO): Promise<User> {
    try {
      const response = await this.client.post<User>('/users', data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const response = await this.client.patch<User>(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete<{ success: boolean }>(
        `/users/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

export default new UserService();
