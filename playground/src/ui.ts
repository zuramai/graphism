// This file contains controls for user interfaces

let modals = document.querySelectorAll('.modal')

modals.forEach(modal => {
    let closeBtn = modal.querySelector('.modal-close')

    closeBtn.addEventListener('click', e => {
        modal.classList.remove('modal-open')
    })
})


const addModal = document.querySelector('.modal-add')
const openAddModal = document.getElementById('openAddModal')
openAddModal.addEventListener('click', e => {
    addModal.classList.toggle('modal-open')
    console.log('open')
})

let sidebarItems = document.querySelectorAll<HTMLElement>(".sidebar-item")

for(let i = 0; i < sidebarItems.length; i++)  {
    let item = sidebarItems[i]
    
    item.querySelector(".sidebar-group-icon").addEventListener('click', () => {
        // Close all sub menu
        sidebarItems.forEach(si => si !== item && si.classList.remove('sidebar-item-open'))

        // Open the submenu
        item.classList.toggle('sidebar-item-open')
    })    

}