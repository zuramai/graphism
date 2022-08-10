// This file contains controls for user interfaces

window.addEventListener('DOMContentLoaded', () => {
  modalControls()
  navbarSubmenuTogglers()
})

function modalControls() {
  const modals = document.querySelectorAll('.modal')

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector('.modal-close')

    closeBtn.addEventListener('click', (e) => {
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
  toggler.addEventListener('click', (e) => {
    modal.classList.toggle('modal-open')
  })
}
