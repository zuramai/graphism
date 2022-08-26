/**
 * Create popup notification
 * @param type The notification type (primary, danger, warning)
 * @param text Text content to be displayed in notification
 * @param duration The duration of notification to stay visible
 */
export function createNotification(type: string, text: string, duration = 2000) {
  const notif = document.createElement('div')
  notif.classList.add('notification')
  notif.classList.add(`notification-${type}`)
  notif.innerText = text

  const btn = document.createElement('button')
  const svgClose = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  svgClose.setAttribute('width', '16')
  svgClose.setAttribute('height', '16')
  path.setAttribute('d', 'M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z')

  svgClose.appendChild(path)
  btn.appendChild(svgClose)
  notif.appendChild(btn)

  const wrapper = document.querySelector('.notifications')
  wrapper.appendChild(notif)

  setTimeout(() => wrapper.removeChild(notif), duration)

  btn.addEventListener('click', () => {
    wrapper.removeChild(notif)
  }, { once: true })
}
