<script lang="ts" setup>
import { ref } from 'vue'

defineProps(['title'])
const emit = defineEmits(['click'])
const isOpen = ref(false)
const onclick = () => {
  emit('click')
  isOpen.value = !isOpen.value
}
</script>

<template>
  <li class="sidebar-item sidebar-icon" :class="[isOpen ? 'sidebar-item-open' : '']">
    <a href="#" class="sidebar-group-icon" :title="title" @click="onclick">
      <slot name="icon" />
    </a>
    <div class="sidebar-sub">
      <slot name="submenu" />
    </div>
  </li>
</template>
