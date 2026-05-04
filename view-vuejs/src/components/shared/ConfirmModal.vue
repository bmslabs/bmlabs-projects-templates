<template>
  <BaseModal
    :show="show"
    :title="title"
    max-width="sm"
    hide-footer
    @close="emit('cancel')"
  >
    <div class="flex flex-col items-center text-center py-2 gap-4">
      <!-- Icon -->
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center"
        :class="iconBgClass"
      >
        <component :is="iconComponent" class="w-7 h-7" :class="iconColorClass" />
      </div>

      <!-- Message -->
      <p class="text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
      <p v-if="subMessage" class="text-xs text-slate-500 dark:text-slate-400">{{ subMessage }}</p>
    </div>

    <!-- Footer -->
    <div class="flex flex-col-reverse sm:flex-row justify-center gap-3 pt-4">
      <AppButton
        id="confirm-modal-cancel"
        variant="secondary"
        class="sm:flex-1"
        @click="emit('cancel')"
      >
        {{ cancelText }}
      </AppButton>
      <AppButton
        v-if="showConfirm"
        id="confirm-modal-confirm"
        :variant="type === 'danger' ? 'danger' : 'primary'"
        :is-loading="loading"
        class="sm:flex-1"
        @click="emit('confirm')"
      >
        {{ confirmText }}
      </AppButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'
import AppButton from './AppButton.vue'

type ModalType = 'warning' | 'danger' | 'info' | 'success'

interface Props {
  show: boolean
  title: string
  message: string
  subMessage?: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  showConfirm?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  subMessage: '',
  type: 'warning',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  showConfirm: true,
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'danger': return AlertCircle
    case 'success': return CheckCircle2
    case 'info': return Info
    default: return AlertTriangle
  }
})

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-red-100 dark:bg-red-900/30'
    case 'success': return 'bg-green-100 dark:bg-green-900/30'
    case 'info': return 'bg-blue-100 dark:bg-blue-900/30'
    default: return 'bg-yellow-100 dark:bg-yellow-900/30'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'text-red-500'
    case 'success': return 'text-green-500'
    case 'info': return 'text-blue-500'
    default: return 'text-yellow-500'
  }
})
</script>
