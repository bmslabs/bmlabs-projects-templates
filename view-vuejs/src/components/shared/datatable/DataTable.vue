<template>
  <div class="w-full rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
    <div
      v-if="showTopToolbar"
      class="flex items-center justify-between gap-3 border-b border-gray-100 px-3 py-2 dark:border-gray-700"
    >
      <div class="min-h-7 text-xs text-slate-500 dark:text-slate-400">
        <slot name="toolbar-left" />
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasFilterableColumns"
          id="datatable-clear-filters-btn"
          type="button"
          class="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 px-2 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          :disabled="activeFiltersCount === 0"
          :aria-label="'Limpiar todos los filtros'"
          :title="'Limpiar todos los filtros'"
          @click="clearAllFilters()"
        >
          <X class="h-3.5 w-3.5" />
          Limpiar
          <span
            v-if="activeFiltersCount > 0"
            class="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          >
            {{ activeFiltersCount }}
          </span>
        </button>

        <button
          v-if="showRefreshButton"
          id="datatable-refresh-btn"
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          :disabled="loading"
          :aria-label="refreshAriaLabel"
          :title="refreshAriaLabel"
          @click="emit('refresh')"
        >
          <RefreshCw class="h-3.5 w-3.5" :class="loading ? 'animate-spin' : ''" />
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="whitespace-nowrap px-3 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 sm:text-sm"
              :class="column.hidden"
            >
              <div class="flex items-center justify-center gap-1">
                <span>{{ column.label }}</span>
                <Filter
                  v-if="column.filterable"
                  :id="`${column.key}-filter`"
                  :model-value="filterModel[column.key]"
                  :is-active="activeFilter === column.key"
                  :type="column.filterType === 'select' ? 'select' : 'text'"
                  :options="toFilterOptions(column.filterOptions)"
                  @update:modelValue="updateFilterValue(column.key, $event)"
                  @update:isActive="setActiveFilter(column.key, $event)"
                  @search="emitFilters()"
                />
              </div>
            </th>
            <th
              v-if="actions.length > 0"
              scope="col"
              class="whitespace-nowrap px-3 py-3 text-center text-xs font-bold text-gray-500 dark:text-gray-400 sm:text-sm"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          <tr v-if="loading">
            <td :colspan="columns.length + actionColumnsOffset" class="py-8 text-center text-gray-500 dark:text-gray-400">
              <div class="flex flex-col items-center">
                <div class="mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--color-primary)]" />
                <span>Cargando registros...</span>
              </div>
            </td>
          </tr>

          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length + actionColumnsOffset" class="py-8 text-center text-gray-500 dark:text-gray-400">
              No se encontraron registros
            </td>
          </tr>

          <tr
            v-for="(row, index) in data"
            v-else
            :key="row.id ?? index"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
            :class="getRowClass ? getRowClass(row) : ''"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-3 text-center text-sm text-gray-900 dark:text-gray-200"
              :class="[column.hidden, column.textColor]"
            >
              <span
                v-if="column.badge"
                class="rounded-full px-2 py-1 text-xs font-semibold"
                :class="resolveBadgeClass(row, column)"
              >
                {{ stringifyValue(row[column.key]) }}
              </span>
              <span v-else>
                {{ stringifyValue(row[column.key]) }}
              </span>
            </td>

            <td v-if="actions.length > 0" class="px-3 py-3 text-center text-sm">
              <div class="flex justify-center gap-1">
                <button
                  v-for="action in visibleActions(row)"
                  :key="action.key"
                  type="button"
                  class="rounded p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                  :class="[action.class, action.iconClass]"
                  :title="action.title"
                  :aria-label="action.title || action.key"
                  @click="emit('action-clicked', action.key, row)"
                >
                  <component :is="action.iconComponent" v-if="action.iconComponent" class="h-4 w-4" />
                  <span v-else>{{ action.title || action.key }}</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="p-4">
      <Paginator
        :total-records="totalRecords"
        :records-per-page="recordsPerPage"
        :show-records-per-page="true"
        :current-page="currentPage"
        @update:currentPage="emit('update:currentPage', $event)"
        @update:recordsPerPage="emit('update:recordsPerPage', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RefreshCw, X } from 'lucide-vue-next'
import Filter from '@/components/shared/Filter.vue'
import Paginator from '@/components/shared/Paginator.vue'
import type { DataTableRow, TableAction, TableColumn, TableFilterOption } from './data-table.types'

interface Props {
  data: DataTableRow[]
  columns: TableColumn[]
  actions?: TableAction[]
  totalRecords: number
  recordsPerPage: number
  currentPage: number
  clientSideOperations?: boolean
  loading?: boolean
  showPagination?: boolean
  getRowClass?: (row: DataTableRow) => string
  showRefreshButton?: boolean
  refreshAriaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
  clientSideOperations: false,
  loading: false,
  showPagination: true,
  getRowClass: undefined,
  showRefreshButton: false,
  refreshAriaLabel: 'Actualizar tabla',
})

const emit = defineEmits<{
  'action-clicked': [key: string, row: DataTableRow]
  'update:currentPage': [page: number]
  'update:recordsPerPage': [recordsPerPage: number]
  'update:filters': [filters: Record<string, string | null>]
  refresh: []
}>()

const activeFilter = ref<string | null>(null)
const filterModel = reactive<Record<string, string | null>>({})

const actionColumnsOffset = computed(() => (props.actions.length > 0 ? 1 : 0))
const hasFilterableColumns = computed(() => props.columns.some((column) => column.filterable))

const activeFiltersCount = computed(() => {
  return Object.values(filterModel).filter((value) => value !== null && value !== '').length
})

const showTopToolbar = computed(() => props.showRefreshButton || hasFilterableColumns.value)

watch(
  () => props.columns,
  (columns) => {
    for (const column of columns) {
      if (!(column.key in filterModel)) {
        filterModel[column.key] = null
      }
    }
  },
  { immediate: true },
)

const setActiveFilter = (columnKey: string, isActive: boolean): void => {
  activeFilter.value = isActive ? columnKey : null
}

const updateFilterValue = (columnKey: string, value: string | null): void => {
  filterModel[columnKey] = value
}

const emitFilters = (): void => {
  emit('update:filters', { ...filterModel })
}

const clearAllFilters = (): void => {
  for (const key of Object.keys(filterModel)) {
    filterModel[key] = null
  }
  activeFilter.value = null
  emitFilters()
}

const toFilterOptions = (options?: TableFilterOption[]): Array<{ id: string; name: string }> => {
  if (!options) return []
  return options.map((option) => ({ id: String(option.value), name: option.label }))
}

const visibleActions = (row: DataTableRow): TableAction[] => {
  return props.actions.filter((action) => (action.show ? action.show(row) : true))
}

const stringifyValue = (value: unknown): string => {
  if (typeof value === 'boolean') return value ? 'Activo' : 'Inactivo'
  if (value === null || value === undefined || value === '') return '-'
  return String(value)
}

const resolveBadgeClass = (row: DataTableRow, column: TableColumn): string => {
  const value = row[column.key]
  if (typeof value === 'boolean') {
    return value
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
      : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
  }
  return column.badgeColor || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
}
</script>