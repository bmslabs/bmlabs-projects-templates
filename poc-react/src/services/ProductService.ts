/**
 * Product Service (Prompt B - CreateApiService)
 * CRUD service for Product entity with full error handling
 */

import axios, { AxiosInstance } from 'axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * ProductService - Handles all product API operations
 * @example
 * const products = await ProductService.getAll();
 * const product = await ProductService.getById('123');
 * const created = await ProductService.create(productData);
 */
class ProductService {
  private client: AxiosInstance;

  constructor(baseURL = 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch all products with pagination
   */
  async getAll(page: number = 1, pageSize: number = 10): Promise<ProductListResponse> {
    try {
      const response = await this.client.get<ProductListResponse>('/products', {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch product by ID
   */
  async getById(id: string): Promise<Product> {
    try {
      const response = await this.client.get<Product>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new product
   */
  async create(data: CreateProductDTO): Promise<Product> {
    try {
      const response = await this.client.post<Product>('/products', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product by ID
   */
  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    try {
      const response = await this.client.patch<Product>(`/products/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete product by ID
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await this.client.delete<{ success: boolean }>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search products by name or category
   */
  async search(query: string): Promise<Product[]> {
    try {
      const response = await this.client.get<Product[]>('/products/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Filter products by category
   */
  async filterByCategory(category: string): Promise<Product[]> {
    try {
      const response = await this.client.get<Product[]>(
        `/products/category/${category}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error filtering by category ${category}:`, error);
      throw error;
    }
  }
}

export default new ProductService();
