export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, props?: Record<string, string>): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName)
  for (const prop in props)
    el.setAttribute(prop, props[prop])

  return el
}
export function createElementNS<K extends keyof SVGElementTagNameMap>(tagName: K, props?: Record<string, any>, cb?: (el: SVGElement) => void): SVGElementTagNameMap[K] {
  const ns = 'http://www.w3.org/2000/svg'
  const el = document.createElementNS(ns, tagName)
  for (const prop in props)
    el.setAttribute(prop, props[prop])
  if (cb)
    cb(el)
  return el
}
document.createElementNS
