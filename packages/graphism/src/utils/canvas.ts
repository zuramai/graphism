export function saveCanvasToImg(canvas: HTMLCanvasElement) {
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('download', 'graphism.png')
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    downloadLink.setAttribute('href', url)
    downloadLink.click()
  })
}
