<script lang="ts" setup>
defineEmits(['click'])
defineProps({
  text: String,
  hasDropdown: Boolean,
  href: String
})
</script>
<template>
<li class="menu-item">
    <a :href="href ? href : '#'" @click="$emit('click')">
        <slot name="icon"></slot>
        <span>{{text}}</span>
        <svg v-if="hasDropdown"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="currentColor"
                    class="bi bi-chevron-down"
                    viewBox="0 0 16 16"
                >
                    <path
                        fill-rule="evenodd"
                        d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                </svg>
    </a>
    <template v-if="hasDropdown" >
      <slot name="dropdown"></slot>
    </template>
</li>
</template>