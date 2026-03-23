import React, { useEffect } from 'react';
import { BackofficeLayout } from '@/components/layout';
import { productService } from '@/services';
import { useCrud } from '@/hooks';

/**
 * Página de ejemplo - Lista de Productos Backoffice
 * Muestra cómo integrar DataGrid y CRUD
 */
export const ProductListPage: React.FC = () => {
  const { items: products, loading, readAll } = useCrud(productService);

  useEffect(() => {
    readAll();
  }, [readAll]);

  return (
    <BackofficeLayout
      sidebar={
        <nav className="space-y-2">
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            🏠 Dashboard
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            📦 Productos
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            👥 Usuarios
          </a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-gray-800">
            📊 Reportes
          </a>
        </nav>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-gray-600 mt-2">
            Administra el catálogo de productos
          </p>
        </div>

        {/* Tabla simplificada */}
        {loading ? (
          <div className="bg-white p-8 rounded-lg text-center">
            Cargando productos...
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Precio</th>
                  <th className="px-6 py-3 text-left font-semibold">Stock</th>
                  <th className="px-6 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600 truncate">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{product.stock} uni.</td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        ✏️
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BackofficeLayout>
  );
};

export default ProductListPage;
