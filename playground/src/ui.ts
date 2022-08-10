// This file contains controls for user interfaces

import type { Coordinate } from 'graphism'

window.addEventListener('DOMContentLoaded', () => {
  modalControls()
  navbarSubmenuTogglers()
})

function modalControls() {
  const modals = document.querySelectorAll('.modal')

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector('.modal-close')

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('modal-open')
    })
  })
}

/**
 * Add onclick event to toggle the submenu visibility for every menu
 */
function navbarSubmenuTogglers() {
  const sidebarItems = document.querySelectorAll<HTMLElement>('.sidebar-item')
  for (let i = 0; i < sidebarItems.length; i++) {
    const item = sidebarItems[i]

    item.querySelector('.sidebar-group-icon').addEventListener('click', () => {
      // Close all sub menu
      sidebarItems.forEach(si => si !== item && si.classList.remove('sidebar-item-open'))

      // Open the submenu
      item.classList.toggle('sidebar-item-open')
    })
  }
}

export function toggleModalFromSelector(modal: HTMLElement, toggler: HTMLElement) {
  toggler.addEventListener('click', () => {
    modal.classList.toggle('modal-open')
  })
}

export function showPoppover(id: string, position: Coordinate): HTMLElement {
  const poppoverEl = document.getElementById(id)
  console.log(position.y, poppoverEl.clientHeight, document.body.clientHeight)
  if (position.y + poppoverEl.clientHeight > document.body.clientHeight) position.y -= poppoverEl.clientHeight
  if (position.x + poppoverEl.clientWidth > document.body.clientWidth) position.x -= poppoverEl.clientWidth
  poppoverEl.style.left = `${position.x}px`
  poppoverEl.style.top = `${position.y}px`
  poppoverEl.style.visibility = 'visible'
  return poppoverEl
}
