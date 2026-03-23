/**
 * ApiServiceDemo Page (Prompt B - CreateApiService)
 * Demonstrates CRUD operations with API services
 */

import React, { useState } from 'react';
import { Button, Input } from '../components';
import { Product } from '../services/ProductService';

const ApiServiceDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mockProducts, setMockProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      category: 'Electronics',
      stock: 10,
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Mouse',
      description: 'Wireless mouse',
      price: 29.99,
      category: 'Accessories',
      stock: 50,
      createdAt: '2024-03-02T00:00:00Z',
      updatedAt: '2024-03-02T00:00:00Z'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0
  });

  const handleAddProduct = async () => {
    setIsLoading(true);

    setTimeout(() => {
      const product: Product = {
        id: String(mockProducts.length + 1),
        ...newProduct,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setMockProducts([...mockProducts, product]);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteProduct = (id: string) => {
    setMockProducts(mockProducts.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Prompt B: CreateApiService
        </h1>

        {/* Add Product Form */}
        <section className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Add New Product
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Input
              label="Product Name"
              placeholder="Enter name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <Input
              label="Category"
              placeholder="e.g., Electronics"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <Input
              label="Price"
              type="number"
              placeholder="0.00"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: parseFloat(e.target.value)
                })
              }
            />

            <Input
              label="Stock"
              type="number"
              placeholder="0"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
              }
            />
          </div>

          <Input
            label="Description"
            placeholder="Product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            containerClassName="mb-6"
          />

          <Button
            variant="primary"
            isLoading={isLoading}
            onClick={handleAddProduct}
            disabled={!newProduct.name || !newProduct.category}
          >
            Add Product
          </Button>
        </section>

        {/* Products List */}
        <section className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Products ({mockProducts.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">
                    Stock
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockProducts.map((product) => (
                  <tr key={product.id} className="border-b border-slate-200">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      {product.stock}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mockProducts.length === 0 && (
            <p className="text-center text-slate-500 py-8">
              No products yet. Add one to get started!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ApiServiceDemo;
