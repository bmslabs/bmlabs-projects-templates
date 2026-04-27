<template>
  <div class="mb-6">
    <div class="border-b border-slate-200 dark:border-white/10 overflow-x-auto">
      <nav class="-mb-px flex space-x-6 min-w-min" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="tab.id === modelValue"
          :class="getTabClasses(tab.id)"
          @click="emit('update:modelValue', tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Tab {
  id: string
  label: string
}

const props = defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [tab: string]
}>()

const getTabClasses = (tabId: string) => {
  const base =
    'cursor-pointer py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200'
  const active =
    'border-[var(--color-primary,#2563eb)] text-[var(--color-primary,#2563eb)] dark:text-white dark:border-white'
  const inactive =
    'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'

  return `${base} ${tabId === props.modelValue ? active : inactive}`
}
</script>
