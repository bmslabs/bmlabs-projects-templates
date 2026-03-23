# Skill: Crear DataGrid (Tabla)

## Propósito
Generar componentes de tabla/grilla de datos completos con paginación, filtrado, búsqueda y acciones, optimizados para backoffice.

## Invocación
```
@copilot /fe-create-datagrid [ComponentName] [options]
```

## Argumentos

- `ComponentName` (requerido): Nombre del componente
- `entity` (requerido): Entidad que muestra (Product, User, Order)
- `columns` (opcional): Columnas a mostrar
- `actions` (opcional): 'edit,delete,detail' u otro

## Ejemplo de Invocación

```
@copilot /fe-create-datagrid ProductDataGrid entity:Product columns:"name,price,status" actions:"edit,delete,detail"
```

## Que Genera

1. **DataGrid.tsx**: Componente funcional
2. **DataGrid.types.ts**: Interfaces y tipos
3. **DataGrid.module.css**: Estilos personalizados
4. **DataGrid.test.tsx**: Tests

## Características Incluidas

- Tabla con headers ordenables
- Paginación configurable
- Búsqueda en tiempo real
- Filtros avanzados
- Acciones (editar, eliminar, detalle)
- Selección múltiple
- Exportación CSV/Excel
- Responsive diseño
- Virtual scrolling (para listas grandes)
- Accessibilidad WCAG 2.1

## Ejemplo de Salida

```typescript
// ProductDataGrid.types.ts
export interface Column<T> {
  id: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface DataGridState<T> {
  page: number;
  pageSize: number;
  sortBy: keyof T | null;
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  selectedRows: Set<string>;
}

// ProductDataGrid.tsx
import React, { useState, useMemo, useCallback } from 'react';
import type { Product } from '@/services';

interface ProductDataGridProps {
  data: Product[];
  loading?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onDetail?: (product: Product) => void;
  onExport?: (data: Product[]) => void;
}

/**
 * DataGrid para productos con funcionalidades avanzadas
 */
export const ProductDataGrid: React.FC<ProductDataGridProps> = React.memo(({
  data,
  loading = false,
  onEdit,
  onDelete,
  onDetail,
  onExport,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<keyof Product | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Filtrado y búsqueda
  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, searchTerm]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortOrder === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredData, sortBy, sortOrder]);

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handlers
  const handleSort = useCallback((column: keyof Product) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)));
    }
  }, [paginatedData, selectedRows.size]);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(sortedData);
    }
  }, [sortedData, onExport]);

  if (loading) {
    return <div className="p-4 text-center">Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Buscar productos"
        />
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          title="Exportar datos"
        >
          Exportar CSV
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedRows.size === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('name')}
                role="button"
                tabIndex={0}
              >
                Nombre {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th
                className="px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('price')}
                role="button"
                tabIndex={0}
              >
                Precio {sortBy === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((product) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(product.id)}
                    onChange={() => handleSelectRow(product.id)}
                    aria-label={`Seleccionar ${product.name}`}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 flex gap-2">
                  {onDetail && (
                    <button
                      onClick={() => onDetail(product)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver detalle"
                    >
                      👁️
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(product)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Editar"
                    >
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(product)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Mostrando {(page - 1) * pageSize + 1} a{' '}
            {Math.min(page * pageSize, sortedData.length)} de {sortedData.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {sortedData.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron productos
        </div>
      )}
    </div>
  );
});

ProductDataGrid.displayName = 'ProductDataGrid';

export default ProductDataGrid;
```

## Uso en Páginas

```typescript
import { useProducts } from '@/hooks';
import { ProductDataGrid } from '@/components';

export const ProductList: React.FC = () => {
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`¿Eliminar ${product.name}?`)) {
      // Llamar API eliminar
    }
  };

  return (
    <ProductDataGrid
      data={products}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};
```

## Variantes Comunes

### Para usuarios
```
@copilot /fe-create-datagrid UserDataGrid entity:User columns:"email,name,role,status" actions:"edit,delete,changeRole"
```

### Para órdenes
```
@copilot /fe-create-datagrid OrderDataGrid entity:Order columns:"id,customer,total,status,date" actions:"detail,cancel,refund"
```

## Checklist de Calidad

- [ ] Búsqueda funcional
- [ ] Ordenamiento por columnas
- [ ] Paginación completa
- [ ] Acciones CRUD incluidas
- [ ] Selección múltiple
- [ ] Exportación CSV/Excel
- [ ] Responsive design
- [ ] Accesibilidad WCAG
- [ ] Virtual scrolling (si > 100 items)
- [ ] Loading state
- [ ] Empty state
