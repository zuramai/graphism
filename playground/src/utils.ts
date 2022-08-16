export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)

export const onClick = (id: string, cb: Function) => document.getElementById(id).addEventListener('click', cb)
