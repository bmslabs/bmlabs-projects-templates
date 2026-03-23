import apiClient from './api';

/**
 * Tipos para Producto
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  inStock?: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Servicio de API para Productos
 * Maneja todas las operaciones CRUD y consultas
 */
class ProductService {
  private baseUrl = '/products';

  /**
   * Obtiene todos los productos con filtros opcionales
   */
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    try {
      return await apiClient.get<Product[]>(this.baseUrl, { params: filters });
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  }

  /**
   * Obtiene un producto específico por ID
   */
  async getById(id: string): Promise<Product> {
    try {
      if (!id) throw new Error('ID is required');
      return await apiClient.get<Product>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw new Error('No se pudo cargar el producto');
    }
  }

  /**
   * Crea un nuevo producto
   */
  async create(data: CreateProductDTO): Promise<Product> {
    try {
      if (!data?.name) throw new Error('Product name is required');
      return await apiClient.post<Product>(this.baseUrl, data);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('No se pudo crear el producto');
    }
  }

  /**
   * Actualiza un producto existente
   */
  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    try {
      if (!id) throw new Error('ID is required');
      return await apiClient.put<Product>(`${this.baseUrl}/${id}`, data);
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw new Error('No se pudo actualizar el producto');
    }
  }

  /**
   * Elimina un producto
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) throw new Error('ID is required');
      await apiClient.delete<void>(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw new Error('No se pudo eliminar el producto');
    }
  }

  /**
   * Busca productos por término
   */
  async search(term: string): Promise<Product[]> {
    try {
      if (!term) return [];
      return await apiClient.get<Product[]>(
        `${this.baseUrl}/search`,
        { params: { term } }
      );
    } catch (error) {
      console.error(`Error searching products for "${term}":`, error);
      throw new Error('No se pudieron buscar los productos');
    }
  }

  /**
   * Obtiene productos por categoría
   */
  async getByCategory(category: string): Promise<Product[]> {
    try {
      if (!category) throw new Error('Category is required');
      return await apiClient.get<Product[]>(
        `${this.baseUrl}/category/${category}`
      );
    } catch (error) {
      console.error(
        `Error fetching products by category ${category}:`,
        error
      );
      throw new Error(`No se pudieron cargar los productos de ${category}`);
    }
  }
}

export const productService = new ProductService();

export default productService;
