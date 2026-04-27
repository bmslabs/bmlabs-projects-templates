<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Funnel, X, Trash2 } from 'lucide-vue-next'

interface Props {
  id?: string
  modelValue: string | null
  isActive?: boolean
  type?: 'text' | 'date' | 'select'
  options?: Array<{ id: string; name: string }>
  valueKey?: string
  labelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  isActive: false,
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'update:isActive': [value: boolean]
  search: []
}>()

const showDropdown = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownPosition = ref<{ top: number; left: number }>({ top: 0, left: 0 })
const dropdownWidth = 260

const hasActiveFilter = computed<boolean>(() => {
  return props.modelValue !== null && props.modelValue !== ''
})

const filterValue = computed<string>({
  get: () => props.modelValue ?? '',
  set: (value) => {
    emit('update:modelValue', value === '' ? null : value)
  },
})

watch(
  () => props.isActive,
  async (newVal) => {
    showDropdown.value = newVal
    if (!newVal) return
    await nextTick()
    updateDropdownPosition()
  },
)

watch(showDropdown, (isOpen) => {
  if (isOpen) {
    window.addEventListener('mousedown', handleDocumentClick)
    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('scroll', handleWindowChange, true)
  } else {
    window.removeEventListener('mousedown', handleDocumentClick)
    window.removeEventListener('resize', handleWindowChange)
    window.removeEventListener('scroll', handleWindowChange, true)
  }
})

const handleSearch = (): void => {
  emit('search')
}

const handleClear = (): void => {
  emit('update:modelValue', null)
  emit('search')
}

const clearAndClose = (): void => {
  handleClear()
  emit('update:isActive', false)
  showDropdown.value = false
}

const handleClose = (): void => {
  emit('update:isActive', false)
  showDropdown.value = false
}

const updateDropdownPosition = (): void => {
  if (!containerRef.value) return

  const triggerRect = containerRef.value.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  const left = Math.min(
    Math.max(triggerRect.right - dropdownWidth, 8),
    viewportWidth - dropdownWidth - 8,
  )

  const estimatedHeight = 180
  const showAbove = triggerRect.bottom + estimatedHeight > viewportHeight - 8
  const top = showAbove
    ? Math.max(triggerRect.top - estimatedHeight - 8, 8)
    : triggerRect.bottom + 8

  dropdownPosition.value = { top, left }
}

const handleWindowChange = (): void => {
  if (!showDropdown.value) return
  updateDropdownPosition()
}

const handleDocumentClick = (event: MouseEvent): void => {
  const target = event.target as Node

  if (containerRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return

  handleClose()
}

onBeforeUnmount(() => {
  window.removeEventListener('mousedown', handleDocumentClick)
  window.removeEventListener('resize', handleWindowChange)
  window.removeEventListener('scroll', handleWindowChange, true)
})
</script>

<template>
  <div ref="containerRef" class="relative inline-flex" @click.stop>
    <button
      :id="id"
      type="button"
      class="relative inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-400 transition-colors hover:bg-slate-100 hover:text-gray-600 dark:hover:bg-slate-700 dark:hover:text-gray-200"
      :class="hasActiveFilter ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300' : ''"
      :title="hasActiveFilter ? 'Filtro activo' : 'Filtrar columna'"
      :aria-label="hasActiveFilter ? 'Filtro activo en esta columna' : 'Abrir filtro de columna'"
      @click="emit('update:isActive', !isActive)"
    >
      <Funnel class="h-4 w-4" />
      <span
        v-if="hasActiveFilter"
        class="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-blue-500"
      />
    </button>

    <transition name="fade">
      <div
        v-if="showDropdown"
        ref="dropdownRef"
        class="fixed z-50 w-[min(16.25rem,calc(100vw-1rem))] rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        :style="{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }"
        @click.stop
      >
        <input
          v-if="type === 'text' || type === 'date'"
          v-model="filterValue"
          :type="type"
          :placeholder="type === 'date' ? 'Selecciona fecha...' : 'Escribe para filtrar...'
          "
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
          @input="handleSearch()"
        />

        <select
          v-else-if="type === 'select' && options"
          v-model="filterValue"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
          @change="handleSearch()"
        >
          <option value="">Seleccionar...</option>
          <option v-for="option in options" :key="option[valueKey || 'id']" :value="option[valueKey || 'id']">
            {{ option[labelKey || 'name'] }}
          </option>
        </select>

        <div class="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-600 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            :class="!hasActiveFilter ? 'pointer-events-none opacity-40' : ''"
            @click="clearAndClose()"
          >
            <Trash2 class="h-3.5 w-3.5" />
            Limpiar
          </button>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            aria-label="Cerrar filtro"
            @click="handleClose()"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
