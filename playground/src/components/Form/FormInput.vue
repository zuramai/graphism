<script lang="ts" setup>
import { computed, ref } from 'vue'

interface Props {
  errorMessage?: string
  placeholder?: string
  icon?: string
  size?: string
  name?: string
  modelValue?: string | number
  type?: string
  label?: string
  disabled?: boolean
  error?: string | null
}
const prop = withDefaults(defineProps<Props>(), {
  type: 'text',
  errorMessage: '',
  error: '',
  disabled: false,
})
const emit = defineEmits(['update:modelValue', 'input', 'change'])

const errorMessage = computed(() => prop.error)
const input = ref<HTMLInputElement | null>()
const onInput = (e: InputEvent) => {
  const target = (e.target as HTMLInputElement)
  emit('update:modelValue', target.value)
  emit('input', e)
}
defineExpose({
  input,
})
</script>

<template>
  <div class="form-group" :class="[icon ? 'has-icon-left position-relative ' : '']">
    <label v-if="label" :for="name">{{ label }}</label>
    <input
      :id="name" ref="input" :type="type"
      class="form-input"
      :class="[size ? `form-control-${size}` : '', errorMessage ? 'is-invalid' : '']"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="onInput"
      @change="$emit('change', $event as InputEvent)"
    >
    <div v-if="icon" class="form-control-icon">
      <i :class="`bi bi-${icon}`" />
    </div>
    <div v-if="errorMessage" class="invalid-feedback">
      {{ errorMessage }}
    </div>
  </div>
</template>
