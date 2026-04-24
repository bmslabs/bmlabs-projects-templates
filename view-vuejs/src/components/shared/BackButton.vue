<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary,#2563eb)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-primary,#2563eb)] transition hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-gray-500 dark:hover:bg-gray-700"
    :class="buttonClass"
    @click="handleGoBack"
  >
    <ArrowLeft class="h-4 w-4 flex-shrink-0" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Props {
  label?: string
  fallbackRoute?: string
  buttonClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Volver',
  fallbackRoute: '/',
  buttonClass: '',
})

const router = useRouter()

const handleGoBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(props.fallbackRoute)
  }
}
</script>
