<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg p-4 shadow-sm"
    style="background-color: var(--color-primary, #2563eb)"
    :aria-label="title"
  >
    <div class="space-y-0.5">
      <h1 class="text-xl font-semibold text-white">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm text-white/80">{{ subtitle }}</p>
    </div>

    <div v-if="$slots.default" class="flex items-center gap-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>
