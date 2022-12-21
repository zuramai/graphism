import { ref } from 'vue'

export default function () {
  const isShow = ref(false)
  const title = ref('')
  const show = () => isShow.value = true
  const hide = () => isShow.value = false

  return {
    show,
    hide,
    isShow,
    title,
  }
}
