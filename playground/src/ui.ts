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