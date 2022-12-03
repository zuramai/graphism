export function saveCanvasToImg(canvas: HTMLCanvasElement) {
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('download', 'graphism.png')
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    downloadLink.setAttribute('href', url)
    downloadLink.click()
  })
}

export function getMousePosition(event: MouseEvent, svg: SVGGraphicsElement) {
  const ctm = svg.getScreenCTM()
  return {
    x: (event.clientX - ctm.e) / ctm.a,
    y: (event.clientY - ctm.f) / ctm.d,
  }
}