let modals = document.querySelectorAll('.modal')

modals.forEach(modal => {
    let closeBtn = modal.querySelector('.modal-close')

    closeBtn.addEventListener('click', e => {
        modal.classList.remove('modal-open')
    })
})
